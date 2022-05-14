terraform {
  backend "http" {}
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

resource "helm_release" "cilium" {
  name = "cilium"

  namespace = "kube-system"

  chart      = "cilium"
  repository = "https://helm.cilium.io/"

  values = [file("${path.module}/yamls/cilium.yml")]
}

resource "helm_release" "kube-prometheus" {
  name = "kube-prometheus"

  namespace        = "monitoring"
  create_namespace = true

  chart      = "kube-prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"

  values = [file("${path.module}/yamls/kube-prometheus.yml")]

  depends_on = [
    helm_release.cilium
  ]
}

resource "helm_release" "tempo" {
  name = "tempo"

  namespace = "monitoring"
  create_namespace = true

  chart = "tempo-distributed"
  repository = "https://grafana.github.io/helm-charts"

  values = [file("${path.module}/yamls/tempo.yml")]

  depends_on = [
    helm_release.cilium,
    helm_release.kube-prometheus
  ]
}

resource "helm_release" "loki" {
  name = "loki"

  namespace = "monitoring"
  create_namespace = true

  chart = "loki-stack"
  repository = "https://grafana.github.io/helm-charts"


  values = [file("${path.module}/yamls/loki.yml")]

  depends_on = [
    helm_release.cilium,
    helm_release.kube-prometheus
  ]
}

resource "helm_release" "rook-operator" {
  name = "rook-operator"

  namespace = "rook-ceph"
  create_namespace = true

  chart = "rook-ceph"
  repository = "https://charts.rook.io/release"

  depends_on = [
    helm_release.cilium,
    helm_release.kube-prometheus
  ]

  values = [file("${path.module}/yamls/rook-operator.yml")]
}

resource "helm_release" "rook-cluster" {
  name = "rook-cluster"

  namespace = "rook-ceph"
  create_namespace = true

  chart = "rook-ceph-cluster"
  repository = "https://charts.rook.io/release"

  depends_on = [
    helm_release.cilium,
    helm_release.kube-prometheus,
    helm_release.rook-operator
  ]

  values = [file("${path.module}/yamls/rook-cluster.yml")]
}

resource "helm_release" "ingress" {
  name = "haproxy-ingress"

  namespace = "haproxy-ingress"
  create_namespace = true

  chart = "haproxy-ingress"
  repository = "https://haproxy-ingress.github.io/charts"

  depends_on = [
    helm_release.cilium,
    helm_release.kube-prometheus
  ]

  values = [file("${path.module}/yamls/ingress.yml")]
}