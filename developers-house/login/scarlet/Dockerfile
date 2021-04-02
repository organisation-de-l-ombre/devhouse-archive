FROM debian
RUN apt-get update && apt-get install libpq-dev -y && rm -rf /var/lib/apt/lists/*
COPY ./target/release/scarlet /bin/scarlet
EXPOSE 8080
ENV ROCKET_PORT=5000
ENTRYPOINT [ "scarlet" ]
