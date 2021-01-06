package logic

type TakeoutRequest struct {
	UUID     string   `json:"uuid"`
	User     string   `json:"user"`
	Services []string `json:"services,omitempty"`
}
