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
    if (file && file.mimetype.startsWith("image/")) {
      console.log("✅ Tipo de arquivo válido:", file.mimetype);
      cb(null, true);
    } else {
      console.error("❌ Arquivo inválido ou sem tipo MIME.");
      cb(new Error("Arquivo inválido ou não é uma imagem."));
    }
  },
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
    req.body.image = prepareImage(req);

    if (!req.body.image || !req.body.image.mimetype || !req.body.image.size) {
      return res
        .status(400)
        .json({ error: "Imagem inválida ou faltando informações." });
    }

    next();
  },
  validateProductData,
  createProduct
);

// Rota de atualização de produto
router.put("/:id", upload.single("image"), (req, res, next) => {
  console.log("🔧 Tentativa de atualização de produto...");

  if (req.file) {
    console.log("🟢 Arquivo de imagem para atualização:");
    console.log("Nome original:", req.file.originalname);
    console.log("Tipo MIME:", req.file.mimetype);
    console.log("Tamanho:", req.file.size, "bytes");
    console.log("Buffer length:", req.file.buffer.length);
    req.body.image = req.file;
  } else {
    console.warn("⚠️ Nenhuma nova imagem enviada para atualização.");
  }

  next();
}, validateId, validateProductData, updateProduct);

router.get("/", getAllProducts);
router.get("/:id", validateId, getProductById);
router.delete("/:id", validateId, deleteProduct);

module.exports = router;
