# Domira MVP - GCP Infrastructure

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  # Uncomment for remote state storage
  # backend "gcs" {
  #   bucket = "domira-terraform-state"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "services" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "iam.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false
}

# Artifact Registry for Docker images
module "artifact_registry" {
  source = "./modules/artifact-registry"

  project_id  = var.project_id
  region      = var.region
  repository_id = "domira-images"

  depends_on = [google_project_service.services]
}

# Secret Manager for sensitive configuration
module "secrets" {
  source = "./modules/secret-manager"

  project_id = var.project_id
  secrets = {
    stripe-api-key       = var.stripe_api_key
    stripe-webhook-secret = var.stripe_webhook_secret
    eth-rpc-url          = var.eth_rpc_url
    contract-address     = var.contract_address
    admin-private-key    = var.admin_private_key
  }

  depends_on = [google_project_service.services]
}

# Cloud Run - Backend API
module "backend" {
  source = "./modules/cloud-run"

  project_id   = var.project_id
  region       = var.region
  service_name = "domira-backend"
  image        = "${var.region}-docker.pkg.dev/${var.project_id}/${module.artifact_registry.repository_id}/backend:${var.image_tag}"

  env_vars = {
    APP_NAME     = "Domira API"
    DEBUG        = "false"
    DATABASE_URL = "sqlite+aiosqlite:///./domira.db"
    CORS_ORIGINS = "[\"${var.frontend_url}\"]"
  }

  secret_env_vars = {
    STRIPE_API_KEY        = module.secrets.secret_ids["stripe-api-key"]
    STRIPE_WEBHOOK_SECRET = module.secrets.secret_ids["stripe-webhook-secret"]
    ETH_RPC_URL           = module.secrets.secret_ids["eth-rpc-url"]
    CONTRACT_ADDRESS      = module.secrets.secret_ids["contract-address"]
    ADMIN_PRIVATE_KEY     = module.secrets.secret_ids["admin-private-key"]
  }

  min_instances = 0
  max_instances = 10
  cpu           = "1"
  memory        = "512Mi"

  allow_unauthenticated = true

  depends_on = [module.artifact_registry, module.secrets]
}

# Cloud Run - Frontend
module "frontend" {
  source = "./modules/cloud-run"

  project_id   = var.project_id
  region       = var.region
  service_name = "domira-frontend"
  image        = "${var.region}-docker.pkg.dev/${var.project_id}/${module.artifact_registry.repository_id}/frontend:${var.image_tag}"

  env_vars = {
    NEXT_PUBLIC_API_URL = module.backend.url
  }

  secret_env_vars = {}

  min_instances = 0
  max_instances = 10
  cpu           = "1"
  memory        = "512Mi"

  allow_unauthenticated = true

  depends_on = [module.artifact_registry, module.backend]
}
