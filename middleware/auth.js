const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

/**
 * Authentication middleware to verify JWT token
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          code: "NO_TOKEN",
          message: "Access token is required",
        },
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN_FORMAT",
          message: "Token format is invalid",
        },
      });
    }

    // Verify the token
    const decoded = verifyToken(token);

    // Check if user exists and is active
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User associated with this token no longer exists",
        },
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: "ACCOUNT_DEACTIVATED",
          message: "Your account has been deactivated",
        },
      });
    }

    // Add user info to request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Invalid authentication token",
        },
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: {
          code: "TOKEN_EXPIRED",
          message: "Authentication token has expired",
        },
      });
    }

    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "AUTH_ERROR",
        message: "Authentication error occurred",
      },
    });
  }
};

module.exports = authMiddleware;
