# Secret Manager Module

variable "project_id" {
  type = string
}

variable "secrets" {
  description = "Map of secret names to values"
  type        = map(string)
  sensitive   = true
}

resource "google_secret_manager_secret" "secrets" {
  for_each  = var.secrets
  secret_id = each.key

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "versions" {
  for_each    = var.secrets
  secret      = google_secret_manager_secret.secrets[each.key].id
  secret_data = each.value
}

# Grant Cloud Run service account access to secrets
data "google_project" "project" {
  project_id = var.project_id
}

resource "google_secret_manager_secret_iam_member" "cloud_run_access" {
  for_each  = var.secrets
  secret_id = google_secret_manager_secret.secrets[each.key].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}

output "secret_ids" {
  value = {
    for k, v in google_secret_manager_secret.secrets : k => v.id
  }
}
