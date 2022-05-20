# syntax=docker/dockerfile:1

##
## Build
##
FROM golang AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./

RUN go build -o /gdpr-collector

##
## Deploy
##
FROM gcr.io/distroless/base-debian10

WORKDIR /

COPY --from=build /gdpr-collector /gdpr-collector

EXPOSE 8090

USER nonroot:nonroot

ENTRYPOINT ["/gdpr-collector"]