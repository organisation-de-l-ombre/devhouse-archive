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


variable "kubeconfig_path" {
  type        = string
  description = "Path of the kubectl config"
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


provider "kubernetes" {
  config_path = var.kubeconfig_path
}

# We use helm to deploy all the infrastructure,
# so we use the helm terraform provider.
provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_path
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
  name = "haproxy-ingress"

  namespace        = "haproxy-ingress"
  create_namespace = true

  chart      = "haproxy-ingress"
  repository = "https://haproxy-ingress.github.io/charts"

  # We alse need the monitoring because we use ServiceMonitors custom ressources defined bu prometheus-operator
  depends_on = [
    helm_release.cilium,
    helm_release.kube_prometheus
  ]

  values = [file("${path.module}/yamls/ingress.yml")]
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
    namespace = "haproxy-ingress"
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
    namespace = "haproxy-ingress"
  }

  depends_on = [
    helm_release.ingress,
    cloudflare_argo_tunnel.traffic_tunnel
  ]

  data = {
    "creds.json" = jsonencode({
      "AccountTag" = var.cloudflare_account_id
      "TunnelSecret" = cloudflare_argo_tunnel.traffic_tunnel.secret
      "TunnelID" = cloudflare_argo_tunnel.traffic_tunnel.id
    })
  }
}

# Deployement of the cloudflared tunnel
resource "kubernetes_deployment" "cloudflared" {
  metadata {
    name = "cloudflared"
    namespace = "haproxy-ingress"
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
        restart_policy = "Always"

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
          image = "cloudflare/cloudflared"
          name  = "cloudflared"
          image_pull_policy = "IfNotPresent"

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
          }

          volume_mount {
            name       = "config"
            mount_path = "/etc/cloudflared"
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
