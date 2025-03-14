const Product = require("../models/products");
const { uploadImageToCloudinary } = require("../services/cloudinaryService");

async function getAllProductsService(query) {
  console.log("📦 Buscando todos os produtos com filtros:", query);

  try {
    const filters = {};

    if (query?.name) {
      console.log("🔍 Filtrando por nome:", query.name);
      filters.name = { $regex: query.name, $options: "i" };
    }

    if (query?.validity === "soon") {
      console.log("📅 Filtrando produtos com validade próxima.");
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      filters.validity = { $lte: sixMonthsFromNow, $gte: new Date() };
    } else if (query?.validity) {
      console.log("📅 Filtrando por validade específica:", query.validity);
      filters.validity = query.validity;
    }

    const products = await Product.find(filters).sort({ time: 1 });

    console.log("✅ Produtos encontrados:", products.length);
    return products || [];
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error.message);
    throw new Error("Erro ao buscar produtos.");
  }
}

async function getProductByIdService(id) {
  console.log("🔎 Buscando produto por ID:", id);

  try {
    const product = await Product.findById(id);

    if (!product) {
      console.warn("⚠️ Produto não encontrado.");
    } else {
      console.log("✅ Produto encontrado:", product);
    }

    return product;
  } catch (error) {
    console.error("❌ Erro ao buscar produto por ID:", error.message);
    throw new Error(`Erro ao buscar produto por ID: ${error.message}`);
  }
}

async function createProductService(productData) {
  console.log("➕ Criando novo produto...");

  try {
    if (!productData.name || !productData.price || !productData.quantity) {
      console.warn("⚠️ Campos obrigatórios faltando:", productData);
      throw new Error("Os campos 'name', 'price' e 'quantity' são obrigatórios.");
    }

    console.log("📄 Dados do produto recebido:", productData);

    if (productData.image) {
      console.log("🖼️ Imagem detectada, iniciando upload...");
      console.log("🔎 Detalhes da imagem recebida:", {
        mimetype: productData.image.mimetype,
        size: productData.image.size,
      });

      productData.image = await uploadImageToCloudinary(
        productData.image,
        "produtos"
      );
      console.log("✅ Imagem enviada para Cloudinary:", productData.image);
    } else {
      console.warn("⚠️ Nenhuma imagem recebida para upload.");
    }

    if (productData.validity) {
      console.log("📅 Convertendo validade para Date...");
      productData.validity = new Date(productData.validity);
    }

    console.log("🛠️ Salvando produto no banco de dados...");
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    console.log("🎯 Produto criado com sucesso:", savedProduct);
    return savedProduct;
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error.message);
    throw new Error(`Erro ao criar produto: ${error.message}`);
  }
}

async function updateProductService(id, updatedData) {
  console.log("✏️ Atualizando produto com ID:", id);

  try {
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      console.warn("⚠️ Produto não encontrado para atualização.");
      throw new Error("Produto não encontrado.");
    }

    console.log("📄 Dados atuais do produto:", existingProduct);
    console.log("🔧 Novos dados recebidos para atualização:", updatedData);

    if (updatedData.image) {
      console.log("🖼️ Nova imagem detectada, iniciando upload...");
      updatedData.image = await uploadImageToCloudinary(
        updatedData.image,
        "produtos"
      );
      console.log("✅ Nova imagem enviada para Cloudinary:", updatedData.image);
    } else {
      console.log("🔗 Mantendo imagem anterior.");
      updatedData.image = existingProduct.image;
    }

    if (updatedData.validity) {
      console.log("📅 Convertendo nova validade para Date...");
      updatedData.validity = new Date(updatedData.validity);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    console.log("✅ Produto atualizado com sucesso:", updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error("❌ Erro ao atualizar produto:", error.message);
    throw new Error("Erro ao atualizar produto.");
  }
}

async function deleteProductService(id) {
  console.log("🗑️ Deletando produto com ID:", id);

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      console.warn("⚠️ Produto não encontrado para exclusão.");
      throw new Error("Produto não encontrado.");
    }

    console.log("✅ Produto deletado com sucesso:", deletedProduct);
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
