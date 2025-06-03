const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

module.exports = class UserController {
  static async register(req, res) {
    try {
      const { email, password, username, fullName } = req.body;

      // Create user
      const user = await User.create({
        email,
        password,
        username,
        fullName,
      });

      // Generate JWT token
      const access_token = signToken({
        id: user.id,
        email: user.email,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            createdAt: user.createdAt,
          },
          access_token,
        },
      });
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: err.errors[0].message,
            details: err.errors.map((e) => ({
              field: e.path,
              message: e.message,
            })),
          },
        });
      }

      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          success: false,
          error: {
            code: "DUPLICATE_ENTRY",
            message: "Email or username already exists",
          },
        });
      }

      console.error("Registration error:", err);
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during registration",
        },
      });
    }
  }
};
