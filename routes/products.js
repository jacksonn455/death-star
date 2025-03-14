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

// Configurar o multer com logs
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log("🔍 Verificando tipo de arquivo...");
    if (file && file.mimetype.startsWith("image/")) {
      console.log("✅ Tipo de arquivo válido:", file.mimetype);
      cb(null, true);
    } else {
      console.error("❌ Arquivo inválido ou sem tipo MIME.");
      cb(new Error("Arquivo não válido ou sem tipo MIME."));
    }
  },
});

// Middleware para logar a requisição
router.use((req, res, next) => {
  console.log("📩 Requisição recebida:");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

router.get("/", getAllProducts);

router.get("/:id", validateId, getProductById);

router.post(
  "/",
  upload.single("image"),
  (req, res, next) => {
    console.log("📂 Tentativa de upload de arquivo...");
    if (!req.file) {
      console.warn("⚠️ Nenhum arquivo recebido.");
    } else {
      console.log("🟢 Arquivo recebido com sucesso!");
      console.log("Nome original:", req.file.originalname);
      console.log("Tipo MIME:", req.file.mimetype);
      console.log("Tamanho:", req.file.size, "bytes");
      console.log("Buffer length:", req.file.buffer.length, "bytes");
    }
    next();
  },
  validateProductData,
  createProduct
);

router.put(
  "/:id",
  upload.single("image"),
  (req, res, next) => {
    console.log("🔧 Tentativa de atualização de produto...");
    if (!req.file) {
      console.warn("⚠️ Nenhum arquivo recebido para atualização.");
    } else {
      console.log("🟢 Arquivo de imagem para atualização:");
      console.log("Nome original:", req.file.originalname);
      console.log("Tipo MIME:", req.file.mimetype);
      console.log("Tamanho:", req.file.size, "bytes");
      console.log("Buffer length:", req.file.buffer.length, "bytes");
    }
    next();
  },
  validateId,
  validateProductData,
  updateProduct
);

router.delete("/:id", validateId, deleteProduct);

module.exports = router;
