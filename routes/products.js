const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const {
  getAllProducts,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} = require("../services/products");
const moment = require("moment");
const { body, param, validationResult } = require("express-validator");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const validateProductData = [
  body("name").isString().notEmpty().withMessage("Nome do produto é obrigatório"),
  body("quantity").isInt({ min: 0 }).withMessage("Quantidade deve ser um número inteiro positivo"),
  body("price").isFloat({ min: 0 }).withMessage("Preço deve ser um número positivo"),
  body("validity")
    .optional()
    .custom((value) => {
      if (!moment(value, moment.ISO_8601, true).isValid()) {
        throw new Error("Validade deve ser uma data válida");
      }
      return true;
    }),
];

const validateId = [param("id").isMongoId().withMessage("ID inválido")];

router.get("/", async (req, res) => {
  console.log("Requisição GET para /");
  try {
    const { name, validity } = req.query;
    console.log("Parâmetros de consulta:", { name, validity });
    const products = await getAllProducts({ name, validity });
    console.log("Produtos encontrados:", products);
    res.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", validateId, async (req, res) => {
  console.log("Requisição GET para /:id");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Erros de validação:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const product = await getProductByIdService(req.params.id);
    if (!product) {
      console.log("Produto não encontrado:", req.params.id);
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    console.log("Produto encontrado:", product);
    res.json(product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", upload.single("image"), validateProductData, async (req, res) => {
  console.log("Requisição POST para / com imagem");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Erros de validação:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    let image = null;
    if (req.file) {
      console.log("Arquivo de imagem recebido:", req.file);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
          if (error) {
            console.error("Erro ao fazer upload para o Cloudinary:", error);
            reject(error);
          } else {
            console.log("Resultado do upload no Cloudinary:", result);
            resolve(result);
          }
        }).end(req.file.buffer);
      });
      image = uploadResult.secure_url;
      console.log("URL da imagem no Cloudinary:", image);
    }
    const newProduct = await createProductService({ ...req.body, image: image });
    console.log("Novo produto criado com imagem:", newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", upload.single("image"), [validateId, validateProductData], async (req, res) => {
  console.log("Requisição PUT para /:id");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Erros de validação:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let image = req.body.image;
    if (req.file) {
      console.log("Arquivo de imagem recebido para atualização:", req.file);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
          if (error) {
            console.error("Erro ao fazer upload para o Cloudinary:", error);
            reject(error);
          }
          resolve(result);
        }).end(req.file.buffer);
      });
      image = uploadResult.secure_url;
      console.log("URL da imagem atualizada no Cloudinary:", image);
    }
    const updatedProduct = await updateProductService(req.params.id, { ...req.body, image: image });
    console.log("Produto atualizado:", updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", validateId, async (req, res) => {
  console.log("Requisição DELETE para /:id");
  try {
    await deleteProductService(req.params.id);
    console.log("Produto excluído:", req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;