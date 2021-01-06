package logic

type ServiceStatus struct {
	Status string `json:"status"`
	Name   string `json:"name"`
	Uuid   string `json:"uuid"`
}

type TakeoutRequest struct {
	UUID     string          `json:"uuid"`
	User     string          `json:"user"`
	Services []ServiceStatus `json:"services,omitempty"`
}
