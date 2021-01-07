package logic

type ServiceStatus struct {
	Status string `json:"status"`
	Name   string `json:"name"`
	Uuid   string `json:"uuid"`
}

type Takeout struct {
	UUID     string          `json:"uuid"`
	Link     string          `json:"link"`
	Expire   float64         `json:"expire"`
	User     string          `json:"user"`
	Services []ServiceStatus `json:"services"`
	Status   string          `json:"status"`
}
