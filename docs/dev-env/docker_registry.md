---
title: Docker registry
---

Developer's House server side services are all container in OCI (or Docker) containers.
It is sometimes helpful to download these images to watch their content. Docker images
are stored in GitLab Docker registry.

Such as NPM packages, you have to create an access token with the permission
`read_registry`.
Next you have to enter these in your shell/terminal:

```shell
docker login
```
Your username is your GitLab full username and the password is the access token you
generated before.
