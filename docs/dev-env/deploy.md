---
title: Deployment
---

To deploy a service on the infrastructure, first you have to define
how the service Docker image should be created and define your
service for Kubernetes.

### Required elements for service functioning

* A system which allow to check the service and an endpoint for
  Kubernetes checking (usually `/_healz`).

### Write a pipeline

Most of the time, a process of this kind is not necessary, but each
project needs a configuration file.
To compile the projects easier, we use
[Kaniko](https://github.com/GoogleContainerTools/kaniko). We have a
deposit with configuration files, such as Helm 3, Kaniko and other...
In general, a configuration file is used like this.

```yml
include:
  # GitLab base inclusion, AutoDevops.
  - template: Auto-DevOps.gitlab-ci.yml
  # Patch application for Kaniko use.
  - project: 'developers-house/dev/gitlab-ci-collection'
    ref: master
    file: 'kaniko.gitlab-ci.yml'
  # Patch application for Helm 3.
  - project: 'developers-house/dev/gitlab-ci-collection'
    ref: master
    file: 'helm.gitlab-ci.yml'

# ... <Remainder of the configuration file>.
```

### Deployment using the Developer's House chart.

Service deployment is realized using Kubernetes manifests which define
which ressources your system needs (oauth client, containers start...).
To easy the deployment of basic services, we have a chart using Helm
(a package manager for these manifests). You can find
[here](https://gitlab.com/developers-house/dev/deploy-chart), on the
GitLab organization, browsing in developers repositories.
In the deploy.yaml file, you can change the chart settings.


You can ask a certain number of replicas.
```yml
replicaCount: 1
```

Autoscaling allows to change the number of replicas according to the
demand.

> The activation of autoscaling disable the `replicaCount` parameter in
the YAML file.

```yml
autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 5
  targetCPUUtilizationPercentage: 80
  targetMemoryUtilizationPercentage: 80
```

You can also define the limits of ressources for each container, which
allows Kubernetes to improve the containers delivery through the servers.

```yml
resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

Define the required permissions for a container is essential for security.
By default, containers are launched with the lowest possible privileges. If you
need higher privileges at the level of the host, you have to change them.

```yml
# Other details of the deployment.
podSecurityContext: {}
securityContext: {}
```

Certain containers need to be only launched on certain hosts and in certain
circonstances, you can configure this like this:

```yml
nodeSelector: {}
affinity: {}
tolerations: {}
```

Each service has an assigned DNS address, custom ports etc... You can configure
this like this:

```yml
service:
  enabled: true
  annotations: {}
  name: web
  type: ClusterIP
  externalPort: 5000
  internalPort: 5000
```

Certain services have to have an assigned HTTP address, an ingress allow to say
to proxy Reverse Proxy to redirect the trafic from the assigned domain name to your
service.

> To add domain names, add the variable `ADDITIONAL_HOSTS` containing all domain names
> splitted by a coma in your GitLab project repository (CI/CD > Variables).

```yml
ingress:
  enabled: true
  path: "/"
  annotations: {}
```

Before the service become available, Kubernetes checks its status. You can configure
these verifications with the following lines. HTTP endpoints must imperatively return 2xx.

```yml
health:
  livenessProbe:
    path: "/"
    initialDelaySeconds: 15
    timeoutSeconds: 15
    scheme: "HTTP"
    probeType: "httpGet"
    command: []
  readinessProbe:
    path: "/"
    initialDelaySeconds: 5
    timeoutSeconds: 3
    scheme: "HTTP"
    probeType: "httpGet"
    command: []
```

Here is how to define the performance which will have Kubernetes during an update:

```yml
podDisruption:
  enabled: true
  # minAvailable: 1
  maxUnavailable: 1
```

You can restrict the access to a container by network in function of the group of this
container. For instance, in this example we only authorize present containers in the
namespace having the label "ingress" to access to the service.

```yml
# You should preferably only allow access of the services you need.
networkPolicy:
  enabled: true
  spec:
    podSelector:
      matchLabels: {}
    ingress:
    - from:
      - podSelector:
          matchLabels: {}
      - namespaceSelector:
          matchLabels:
            role: ingress
```

Kubernetes API works thanks to roles anc accounts, if the container needs an account at
the level of the API, enable this option.

```yml
# The service account of the container.
# Allow access to the kubernetes apis here.
serviceAccount:
  # Specifies whether a service account should be created.
  create: true
  # Annotations to add to the service account.
  annotations: {}
  # The name of the service account to use.
  # If not set and create is true, a name is generated using the fullname template.
  name: ""
```

You can add labels to containers, it is helpful for networkPolicy use.

```yml
# Annotations attached to the container.
extraLabels: {}
podAnnotations: {}
```

The OAuth access client at the level of the login service can potentially interest you :

```yaml
oauthClient:
  enabled: true
  name: Test HELM
  grantType:
    - authorization_code / implicit (deprecated)
  responseTypes:
    - code
    - token
    - id_token
  scope: "account.* websocket.*" # Scopes list.
  audiences:
   - abdera # APIs list.
  tokenEndpointAuthMethod: none # Required parameters for code validation.
```