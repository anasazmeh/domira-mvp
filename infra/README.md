# GCP Infrastructure Deployment Guide

## Prerequisites

1. **GCP Project** with billing enabled
2. **Terraform** >= 1.5.0 installed
3. **gcloud CLI** installed and authenticated
4. **Docker** for local testing

## Quick Deploy

### 1. Configure GCP

```bash
# Set your project
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com

# Authenticate for Terraform
gcloud auth application-default login
```

### 2. Deploy Infrastructure

```bash
cd infra/terraform

# Create tfvars file
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize and deploy
terraform init
terraform plan
terraform apply
```

### 3. Build & Deploy (Manual)

```bash
# From project root
export REGION="europe-west4"

# Build and push backend
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/domira-images/backend:v1 backend/
docker push $REGION-docker.pkg.dev/$PROJECT_ID/domira-images/backend:v1

# Build and push frontend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://domira-backend-xxxxx.run.app/api/v1 \
  -t $REGION-docker.pkg.dev/$PROJECT_ID/domira-images/frontend:v1 frontend/
docker push $REGION-docker.pkg.dev/$PROJECT_ID/domira-images/frontend:v1

# Update images in terraform.tfvars and re-apply
terraform apply
```

### 4. Deploy with Cloud Build (CI/CD)

```bash
# Connect your repository first
gcloud builds submit --config cloudbuild.yaml

# Or set up a trigger for automatic deployments
gcloud builds triggers create github \
  --repo-name="domira-mvp" \
  --repo-owner="your-github-username" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml"
```

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │              GCP Project                │
                    │                                         │
 Users ──────────►  │  ┌─────────────────────────────────┐   │
                    │  │      Cloud Run (Frontend)        │   │
                    │  │      Next.js + Tailwind          │   │
                    │  └──────────────┬──────────────────┘   │
                    │                 │                       │
                    │                 ▼                       │
                    │  ┌─────────────────────────────────┐   │
                    │  │      Cloud Run (Backend)         │   │
                    │  │      FastAPI + Web3.py           │   │
                    │  └──────────────┬──────────────────┘   │
                    │                 │                       │
                    │    ┌────────────┴────────────┐         │
                    │    ▼                         ▼         │
                    │  ┌──────────┐     ┌──────────────────┐ │
                    │  │ Secrets  │     │ Artifact Registry│ │
                    │  │ Manager  │     │ (Docker Images)  │ │
                    │  └──────────┘     └──────────────────┘ │
                    └─────────────────────────────────────────┘
                                      │
                                      ▼
                              Ethereum (Sepolia)
                              SPVPropertyToken
```

## Costs (Estimated)

| Service | Cost |
|---------|------|
| Cloud Run | ~$0 (free tier: 2M requests/month) |
| Artifact Registry | ~$0.10/GB storage |
| Secret Manager | ~$0.03/10,000 accesses |
| Cloud Build | 120 min/day free |

**Total**: ~$5-10/month for low traffic

## Troubleshooting

### Cloud Run service not starting

```bash
gcloud run services describe domira-backend --region europe-west4
gcloud run services logs domira-backend --region europe-west4
```

### Terraform state issues

```bash
terraform refresh
terraform state list
```

### Secret access denied

Ensure the Cloud Run service account has `Secret Manager Secret Accessor` role.
