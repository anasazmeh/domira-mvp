"""
Domira Backend - Monthly Rental Distribution Calculator

This script calculates the monthly rental income distribution for each token holder.
It deducts management fees and generates a distribution report.

Usage:
    python -m scripts.rental_distribution --property-id <id> --period 2026-01
"""
import argparse
from datetime import datetime
from typing import Optional
import json


# Mock data for demonstration
MOCK_PROPERTIES = {
    "prop-001": {
        "name": "Stationsplein Apartments",
        "token_id": 0,
        "total_fractions": 1000,
        "monthly_rent": 12500.00,  # EUR
        "management_fee_percent": 15.0
    },
    "prop-002": {
        "name": "Weerwater Residences",
        "token_id": 1,
        "total_fractions": 500,
        "monthly_rent": 8000.00,
        "management_fee_percent": 12.0
    }
}

# Mock token holders (would come from on-chain data)
MOCK_HOLDERS = {
    0: [  # token_id 0
        {"wallet": "0x1234...abcd", "fractions": 200},
        {"wallet": "0x5678...efgh", "fractions": 150},
        {"wallet": "0x9abc...ijkl", "fractions": 100},
        {"wallet": "0xdef0...mnop", "fractions": 50},
        {"wallet": "0x1111...pool", "fractions": 500},  # Liquidity pool
    ],
    1: [  # token_id 1
        {"wallet": "0x2222...aaaa", "fractions": 100},
        {"wallet": "0x3333...bbbb", "fractions": 100},
        {"wallet": "0x4444...cccc", "fractions": 75},
        {"wallet": "0x5555...dddd", "fractions": 225},
    ]
}


def calculate_distribution(
    property_id: str,
    period: str,
    gross_rent: Optional[float] = None
) -> dict:
    """
    Calculate rental distribution for a property.
    
    Args:
        property_id: Property identifier
        period: Distribution period (YYYY-MM format)
        gross_rent: Override monthly rent (optional)
    
    Returns:
        Distribution report with breakdown per holder
    """
    if property_id not in MOCK_PROPERTIES:
        raise ValueError(f"Property {property_id} not found")
    
    prop = MOCK_PROPERTIES[property_id]
    token_id = prop["token_id"]
    
    # Get gross rental income
    gross_income = gross_rent or prop["monthly_rent"]
    
    # Calculate management fee
    management_fee = gross_income * (prop["management_fee_percent"] / 100)
    
    # Net income for distribution
    net_income = gross_income - management_fee
    
    # Income per fraction
    income_per_fraction = net_income / prop["total_fractions"]
    
    # Get holders and calculate distributions
    holders = MOCK_HOLDERS.get(token_id, [])
    distributions = []
    
    for holder in holders:
        amount = holder["fractions"] * income_per_fraction
        distributions.append({
            "wallet_address": holder["wallet"],
            "fractions": holder["fractions"],
            "percentage": (holder["fractions"] / prop["total_fractions"]) * 100,
            "amount": round(amount, 2)
        })
    
    # Sort by amount descending
    distributions.sort(key=lambda x: x["amount"], reverse=True)
    
    return {
        "property_id": property_id,
        "property_name": prop["name"],
        "token_id": token_id,
        "period": period,
        "generated_at": datetime.utcnow().isoformat(),
        "financial_summary": {
            "gross_rental_income": round(gross_income, 2),
            "management_fee_percent": prop["management_fee_percent"],
            "management_fee_amount": round(management_fee, 2),
            "net_distributable_income": round(net_income, 2),
            "income_per_fraction": round(income_per_fraction, 4)
        },
        "distribution_summary": {
            "total_fractions": prop["total_fractions"],
            "holder_count": len(distributions),
            "total_distributed": round(sum(d["amount"] for d in distributions), 2)
        },
        "distributions": distributions
    }


def generate_report(property_id: str, period: str, output_file: Optional[str] = None):
    """Generate and optionally save distribution report"""
    report = calculate_distribution(property_id, period)
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"RENTAL DISTRIBUTION REPORT")
    print(f"Property: {report['property_name']}")
    print(f"Period: {report['period']}")
    print("=" * 60)
    
    summary = report["financial_summary"]
    print(f"\nGross Rental Income:    €{summary['gross_rental_income']:,.2f}")
    print(f"Management Fee ({summary['management_fee_percent']}%): -€{summary['management_fee_amount']:,.2f}")
    print(f"Net Distributable:      €{summary['net_distributable_income']:,.2f}")
    print(f"Income per Fraction:    €{summary['income_per_fraction']:.4f}")
    
    print(f"\nDistributions ({report['distribution_summary']['holder_count']} holders):")
    print("-" * 60)
    
    for dist in report["distributions"]:
        print(f"  {dist['wallet_address']}: {dist['fractions']} fractions ({dist['percentage']:.1f}%) → €{dist['amount']:,.2f}")
    
    print("-" * 60)
    print(f"Total Distributed: €{report['distribution_summary']['total_distributed']:,.2f}")
    print("=" * 60 + "\n")
    
    # Save to file if requested
    if output_file:
        with open(output_file, "w") as f:
            json.dump(report, f, indent=2)
        print(f"Report saved to: {output_file}")
    
    return report


def main():
    parser = argparse.ArgumentParser(
        description="Calculate monthly rental distributions for Domira properties"
    )
    parser.add_argument(
        "--property-id",
        required=True,
        help="Property ID (e.g., prop-001)"
    )
    parser.add_argument(
        "--period",
        default=datetime.now().strftime("%Y-%m"),
        help="Distribution period in YYYY-MM format"
    )
    parser.add_argument(
        "--output",
        help="Output JSON file path"
    )
    parser.add_argument(
        "--gross-rent",
        type=float,
        help="Override gross rental income"
    )
    
    args = parser.parse_args()
    
    try:
        generate_report(
            property_id=args.property_id,
            period=args.period,
            output_file=args.output
        )
    except ValueError as e:
        print(f"Error: {e}")
        exit(1)


if __name__ == "__main__":
    main()
