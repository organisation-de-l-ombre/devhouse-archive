package logic

import (
	"archive/zip"
	bytes2 "bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/streadway/amqp"
	"go.developers-house.xyz/login-group/cryir/server"
	"log"
	"os"
	"strings"
	"time"
)

var ctx = context.Background()

func logIfError(err error, msg string) bool {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
		return true
	}
	return false
}

// DefaultApiService is a service that implents the logic for the DefaultApiServicer
// This service should implement the business logic for every endpoint for the DefaultApi API.
// Include any external packages or services that will be required by this service.
type ImplementedApiService struct {
	redis     *redis.Client
	amqp      *amqp.Channel
	s3        s3.S3
	session   session.Session
	callbacks <-chan amqp.Delivery
}

// NewDefaultApiService creates a default api service
func NewImplementedApiService(amqp *amqp.Channel, redis *redis.Client) server.DefaultApiServicer {
	/*
	 * 1. We connect the redis instance
	 * 2. We connect to the amqp instance
	 * 3. Start the connections.
	 * 4. We register the callback for the lib-datamanagers
	 */

	err := amqp.ExchangeDeclare(
		"takeout_request",
		"direct",
		true,
		false,
		false,
		true,
		nil,
	)
	if logIfError(err, "Failed to declare an exchange for the rabbitmq channel.") {
		os.Exit(1)
	}
	err = amqp.ExchangeDeclare(
		"takeout_callback",
		"topic",
		true,
		false,
		false,
		true,
		nil,
	)
	if logIfError(err, "Failed to declare an exchange for the rabbitmq channel.") {
		os.Exit(1)
	}
	queue, err := amqp.QueueDeclare(
		"takeout_callback_listener",
		true,
		false,
		false,
		true,
		nil,
	)
	if logIfError(err, "Failed to declare an exchange for the rabbitmq channel.") {
		os.Exit(1)
	}
	err = amqp.QueueBind(
		queue.Name,
		"takeout.callback.#",
		"takeout_callback",
		true,
		nil,
	)
	if logIfError(err, "Failed to declare an exchange for the rabbitmq channel.") {
		os.Exit(1)
	}
	sess := session.Must(session.NewSession())

	cl := s3.New(sess, &aws.Config{
		Credentials: credentials.NewStaticCredentialsFromCreds(credentials.Value{
			AccessKeyID:     os.Getenv("TAKEOUT_AWS_ACCESS_KEY_ID"),
			SecretAccessKey: os.Getenv("TAKEOUT_AWS_SECRET_ACCESS_KEY"),
		}),
		S3ForcePathStyle: aws.Bool(true),
		Region:           aws.String("us-east-1"),
		Endpoint:         aws.String(fmt.Sprintf("http://%s:%s", os.Getenv("TAKEOUT_BUCKET_HOST"), os.Getenv("TAKEOUT_BUCKET_PORT"))),
	})
	inst := ImplementedApiService{
		amqp:    amqp,
		redis:   redis,
		s3:      *cl,
		session: *sess,
	}
	cha, err := amqp.Consume(queue.Name, "cryir", true, true, true, true, nil)
	inst.callbacks = cha

	go inst.statusUpdate()

	return &inst
}

func (s *ImplementedApiService) statusUpdate() {
	// For each message received in the channel.
	for d := range s.callbacks {
		/*
		 * 1. We deserialize the message
		 * 2. We get the state of the takeout in redis & deserialize it
		 * 3. We edit or add the service to the list with his status.
		 * 4. We save the new state in redis.
		 */
		log.Printf(" [Callback] %s", d.Body)

		/* 1. We load the incoming service status & unmarshal it */
		incomingServiceStatus := ServiceStatus{}
		err := json.Unmarshal(d.Body, &incomingServiceStatus)
		if logIfError(err, "Failed to unmarshal the json from the incoming message.") {
			continue
		}

		/* 2. We get the state of the takeout in redis */
		requestContext, _ := context.WithTimeout(ctx, time.Millisecond*500)
		data := s.redis.Get(requestContext, fmt.Sprintf("cryir:takeout:%s", incomingServiceStatus.Uuid))
		if logIfError(data.Err(), "Failed to load the state of the takeout in redis.") {
			continue
		}
		/* 2.5. We unmarshal the takeout request state */
		request := Takeout{}
		// We get the bytes first
		bytes, err := data.Bytes()
		if logIfError(err, "Failed to read the body from the state.") {
			continue
		}
		// We unmarshal the content.
		err = json.Unmarshal(bytes, &request)
		if logIfError(err, "Failed to unmarshal the text from redis.") {
			continue
		}

		/* 3. We edit or add the service to the list with his status. */
		found := false
		for _, service := range request.Services {
			// If the service exists, we edit it.
			if service.Name == incomingServiceStatus.Name {
				found = true
				service.Status = incomingServiceStatus.Status
			}
		}
		// If the service doesn't exists, we register it.
		if !found {
			request.Services = append(request.Services, incomingServiceStatus)
		}

		finished := true

		for _, service := range request.Services {
			if service.Status != "finished" {
				finished = false
			}
		}

		if finished {
			prefix := fmt.Sprintf("%s/%s", request.UUID, request.User)
			list, err := s.s3.ListObjects(&s3.ListObjectsInput{
				Prefix: &prefix,
				Bucket: aws.String("takeouts"),
			})
			if logIfError(err, "Failed to list the files.") {
				s.redis.Del(requestContext, fmt.Sprintf("cryir:takeout:%s", incomingServiceStatus.Uuid))
			}
			zipfs := bytes2.Buffer{}
			zipper := zip.NewWriter(&zipfs)

			for _, file := range list.Contents {
				fs := aws.NewWriteAtBuffer([]byte{})

				downloader := s3manager.NewDownloaderWithClient(&s.s3)
				_, err = downloader.Download(fs, &s3.GetObjectInput{
					Key:    file.Key,
					Bucket: aws.String("takeouts"),
				})

				if logIfError(err, "Failed to download the file") {
					continue
				}

				f, err := zipper.Create(fmt.Sprintf("takeout%s", strings.Replace(*file.Key, prefix, "", 1)))
				if logIfError(err, "Failed to push the file to the zip.") {
					continue
				}

				_, err = f.Write(fs.Bytes())
				if logIfError(err, "Failed to write to the zip") {
					continue
				}
			}

			deleter := s3manager.NewBatchDeleteWithClient(&s.s3)
			err = deleter.Delete(ctx, s3manager.NewDeleteListIterator(&s.s3, &s3.ListObjectsInput{
				Prefix: &prefix,
				Bucket: aws.String("takeouts"),
			}))

			if logIfError(err, "Failed to delete the files") {
				return
			}

			err = zipper.Close()
			if logIfError(err, "Failed to close the zipper") {
				return
			}
			expire := time.Now()
			expire.Add(time.Hour * 24 * 7)
			uploader := s3manager.NewUploaderWithClient(&s.s3)
			_, err = uploader.Upload(&s3manager.UploadInput{
				Body:    &zipfs,
				Bucket:  aws.String("takeouts-final"),
				Key:     aws.String(request.UUID + ".zip"),
				Expires: &expire,
			})
			if logIfError(err, "Failed to upload the file") {
				return
			}
			sess := session.Must(session.NewSession())
			sign := s3.New(sess, &aws.Config{
				Credentials: credentials.NewStaticCredentialsFromCreds(credentials.Value{
					AccessKeyID:     os.Getenv("TAKEOUT_AWS_ACCESS_KEY_ID"),
					SecretAccessKey: os.Getenv("TAKEOUT_AWS_SECRET_ACCESS_KEY"),
				}),
				S3ForcePathStyle: aws.Bool(true),
				Region:           aws.String("us-east-1"),
				Endpoint:         aws.String("https://s3.developershouse.xyz"),
			})

			req, _ := sign.GetObjectRequest(&s3.GetObjectInput{
				Bucket: aws.String("takeouts-final"),
				Key:    aws.String(request.UUID + ".zip"),
			})

			url, err := req.Presign(7 * 24 * 60 * time.Minute)
			request.Link = url
			request.Status = "finished"

			val, err := json.Marshal(request)
			if logIfError(err, "Failed to save the request state") {
				return
			}

			s.redis.Set(requestContext, fmt.Sprintf("cryir:takeout:%s", request.UUID), val, 7*24*60*time.Minute)
		} else {
			val, err := json.Marshal(request)
			if logIfError(err, "Failed to save the request update state.") {
				return
			}
			/* 4. We save the new state in redis. */
			err = s.redis.Set(requestContext, fmt.Sprintf("cryir:takeout:%s", incomingServiceStatus.Uuid), val, time.Hour).Err()
			logIfError(err, "Failed to save the state in redis.")
		}

	}
}

// RequestsPost - Creates a data request.
func (s *ImplementedApiService) RequestsPost(userId string) (interface{}, error) {
	/*
	 * 1. We save the status to the redis cache.
	 * 2. We broadcast the message to the channels.
	 * 3. We return the generated id.
	 */
	requestUUID := uuid.New().String()

	// - Save the status to the redis cache.
	requestState := Takeout{
		UUID:     requestUUID,
		User:     userId,
		Services: make([]ServiceStatus, 0),
		Expire:   nil,
		Link:     nil,
		Status:   "pending",
	}

	bytes, err := json.Marshal(requestState)
	if logIfError(err, "Failed to serialize the request state.") {
		return nil, err
	}

	requestContext, _ := context.WithTimeout(ctx, time.Millisecond*500)
	err = s.redis.Set(requestContext, fmt.Sprintf("cryir:takeout:%s", requestUUID), string(bytes), time.Hour).Err()
	if logIfError(err, "Failed to save the state in redis.") {
		return nil, err
	}
	s.redis.SAdd(requestContext, fmt.Sprintf("cryir:takeout-result:%s", userId), requestUUID)

	// - Broadcast the event.

	err = s.amqp.Publish(
		"takeout_request",
		"cryir.takeout_request.create",
		false,
		false,
		amqp.Publishing{
			Body:        bytes,
			ContentType: "application/json",
		},
	)

	if logIfError(err, "Failed to broadcast the event to the listeners") {
		return nil, err
	}

	return requestState, nil
}

// RequestsRequestGet - Gets the status of a request
func (s *ImplementedApiService) RequestsRequestGet(request string) (interface{}, error) {
	/* 2. We get the state of the takeout in redis */
	requestContext, _ := context.WithTimeout(ctx, time.Millisecond*500)
	data := s.redis.Get(requestContext, fmt.Sprintf("cryir:takeout:%s", request))
	if logIfError(data.Err(), "Failed to load the state of the takeout in redis.") {
		return nil, data.Err()
	}
	ttl, err := s.redis.TTL(requestContext, fmt.Sprintf("cryir:takeout:%s", request)).Result()
	if logIfError(data.Err(), "Failed to get the TTL") {
		return nil, data.Err()
	}
	/* 2.5. We unmarshal the takeout request state */
	ent := Takeout{}
	// We get the bytes first
	bytes, err := data.Bytes()
	if logIfError(err, "Failed to read the body from the state.") {
		return err, nil
	}
	err = json.Unmarshal(bytes, &ent)
	if logIfError(err, "Failed to unmarshal the text from redis.") {
		return err, nil
	}
	ent.Expire = ttl.Seconds()
	return ent, nil
}

func (s *ImplementedApiService) RequestGetUserLinks(userId string) (interface{}, error) {
	requestContext, _ := context.WithTimeout(ctx, time.Millisecond*500)
	keys := s.redis.SMembers(requestContext, fmt.Sprintf("cryir:takeout-result:%s", userId))
	array := make([]Takeout, len(keys.Val()))
	i := 0
	for _, val := range keys.Val() {
		link, err := s.redis.Get(requestContext, fmt.Sprintf("cryir:takeout:%s", val)).Bytes()
		if err != nil {
			s.redis.SRem(requestContext, val)
			continue
		}
		expireIn, err := s.redis.TTL(requestContext, fmt.Sprintf("cryir:takeout:%s", val)).Result()
		if err != nil {
			continue
		}
		array[i] = Takeout{}
		err = json.Unmarshal(link, &array[i])
		if err != nil {
			continue
		}
		array[i].Expire = expireIn.Seconds()
		i++
	}
	return array, nil
}
