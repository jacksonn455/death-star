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

async function uploadImageToCloudinary(imageUrl, publicId) {
  try {
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw new Error("Erro ao fazer upload da imagem.");
  }
}

async function createProductService(productData) {
  try {
    if (productData.imageUrl) {
      const imageUrl = await uploadImageToCloudinary(productData.imageUrl, `product_image_${productData.name}`);
      productData.imageUrl = imageUrl;
    }
    
    const newProduct = new Product(productData);
    return await newProduct.save();
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw new Error("Erro ao criar produto.");
  }
}

async function updateProductService(id, updatedData) {
  if (updatedData.validity) {
    updatedData.validity = new Date(updatedData.validity);
  }
  return await Product.findByIdAndUpdate(id, updatedData, { new: true });
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