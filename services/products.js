const Product = require("../models/products");
const { uploadImageToCloudinary } = require("../services/cloudinaryService");

async function getAllProductsService(query) {
  try {
    const filters = {};

    if (query?.name) {
      filters.name = { $regex: query.name, $options: "i" };
    }

    if (query?.validity === "soon") {
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      filters.validity = { $lte: sixMonthsFromNow, $gte: new Date() };
    } else if (query?.validity) {
      filters.validity = query.validity;
    }

    const products = await Product.find(filters).sort({ time: 1 });
    return products || [];
  } catch (error) {
    throw new Error("Erro ao buscar produtos.");
  }
}

async function getProductByIdService(id) {
  try {
    const product = await Product.findById(id);
    return product;
  } catch (error) {
    throw new Error(`Erro ao buscar produto por ID: ${error.message}`);
  }
}

async function createProductService(productData) {
  try {
    if (productData.image) {
      productData.image = await uploadImageToCloudinary(
        productData.image,
        "produtos"
      );
    }

    if (productData.validity) {
      productData.validity = new Date(productData.validity);
    }

    const newProduct = new Product(productData);
    return await newProduct.save();
  } catch (error) {
    throw new Error("Erro ao criar produto.");
  }
}

async function updateProductService(id, updatedData) {
  try {
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      throw new Error("Produto não encontrado.");
    }

    if (updatedData.image) {
      updatedData.image = await uploadImageToCloudinary(
        updatedData.image,
        "produtos"
      );
    } else {
      updatedData.image = existingProduct.image;
    }

    if (updatedData.validity) {
      updatedData.validity = new Date(updatedData.validity);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return updatedProduct;
  } catch (error) {
    throw new Error("Erro ao atualizar produto.");
  }
}

async function deleteProductService(id) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new Error("Produto não encontrado.");
    }
    return deletedProduct;
  } catch (error) {
    throw new Error(`Erro ao deletar produto: ${error.message}`);
  }
}

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};
