"""
Domira Backend - Marketplace API
Secondary marketplace for trading property fractions
"""
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import Listing, ListingCreate, BuyOrder, ListingStatus
from app.api.properties import properties_db
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()

# In-memory store for MVP (replace with database)
listings_db: dict[str, dict] = {}


@router.get("/listings", response_model=list[Listing])
async def list_active_listings(
    property_id: Optional[str] = None,
    max_price: Optional[float] = None
) -> list[Listing]:
    """List all active secondary market listings"""
    listings = [l for l in listings_db.values() if l["status"] == ListingStatus.ACTIVE]
    
    if property_id:
        listings = [l for l in listings if l["property_id"] == property_id]
    if max_price:
        listings = [l for l in listings if l["price_per_fraction"] <= max_price]
    
    return [Listing(**l) for l in listings]


@router.post("/listings", response_model=Listing, status_code=status.HTTP_201_CREATED)
async def create_listing(listing_data: ListingCreate) -> Listing:
    """Create a new secondary market listing"""
    # Verify property exists
    if listing_data.property_id not in properties_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    property_info = properties_db[listing_data.property_id]
    listing_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    listing_dict = {
        "id": listing_id,
        "seller_id": "mock-seller-id",  # Would come from auth
        "property_id": listing_data.property_id,
        "property_name": property_info["name"],
        "fractions": listing_data.fractions,
        "price_per_fraction": listing_data.price_per_fraction,
        "total_price": listing_data.fractions * listing_data.price_per_fraction,
        "status": ListingStatus.ACTIVE,
        "created_at": now
    }
    
    listings_db[listing_id] = listing_dict
    return Listing(**listing_dict)


@router.get("/listings/{listing_id}", response_model=Listing)
async def get_listing(listing_id: str) -> Listing:
    """Get listing details by ID"""
    if listing_id not in listings_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    return Listing(**listings_db[listing_id])


@router.post("/buy", status_code=status.HTTP_200_OK)
async def execute_buy_order(order: BuyOrder) -> dict:
    """
    Execute a buy order on a secondary market listing
    This would trigger on-chain transfer in production
    """
    if order.listing_id not in listings_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    listing = listings_db[order.listing_id]
    
    if listing["status"] != ListingStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Listing is no longer active"
        )
    
    if order.fractions > listing["fractions"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {listing['fractions']} fractions available"
        )
    
    # Calculate purchase
    total_cost = order.fractions * listing["price_per_fraction"]
    
    # Update listing
    listing["fractions"] -= order.fractions
    if listing["fractions"] == 0:
        listing["status"] = ListingStatus.SOLD
    listing["total_price"] = listing["fractions"] * listing["price_per_fraction"]
    
    return {
        "message": "Purchase successful",
        "fractions_bought": order.fractions,
        "total_cost": total_cost,
        "listing_id": order.listing_id,
        "remaining_fractions": listing["fractions"],
        "transaction_note": "On-chain transfer would be executed here"
    }


@router.delete("/listings/{listing_id}")
async def cancel_listing(listing_id: str) -> dict:
    """Cancel a listing"""
    if listing_id not in listings_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    listings_db[listing_id]["status"] = ListingStatus.CANCELLED
    return {"message": "Listing cancelled", "listing_id": listing_id}
