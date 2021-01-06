package logic

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/streadway/amqp"
	"go.developers-house.xyz/login-group/cryir/server"
	"log"
	"time"
)

var ctx = context.Background()

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

// DefaultApiService is a service that implents the logic for the DefaultApiServicer
// This service should implement the business logic for every endpoint for the DefaultApi API.
// Include any external packages or services that will be required by this service.
type ImplementedApiService struct {
	redis *redis.Client
	amqp  *amqp.Channel
}

// NewDefaultApiService creates a default api service
func NewImplementedApiService(amqp *amqp.Channel, redis *redis.Client) server.DefaultApiServicer {
	/*
	 * 1. We connect the redis instance
	 * 2. We connect to the amqp instance
	 * 3. Start the connections.
	 */

	err := amqp.ExchangeDeclare(
		"takeout_request_created_topic",
		"topic",
		true,
		false,
		false,
		true,
		nil,
	)
	failOnError(err, "Failed to declare an exchange for the rabbitmq channel.")

	return &ImplementedApiService{
		amqp:  amqp,
		redis: redis,
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
		UUID: requestUUID,
		User: userId,
	}
	bytes, err := json.Marshal(requestState)
	failOnError(err, "Failed to serialize the request state.")
	requestContext, _ := context.WithTimeout(ctx, time.Millisecond*500)
	err = s.redis.Set(requestContext, fmt.Sprintf("cryir:takeout:%s", requestUUID), string(bytes), time.Hour).Err()
	failOnError(err, "Failed to save the state")

	// - Broadcast the event.

	err = s.amqp.Publish(
		"takeout_request_created_topic",
		"cryir.takeout_request.create",
		false,
		false,
		amqp.Publishing{
			Body:        bytes,
			ContentType: "application/json",
		},
	)

	// Add api_default_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.
	return requestState, nil
}

// RequestsRequestFinalizersPost - Register a finalizer for a request.
func (s *ImplementedApiService) RequestsRequestFinalizersPost(request string) (interface{}, error) {
	// TODO - update RequestsRequestFinalizersPost with the required logic for this service method.
	// Add api_default_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.
	return nil, errors.New("service method 'RequestsRequestFinalizersPost' not implemented")
}

// RequestsRequestGet - Gets the status of a request
func (s *ImplementedApiService) RequestsRequestGet(request string) (interface{}, error) {
	// TODO - update RequestsRequestGet with the required logic for this service method.
	// Add api_default_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.
	return nil, errors.New("service method 'RequestsRequestGet' not implemented")
}

func (s *ImplementedApiService) RequestsRequestFinalizersPatch(request string, finished bool) (interface{}, error) {
	return nil, errors.New("service method 'RequestsRequestFinalizersPatch' not implemented")
}
