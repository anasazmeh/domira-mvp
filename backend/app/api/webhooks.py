"""
Domira Backend - Stripe Webhooks API
Handles Stripe Identity verification events
"""
from fastapi import APIRouter, Request, HTTPException, Header
from app.config import get_settings
from app.models.schemas import KYCStatus
from app.api.users import update_user_kyc_status, get_user_by_wallet
from app.web3.contract import whitelist_address
import stripe
import logging

router = APIRouter()
settings = get_settings()
logger = logging.getLogger(__name__)

# Configure Stripe
stripe.api_key = settings.stripe_api_key


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature")
):
    """
    Handle Stripe Identity verification webhooks
    
    Events handled:
    - identity.verification_session.verified: User passed KYC
    - identity.verification_session.requires_input: Additional info needed
    - identity.verification_session.canceled: User cancelled
    """
    payload = await request.body()
    
    # Verify webhook signature in production
    if settings.stripe_webhook_secret:
        try:
            event = stripe.Webhook.construct_event(
                payload, stripe_signature, settings.stripe_webhook_secret
            )
        except ValueError as e:
            logger.error(f"Invalid payload: {e}")
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid signature: {e}")
            raise HTTPException(status_code=400, detail="Invalid signature")
    else:
        # Development mode - parse without verification
        import json
        event = json.loads(payload)
    
    event_type = event.get("type", "")
    data = event.get("data", {}).get("object", {})
    
    logger.info(f"Received Stripe event: {event_type}")
    
    if event_type == "identity.verification_session.verified":
        return await handle_verification_success(data)
    
    elif event_type == "identity.verification_session.requires_input":
        return await handle_verification_pending(data)
    
    elif event_type == "identity.verification_session.canceled":
        return await handle_verification_failed(data)
    
    return {"status": "ignored", "event_type": event_type}


async def handle_verification_success(data: dict) -> dict:
    """Handle successful identity verification"""
    metadata = data.get("metadata", {})
    user_id = metadata.get("user_id")
    wallet_address = metadata.get("wallet_address")
    
    if not user_id:
        logger.warning("Verification success but no user_id in metadata")
        return {"status": "error", "message": "Missing user_id in metadata"}
    
    # Update user KYC status
    update_user_kyc_status(user_id, KYCStatus.VERIFIED)
    logger.info(f"User {user_id} KYC verified")
    
    # Whitelist wallet on-chain if address provided
    if wallet_address:
        try:
            tx_hash = await whitelist_address(wallet_address, True)
            logger.info(f"Wallet {wallet_address} whitelisted, tx: {tx_hash}")
            return {
                "status": "success",
                "user_id": user_id,
                "wallet_whitelisted": True,
                "tx_hash": tx_hash
            }
        except Exception as e:
            logger.error(f"Failed to whitelist wallet: {e}")
            return {
                "status": "partial",
                "user_id": user_id,
                "kyc_verified": True,
                "wallet_whitelisted": False,
                "error": str(e)
            }
    
    return {"status": "success", "user_id": user_id, "kyc_verified": True}


async def handle_verification_pending(data: dict) -> dict:
    """Handle verification requiring additional input"""
    metadata = data.get("metadata", {})
    user_id = metadata.get("user_id")
    
    if user_id:
        update_user_kyc_status(user_id, KYCStatus.PENDING)
    
    return {"status": "pending", "user_id": user_id}


async def handle_verification_failed(data: dict) -> dict:
    """Handle failed/cancelled verification"""
    metadata = data.get("metadata", {})
    user_id = metadata.get("user_id")
    
    if user_id:
        update_user_kyc_status(user_id, KYCStatus.FAILED)
        logger.info(f"User {user_id} KYC failed")
    
    return {"status": "failed", "user_id": user_id}


@router.post("/create-verification-session")
async def create_verification_session(user_id: str, wallet_address: str) -> dict:
    """
    Create a new Stripe Identity verification session for a user
    Returns the verification URL for the frontend to redirect to
    """
    if not settings.stripe_api_key:
        # Development mode - return mock session
        return {
            "session_id": "mock_session_id",
            "url": "https://verify.stripe.com/mock",
            "status": "mock_mode"
        }
    
    try:
        session = stripe.identity.VerificationSession.create(
            type="document",
            metadata={
                "user_id": user_id,
                "wallet_address": wallet_address
            },
            options={
                "document": {
                    "require_matching_selfie": True,
                    "allowed_types": ["passport", "driving_license", "id_card"]
                }
            }
        )
        
        return {
            "session_id": session.id,
            "url": session.url,
            "status": session.status
        }
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
