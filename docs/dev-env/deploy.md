---
title: Deploiement
---

Pour faire tourner un service sur l'infrastructure, vous devez premièrement définir comment l'image Docker de ce service doit être crée puis définir votre service.

### Elements requis pour le fonctionnement d'un service.

* Un système pour vérifier le fonctionnement d'un service et une endpoint pour que Kubernetes puisse vérifier (usuellement `/_healz`)
* Un conteneur qui se démarre.


### Ecrire une pipeline

La plupart du temps, un tel processus n'est pas nécessaire, mais chaque projet a besoin d'un fichier de configuration.
Pour pouvoir compiler les projets plus facilement, nous utilisont [Kaniko](https://github.com/GoogleContainerTools/kaniko). Nous disposons d'un dépot avec les fichiers de configuration, tel que helm3, kaniko et autre... en général, un fichier de configuration sera structuré comme ça.

```yml
include:
  # Inclusion de la configuration de base de GitLab, AutoDevops.
  - template: Auto-DevOps.gitlab-ci.yml
  # Application du patch pour l'utilisation de kaniko.
  - project: 'developers-house/dev/gitlab-ci-collection'
    ref: master
    file: 'kaniko.gitlab-ci.yml'
  # Application du patch pour l'utilisation de helm version 3
  - project: 'developers-house/dev/gitlab-ci-collection'
    ref: master
    file: 'helm.gitlab-ci.yml'

# ... <reste du fichier de configuration>
```

### Deploiement a partie de la chart de Developer's House.

La deploiement de service se fait a parir de manifestes Kubernetes, qui définissent quelles ressources votre service a besoin (client oauth, démarrage de conteneur...).
Pour faciliter le deploiement de services basiques, nous avons une "chart" custom qui utilise helm (un package manager pour ces manifests) [ici](https://gitlab.com/developers-house/dev/deploy-chart).

Dans le fichier deploy.yaml, vous pouvez changez les réglages de cete chart.


Vous pouvez demander un certain nombre de replicas.
```yml
replicaCount: 1
```

L'autoscaling permet de changer le nombre de réplicas selon la demande

> Activer l'autoscaling efface la configuration `replicaCount`

```yml
autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 5
  targetCPUUtilizationPercentage: 80
  targetMemoryUtilizationPercentage: 80
```

Vous pouvez aussi définir des limites de ressources a chque conteneur, ce réglage permet a Kubernetes de mieux pouvoir distribuer les conteneurs a travers les serveurs.

```yml
resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

Définir les permissions requises a un conteneur est primordial pour la sécurité, par défaut, les conteneurs sont lancés avec les privilèges les plus bas. Si vous avez besoin de privilèges plus hauts au niveau de l'hôte, vous pouvez les changer ici.

```yml
# Other details of the deployment.
podSecurityContext: {}
securityContext: {}
```

Certains conteneurs ont besoin d'être lancés seulement sur certains hôtes et dans certaines circonstances, vous pouvez configurer ça ici.

```yml
nodeSelector: {}
affinity: {}
tolerations: {}
```

Chaque service a une adresse DNS assignée, des ports personalisés etc... Vous pouvez configurer ça ici. 

```yml
service:
  enabled: true
  annotations: {}
  name: web
  type: ClusterIP
  externalPort: 5000
  internalPort: 5000
```

Certains services ont besoin d'avoir une adresse HTTP(s) qui leut est assignée, un ingress permet de dire au Reverse Proxy de rediriger le trafic du nom de domaine assigné a votre service.

> Pour ajouter des noms de domaines, ajoutez la variable `ADDITIONAL_HOSTS` contenant tout les noms de domaine séparés par une virgule dans votre projet GitLab (CI/CD > Variables).

```yml
ingress:
  enabled: true
  path: "/"
  annotations: {}
```

Avant que le service soit disponible, Kubernetes vérifie le status de ce dernier. Vous pouvez configurer ces vérifications avec les lignes suivantes. Les endpoints HTTP doivent obligatoirement retourner 2xx.

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

Definit le comportement qu'aura Kubernetes pendant une mise a jour.

```yml
podDisruption:
  enabled: true
  # minAvailable: 1
  maxUnavailable: 1
```

Permet de restreindre l'accès a ce conteneur par le réseau selon le groupe de ce conteneur. Par exemple, dans cet exemple, on autorise seulement les conteneurs présents dans le namespace ayant le label "ingress" a toucher le service.

```yml
# You should preferably only allow acces of the services you need.
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

L'api de Kubernetes fonctionne grâce a des rôles et des comptes, si votre conteneur a besoin d'un compte au niveau de l'api, activez cette option.

```yml
# The service account of the contaier.
# Allow access to the kubernetes apis here.
serviceAccount:
  # Specifies whether a service account should be created
  create: true
  # Annotations to add to the service account
  annotations: {}
  # The name of the service account to use.
  # If not set and create is true, a name is generated using the fullname template
  name: ""
```

Ajoute des labels a votre conteneur, utile pour l'utilisation des networkPolicy.

```yml
# Annotations attached to the container.
extraLabels: {}
podAnnotations: {}
```

Permet la création d'un client d'accès OAuth au niveau du serveur de login.

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
  scope: "account.* websocket.*" # Liste des scopes.
  audiences:
   - abdera # Liste des apis.
  tokenEndpointAuthMethod: none # Paramètres requis a la validation du code.
```