const express = require("express");
const {
  getAllProducts,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} = require("../services/products");

const router = express.Router();
const { body, param, validationResult } = require("express-validator");

const validateProductData = [
  body("name").isString().notEmpty().withMessage("Nome do produto é obrigatório"),
  body("quantity").isInt({ min: 0 }).withMessage("Quantidade deve ser um número inteiro positivo"),
  body("price").isFloat({ min: 0 }).withMessage("Preço deve ser um número positivo"),
  body("validity").optional().isDate().withMessage("Validade deve ser uma data válida"),
];

const validateId = [param("id").isMongoId().withMessage("ID inválido")];

router.get("/", async (req, res) => {
  try {
    const { name, validity } = req.query;
    const products = await getAllProducts({ name, validity });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", validateId, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await getProductByIdService(req.params.id);
    if (!product) return res.status(404).json({ error: "Produto não encontrado." });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", validateProductData, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newProduct = await createProductService(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", [validateId, validateProductData], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedProduct = await updateProductService(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", validateId, async (req, res) => {
  try {
    await deleteProductService(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;