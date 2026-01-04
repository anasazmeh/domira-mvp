# Domira MVP

A fractional real-estate marketplace for the Dutch market (Almere), enabling investors to purchase tokenized fractions of property SPVs with built-in KYC compliance and diversification guardrails.

## 🏗️ Architecture

```
domira-mvp/
├── frontend/          # Next.js 15 + Tailwind CSS
├── backend/           # Python FastAPI + Web3.py
├── contracts/         # Solidity ERC-1155 (Hardhat)
└── docs/              # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- npm or pnpm

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy env file and configure
cp .env.example .env

# Run server
uvicorn app.main:app --reload
# API docs at http://localhost:8000/docs
```

### 3. Smart Contracts

```bash
cd contracts
npm install

# Compile
npm run compile

# Run tests
npm run test

# Deploy to local network
npx hardhat node
npm run deploy:local
```

## ✨ Features

### Smart Contract (SPVPropertyToken.sol)

- **ERC-1155** multi-token standard for property fractions
- **20% Max Holding Cap** - Enforced diversification guardrail
- **KYC Whitelist** - Only verified wallets can hold tokens
- **Emergency Pause** - Admin can freeze all operations
- **Manager Swap** - Step-in protocol for property managers

### Backend API

- User management with Stripe Identity KYC
- Property listings with auto-generated Property Passports
- Mock Kadaster/BAG/PDOK Dutch registry data
- Secondary marketplace for P2P trading
- Rental distribution calculator

### Frontend

- Premium dashboard with portfolio stats
- Diversification warning alerts
- Property detail with full Property Passport
- Secondary marketplace UI
- Responsive design with dark mode

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users` | POST | Create user |
| `/api/v1/users/{id}` | GET | Get user profile |
| `/api/v1/properties` | GET/POST | List/create properties |
| `/api/v1/properties/{id}/passport` | GET | Get property passport |
| `/api/v1/marketplace/listings` | GET/POST | Secondary listings |
| `/api/v1/marketplace/buy` | POST | Execute purchase |
| `/api/v1/webhooks/stripe` | POST | Stripe KYC webhook |

## 🔐 Environment Variables

### Backend (.env)

```env
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ETH_RPC_URL=https://rpc.sepolia.org
CONTRACT_ADDRESS=0x...
ADMIN_PRIVATE_KEY=0x...
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📊 Rental Distribution Script

Calculate monthly distributions:

```bash
cd backend
python -m scripts.rental_distribution --property-id prop-001 --period 2026-01
```

## 🧪 Testing

```bash
# Smart contract tests
cd contracts && npm run test

# Backend tests
cd backend && pytest tests/ -v

# Frontend type check
cd frontend && npm run build
```

## 🚀 Deployment & Continuous Integration

This project uses **GitHub Actions** for fully automated CI/CD.

- **Pipeline**: [View Pipeline Guide](.github/CICD_SETUP.md)
- **Infrastructure**: Provisioned via Terraform (`infra/terraform`)
- **Services**: Deployed to Google Cloud Run

> **Setup Required**: You must configure the required GitHub Secrets to enable the pipelines. See [CICD_SETUP.md](.github/CICD_SETUP.md) for details.

## 📄 License

MIT License - See LICENSE file for details.

---

Built with ❤️ for Dutch real estate innovation
