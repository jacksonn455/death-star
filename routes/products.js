const express = require("express");
const multer = require("multer");
const { validateProductData, validateId } = require("../utils/validationUtils");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const router = express.Router();
const storage = multer.memoryStorage();

// Configuração do multer com limite de tamanho de arquivo (5MB)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file && file.mimetype.startsWith("image/")) {
      console.log("✅ Tipo de arquivo válido:", file.mimetype);
      cb(null, true);
    } else {
      console.error("❌ Arquivo inválido ou não é uma imagem.");
      cb(new Error("Arquivo inválido ou não é uma imagem."));
    }
  },
});

// Middleware para preparar a imagem
function prepareImage(file) {
  if (!file) return null;
  return {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  };
}

// Rota POST para criar produto
router.post(
  "/",
  upload.single("image"),
  (req, res, next) => {
    console.log("📂 Tentativa de upload de arquivo...");

    if (!req.file) {
      console.warn("⚠️ Nenhum arquivo recebido.");
      return res
        .status(400)
        .json({ error: "Arquivo de imagem é obrigatório." });
    }

    console.log("🟢 Arquivo recebido com sucesso!");
    req.body.image = prepareImage(req.file);
    next();
  },
  validateProductData,
  createProduct
);

// Rota PUT para atualizar produto
router.put(
  "/:id",
  upload.single("image"),
  (req, res, next) => {
    console.log("🔧 Tentativa de atualização de produto...");

    if (req.file) {
      console.log("🟢 Arquivo de imagem para atualização:");
      console.log("Nome original:", req.file.originalname);
      console.log("Tipo MIME:", req.file.mimetype);
      console.log("Tamanho:", req.file.size, "bytes");
      console.log("Buffer length:", req.file.buffer.length);
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

// Rotas GET e DELETE
router.get("/", getAllProducts);
router.get("/:id", validateId, getProductById);
router.delete("/:id", validateId, deleteProduct);

// Middleware de tratamento de erros
router.use((err, req, res, next) => {
  console.error("🚨 Erro capturado:", err.message);
  res.status(500).json({ error: err.message || "Erro interno do servidor." });
});

module.exports = router;
