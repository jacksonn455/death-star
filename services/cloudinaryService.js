const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { validateFileType } = require("../utils/validationUtils");

const cloudinaryConfig = {
  allowedFormats: ["jpg", "jpeg", "png"],
  transformations: [
    { width: 500, height: 500, crop: "limit" },
    { quality: "auto" },
  ],
};

const uploadImageToCloudinary = async (file, folder) => {
  console.log("📂 Iniciando upload de imagem para Cloudinary...");

  try {
    if (!file) {
      console.warn("⚠️ Nenhum arquivo recebido para upload.");
      throw new Error("Nenhum arquivo recebido.");
    }

    console.log("📄 Verificando propriedades do arquivo recebido:", {
      originalname: file.originalname || 'N/A',
      mimetype: file.mimetype || 'N/A',
      size: file.size || 'N/A',
      bufferLength: file.buffer ? file.buffer.length : 0,
    });

    if (!file.mimetype || !file.buffer) {
      console.error("❌ Arquivo inválido ou não processado corretamente pelo multer.");
      throw new Error("Arquivo inválido ou ausente.");
    }

    console.log("🔎 Validando tipo de arquivo...");
    validateFileType(file, cloudinaryConfig.allowedFormats);
    console.log("✅ Tipo de arquivo válido!");

    console.log(`📤 Iniciando upload para a pasta: ${folder}`);

    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            console.error("❌ Erro no upload para o Cloudinary:", error.message);
            reject(new Error("Erro no upload para o Cloudinary: " + error.message));
          } else {
            console.log("✅ Upload para Cloudinary bem-sucedido!");
            console.log("🔗 URL segura da imagem:", result.secure_url);
            resolve(result.secure_url);
          }
        }
      );

      console.log("📡 Enviando arquivo para o stream...");
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    console.log("🎯 Upload finalizado com sucesso!");
    return uploadResponse;
  } catch (error) {
    console.error("❌ Erro no upload:", error.message);
    throw error;
  }
};

const deleteImageFromCloudinary = async (imageUrl) => {
  console.log("🗑️ Iniciando exclusão de imagem do Cloudinary...");

  try {
    if (!imageUrl) {
      console.warn("⚠️ URL da imagem não fornecida.");
      throw new Error("URL da imagem inválida.");
    }

    console.log("🔍 Extraindo publicId da URL...");
    const publicId = imageUrl.split("/").pop().split(".")[0];

    console.log("🧹 Enviando requisição para deletar imagem...");
    const result = await cloudinary.uploader.destroy(publicId);

    console.log("📩 Resposta do Cloudinary:", result);

    if (result.result !== "ok") {
      console.warn("⚠️ Falha ao deletar a imagem.");
      throw new Error("Falha ao deletar a imagem do Cloudinary.");
    }

    console.log("✅ Imagem deletada com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao deletar imagem do Cloudinary:", error.message);
    throw new Error(error.message || "Erro ao deletar a imagem.");
  }
};

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
