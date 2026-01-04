"""
Domira Backend - Pydantic Models
"""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime


# ============ Enums ============

class KYCStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    FAILED = "failed"
    EXPIRED = "expired"


class ListingStatus(str, Enum):
    ACTIVE = "active"
    SOLD = "sold"
    CANCELLED = "cancelled"


# ============ User Models ============

class UserBase(BaseModel):
    email: str = Field(..., description="User email address")
    full_name: str = Field(..., description="User full name")


class UserCreate(UserBase):
    wallet_address: Optional[str] = Field(None, description="Ethereum wallet address")


class User(UserBase):
    id: str
    wallet_address: Optional[str]
    kyc_status: KYCStatus = KYCStatus.PENDING
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============ Property Models ============

class PropertyPassport(BaseModel):
    """Dutch property passport data from Kadaster/BAG/PDOK"""
    # Kadaster data
    cadastral_number: str = Field(..., description="Kadastrale aanduiding")
    ownership_status: str = Field(..., description="Eigendom status")
    mortgage_info: Optional[str] = Field(None, description="Hypotheek informatie")
    
    # BAG data
    address: str = Field(..., description="Full address")
    postal_code: str = Field(..., description="Postal code")
    city: str = Field(..., description="City")
    building_year: int = Field(..., description="Construction year")
    floor_area: float = Field(..., description="Floor area in m²")
    building_type: str = Field(..., description="Type of building")
    usage_purpose: str = Field(..., description="Usage purpose")
    
    # PDOK data
    energy_label: str = Field(..., description="Energy label (A-G)")
    woz_value: float = Field(..., description="WOZ valuation in EUR")
    woz_year: int = Field(..., description="WOZ valuation year")


class PropertyBase(BaseModel):
    name: str = Field(..., description="Property name")
    description: str = Field(..., description="Property description")
    address: str = Field(..., description="Property address")
    city: str = Field("Almere", description="City")
    asking_price: float = Field(..., description="Property asking price in EUR")
    total_fractions: int = Field(..., description="Total number of fractions")
    price_per_fraction: float = Field(..., description="Price per fraction in EUR")
    expected_yield: float = Field(..., description="Expected annual yield percentage")


class PropertyCreate(PropertyBase):
    pass


class Property(PropertyBase):
    id: str
    token_id: Optional[int] = Field(None, description="On-chain token ID")
    passport: Optional[PropertyPassport] = None
    available_fractions: int
    manager_address: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Marketplace Models ============

class ListingCreate(BaseModel):
    property_id: str = Field(..., description="Property ID to list")
    fractions: int = Field(..., description="Number of fractions to sell")
    price_per_fraction: float = Field(..., description="Asking price per fraction")


class Listing(BaseModel):
    id: str
    seller_id: str
    property_id: str
    property_name: str
    fractions: int
    price_per_fraction: float
    total_price: float
    status: ListingStatus
    created_at: datetime

    class Config:
        from_attributes = True


class BuyOrder(BaseModel):
    listing_id: str = Field(..., description="Listing ID to buy from")
    fractions: int = Field(..., description="Number of fractions to buy")


# ============ Portfolio Models ============

class PortfolioHolding(BaseModel):
    property_id: str
    property_name: str
    token_id: int
    fractions_held: int
    total_fractions: int
    percentage_held: float
    current_value: float
    monthly_yield: float


class Portfolio(BaseModel):
    user_id: str
    total_value: float
    monthly_yield: float
    holdings: list[PortfolioHolding]
    diversification_warning: Optional[str] = None


# ============ Distribution Models ============

class RentalDistribution(BaseModel):
    property_id: str
    property_name: str
    period: str  # e.g., "2026-01"
    gross_rental_income: float
    management_fee: float
    net_income: float
    distributions: list[dict]  # [{wallet_address, fractions, amount}]
