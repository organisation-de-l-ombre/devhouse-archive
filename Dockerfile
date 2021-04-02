FROM debian
COPY ./target/release/scarlet /bin/scarlet
EXPOSE 8080
ENV ROCKET_PORT=5000
ENTRYPOINT [ "scarlet" ]
