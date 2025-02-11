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

async function uploadImageToCloudinary(imageFile) {
  try {
    if (!imageFile || !imageFile.path) {
      throw new Error("Arquivo de imagem inválido.");
    }
    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      public_id: `product_image_${imageFile.originalname}`,
      folder: "products",
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw new Error("Erro ao fazer upload da imagem.");
  }
}

async function createProductService(productData) {
  try {
    if (productData.image) {
      console.log("Processando imagem antes de salvar no banco de dados:", productData.image);
      const image = await uploadImageToCloudinary(productData.image);
      productData.image = image;
      console.log("URL da imagem depois de upload no Cloudinary:", productData.image);
    }

    if (productData.validity) {
      productData.validity = new Date(productData.validity);
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    console.log("Produto salvo com sucesso:", savedProduct);
    return savedProduct;
  } catch (error) {
    console.error("Erro ao criar produto no banco de dados:", error);
    throw new Error("Erro ao criar produto.");
  }
}

async function uploadImageToCloudinary(imageFile) {
  try {
    if (!imageFile || !imageFile.buffer) {
      throw new Error("Arquivo de imagem inválido.");
    }
    console.log("Iniciando upload da imagem para o Cloudinary:", imageFile.originalname);
    const uploadResult = await cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
      if (error) {
        console.error("Erro ao fazer upload para o Cloudinary:", error);
        throw new Error("Erro ao fazer upload da imagem.");
      }
      console.log("Resultado do upload da imagem no Cloudinary:", result);
      return result;
    }).end(imageFile.buffer);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw new Error("Erro ao fazer upload da imagem.");
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
