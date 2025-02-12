const Product = require("../models/products");
const cloudinary = require("../config/cloudinary");

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
  console.log("Tipo de imagem recebido:", imageFile.mimetype);
  console.log("Tamanho da imagem recebido:", imageFile.size);
  
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(imageFile.mimetype)) {
    throw new Error("Tipo de arquivo inválido. Apenas JPG, JPEG ou PNG são permitidos.");
  }
  if (imageFile.size > 5000000) {
    throw new Error("O tamanho da imagem deve ser no máximo 5MB.");
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          fetch_format: "auto",
          quality: "auto",
          width: 500,
          height: 500,
          crop: "limit",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(imageFile.buffer);
    });

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