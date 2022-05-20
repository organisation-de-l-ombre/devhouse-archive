package main

import (
	"encoding/json"
	"flag"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"

	servicewatcher "gitlab.com/developers-house/login/gdpr-collector/service_watcher"
)

var (
	DebugMode *bool = flag.Bool("debug", false, "Enables pretty logging")
)

func main() {
	flag.Parse()

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	if *DebugMode {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	}

	config, err := rest.InClusterConfig()

	if err != nil {
		log.Err(err).Msgf("Unable to use the in cluster config")

		var kubeconfig *string
		if home := homedir.HomeDir(); home != "" {
			kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
		} else {
			kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
		}

		flag.Parse()

		log.Info().Msgf("Using kubeconfig: %s", *kubeconfig)

		// use the current context in kubeconfig
		config, err = clientcmd.BuildConfigFromFlags("", *kubeconfig)

		if err != nil {
			log.Panic().AnErr("", err).Msgf("Unable to read the kubernetes config")
		}
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		log.Panic().Err(err).Msgf("Unable to start the kubernetes client")
	}

	watcher := servicewatcher.CreateServiceWatcher(clientset)

	go watcher.Watch()

	go func() {

		h := func(w http.ResponseWriter, req *http.Request) {
			b, _ := json.Marshal(watcher)

			w.Write(b)
		}

		http.HandleFunc("/", h)

		http.ListenAndServe("0.0.0.0:8090", nil)
	}()

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	log.Info().Msg("Awaiting exit signal...")
	sig := <-sigs
	log.Info().Msgf("Got signal %s... Exiting", sig)
}
