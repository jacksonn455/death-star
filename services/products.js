const Product = require("../models/products");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

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
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        fetch_format: "auto",
        quality: "auto",
        width: 500,
        height: 500,
        crop: "limit",
      },
      (error, result) => {
        if (error) {
          console.error("Erro ao fazer upload da imagem:", error);
          reject(new Error("Erro ao fazer upload da imagem."));
        } else {
          console.log("Upload bem-sucedido:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );

    // Criar um stream a partir do buffer e enviá-lo
    streamifier.createReadStream(imageFile.buffer).pipe(uploadStream);
  });
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