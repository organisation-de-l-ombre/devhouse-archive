package logic

import (
	"context"

	openapi "go.developershouse.xyz/login/cryir/go"
)

func (s *ImplementedApiService) HealthGet(context context.Context) (openapi.ImplResponse, error) {
	return openapi.ImplResponse{Code: 200, Body: struct{}{}}, nil
}
