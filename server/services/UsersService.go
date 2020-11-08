package services

import (
	"context"

	"gitlab.com/developers-house/dev/login-group/scarlet_protocol"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Server is a gRPC server instance.
type Server struct {
	scarlet_protocol.UnimplementedUsersServiceServer
}

// GetUser fetch a user from the database.
func (s *Server) GetUser(context.Context, *scarlet_protocol.GetUserMessage) (*scarlet_protocol.User, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetUser not implemented")
}

// CreateUser creates a user in the database.
func (s *Server) CreateUser(context.Context, *scarlet_protocol.User) (*scarlet_protocol.User, error) {
	return nil, status.Errorf(codes.Unimplemented, "method is not implemented.")
}

// DeleteUser deletes a user from the database.
func (s *Server) DeleteUser(context.Context, *scarlet_protocol.User) (*scarlet_protocol.User, error) {
	return nil, status.Errorf(codes.Unimplemented, "method is not implemented.")
}

// EditUser applies a modification to a user in the database.
func (s *Server) EditUser(context.Context, *scarlet_protocol.User) (*scarlet_protocol.User, error) {
	return nil, status.Errorf(codes.Unimplemented, "method is not implemented.")
}
