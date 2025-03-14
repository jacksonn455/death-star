const express = require("express");
const multer = require("multer");
const { validateProductData, validateId, validateIdMiddleware } = require("../utils/validationUtils");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      console.error("❌ Arquivo inválido ou não é uma imagem.");
      cb(new Error("Arquivo inválido ou não é uma imagem."));
    }
  },
});

function prepareImage(file) {
  if (!file) return null;
  return {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  };
}

router.post(
  "/",
  upload.single("image"),
  (req, res, next) => {
    if (!req.file) {
      console.warn("⚠️ Nenhum arquivo recebido.");
      return res
        .status(400)
        .json({ error: "Arquivo de imagem é obrigatório." });
    }

    req.body.image = prepareImage(req.file);
    next();
  },
  validateProductData,
  createProduct
);

router.put(
  "/:id",
  upload.single("image"),
  (req, res, next) => {
    if (req.file) {
      req.body.image = prepareImage(req.file);
    } else {
      console.warn("⚠️ Nenhuma nova imagem enviada para atualização.");
    }

    next();
  },
  validateId,
  validateProductData,
  updateProduct
);

router.get("/", getAllProducts);
router.get("/:id", validateId, getProductById);
router.delete("/:id", validateIdMiddleware, deleteProduct);

router.use((err, req, res, next) => {
  console.error("🚨 Erro capturado:", err.message);
  res.status(500).json({ error: err.message || "Erro interno do servidor." });
});

module.exports = router;
