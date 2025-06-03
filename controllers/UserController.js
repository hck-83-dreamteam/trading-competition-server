const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

module.exports = class UserController {
<<<<<<< HEAD
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { name: "BadRequest", message: "Email is required" };
      }
      if (!password) {
        throw { name: "BadRequest", message: "Password is required" };
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw {
          name: "Unauthorized",
          message: "Email or password is required",
        };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw {
          name: "Unauthorized",
          message: "Email or password is required",
        };
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (err) {
      if (err.name === "BadRequest") {
        res.status(400).json({ message: err.message });
      } else if (err.name === "Unauthorized") {
        res.status(401).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
=======
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
>>>>>>> feat/register
    }
  }
};
