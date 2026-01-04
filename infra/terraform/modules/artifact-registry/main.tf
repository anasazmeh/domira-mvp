# Artifact Registry Module

variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "repository_id" {
  type = string
}

resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = var.repository_id
  description   = "Docker images for Domira MVP"
  format        = "DOCKER"

  docker_config {
    immutable_tags = false
  }
}

output "repository_id" {
  value = google_artifact_registry_repository.repo.repository_id
}

output "repository_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_id}"
}
