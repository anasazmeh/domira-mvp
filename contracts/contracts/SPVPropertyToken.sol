// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/**
 * @title SPVPropertyToken
 * @dev ERC-1155 token representing fractional ownership in property SPVs
 * 
 * Features:
 * - Each tokenId represents one property SPV
 * - 20% maximum holding cap per wallet (diversification guardrail)
 * - KYC whitelist enforcement
 * - Emergency pause functionality
 * - Manager swap capability for step-in protocol
 */
contract SPVPropertyToken is ERC1155, AccessControl, Pausable, ERC1155Supply {
    
    // ============ Constants ============
    
    /// @notice Maximum percentage of total supply a single wallet can hold (20%)
    uint256 public constant MAX_HOLDING_PERCENTAGE = 20;
    
    /// @notice Basis points denominator (100%)
    uint256 public constant BASIS_POINTS = 100;
    
    // ============ Roles ============
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant KYC_MANAGER_ROLE = keccak256("KYC_MANAGER_ROLE");
    
    // ============ State Variables ============
    
    /// @notice Mapping of token ID to property manager address
    mapping(uint256 => address) public propertyManagers;
    
    /// @notice Mapping of token ID to property metadata URI
    mapping(uint256 => string) public propertyURIs;
    
    /// @notice Mapping of addresses that have passed KYC
    mapping(address => bool) public whitelistedAddresses;
    
    /// @notice Mapping of token ID to total supply cap
    mapping(uint256 => uint256) public tokenSupplyCaps;
    
    /// @notice Next token ID to be minted
    uint256 public nextTokenId;
    
    // ============ Events ============
    
    event PropertyCreated(
        uint256 indexed tokenId,
        address indexed manager,
        uint256 totalSupply,
        string propertyURI
    );
    
    event PropertyManagerSwapped(
        uint256 indexed tokenId,
        address indexed oldManager,
        address indexed newManager,
        string reason
    );
    
    event AddressWhitelisted(address indexed account, bool status);
    
    event EmergencyPauseActivated(address indexed by, string reason);
    
    event EmergencyPauseDeactivated(address indexed by);
    
    // ============ Errors ============
    
    error NotWhitelisted(address account);
    error ExceedsMaxHolding(address account, uint256 tokenId, uint256 currentBalance, uint256 amount, uint256 maxAllowed);
    error PropertyDoesNotExist(uint256 tokenId);
    error InvalidManager(address manager);
    error InvalidSupply(uint256 supply);
    
    // ============ Constructor ============
    
    constructor(string memory baseURI) ERC1155(baseURI) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(KYC_MANAGER_ROLE, msg.sender);
        
        // Whitelist deployer by default
        whitelistedAddresses[msg.sender] = true;
        emit AddressWhitelisted(msg.sender, true);
    }
    
    // ============ Property Management ============
    
    /**
     * @notice Create a new property SPV token
     * @param manager Address of the property manager
     * @param totalSupply Total number of fractions for this property
     * @param propertyURI Metadata URI for this property
     * @return tokenId The ID of the newly created property token
     */
    function createProperty(
        address manager,
        uint256 totalSupply,
        string calldata propertyURI
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        if (manager == address(0)) revert InvalidManager(manager);
        if (totalSupply == 0) revert InvalidSupply(totalSupply);
        
        uint256 tokenId = nextTokenId++;
        
        propertyManagers[tokenId] = manager;
        propertyURIs[tokenId] = propertyURI;
        tokenSupplyCaps[tokenId] = totalSupply;
        
        emit PropertyCreated(tokenId, manager, totalSupply, propertyURI);
        
        return tokenId;
    }
    
    /**
     * @notice Mint property tokens to an investor
     * @param to Recipient address (must be whitelisted)
     * @param tokenId Property token ID
     * @param amount Number of fractions to mint
     */
    function mintPropertyTokens(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes calldata data
    ) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (tokenId >= nextTokenId) revert PropertyDoesNotExist(tokenId);
        _checkWhitelist(to);
        _checkMaxHolding(to, tokenId, amount);
        
        _mint(to, tokenId, amount, data);
    }
    
    // ============ Step-In Protocol ============
    
    /**
     * @notice Swap property manager in case of KPI failure
     * @dev Only callable by admin role
     * @param tokenId Property token ID
     * @param newManager New property manager address
     * @param reason Reason for the swap (audit trail)
     */
    function managerSwap(
        uint256 tokenId,
        address newManager,
        string calldata reason
    ) external onlyRole(ADMIN_ROLE) {
        if (tokenId >= nextTokenId) revert PropertyDoesNotExist(tokenId);
        if (newManager == address(0)) revert InvalidManager(newManager);
        
        address oldManager = propertyManagers[tokenId];
        propertyManagers[tokenId] = newManager;
        
        emit PropertyManagerSwapped(tokenId, oldManager, newManager, reason);
    }
    
    /**
     * @notice Emergency pause all token operations
     * @param reason Reason for emergency pause
     */
    function emergencyPause(string calldata reason) external onlyRole(ADMIN_ROLE) {
        _pause();
        emit EmergencyPauseActivated(msg.sender, reason);
    }
    
    /**
     * @notice Unpause token operations
     */
    function emergencyUnpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
        emit EmergencyPauseDeactivated(msg.sender);
    }
    
    // ============ KYC Whitelist ============
    
    /**
     * @notice Add or remove address from whitelist
     * @param account Address to whitelist
     * @param status True to whitelist, false to remove
     */
    function setWhitelisted(
        address account,
        bool status
    ) external onlyRole(KYC_MANAGER_ROLE) {
        whitelistedAddresses[account] = status;
        emit AddressWhitelisted(account, status);
    }
    
    /**
     * @notice Batch whitelist multiple addresses
     * @param accounts Array of addresses to whitelist
     * @param status Whitelist status to set
     */
    function batchSetWhitelisted(
        address[] calldata accounts,
        bool status
    ) external onlyRole(KYC_MANAGER_ROLE) {
        for (uint256 i = 0; i < accounts.length; i++) {
            whitelistedAddresses[accounts[i]] = status;
            emit AddressWhitelisted(accounts[i], status);
        }
    }
    
    /**
     * @notice Check if address is whitelisted
     * @param account Address to check
     * @return True if whitelisted
     */
    function isWhitelisted(address account) external view returns (bool) {
        return whitelistedAddresses[account];
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get maximum tokens an address can hold for a specific property
     * @param tokenId Property token ID
     * @return Maximum number of tokens
     */
    function getMaxHolding(uint256 tokenId) public view returns (uint256) {
        return (tokenSupplyCaps[tokenId] * MAX_HOLDING_PERCENTAGE) / BASIS_POINTS;
    }
    
    /**
     * @notice Get remaining tokens an address can acquire
     * @param account Address to check
     * @param tokenId Property token ID
     * @return Remaining tokens available to acquire
     */
    function getRemainingAllowance(
        address account,
        uint256 tokenId
    ) external view returns (uint256) {
        uint256 maxHolding = getMaxHolding(tokenId);
        uint256 currentBalance = balanceOf(account, tokenId);
        
        if (currentBalance >= maxHolding) return 0;
        return maxHolding - currentBalance;
    }
    
    /**
     * @notice URI for a specific token ID
     * @param tokenId Token ID
     * @return Token URI
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        if (bytes(propertyURIs[tokenId]).length > 0) {
            return propertyURIs[tokenId];
        }
        return super.uri(tokenId);
    }
    
    // ============ Internal Functions ============
    
    function _checkWhitelist(address account) internal view {
        if (!whitelistedAddresses[account]) {
            revert NotWhitelisted(account);
        }
    }
    
    function _checkMaxHolding(
        address account,
        uint256 tokenId,
        uint256 amount
    ) internal view {
        uint256 maxHolding = getMaxHolding(tokenId);
        uint256 currentBalance = balanceOf(account, tokenId);
        uint256 newBalance = currentBalance + amount;
        
        if (newBalance > maxHolding) {
            revert ExceedsMaxHolding(account, tokenId, currentBalance, amount, maxHolding);
        }
    }
    
    // ============ Overrides ============
    
    /**
     * @dev Hook that is called before any token transfer
     * Enforces whitelist and max holding requirements
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        // Skip checks for minting (from = 0) and burning (to = 0)
        if (to != address(0)) {
            _checkWhitelist(to);
            
            for (uint256 i = 0; i < ids.length; i++) {
                _checkMaxHolding(to, ids[i], values[i]);
            }
        }
        
        super._update(from, to, ids, values);
    }
    
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
