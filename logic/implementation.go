package logic

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/go-redis/redis/v8"
	"github.com/rs/zerolog/log"
	"github.com/streadway/amqp"
	openapi "go.developershouse.xyz/login/cryir/go"
)

const (
	RequestExchange = "takeout_requests"
	ResponseQueue   = "takeouts_responses"
)

type ImplementedApiService struct {
	Redis     *redis.Client
	Amqp      *amqp.Channel
	S3        s3.S3
	Session   session.Session
	Callbacks <-chan amqp.Delivery
}

// NewDefaultApiService creates a default api service
func NewImplementedApiService(amqp *amqp.Channel, redis *redis.Client) openapi.DefaultApiServicer {
	/**
	 * A custom RabbitMq exchange is used to broadcast the requests to all the services.
	 */
	err := amqp.ExchangeDeclare(
		RequestExchange,
		"direct",
		true,
		false,
		false,
		true,
		nil,
	)
	if err != nil {
		log.Fatal().
			Str("message", "Failed to create the request exchange of cryir.")
		panic("Failed to create the request exchange of cryir.")
	}

	/**
	 * All the services responses are sent on this channel to notify cryir of the progression.
	 */
	queue, err := amqp.QueueDeclare(
		ResponseQueue,
		true,
		false,
		false,
		true,
		nil,
	)

	if err != nil {
		log.Fatal().
			Str("message", "Failed to create the response queue of cryir.")
		panic("Failed to create the response queue of cryir.")
	}

	/**
	 * All the takeout's data are stored in S3, so we need a connection to it.
	 */
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

	/**
	 * Our service representation.
	 */
	inst := ImplementedApiService{
		Amqp:    amqp,
		Redis:   redis,
		S3:      *cl,
		Session: *sess,
	}

	// We consume all the messages of the response queue in the "Callbacks" go channel.
	cha, err := amqp.Consume(queue.Name, "cryir", true, true, true, true, nil)
	if err != nil {
		log.Err(err)
		panic(err)
	}
	inst.Callbacks = cha

	// This goroutine handles all the responses.
	go inst.statusUpdate()

	// we return the instance of our api service.
	return &inst
}
