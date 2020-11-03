FROM golang as build

WORKDIR /build
COPY . .
RUN cd server && \
    go build

FROM alpine

WORKDIR /app
COPY --from=build /build/server/server .
CMD /app/server