const { register, login, authMe } = require("../controllers/AuthController");
const express = require("express");
const { authMiddleware } = require("../middlewares/authentication");
const router = express.Router();

router.get("/me", authMiddleware, authMe);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
