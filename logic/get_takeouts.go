package logic

import (
	"context"
	"encoding/json"
	"fmt"

	openapi "go.developershouse.xyz/login/cryir/go"
)

func (s *ImplementedApiService) GetTakeouts(context context.Context, userId string) (openapi.ImplResponse, error) {
	keys := s.Redis.SMembers(context, fmt.Sprintf("cryir:takeout-result:%s", userId))

	array := make([]openapi.Takeout, len(keys.Val()))
	i := 0
	for _, val := range keys.Val() {
		link, err := s.Redis.Get(context, fmt.Sprintf("cryir:takeout:%s", val)).Bytes()
		if err != nil {
			s.Redis.SRem(context, fmt.Sprintf("cryir:takeout-result:%s", userId), val)
			continue
		}
		expireIn, err := s.Redis.TTL(context, fmt.Sprintf("cryir:takeout:%s", val)).Result()
		if err != nil {
			continue
		}
		array[i] = openapi.Takeout{}
		err = json.Unmarshal(link, &array[i])
		if err != nil {
			continue
		}
		array[i].Expire = int32(expireIn.Seconds())
		i++
	}
	return openapi.ImplResponse{Code: 200, Body: array}, nil
}
