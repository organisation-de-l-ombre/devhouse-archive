FROM debian
COPY ./target/release/scarlet /bin/scarlet
EXPOSE 8080
ENV RUST_LOG=info
ENTRYPOINT [ "scarlet" ]
