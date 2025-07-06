// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title OrganMatchLog
 * @dev Smart contract for logging organ donor-recipient matches on blockchain
 * @notice This contract provides immutable audit trail for organ matching decisions
 */
contract OrganMatchLog {
    
    // Structure to store match information
    struct MatchRecord {
        string donorId;
        string recipientId;
        uint256 matchScore;
        address hospital;
        uint256 timestamp;
        bool isActive;
    }
    
    // Events
    event MatchLogged(
        address indexed hospital,
        string indexed donorId,
        string indexed recipientId,
        uint256 matchScore,
        uint256 timestamp
    );
    
    event MatchStatusUpdated(
        string indexed donorId,
        string indexed recipientId,
        bool isActive,
        uint256 timestamp
    );
    
    // State variables
    mapping(bytes32 => MatchRecord) public matches;
    mapping(address => bool) public authorizedHospitals;
    address public owner;
    uint256 public totalMatches;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAuthorized() {
        require(
            authorizedHospitals[msg.sender] || msg.sender == owner,
            "Not authorized to log matches"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedHospitals[msg.sender] = true;
    }
    
    /**
     * @dev Log a new organ match on the blockchain
     * @param donorId Unique identifier for the donor
     * @param recipientId Unique identifier for the recipient
     * @param matchScore Compatibility score (0-10000, representing 0.00%-100.00%)
     */
    function logMatch(
        string memory donorId,
        string memory recipientId,
        uint256 matchScore
    ) public onlyAuthorized {
        require(bytes(donorId).length > 0, "Donor ID cannot be empty");
        require(bytes(recipientId).length > 0, "Recipient ID cannot be empty");
        require(matchScore <= 10000, "Match score cannot exceed 100.00%");
        
        bytes32 matchId = keccak256(abi.encodePacked(donorId, recipientId, block.timestamp));
        
        matches[matchId] = MatchRecord({
            donorId: donorId,
            recipientId: recipientId,
            matchScore: matchScore,
            hospital: msg.sender,
            timestamp: block.timestamp,
            isActive: true
        });
        
        totalMatches++;
        
        emit MatchLogged(
            msg.sender,
            donorId,
            recipientId,
            matchScore,
            block.timestamp
        );
    }
    
    /**
     * @dev Update the status of an existing match
     * @param donorId Donor ID of the match to update
     * @param recipientId Recipient ID of the match to update
     * @param timestamp Original timestamp of the match
     * @param isActive New status for the match
     */
    function updateMatchStatus(
        string memory donorId,
        string memory recipientId,
        uint256 timestamp,
        bool isActive
    ) public onlyAuthorized {
        bytes32 matchId = keccak256(abi.encodePacked(donorId, recipientId, timestamp));
        require(matches[matchId].timestamp == timestamp, "Match not found");
        
        matches[matchId].isActive = isActive;
        
        emit MatchStatusUpdated(
            donorId,
            recipientId,
            isActive,
            block.timestamp
        );
    }
    
    /**
     * @dev Add an authorized hospital address
     * @param hospital Address of the hospital to authorize
     */
    function authorizeHospital(address hospital) public onlyOwner {
        require(hospital != address(0), "Invalid hospital address");
        authorizedHospitals[hospital] = true;
    }
    
    /**
     * @dev Remove authorization from a hospital address
     * @param hospital Address of the hospital to deauthorize
     */
    function deauthorizeHospital(address hospital) public onlyOwner {
        authorizedHospitals[hospital] = false;
    }
    
    /**
     * @dev Get match information by match ID
     * @param matchId The unique identifier for the match
     * @return MatchRecord struct containing match information
     */
    function getMatch(bytes32 matchId) public view returns (MatchRecord memory) {
        return matches[matchId];
    }
    
    /**
     * @dev Check if an address is authorized to log matches
     * @param hospital Address to check authorization for
     * @return bool indicating authorization status
     */
    function isAuthorized(address hospital) public view returns (bool) {
        return authorizedHospitals[hospital] || hospital == owner;
    }
    
    /**
     * @dev Get the total number of matches logged
     * @return uint256 total number of matches
     */
    function getTotalMatches() public view returns (uint256) {
        return totalMatches;
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}

/*
DEPLOYMENT INSTRUCTIONS:

1. Using Remix IDE:
   - Go to https://remix.ethereum.org/
   - Create a new file called "OrganMatchLog.sol"
   - Paste this contract code
   - Compile with Solidity version ^0.8.0
   - Deploy to your preferred network (Ethereum Sepolia, Polygon Mumbai, etc.)
   - Copy the deployed contract address

2. Using Hardhat:
   - Install Hardhat: npm install --save-dev hardhat
   - Initialize: npx hardhat init
   - Replace contracts/Lock.sol with this file
   - Configure hardhat.config.js with your network settings
   - Deploy: npx hardhat run scripts/deploy.js --network <network_name>

3. Network Recommendations:
   - For testing: Ethereum Sepolia or Polygon Mumbai (free testnet ETH/MATIC)
   - For production: Polygon Mainnet (low fees) or Ethereum Mainnet

4. After deployment:
   - Copy the contract address
   - Paste it into the Blockchain Status component in your app
   - Connect MetaMask or provide RPC URL + private key
   - Start logging organ matches on-chain!

SECURITY NOTES:
- Only authorized hospitals can log matches
- All matches are immutable once logged
- Contract owner can manage hospital authorizations
- Match scores are stored as integers (multiply by 100 for 2 decimal precision)
*/