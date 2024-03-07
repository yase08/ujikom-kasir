const express = require("express");
const {
  getDetailSales,
  createDetailSale,
  deleteDetailSale,
  updateDetailSale,
  exportDetailSale,
  getDetailSale,
} = require("../controllers/DetailSaleController");
const { authMiddleware } = require("../middlewares/authentication");
const router = express.Router();

router.get("/", authMiddleware, getDetailSales);
router.get("/detail/:id", authMiddleware, getDetailSale);
router.get("/export", exportDetailSale);
router.get("/:id", authMiddleware, getDetailSale);
router.post("/", authMiddleware, createDetailSale);
router.delete("/:id", authMiddleware, deleteDetailSale);
router.put("/:id", authMiddleware, updateDetailSale);

module.exports = router;
