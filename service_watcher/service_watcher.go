package servicewatcher

import (
	"context"
	"sync"

	"github.com/rs/zerolog/log"
	v1 "k8s.io/api/core/v1"
	v1meta "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/kubernetes"
)

type ServiceInfo struct {
	Namespace string
	Name      string
	UID       types.UID
}

/// Contains all the endpoints an application
/// exposes to the gdpr controller
type ApplicationServices struct {
	Takeout  []*ServiceInfo
	Deletion []*ServiceInfo
}

type ServiceAssignationState struct {
	Application string
}

/// Stores the assigned application for a service
type ServiceAssignation struct {
	Takeout  ServiceAssignationState
	Deletion ServiceAssignationState
}

/// A ServiceWatcher simply watch the kubernetes services for
/// annotations relative to the gdpr endpoints.
/// See the gdpr-collector for more information.
type ServiceWatcher struct {
	client *kubernetes.Clientset

	mutex *sync.RWMutex

	// Store the services list for each application
	Applications map[string]ApplicationServices
	// Store the applications for each service (use for quick-lookup)
	ServiceLookup map[types.UID]ServiceAssignation

	stopCtx context.CancelFunc
}

/// Creates an instance of a ServiceWatcher and
/// start watching for the services
func CreateServiceWatcher(client *kubernetes.Clientset) *ServiceWatcher {
	svcw := &ServiceWatcher{
		client:        client,
		mutex:         &sync.RWMutex{},
		Applications:  make(map[string]ApplicationServices),
		ServiceLookup: make(map[types.UID]ServiceAssignation),
	}
	return svcw
}

/// Start watching the kubernetes cluster for updates
func (svcw *ServiceWatcher) Watch() {
	ctx, stop := context.WithCancel(context.Background())
	svcw.stopCtx = stop

	logger := log.Logger

	// watch all namespaces for services
	watcher, err := svcw.client.CoreV1().Services("").Watch(ctx, v1meta.ListOptions{
		Watch: true,
	})

	if err != nil {
		logger.Panic().Err(err).Msg("Failed to start service listener")
	}

	listenChannel := watcher.ResultChan()

	for {
		event := <-listenChannel

		// on error
		if event.Type == watch.Error {
			log.Fatal().Msg("The watcher returned an error")
			break
		}

		// on service creation
		if event.Type == watch.Added {
			svc := event.Object.(*v1.Service)

			var uid = svc.UID
			svcw.mutex.Lock()

			assignation := ServiceAssignation{}
			shouldCommitAssignation := false

			// we added a service
			if application, ok := svc.Annotations["developershouse.xyz/gdpr-takeout-service"]; ok {
				logger.Info().Msgf("Service %s/%s added to the %s takeout service list", svc.Namespace, svc.Name, application)
				// if the application is already registered, we just add the service to the list
				if entry, ok := svcw.Applications[application]; ok {
					entry.Takeout = append(svcw.Applications[application].Takeout, &ServiceInfo{
						Namespace: svc.Namespace,
						Name:      svc.Name,
						UID:       uid,
					})
					svcw.Applications[application] = entry
				} else {
					// otherwise, we just create the application
					var array = make([]*ServiceInfo, 1)
					array[0] = &ServiceInfo{
						Namespace: svc.Namespace,
						Name:      svc.Name,
						UID:       uid,
					}

					svcw.Applications[application] = ApplicationServices{
						Takeout:  array,
						Deletion: make([]*ServiceInfo, 0),
					}
				}
				// we add our service to the lookup table
				assignation.Takeout = ServiceAssignationState{
					Application: application,
				}
				shouldCommitAssignation = true
			}

			if application, ok := svc.Annotations["developershouse.xyz/gdpr-deletion-service"]; ok {
				logger.Info().Msgf("Service %s/%s added to the %s deletion service list", svc.Namespace, svc.Name, application)
				// if the application is already registered, we just add the service to the list
				if entry, ok := svcw.Applications[application]; ok {
					entry.Deletion = append(svcw.Applications[application].Deletion, &ServiceInfo{
						Namespace: svc.Namespace,
						Name:      svc.Name,
						UID:       uid,
					})
					svcw.Applications[application] = entry
				} else {
					// otherwise, we just create the application
					var array = make([]*ServiceInfo, 1)
					array[0] = &ServiceInfo{
						Namespace: svc.Namespace,
						Name:      svc.Name,
						UID:       uid,
					}

					svcw.Applications[application] = ApplicationServices{
						Takeout:  make([]*ServiceInfo, 0),
						Deletion: array,
					}
				}

				// we add our service to the lookup table
				assignation.Deletion = ServiceAssignationState{
					Application: application,
				}
				shouldCommitAssignation = true
			}

			if shouldCommitAssignation {
				// commit to the lookup table
				svcw.ServiceLookup[uid] = assignation
			}

			svcw.mutex.Unlock()
		}

		if event.Type == watch.Deleted {
			svc := event.Object.(*v1.Service)

			var uid = svc.UID

			if entry, ok := svcw.ServiceLookup[uid]; ok {
				// delete the service from the application deletion service list
				if services, ok := svcw.Applications[entry.Deletion.Application]; ok {
					index := -1

					// linear search
					for i, s := range services.Deletion {
						if s.UID == uid {
							index = i
							break
						}
					}

					if index != -1 {
						services.Deletion[index] = services.Deletion[len(services.Deletion)-1]
						services.Deletion[len(services.Deletion)-1] = nil
						services.Deletion = services.Deletion[:len(services.Deletion)-1]

						svcw.Applications[entry.Deletion.Application] = services
					} else {
						log.Info().Msgf("couldn't find service %s in deletion list of %s", uid, entry.Takeout.Application)
					}

				}

				// delete the service from the application takeout service list
				if services, ok := svcw.Applications[entry.Takeout.Application]; ok {
					index := -1

					// linear search
					for i, s := range services.Takeout {
						if s.UID == uid {
							index = i
							break
						}
					}

					if index != -1 {
						services.Takeout[index] = services.Takeout[len(services.Takeout)-1]
						services.Takeout[len(services.Takeout)-1] = nil
						services.Takeout = services.Takeout[:len(services.Takeout)-1]

						svcw.Applications[entry.Takeout.Application] = services
					} else {
						log.Info().Msgf("couldn't find service %s in takeout list of %s", uid, entry.Takeout.Application)
					}
				}

				// delete from the service lookup
				delete(svcw.ServiceLookup, uid)
			} else {
				log.Info().Msgf("bad cache removal: not present in the service lookup map")
			}
		}

		/*
			if event.Type == watch.Modified {
				svc := event.Object.(*v1.Service)

				if val, ok := svc.Annotations["developershouse.xyz/gdpr-takeout-service"]; ok {
					fmt.Println("New gdpr takeout service removed", svc.Name, "for bucket", val)
				}

				if val, ok := svc.Annotations["developershouse.xyz/gdpr-deletion-service"]; ok {
					fmt.Println("New gdpr deletion service removed", svc.Name, "for bucket", val)
				}
			}*/
	}

}
