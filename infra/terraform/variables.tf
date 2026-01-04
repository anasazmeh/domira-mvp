# Input Variables

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region for resources"
  type        = string
  default     = "europe-west4"  # Netherlands
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "frontend_url" {
  description = "Frontend URL for CORS configuration"
  type        = string
  default     = "https://domira.run.app"
}

# Secrets (mark as sensitive)
variable "stripe_api_key" {
  description = "Stripe API Key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_webhook_secret" {
  description = "Stripe Webhook Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "eth_rpc_url" {
  description = "Ethereum RPC URL"
  type        = string
  default     = "https://rpc.sepolia.org"
}

variable "contract_address" {
  description = "Deployed SPVPropertyToken contract address"
  type        = string
  default     = ""
}

variable "admin_private_key" {
  description = "Admin wallet private key for contract interactions"
  type        = string
  sensitive   = true
  default     = ""
}
