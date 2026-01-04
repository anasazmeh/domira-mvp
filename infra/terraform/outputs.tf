# Outputs

output "backend_url" {
  description = "URL of the deployed backend API"
  value       = module.backend.url
}

output "frontend_url" {
  description = "URL of the deployed frontend"
  value       = module.frontend.url
}

output "artifact_registry_url" {
  description = "Artifact Registry repository URL"
  value       = module.artifact_registry.repository_url
}

output "api_docs_url" {
  description = "Backend API documentation URL"
  value       = "${module.backend.url}/docs"
}
