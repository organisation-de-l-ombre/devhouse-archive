# Required by the gitlab (used as a state backend)
terraform {
  backend "http" {}
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.11.0"
    }
  }
}

variable "cloudflare_email" {
  type        = string
  description = "Email of the cloudflare account used"
}

variable "cloudflare_api_key" {
  type        = string
  description = "API key used to deploy stuff on cloudflare"
}

variable "cloudflare_tunnel_secret" {
  type        = string
  description = "Secrer of the pre-created tunnel secret"
}

variable "cloudflare_account_id" {
  type        = string
  description = "Account id"
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Zone id"
}

variable "gitlab_agent_token" {
  type        = string
  description = "Gitlab agent token"
}

variable "kube_context" {
  type        = string
  description = "Gitlab agent token"
}

provider "kubernetes" {
  config_context = var.kube_context
}
provider "helm" {
  kubernetes {
    config_context = var.kube_context
  }
}

provider "cloudflare" {
  email   = var.cloudflare_email
  api_key = var.cloudflare_api_key
}

# Cilium is used to operate the networking of every container
# see the values of the cilium helm chart here
resource "helm_release" "cilium" {
  name = "cilium"

  namespace = "kube-system"

  chart      = "cilium"
  repository = "https://helm.cilium.io/"

  values = [file("${path.module}/yamls/cilium.yml")]
}

# We use the kube-prometheus to bootstrap the monitoring
# this chart includes
# * prometheus-operator (used to automatically manage the lifecycle of prometheus, like adding monitors, alerts)
#     -> a prometheus cluster is also created
# * grafana (used to viazualize the metrics)
# * alertmanager (used to watch & broadcast alerts)
resource "helm_release" "kube_prometheus" {
  name = "kube-prometheus"

  namespace = "monitoring"
  # The namespace might not exist
  create_namespace = true

  chart      = "kube-prometheus-stack"
  repository = "https://prometheus-community.github.io/helm-charts"

  values = [file("${path.module}/yamls/kube-prometheus.yml")]

  wait = false

  set {
    name  = "grafana.grafana\\.ini.auth\\.gitlab.client_id"
    value = "ed13776e09fd34b288a49e8d19aeed49c7905eb95edf13013996a2a50358379e"
    type = "string"
  }

  set {
    name  = "grafana.grafana\\.ini.auth\\.gitlab.client_secret"
    value = "ce9b3474ae6372a26b8c3aaba9c7c761db849c981ee2e44bccd6ff2d08c06902"
    type = "string"
  }

  # We need the networking
  depends_on = [
    helm_release.cilium
  ]
}

# Tempo is the Grafanalabs's alternative to tracing solutions like jaeger & zipking
# it is used to store traces of many requests in the infrastructure
# it enables insignts about problems and performance of various services
resource "helm_release" "tempo" {
  name = "tempo"

  namespace        = "monitoring"
  create_namespace = true

  chart      = "tempo-distributed"
  repository = "https://grafana.github.io/helm-charts"

  values = [file("${path.module}/yamls/tempo.yml")]

  wait = false

  depends_on = [
    helm_release.cilium,
    helm_release.kube_prometheus
  ]
}

# Loki is the Grafanalabs's alternative for storing logs
# it basically stores the logs files of every service on the infrastructure
resource "helm_release" "loki" {
  name = "loki"

  namespace        = "monitoring"
  create_namespace = true

  chart      = "loki-distributed"
  repository = "https://grafana.github.io/helm-charts"


  values = [file("${path.module}/yamls/loki.yml")]

  wait = false

  depends_on = [
    helm_release.cilium,
    helm_release.kube_prometheus
  ]
}

resource "helm_release" "promtail" {
  name = "promtail"

  namespace        = "monitoring"
  create_namespace = true

  chart      = "promtail"
  repository = "https://grafana.github.io/helm-charts"


  values = [file("${path.module}/yamls/promtail.yml")]

  wait = false

  depends_on = [
    helm_release.cilium,
    helm_release.kube_prometheus,
    helm_release.loki
  ]
}

resource "helm_release" "gitlab_agent" {
  name = "gitlab-agent"

  namespace        = "gitlab"
  create_namespace = true

  chart      = "gitlab-agent"
  repository = "https://charts.gitlab.io"

  set {
    name  = "config.token"
    value = var.gitlab_agent_token
    type  = "string"
  }

  set {
    name  = "config.kasAddress"
    value = "wss://kas.gitlab.com"
    type  = "string"
  }
}


# Rook is used as out storage layer; it enables use of ceph-based volumes and object storage
# Rook-operator handles the lifecycle of ceph clusters
resource "helm_release" "rook_operator" {
  name = "rook-operator"

  namespace        = "rook-ceph"
  create_namespace = true

  chart      = "rook-ceph"
  repository = "https://charts.rook.io/release"

  # We need the monitoring because we use "ServiceMonitors" provided by the prometheus-operator
  depends_on = [
    helm_release.cilium,
    helm_release.kube_prometheus
  ]

  values = [file("${path.module}/yamls/rook-operator.yml")]
}

# Simply bootstrap the rook-ceph cluster using crds (CustomRessourcesDefinitions)
resource "helm_release" "rook_cluster" {
  name = "rook-cluster"

  namespace        = "rook-ceph"
  create_namespace = true

  chart      = "rook-ceph-cluster"
  repository = "https://charts.rook.io/release"

  # We need the monitoring because we use "ServiceMonitors" provided by the prometheus-operator
  # We also need the rook operator, since we use CustomRessources defined by the operator itself
  depends_on = [
    helm_release.cilium,
    helm_release.kube_prometheus,
    helm_release.rook_operator
  ]

  values = [file("${path.module}/yamls/rook-cluster.yml")]
}

# The ingress's job is to handle the routing of all the http/https traffic
resource "helm_release" "ingress" {
  name = "ingress"

  namespace        = "projectcontour"
  create_namespace = true

  chart      = "contour"
  repository = "https://charts.bitnami.com/bitnami"

  # We alse need the monitoring because we use ServiceMonitors custom ressources defined bu prometheus-operator
  depends_on = [
    helm_release.cilium,
    helm_release.kube_prometheus
  ]
}

resource "helm_release" "gitlab_runner" {
  name = "gitlab-runner"

  namespace = "gitlab-runner"
  create_namespace = true

  chart = "gitlab-runner"
  repository = "https://charts.gitlab.io"

    depends_on = [
    helm_release.cilium
  ]

  values = [file("${path.module}/yamls/gitlab-runner.yml")]
}

# We use a cloudflare tunnel to route the traffic to our infrastructure.
# We load the existing tunnel
resource "cloudflare_argo_tunnel" "traffic_tunnel" {
  account_id = var.cloudflare_account_id
  name       = "dh-tunnel"
  secret     = var.cloudflare_tunnel_secret
}

# We create a record that catch all the subdomains of the domain
# We route all the data to the argo tunnel
resource "cloudflare_record" "catch_all" {
  zone_id = var.cloudflare_zone_id
  name    = "*"
  value   = cloudflare_argo_tunnel.traffic_tunnel.cname
  type    = "CNAME"
  ttl     = 1
  proxied = true

  depends_on = [
    cloudflare_argo_tunnel.traffic_tunnel
  ]
}

resource "cloudflare_record" "catch_all_matthieu_dev" {
  zone_id = "9e2bc49eb331f6117f70f16ad0fedd91"
  name    = "*"
  value   = cloudflare_argo_tunnel.traffic_tunnel.cname
  type    = "CNAME"
  ttl     = 1
  proxied = true

  depends_on = [
    cloudflare_argo_tunnel.traffic_tunnel
  ]
}

# See cloudflared-config.yml for the configuration
resource "kubernetes_config_map" "cloudflare_configmap" {
  metadata {
    name      = "cloudflared-config"
    namespace = "projectcontour"
  }

  depends_on = [
    helm_release.ingress
  ]

  data = {
    "config.yml" = "${file("${path.module}/cloudflared-config.yml")}"
  }
}

# Secret generated from the argo tunnel
resource "kubernetes_secret" "cloudflare_secret" {
  metadata {
    name      = "cloudflared-secret"
    namespace = "projectcontour"
  }

  depends_on = [
    helm_release.ingress,
    cloudflare_argo_tunnel.traffic_tunnel
  ]

  data = {
    "creds.json" = jsonencode({
      "AccountTag"   = var.cloudflare_account_id
      "TunnelSecret" = cloudflare_argo_tunnel.traffic_tunnel.secret
      "TunnelID"     = cloudflare_argo_tunnel.traffic_tunnel.id
    })
  }
}

# Deployement of the cloudflared tunnel
resource "kubernetes_deployment" "cloudflared" {
  metadata {
    name      = "cloudflared"
    namespace = "projectcontour"
    labels = {
      app = "cloudflared"
    }
  }
  depends_on = [
    helm_release.ingress
  ]

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "cloudflared"
      }
    }

    template {
      metadata {
        labels = {
          app = "cloudflared"
        }
      }



      spec {
        restart_policy                  = "Always"
        automount_service_account_token = false

        volume {
          name = "config"
          config_map {
            name = kubernetes_config_map.cloudflare_configmap.metadata[0].name
          }
        }

        volume {
          name = "credentials"
          secret {
            secret_name = kubernetes_secret.cloudflare_secret.metadata[0].name
          }
        }

        container {
          image             = "cloudflare/cloudflared"
          name              = "cloudflared"
          image_pull_policy = "Always"

          security_context {
            capabilities {
              drop = ["ALL"]
            }
            read_only_root_filesystem = true
          }



          resources {
            limits = {
              cpu    = "100m"
              memory = "100Mi"
            }
            requests = {
              cpu    = "100m"
              memory = "100Mi"
            }
          }

          command = ["cloudflared", "tunnel", "run", "dh-tunnel"]

          env {
            name  = "TUNNEL_METRICS"
            value = "0.0.0.0:8080"
          }

          volume_mount {
            name       = "credentials"
            mount_path = "/secrets"
            read_only  = true
          }

          volume_mount {
            name       = "config"
            mount_path = "/etc/cloudflared"
            read_only  = true
          }

          liveness_probe {
            http_get {
              path = "/healthcheck"
              port = 8080
            }

            initial_delay_seconds = 3
            period_seconds        = 3
          }

          readiness_probe {
            http_get {
              path = "/ready"
              port = 8080
            }
          }


        }
      }
    }
  }
}
