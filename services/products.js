const Product = require("../models/products");

async function getAllProducts() {
  return await Product.find();
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