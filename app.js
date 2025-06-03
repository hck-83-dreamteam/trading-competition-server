const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Dummy authentication logic
  if (username === "user" && password === "password") {
    res.status(200).json({ message: "Login successful", token: "dummy_token" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
