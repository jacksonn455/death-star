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
  }
});

router.use((req, res, next) => {
  console.log("📩 Requisição recebida:");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

function prepareImage(req) {
  if (!req.file) return null;

  return {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    buffer: req.file.buffer,
  };
}

// Rota de criação de produto
router.post("/", upload.single("image"), (req, res, next) => {
  console.log("📂 Tentativa de upload de arquivo...");

  if (!req.file) {
    console.warn("⚠️ Nenhum arquivo recebido.");
    return res.status(400).json({ error: "Arquivo de imagem é obrigatório." });
  }

  console.log("🟢 Arquivo recebido com sucesso!");
  req.body.image = prepareImage(req);

  next();
}, validateProductData, createProduct);

// Rota de atualização de produto
router.put("/:id", upload.single("image"), (req, res, next) => {
  console.log("🔧 Tentativa de atualização de produto...");

  if (req.file) {
    console.log("🟢 Arquivo de imagem para atualização:");
    req.body.image = prepareImage(req);
  } else {
    console.warn("⚠️ Nenhuma nova imagem enviada para atualização.");
  }

  next();
}, validateId, validateProductData, updateProduct);

router.get("/", getAllProducts);
router.get("/:id", validateId, getProductById);
router.delete("/:id", validateId, deleteProduct);

module.exports = router;
