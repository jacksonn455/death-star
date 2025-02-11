const Product = require("../models/products");
const cloudinary = require("../config/cloudinary");

async function getAllProducts(query) {
  try {
    const filters = {};

    if (query && query.name) {
      filters.name = { $regex: query.name, $options: "i" };
    }

    if (query && query.validity) {
      filters.validity = query.validity;
    }

    const products = await Product.find(filters).sort({ time: 1 });
    return products;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Erro ao buscar produto.");
  }
}

async function getProductByIdService(id) {
  return await Product.findById(id);
}

// Função para fazer o upload da imagem
const uploadImageToCloudinary = async (imageFile) => {
  console.log("Tipo de imagem recebido:", imageFile.mimetype);

  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(imageFile.mimetype)) {
    throw new Error("Tipo de arquivo inválido. Apenas JPG, JPEG ou PNG são permitidos.");
  }

  if (imageFile.size > 5000000) {
    throw new Error("O tamanho da imagem deve ser no máximo 5MB.");
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(imageFile.buffer, {
      folder: "products",
    });

    if (uploadResult.secure_url) {
      return uploadResult.secure_url;
    }

    throw new Error("Falha no upload da imagem.");
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw new Error("Erro ao fazer upload da imagem.");
  }
};

async function createProductService(productData) {
  try {
    if (productData.image) {
      console.log("Imagem recebida, fazendo upload...");
      const image = await uploadImageToCloudinary(productData.image);
      productData.image = image;
      console.log("Imagem salva no Cloudinary, URL:", image);
    }

    if (productData.validity) {
      productData.validity = new Date(productData.validity);
    }

    const newProduct = new Product(productData);
    console.log("Produto a ser salvo no MongoDB:", newProduct);
    return await newProduct.save();
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw new Error("Erro ao criar produto.");
  }
}

async function updateProductService(id, updatedData) {
  try {
    if (updatedData.image) {
      const image = await uploadImageToCloudinary(updatedData.image);
      updatedData.image = image;
    } else {
      const existingProduct = await Product.findById(id);
      updatedData.image = existingProduct.image;
    }

    if (updatedData.validity) {
      updatedData.validity = new Date(updatedData.validity);
    }

    return await Product.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw new Error("Erro ao atualizar produto.");
  }
}

async function deleteProductService(id) {
  return await Product.findByIdAndDelete(id);
}

module.exports = {
  getAllProducts,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};