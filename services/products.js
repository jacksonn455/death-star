const Product = require("../models/products");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

async function getAllProducts(query) {
  try {
    const filters = {};

    if (query?.name) {
      filters.name = { $regex: query.name, $options: "i" };
    }
    if (query?.validity) {
      filters.validity = query.validity;
    }

    return await Product.find(filters).sort({ time: 1 });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Erro ao buscar produto.");
  }
}

async function getProductByIdService(id) {
  return await Product.findById(id);
}

const uploadImageToCloudinary = async (imageFile) => {
  try {
    // Criar um caminho temporário para salvar a imagem
    const tempPath = path.join(__dirname, "..", "temp", imageFile.originalname);

    // Salvar o buffer no sistema de arquivos
    await fs.promises.writeFile(tempPath, imageFile.buffer);

    console.log("Imagem salva temporariamente em:", tempPath);

    // Enviar para o Cloudinary
    const uploadResult = await cloudinary.uploader.upload(tempPath, {
      folder: "products",
      fetch_format: "auto",
      quality: "auto",
      width: 500,
      height: 500,
      crop: "limit",
    });

    console.log("Upload bem-sucedido:", uploadResult.secure_url);

    // Remover o arquivo temporário após o upload
    await fs.promises.unlink(tempPath);
    console.log("Imagem temporária removida");

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw new Error("Erro ao fazer upload da imagem.");
  }
};

async function createProductService(productData) {
  try {
    if (productData.image) {
      productData.image = await uploadImageToCloudinary(productData.image);
    }
    if (productData.validity) {
      productData.validity = new Date(productData.validity);
    }

    return await new Product(productData).save();
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw new Error("Erro ao criar produto.");
  }
}

async function updateProductService(id, updatedData) {
  try {
    if (updatedData.image) {
      updatedData.image = await uploadImageToCloudinary(updatedData.image);
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