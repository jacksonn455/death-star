const {
    getAllProducts,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService,
  } = require("../services/product");
  
  async function getProducts(req, res) {
    try {
      const { name, validity } = req.query;
      const products = await getAllProducts({ name, validity });
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
  
      let image = null;
      if (req.file) {
        console.log("Imagem recebida na requisição POST:", req.file);
  
        const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedFileTypes.includes(req.file.mimetype)) {
          return res.status(400).send("Tipo de arquivo inválido. Apenas JPG, JPEG ou PNG são permitidos.");
        }
  
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
            if (error) {
              console.error("Erro ao fazer upload da imagem para o Cloudinary:", error);
              reject(error);
            }
            resolve(result);
          }).end(req.file.buffer);
        });
  
        image = uploadResult.secure_url;
        console.log("URL da imagem no Cloudinary após upload:", image);
      }
  
      const newProduct = await createProductService({ ...req.body, image: image });
      console.log("Novo produto criado com imagem:", newProduct);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(500).json({ error: error.message });
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