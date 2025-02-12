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

const uploadImageToCloudinary = (imageFile) => {
  return new Promise((resolve, reject) => {
    if (!imageFile) {
      console.error("❌ Erro: Nenhum arquivo recebido.");
      return reject(new Error("Nenhum arquivo recebido."));
    }

    if (!imageFile.buffer) {
      console.error("❌ Erro: O arquivo não possui buffer.");
      return reject(new Error("O arquivo não possui buffer."));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        format: "png",
        transformation: [
          { width: 500, height: 500, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          console.error("❌ Erro ao fazer upload:", error);
          return reject(
            new Error("Erro ao fazer upload da imagem no Cloudinary.")
          );
        }

        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(imageFile.buffer).pipe(uploadStream);
  });
};

async function createProductService(productData) {
  try {
    if (productData.image) {
      if (typeof productData.image === "string") {
      } else {
        productData.image = await uploadImageToCloudinary(productData.image);
      }
    } else {
    }

    if (productData.validity) {
      productData.validity = new Date(productData.validity);
    }

    const newProduct = await new Product(productData).save();

    return newProduct;
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error);
  }
}

async function updateProductService(id, updatedData) {
  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new Error("Produto não encontrado.");
    }

    if (!updatedData.image) {
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