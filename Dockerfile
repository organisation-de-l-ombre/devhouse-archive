FROM golang AS build
WORKDIR /go/src
COPY . .

ENV CGO_ENABLED=0
RUN go get -d -v ./...

RUN go build -a -installsuffix cgo -o server .

FROM scratch AS runtime
COPY --from=build /go/src/server ./
EXPOSE 8080/tcp
ENTRYPOINT ["./server"]
