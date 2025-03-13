const {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} = require("../services/products");

const mongoose = require("mongoose");

async function getAllProducts(req, res) {
  try {
    const { name, validity } = req.query || {};
    const products = await getAllProductsService({ name, validity });

    if (!products.length) {
      return res.status(404).json({ error: "Nenhum produto encontrado." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.message);
    res
      .status(500)
      .json({ error: error.message || "Erro interno no servidor" });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const product = await getProductByIdService(id);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function createProduct(req, res) {
  try {
    const productData = req.body;
    if (req.file) {
      productData.image = req.file.buffer;
    }
    const newProduct = await createProductService(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erro ao criar produto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const updatedData = req.body;
    if (req.file) {
      updatedData.image = req.file.buffer;
    }
    const updatedProduct = await updateProductService(id, updatedData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    await deleteProductService(id);
    res.status(204).end();
  } catch (error) {
    console.error("Erro ao excluir produto:", error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
