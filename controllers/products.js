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
    console.log("Recebendo requisição para criar produto...");
    console.log("Headers:", req.headers);
    console.log("Query params:", req.query);

    console.log("req.body recebido:", req.body);
    console.log("req.file recebido:", req.file);

    const productData = req.body;

    if (!productData.name || !productData.price || !productData.quantity) {
      console.warn("Campos obrigatórios faltando.", productData);
      return res.status(400).json({
        error: "Os campos 'name', 'price' e 'quantity' são obrigatórios."
      });
    }

    if (req.file) {
      console.log("Arquivo recebido! Detalhes:");
      console.log("Nome do arquivo:", req.file.originalname);
      console.log("Tipo MIME:", req.file.mimetype);
      console.log("Tamanho do arquivo (bytes):", req.file.size);
      console.log("Buffer da imagem (primeiros 100 bytes):", req.file.buffer.slice(0, 100));

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
