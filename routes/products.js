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
const streamifier = require("streamifier");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const validateProductData = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Nome do produto é obrigatório"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantidade deve ser um número inteiro maior que 0"),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Preço deve ser um número positivo e maior que 0"),
  body("validity")
    .optional()
    .custom((value) => {
      if (value && !moment(value, moment.ISO_8601, true).isValid()) {
        throw new Error("Validade deve ser uma data válida");
      }
      return true;
    }),
];

const validateId = [param("id").isMongoId().withMessage("ID inválido")];

router.get("/", async (req, res) => {
  try {
    const { name, validity } = req.query;

    const products = await getAllProducts({ name, validity });

    res.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
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
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.json(product);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  upload.single("image"),
  validateProductData,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let image = null;

      if (req.file) {
        const uploadFromBuffer = (buffer) => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "products",
                resource_type: "auto",
                use_filename: true,
                unique_filename: false,
                overwrite: true,
                format: "png",
                transformation: [
                  { width: 500, height: 500, crop: "limit" },
                  { quality: "auto" },
                ],
              },
              (error, result) => {
                if (error) {
                  console.error("❌ Erro no upload para o Cloudinary:", error);
                  return reject(error);
                }

                resolve(result.secure_url);
              }
            );

            streamifier.createReadStream(buffer).pipe(uploadStream);
          });
        };

        image = await uploadFromBuffer(req.file.buffer);
      } else {
      }

      const newProduct = await createProductService({ ...req.body, image });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("❌ Erro ao criar produto:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.put(
  "/:id",
  upload.single("image"),
  [validateId, validateProductData],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let image = req.body.image;

      if (req.file) {
        const uploadFromBuffer = (buffer) => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "products",
                resource_type: "auto",
                use_filename: true,
                unique_filename: false,
                overwrite: true,
                format: "png",
                transformation: [
                  { width: 500, height: 500, crop: "limit" },
                  { quality: "auto" },
                ],
              },
              (error, result) => {
                if (error) {
                  console.error("❌ Erro no upload para o Cloudinary:", error);
                  return reject(error);
                }

                resolve(result.secure_url);
              }
            );

            streamifier.createReadStream(buffer).pipe(uploadStream);
          });
        };

        image = await uploadFromBuffer(req.file.buffer);
      }

      const updatedProduct = await updateProductService(req.params.id, {
        ...req.body,
        image,
      });

      res.json(updatedProduct);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/:id", validateId, async (req, res) => {
  try {
    await deleteProductService(req.params.id);

    res.status(204).end();
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
