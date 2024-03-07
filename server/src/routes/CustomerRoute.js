const express = require("express");
const {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
  exportCustomer,
  getCustomer,
} = require("../controllers/CustomerController");
const { authMiddleware } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", authMiddleware, getCustomers);
router.get("/export", exportCustomer);
router.get("/:id", authMiddleware, getCustomer);
router.post("/", authMiddleware, createCustomer);
router.delete("/:id", authMiddleware, deleteCustomer);
router.put("/:id", authMiddleware, updateCustomer);

module.exports = router;
