/*
 * The entrypoint of the scarlet server.
 */

package server

import (
	"log"
	"net"

	"gitlab.com/developers-house/dev/login-group/scarlet/server/services"

	"google.golang.org/grpc"

	"gitlab.com/developers-house/dev/login-group/scarlet_protocol"
)

// CreateServer is used to create an instance of the gRPC server.
func CreateServer() *grpc.Server {
	listen, err := net.Listen("tcp", ":5000")

	if err != nil {
		log.Panicf("Failed to start the server : Listen error %s", err.Error())
	}

	server := grpc.NewServer()

	// Register the users service.
	scarlet_protocol.RegisterUsersServiceServer(server, &services.Server{})

	if err := server.Serve(listen); err != nil {
		log.Panicf("Failed to start the gRPC server : %s", err.Error())
	}

	return server
}
