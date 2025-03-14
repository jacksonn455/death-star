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
  }
});

// Middleware para logar a requisição
router.use((req, res, next) => {
  console.log("📩 Requisição recebida:");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Middleware para preparar a imagem
const prepareImage = (req, res, next) => {
  if (!req.file) {
    console.warn("⚠️ Nenhum arquivo de imagem enviado.");
    return res.status(400).json({ error: "Arquivo de imagem é obrigatório." });
  }

  console.log("🟢 Arquivo de imagem recebido!");
  console.log("Nome original:", req.file.originalname);
  console.log("Tipo MIME:", req.file.mimetype);
  console.log("Tamanho:", req.file.size, "bytes");
  console.log("Buffer length:", req.file.buffer.length);

  req.body.image = {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    buffer: req.file.buffer
  };

  next();
};

// Rota de criação de produto
router.post("/", upload.single("image"), prepareImage, validateProductData, createProduct);

// Rota de atualização de produto
router.put("/:id", upload.single("image"), (req, res, next) => {
  console.log("🔧 Tentativa de atualização de produto...");

  if (req.file) {
    console.log("🟢 Arquivo de imagem para atualização:");
    console.log("Nome original:", req.file.originalname);
    console.log("Tipo MIME:", req.file.mimetype);
    console.log("Tamanho:", req.file.size, "bytes");
    console.log("Buffer length:", req.file.buffer.length);
    req.body.image = {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer
    };
  } else {
    console.warn("⚠️ Nenhuma nova imagem enviada para atualização.");
  }

  next();
}, validateId, validateProductData, updateProduct);

router.get("/", getAllProducts);
router.get("/:id", validateId, getProductById);
router.delete("/:id", validateId, deleteProduct);

module.exports = router;
