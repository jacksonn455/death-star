const Product = require("../models/products");
const moment = require("moment");

async function getAllProducts(query) {
  try {
    const filters = {};

    if (query && query.name) {
      filters.name = { $regex: query.name, $options: 'i' };
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

async function createProductService(productData) {
  const newProduct = new Product(productData);
  return await newProduct.save();
}

async function updateProductService(id, updatedData) {
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