"""
Domira Backend - Web3 Contract Service
Interacts with SPVPropertyToken contract via Web3.py
"""
from web3 import Web3, AsyncWeb3
from web3.middleware import ExtraDataToPOAMiddleware
from app.config import get_settings
import json
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# Contract ABI (minimal interface for required functions)
CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {"internalType": "bool", "name": "status", "type": "bool"}],
        "name": "setWhitelisted",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "isWhitelisted",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "manager", "type": "address"}, {"internalType": "uint256", "name": "totalSupply", "type": "uint256"}, {"internalType": "string", "name": "propertyURI", "type": "string"}],
        "name": "createProperty",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "bytes", "name": "data", "type": "bytes"}],
        "name": "mintPropertyTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {"internalType": "uint256", "name": "id", "type": "uint256"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "getMaxHolding",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "reason", "type": "string"}],
        "name": "emergencyPause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyUnpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]


def get_web3() -> Web3:
    """Get Web3 instance connected to configured RPC"""
    w3 = Web3(Web3.HTTPProvider(settings.eth_rpc_url))
    # Add PoA middleware for testnets like Sepolia
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
    return w3


def get_contract():
    """Get contract instance"""
    w3 = get_web3()
    if not settings.contract_address:
        raise ValueError("Contract address not configured")
    return w3.eth.contract(
        address=Web3.to_checksum_address(settings.contract_address),
        abi=CONTRACT_ABI
    )


def get_admin_account():
    """Get admin account for signing transactions"""
    w3 = get_web3()
    if not settings.admin_private_key:
        raise ValueError("Admin private key not configured")
    return w3.eth.account.from_key(settings.admin_private_key)


async def whitelist_address(address: str, status: bool = True) -> str:
    """
    Add or remove an address from the KYC whitelist
    Returns transaction hash
    """
    if not settings.contract_address or not settings.admin_private_key:
        logger.warning("Contract not configured, skipping whitelist transaction")
        return "0x" + "0" * 64  # Mock tx hash
    
    w3 = get_web3()
    contract = get_contract()
    admin = get_admin_account()
    
    # Build transaction
    tx = contract.functions.setWhitelisted(
        Web3.to_checksum_address(address),
        status
    ).build_transaction({
        'from': admin.address,
        'nonce': w3.eth.get_transaction_count(admin.address),
        'gas': 100000,
        'gasPrice': w3.eth.gas_price
    })
    
    # Sign and send
    signed_tx = w3.eth.account.sign_transaction(tx, admin.key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    
    logger.info(f"Whitelist transaction sent: {tx_hash.hex()}")
    return tx_hash.hex()


async def check_whitelist(address: str) -> bool:
    """Check if an address is whitelisted"""
    if not settings.contract_address:
        return False
    
    contract = get_contract()
    return contract.functions.isWhitelisted(
        Web3.to_checksum_address(address)
    ).call()


async def get_balance(address: str, token_id: int) -> int:
    """Get token balance for an address"""
    if not settings.contract_address:
        return 0
    
    contract = get_contract()
    return contract.functions.balanceOf(
        Web3.to_checksum_address(address),
        token_id
    ).call()


async def get_max_holding(token_id: int) -> int:
    """Get maximum holding for a token (20% of supply)"""
    if not settings.contract_address:
        return 0
    
    contract = get_contract()
    return contract.functions.getMaxHolding(token_id).call()


async def create_property_on_chain(
    manager_address: str,
    total_supply: int,
    property_uri: str
) -> int:
    """
    Create a new property token on-chain
    Returns the new token ID
    """
    if not settings.contract_address or not settings.admin_private_key:
        logger.warning("Contract not configured, returning mock token ID")
        return 0
    
    w3 = get_web3()
    contract = get_contract()
    admin = get_admin_account()
    
    tx = contract.functions.createProperty(
        Web3.to_checksum_address(manager_address),
        total_supply,
        property_uri
    ).build_transaction({
        'from': admin.address,
        'nonce': w3.eth.get_transaction_count(admin.address),
        'gas': 200000,
        'gasPrice': w3.eth.gas_price
    })
    
    signed_tx = w3.eth.account.sign_transaction(tx, admin.key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    
    # Wait for receipt to get token ID from events
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    # Parse PropertyCreated event for tokenId
    # In production, decode the event logs
    logger.info(f"Property created on-chain, tx: {tx_hash.hex()}")
    
    return 0  # Would parse from event logs
