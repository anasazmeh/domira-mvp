"""
Domira Backend - Property Passport Service
Mocks Dutch property data from Kadaster, BAG, and PDOK
"""
from app.models.schemas import PropertyPassport
import random


# Mock Almere addresses for demo
ALMERE_ADDRESSES = [
    {"street": "Stationsplein", "number": "45", "postal": "1315 NT", "neighborhood": "Centrum"},
    {"street": "Weerwater", "number": "12", "postal": "1316 AB", "neighborhood": "Weerwater"},
    {"street": "Spoordreef", "number": "8", "postal": "1315 GB", "neighborhood": "Centrum"},
    {"street": "Almerestraat", "number": "125", "postal": "1318 PM", "neighborhood": "Haven"},
    {"street": "De Vaart", "number": "56", "postal": "1312 KL", "neighborhood": "Tussen de Vaarten"},
    {"street": "Landgoedlaan", "number": "33", "postal": "1324 XZ", "neighborhood": "Muziekwijk"},
    {"street": "Waterlandplein", "number": "7", "postal": "1315 JD", "neighborhood": "Centrum"},
    {"street": "Olympiaweg", "number": "91", "postal": "1326 AC", "neighborhood": "Parkrand"},
]

BUILDING_TYPES = ["apartment", "townhouse", "detached", "semi-detached", "studio"]
ENERGY_LABELS = ["A++", "A+", "A", "B", "C", "D", "E", "F", "G"]
USAGE_PURPOSES = ["residential", "mixed-use", "commercial"]


def generate_cadastral_number() -> str:
    """Generate a mock Dutch cadastral number (Kadastrale aanduiding)"""
    section = random.choice(["A", "B", "C", "D", "E"])
    plot = random.randint(1000, 9999)
    return f"ALM-{section}-{plot}"


def calculate_woz_value(floor_area: float, energy_label: str, building_year: int) -> float:
    """Calculate mock WOZ value based on property characteristics"""
    base_price_per_sqm = 4500  # EUR per m² in Almere
    
    # Energy label multiplier
    energy_multipliers = {
        "A++": 1.15, "A+": 1.12, "A": 1.10, "B": 1.05,
        "C": 1.00, "D": 0.95, "E": 0.90, "F": 0.85, "G": 0.80
    }
    
    # Age factor (newer = higher value)
    current_year = 2026
    age = current_year - building_year
    age_factor = max(0.7, 1 - (age * 0.005))  # 0.5% decrease per year, min 70%
    
    woz = floor_area * base_price_per_sqm * energy_multipliers.get(energy_label, 1.0) * age_factor
    return round(woz, 2)


def generate_property_passport(
    address: str,
    postal_code: str = None,
    city: str = "Almere"
) -> PropertyPassport:
    """
    Generate a mock Property Passport with data simulating:
    - Kadaster: Ownership and cadastral data
    - BAG: Building address and usage data
    - PDOK: Energy labels and WOZ valuation
    """
    # Pick a random Almere address if not specific enough
    mock_addr = random.choice(ALMERE_ADDRESSES)
    
    if not postal_code:
        postal_code = mock_addr["postal"]
    
    # Generate property characteristics
    building_year = random.randint(1980, 2024)
    floor_area = random.uniform(45, 180)
    building_type = random.choice(BUILDING_TYPES)
    energy_label = random.choice(ENERGY_LABELS[:4])  # Almere tends to have newer buildings
    
    # Calculate WOZ
    woz_value = calculate_woz_value(floor_area, energy_label, building_year)
    
    return PropertyPassport(
        # Kadaster data
        cadastral_number=generate_cadastral_number(),
        ownership_status="Eigendom",
        mortgage_info=random.choice([None, "ABN AMRO Bank N.V.", "ING Bank N.V.", "Rabobank"]),
        
        # BAG data
        address=address,
        postal_code=postal_code,
        city=city,
        building_year=building_year,
        floor_area=round(floor_area, 1),
        building_type=building_type,
        usage_purpose=random.choice(USAGE_PURPOSES),
        
        # PDOK data
        energy_label=energy_label,
        woz_value=woz_value,
        woz_year=2025
    )


def get_property_passport_by_address(
    street: str,
    house_number: str,
    postal_code: str = None
) -> PropertyPassport:
    """Look up property passport by address (mock implementation)"""
    full_address = f"{street} {house_number}"
    return generate_property_passport(full_address, postal_code)
