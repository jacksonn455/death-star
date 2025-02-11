const {
    getAllProducts,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService,
  } = require("../services/product");
  
  async function getProducts(req, res) {
    try {
      const { name, date } = req.query;
      const products = await getAllProducts({ name, date });
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  async function getProductById(req, res) {
    try {
      const id = req.params.id;
      if (id && Number(id)) {
        const product = await getProductByIdService(id);
        res.status(200).send(product);
      } else {
        res.status(422).send("ID inválido");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  async function createProduct(req, res) {
    try {
      const productData = req.body;
      const requiredFields = ["name", "category", "quantity", "price", "supplier"];
  
      for (const field of requiredFields) {
        if (!productData[field]) {
          return res.status(400).send(`O campo "${field}" é obrigatório.`);
        }
      }
  
      const newProduct = await createProductService(productData);
      res.status(201).send(newProduct);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  async function updateProduct(req, res) {
    try {
      const id = req.params.id;
      const updatedData = req.body;
  
      if (id && Number(id)) {
        const updatedProduct = await updateProductService(id, updatedData);
        res.status(200).send(updatedProduct);
      } else {
        res.status(422).send("ID inválido");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  async function deleteProduct(req, res) {
    try {
      const id = req.params.id;
  
      if (id && Number(id)) {
        await deleteProductService(id);
        res.status(200).send("Produto excluído com sucesso.");
      } else {
        res.status(422).send("ID inválido");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };  