const express = require("express");
const {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  exportProduct,
  getProduct,
  getProductsOption,
} = require("../controllers/ProductController");
const { authMiddleware } = require("../middlewares/authentication");
const router = express.Router();
const uploadPhoto = require("../libs/multer");

router.get("/", authMiddleware, getProducts);
router.get("/product", authMiddleware, getProductsOption);
router.get("/export", exportProduct);
router.get("/:id", authMiddleware, getProduct);
router.post("/", authMiddleware, createProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.put("/:id", authMiddleware, updateProduct);

module.exports = router;
