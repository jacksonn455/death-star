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
  try {
    if (!file) {
      throw new Error("Nenhum arquivo recebido.");
    }

    console.log("Arquivo recebido para upload:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    validateFileType(file, cloudinaryConfig.allowedFormats);

    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            reject(new Error("Erro no upload para o Cloudinary: " + error.message));
          } else {
            console.log("Upload para Cloudinary bem-sucedido:", result);
            resolve(result.secure_url);
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    return uploadResponse;
  } catch (error) {
    console.error("Erro no upload:", error.message);
    throw error;
  }
};

const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) {
      throw new Error("URL da imagem inválida.");
    }

    const publicId = imageUrl.split("/").pop().split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      throw new Error("Falha ao deletar a imagem do Cloudinary.");
    }

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
