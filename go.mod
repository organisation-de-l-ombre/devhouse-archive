module gitlab.com/developers-house/dev/login-group/scarlet

go 1.13

require (
	github.com/mattn/go-sqlite3 v2.0.3+incompatible // indirect
	gitlab.com/developers-house/dev/login-group/scarlet_protocol v1.0.0
	google.golang.org/grpc v1.33.2
	gorm.io/driver/sqlite v1.1.3 // indirect
	gorm.io/gorm v1.20.5
)

replace gitlab.com/developers-house/dev/login-group/scarlet_protocol => ./protocol/src
