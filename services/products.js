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
    console.error("❌ Erro ao buscar produtos:", error.message);
    throw new Error("Erro ao buscar produtos.");
  }
}

async function getProductByIdService(id) {
  try {
    const product = await Product.findById(id);
    return product;
  } catch (error) {
    console.error("❌ Erro ao buscar produto por ID:", error.message);
    throw new Error(`Erro ao buscar produto por ID: ${error.message}`);
  }
}

async function createProductService(productData) {
  try {
    if (!productData.name || !productData.price || !productData.quantity) {
      console.warn("⚠️ Campos obrigatórios faltando:", productData);
      throw new Error(
        "Os campos 'name', 'price' e 'quantity' são obrigatórios."
      );
    }

    if (productData.image) {
      productData.image = await uploadImageToCloudinary(
        productData.image,
        "produtos"
      );
    } else {
      console.warn("⚠️ Nenhuma imagem recebida para upload.");
    }

    if (productData.validity) {
      productData.validity = new Date(productData.validity);
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    return savedProduct;
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error.message);
    throw new Error(`Erro ao criar produto: ${error.message}`);
  }
}

async function updateProductService(id, updatedData) {
  try {
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      console.warn("⚠️ Produto não encontrado para atualização.");
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
    console.error("❌ Erro ao atualizar produto:", error.message);
    throw new Error("Erro ao atualizar produto.");
  }
}

async function deleteProductService(id) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      console.warn("⚠️ Produto não encontrado para exclusão.");
      throw new Error("Produto não encontrado.");
    }

    return deletedProduct;
  } catch (error) {
    console.error("❌ Erro ao deletar produto:", error.message);
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
