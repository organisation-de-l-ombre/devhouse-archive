package logic

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/streadway/amqp"
	openapi "go.developershouse.xyz/login/cryir/go"
)

func (s *ImplementedApiService) CreateTakeout(context context.Context, userId string) (openapi.ImplResponse, error) {
	id := uuid.New().String()
	state := openapi.Takeout{
		Id:       id,
		User:     userId,
		Services: make([]openapi.TakeoutServices, 0),
		Expire:   3600,
		Link:     "",
		Status:   "pending",
	}
	bytes, err := json.Marshal(state)
	if err != nil {
		log.Err(err)
		return openapi.ImplResponse{Code: 500, Body: struct{}{}}, err
	}

	err = s.Redis.Set(context, fmt.Sprintf("cryir:takeout:%s", id), string(bytes), time.Hour).Err()
	if err != nil {
		log.Err(err)
		return openapi.ImplResponse{Code: 500, Body: struct{}{}}, err
	}
	err = s.Redis.SAdd(context, fmt.Sprintf("cryir:takeout-result:%s", userId), id).Err()
	if err != nil {
		log.Err(err)
		return openapi.ImplResponse{Code: 500, Body: struct{}{}}, err
	}

	err = s.Amqp.Publish(
		RequestExchange,
		"cryir.takeout_request.create",
		false,
		false,
		amqp.Publishing{
			Body:        bytes,
			ContentType: "application/json",
		},
	)
	if err != nil {
		log.Err(err)
		return openapi.ImplResponse{Code: 500, Body: struct{}{}}, err
	}

	return openapi.ImplResponse{
		Code: 200,
		Body: state,
	}, nil
}
