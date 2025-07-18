package logic

import (
	"context"

	openapi "go.developershouse.xyz/login/cryir/go"
)

func (s *ImplementedApiService) RequestDelete(context context.Context, userId string) (openapi.ImplResponse, error) {
	return openapi.ImplResponse{Code: 503, Body: struct{}{}}, nil
}
