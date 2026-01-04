"""
Domira Backend - Properties API
"""
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import Property, PropertyCreate, PropertyPassport
from app.services.property_passport import generate_property_passport
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()

# In-memory store for MVP (replace with database)
properties_db: dict[str, dict] = {}


@router.get("/", response_model=list[Property])
async def list_properties(
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
) -> list[Property]:
    """List all available properties with optional filters"""
    properties = list(properties_db.values())
    
    if city:
        properties = [p for p in properties if p["city"].lower() == city.lower()]
    if min_price:
        properties = [p for p in properties if p["asking_price"] >= min_price]
    if max_price:
        properties = [p for p in properties if p["asking_price"] <= max_price]
    
    return [Property(**p) for p in properties]


@router.post("/", response_model=Property, status_code=status.HTTP_201_CREATED)
async def create_property(property_data: PropertyCreate) -> Property:
    """Create a new property listing"""
    property_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    # Generate property passport
    passport = generate_property_passport(
        address=property_data.address,
        city=property_data.city
    )
    
    property_dict = {
        "id": property_id,
        "name": property_data.name,
        "description": property_data.description,
        "address": property_data.address,
        "city": property_data.city,
        "asking_price": property_data.asking_price,
        "total_fractions": property_data.total_fractions,
        "available_fractions": property_data.total_fractions,
        "price_per_fraction": property_data.price_per_fraction,
        "expected_yield": property_data.expected_yield,
        "token_id": None,  # Set after on-chain creation
        "manager_address": "0x0000000000000000000000000000000000000000",
        "passport": passport.model_dump(),
        "created_at": now
    }
    
    properties_db[property_id] = property_dict
    return Property(**property_dict)


@router.get("/{property_id}", response_model=Property)
async def get_property(property_id: str) -> Property:
    """Get property details by ID"""
    if property_id not in properties_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    return Property(**properties_db[property_id])


@router.get("/{property_id}/passport", response_model=PropertyPassport)
async def get_property_passport(property_id: str) -> PropertyPassport:
    """Get property passport (Kadaster/BAG/PDOK data)"""
    if property_id not in properties_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    prop = properties_db[property_id]
    if not prop.get("passport"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property passport not available"
        )
    
    return PropertyPassport(**prop["passport"])


@router.patch("/{property_id}/token")
async def set_token_id(property_id: str, token_id: int) -> dict:
    """Set on-chain token ID after minting"""
    if property_id not in properties_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    properties_db[property_id]["token_id"] = token_id
    return {"message": "Token ID set", "token_id": token_id}


def update_available_fractions(property_id: str, change: int) -> Optional[dict]:
    """Update available fractions (internal use)"""
    if property_id in properties_db:
        properties_db[property_id]["available_fractions"] += change
        return properties_db[property_id]
    return None
