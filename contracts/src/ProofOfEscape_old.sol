// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./EscapeToken.sol";

/// @title ProofOfEscape
/// @notice Contract for tracking quiz completions and distributing rewards
contract ProofOfEscape {
    // Immutable owner address
    address public immutable owner;

    // ERC-20 reward token reference
    EscapeToken public rewardToken;

    // Mapping to track if a user has completed a specific quiz
    mapping(address => mapping(uint => bool)) public completedQuizzes;

    // Mapping to store the correct hash for each quiz
    mapping(uint => bytes32) private quizHashes;

    // Mapping to track registered users
    mapping(address => bool) public registeredUsers;

    // Mapping to count total completions per quiz
    mapping(uint => uint) public quizCompletions;

    // Events to log important actions
    event QuizCompleted(
        address indexed user,
        uint indexed quizId,
        string message
    );
    event QuizHashUpdated(uint indexed quizId, bytes32 newHash);

    // Constructor sets the owner and token reference
    constructor(address tokenAddress) {
        owner = msg.sender;
        rewardToken = EscapeToken(tokenAddress);
    }

    // Modifier to restrict functions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    /// @notice Register a user
    function register() public {
        require(!registeredUsers[msg.sender], "Already registered");
        registeredUsers[msg.sender] = true;
    }

    /// @notice Set the correct hash for a quiz (restricted to owner)
    /// @param quizId The ID of the quiz
    /// @param correctHash The correct hash for the quiz
    function setQuizHash(uint quizId, bytes32 correctHash) public onlyOwner {
        quizHashes[quizId] = correctHash;
        emit QuizHashUpdated(quizId, correctHash);
    }

    /// @notice Get the hash for a quiz (only accessible by the owner)
    function getQuizHash(uint quizId) public view onlyOwner returns (bytes32) {
        return quizHashes[quizId];
    }

    /// @notice Check if a submitted answer is correct and reward tokens
    /// @param quizId The ID of the quiz
    /// @param answerHash The keccak256 hash of the user's answer
    function checkQuizAnswer(
        uint quizId,
        bytes32 answerHash
    ) public returns (bool success) {
        require(registeredUsers[msg.sender], "You need to register first");
        require(quizHashes[quizId] != bytes32(0), "This quiz does not exist.");
        require(
            !completedQuizzes[msg.sender][quizId],
            "Quiz already completed"
        );

        if (answerHash == quizHashes[quizId]) {
            completedQuizzes[msg.sender][quizId] = true;
            quizCompletions[quizId] += 1;

            // Mint reward (10 ESCAPE tokens)
            rewardToken.mint(msg.sender, 10 * (10 ** 18));

            emit QuizCompleted(
                msg.sender,
                quizId,
                "Congratulations! You answered correctly!"
            );
            return true;
        }

        return false;
    }
}
