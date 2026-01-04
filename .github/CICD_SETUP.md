# GitHub Actions CI/CD Setup Guide

## Required GitHub Secrets

Add these secrets to your repository at **Settings > Secrets and variables > Actions**:

### GCP Authentication (Workload Identity Federation)

| Secret | Description | Example |
|--------|-------------|---------|
| `GCP_PROJECT_ID` | Your GCP project ID | `domira-blockchain` |
| `GCP_SERVICE_ACCOUNT` | Service account email | `github-actions@domira-blockchain.iam.gserviceaccount.com` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | WIF provider path | `projects/123/locations/global/workloadIdentityPools/github/providers/github` |

### Application Secrets

| Secret | Description |
|--------|-------------|
| `STRIPE_API_KEY` | Stripe API key (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (whsec_...) |
| `ETH_RPC_URL` | Ethereum RPC URL |
| `CONTRACT_ADDRESS` | Deployed contract address |
| `ADMIN_PRIVATE_KEY` | Admin wallet private key |

---

## Setup Workload Identity Federation

This eliminates the need for service account keys:

```bash
# Set variables
export PROJECT_ID="domira-blockchain"
export GITHUB_REPO="anasazmeh/domira-mvp"

# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Grant required roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create Workload Identity Pool
gcloud iam workload-identity-pools create github \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create Provider
gcloud iam workload-identity-pools providers create-oidc github \
  --location="global" \
  --workload-identity-pool="github" \
  --display-name="GitHub" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Allow GitHub repo to impersonate service account
gcloud iam service-accounts add-iam-policy-binding \
  github-actions@$PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')/locations/global/workloadIdentityPools/github/attribute.repository/$GITHUB_REPO"

# Get the provider path for GCP_WORKLOAD_IDENTITY_PROVIDER secret
echo "projects/$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')/locations/global/workloadIdentityPools/github/providers/github"
```

---

## Workflow Files

| File | Trigger | Purpose |
|------|---------|---------|
| `ci-cd.yml` | Push to main | **Full pipeline**: Infra + Deploy |
| `infrastructure.yml` | Changes in `infra/` | Terraform only |
| `deploy.yml` | Changes in `backend/` or `frontend/` | App deployment only |

---

## Manual Triggers

All workflows support `workflow_dispatch` for manual runs:

1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**
4. Choose options and run

---

## Pipeline Flow

```
┌─────────────────┐
│  Push to main   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Detect Changes  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌─────────────┐
│ Infra │ │ Build Backend│
│ (TF)  │ └──────┬──────┘
└───────┘        │
                 ▼
         ┌──────────────┐
         │Deploy Backend│
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │Build Frontend│
         └──────┬───────┘
                │
                ▼
         ┌───────────────┐
         │Deploy Frontend│
         └──────┬────────┘
                │
                ▼
         ┌───────────────┐
         │    Summary    │
         └───────────────┘
```
