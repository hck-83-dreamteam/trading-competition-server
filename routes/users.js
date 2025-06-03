const express = require("express");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", authMiddleware, UserController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 * @body    { username, fullName, profileImage }
 */
router.put("/profile", authMiddleware, UserController.updateProfile);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete("/account", authMiddleware, UserController.deleteAccount);

module.exports = router;
