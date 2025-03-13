const express = require("express");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const { validateProductData, validateId } = require("../utils/validationUtils");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllProducts);
router.get("/:id", validateId, getProductById);
router.post("/", upload.single("image"), validateProductData, createProduct);
router.put(
  "/:id",
  upload.single("image"),
  validateId,
  validateProductData,
  updateProduct
);
router.delete("/:id", validateId, deleteProduct);

module.exports = router;
