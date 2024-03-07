const express = require("express");
const {
  getSales,
  createSale,
  deleteSale,
  updateSale,
  exportSale,
  getSale,
  saleByDetailSale,
} = require("../controllers/SaleController");
const { authMiddleware } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", authMiddleware, getSales);
router.get("/export", exportSale);
router.get("/:id", authMiddleware, getSale);
router.post("/", authMiddleware, createSale);
router.delete("/:id", authMiddleware, deleteSale);
router.put("/:id", authMiddleware, updateSale);

module.exports = router;
