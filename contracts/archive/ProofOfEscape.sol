// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./EscapeToken.sol";

/// @title ProofOfEscape
/// @notice Track quiz completions and distribute rewards
contract ProofOfEscape is Ownable, ReentrancyGuard {
    // ERC-20 reward token reference (must expose mint)
    EscapeToken public immutable escapeToken;

    // Mapping to track if a user has completed a specific quiz
    mapping(address => mapping(uint256 => bool)) public completedQuizzes;

    // Mapping to store the correct hash for each quiz
    mapping(uint256 => bytes32) private quizHashes;

    // Mapping to track registered users
    mapping(address => bool) public isRegistered;

    // Array to store all registered user addresses (for enumeration)
    address[] private registeredUserAddresses;

    // Mapping to count total completions per quiz
    mapping(uint256 => uint256) public quizCompletions;

    // Reward per correct quiz (configurable)
    mapping(uint256 => uint256) public quizRewards;

    // Events
    event QuizCompleted(
        address indexed user,
        uint256 indexed quizId,
        string message
    );
    event QuizHashUpdated(uint256 indexed quizId, bytes32 newHash);
    event UserRegistered(address indexed user);
    event QuizFailed(
        address indexed user,
        uint256 indexed quizId,
        string message
    );

    constructor(address _escapeToken) Ownable() {
        require(_escapeToken != address(0), "token addr zero");
        escapeToken = EscapeToken(_escapeToken);
    }

    /// @notice Set the reward amount for a quiz (owner only)
    function setQuizReward(
        uint256 quizId,
        uint256 rewardAmount
    ) external onlyOwner {
        require(rewardAmount > 0, "Reward must be > 0");
        quizRewards[quizId] = rewardAmount;
    }

    /// @notice Register a user (idempotent)
    function register() external {
        require(!isRegistered[msg.sender], "Already registered");
        isRegistered[msg.sender] = true;
        registeredUserAddresses.push(msg.sender);
        emit UserRegistered(msg.sender);
    }

    /// @notice Set the correct hash for a quiz (owner only)
    function setQuizHash(
        uint256 quizId,
        bytes32 correctHash
    ) external onlyOwner {
        require(quizId != 0, "quizId zero");
        quizHashes[quizId] = correctHash;
        emit QuizHashUpdated(quizId, correctHash);
    }

    /// @notice Get the hash for a quiz (owner only)
    function getQuizHash(
        uint256 quizId
    ) external view onlyOwner returns (bytes32) {
        return quizHashes[quizId];
    }

    /// @notice Check if a submitted answer is correct and reward tokens
    /// @dev Reverts with a specific error message if any check fails
    function checkQuizAnswer(
        uint256 quizId,
        bytes32 answerHash
    ) external nonReentrant returns (bool success) {
        // Use require statements for clear error feedback
        require(isRegistered[msg.sender], "Register first");
        require(quizHashes[quizId] != bytes32(0), "Quiz not set");
        require(!completedQuizzes[msg.sender][quizId], "Already completed");
        require(answerHash == quizHashes[quizId], "Wrong answer");

        completedQuizzes[msg.sender][quizId] = true;
        unchecked {
            quizCompletions[quizId] += 1;
        }

        uint256 reward = quizRewards[quizId];
        require(reward > 0, "Reward not set");
        escapeToken.mint(msg.sender, reward);

        emit QuizCompleted(
            msg.sender,
            quizId,
            "Congratulations! You answered correctly!"
        );
        return true;
    }

    /// @notice Total number of registered users
    function totalRegisteredUsers() external view returns (uint256) {
        return registeredUserAddresses.length;
    }

    /// @notice Get a slice of registered users for pagination
    /// @param start inclusive start index
    /// @param count number of items to return
    function getRegisteredUsersSlice(
        uint256 start,
        uint256 count
    ) external view returns (address[] memory) {
        uint256 len = registeredUserAddresses.length;
        if (start >= len) return new address[](0);

        uint256 end = start + count;
        if (end > len) end = len;

        address[] memory slice = new address[](end - start);
        for (uint256 i = start; i < end; i++) {
            slice[i - start] = registeredUserAddresses[i];
        }
        return slice;
    }
}
