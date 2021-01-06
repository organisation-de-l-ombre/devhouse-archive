package logic

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/streadway/amqp"
	"go.developers-house.xyz/login-group/cryir/server"
	"log"
	"os"
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

	inst := ImplementedApiService{
		amqp:  amqp,
		redis: redis,
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
		request := TakeoutRequest{}
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
				break
			}
		}
		// If the service doesn't exists, we register it.
		if !found {
			request.Services = append(request.Services, incomingServiceStatus)
		}

		/* 4. We save the new state in redis. */
		err = s.redis.Set(requestContext, fmt.Sprintf("cryir:takeout:%s", incomingServiceStatus.Uuid), string(bytes), time.Hour).Err()
		logIfError(err, "Failed to save the state in redis.")
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
	requestState := TakeoutRequest{
		UUID:     requestUUID,
		User:     userId,
		Services: make([]ServiceStatus, 0),
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
	/* 2.5. We unmarshal the takeout request state */
	ent := TakeoutRequest{}
	// We get the bytes first
	bytes, err := data.Bytes()
	if logIfError(err, "Failed to read the body from the state.") {
		return err, nil
	}
	err = json.Unmarshal(bytes, &ent)
	if logIfError(err, "Failed to unmarshal the text from redis.") {
		return err, nil
	}

	return data, nil
}
