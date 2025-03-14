const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const { validateProductData } = require("../utils/validationUtils");

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

async function createProduct(req, res) {
  try {
    console.log("Recebendo requisição para criar produto...");
    console.log("req.body recebido:", req.body);
    console.log("req.file recebido:", req.file);

    const productData = req.body;

    if (!productData.name || !productData.price || !productData.quantity) {
      console.warn("Campos obrigatórios faltando.", productData);
      return res.status(400).json({
        error: "Os campos 'name', 'price' e 'quantity' são obrigatórios.",
      });
    }

    if (req.file) {
      console.log("Arquivo recebido! Detalhes:");
      console.log("Nome do arquivo:", req.file.originalname);
      console.log("Tipo MIME:", req.file.mimetype);
      console.log("Tamanho do arquivo (bytes):", req.file.size);
      productData.image = req.file.buffer;
    } else {
      console.warn("Nenhuma imagem foi recebida!");
    }

    console.log("Dados finais para criação do produto:", productData);

    const newProduct = await createProductService(productData);
    console.log("Produto criado com sucesso:", newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
}

module.exports = router;
