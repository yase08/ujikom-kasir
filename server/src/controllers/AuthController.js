const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      if (req.body.password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await prisma.user.create({
        data: {
          ...req.body,
          password: hashedPassword,
        },
      });

      return res.status(201).json({ message: "User created" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      console.log(user.password, req.body.password);
      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, "thisisreallysecret", {
        expiresIn: "1d",
      });

      return res.status(200).json({
        message: "Login success",
        data: {
          token,
          role: user.role,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const authMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Get user", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  authMe,
};
