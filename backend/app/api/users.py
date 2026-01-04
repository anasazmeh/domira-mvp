"""
Domira Backend - Users API
"""
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import User, UserCreate, KYCStatus
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()

# In-memory store for MVP (replace with database)
users_db: dict[str, dict] = {}


@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate) -> User:
    """Create a new user account"""
    user_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    user_data = {
        "id": user_id,
        "email": user.email,
        "full_name": user.full_name,
        "wallet_address": user.wallet_address,
        "kyc_status": KYCStatus.PENDING,
        "created_at": now,
        "updated_at": now
    }
    
    users_db[user_id] = user_data
    return User(**user_data)


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str) -> User:
    """Get user profile by ID"""
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return User(**users_db[user_id])


@router.get("/{user_id}/kyc-status")
async def get_kyc_status(user_id: str) -> dict:
    """Get user's KYC verification status"""
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = users_db[user_id]
    return {
        "user_id": user_id,
        "kyc_status": user["kyc_status"],
        "wallet_whitelisted": user["kyc_status"] == KYCStatus.VERIFIED
    }


@router.patch("/{user_id}/wallet")
async def update_wallet(user_id: str, wallet_address: str) -> dict:
    """Update user's wallet address"""
    if user_id not in users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    users_db[user_id]["wallet_address"] = wallet_address
    users_db[user_id]["updated_at"] = datetime.utcnow()
    
    return {"message": "Wallet address updated", "wallet_address": wallet_address}


def update_user_kyc_status(user_id: str, status: KYCStatus) -> Optional[dict]:
    """Internal function to update KYC status (called by webhook)"""
    if user_id in users_db:
        users_db[user_id]["kyc_status"] = status
        users_db[user_id]["updated_at"] = datetime.utcnow()
        return users_db[user_id]
    return None


def get_user_by_wallet(wallet_address: str) -> Optional[dict]:
    """Get user by wallet address"""
    for user in users_db.values():
        if user.get("wallet_address") == wallet_address:
            return user
    return None
