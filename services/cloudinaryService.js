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
  if (!file || !file.mimetype || !file.buffer) {
    console.warn("⚠️ Arquivo inválido ou ausente.");
    throw new Error("Arquivo inválido ou ausente.");
  }

  validateFileType(file, cloudinaryConfig.allowedFormats);

  try {
    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, transformation: cloudinaryConfig.transformations },
        (error, result) => {
          if (error) {
            console.error(
              "❌ Erro no upload para o Cloudinary:",
              error.message
            );
            return reject(
              new Error("Erro no upload para o Cloudinary: " + error.message)
            );
          }

          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    return uploadResponse;
  } catch (error) {
    console.error("❌ Erro no upload:", error.message);
    throw new Error("Erro ao fazer upload da imagem: " + error.message);
  }
};

const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) {
    console.warn("⚠️ URL da imagem não fornecida.");
    throw new Error("URL da imagem inválida.");
  }

  try {
    const publicId = imageUrl.split("/").pop().split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      console.warn("⚠️ Falha ao deletar a imagem.");
      throw new Error("Falha ao deletar a imagem do Cloudinary.");
    }

    return true;
  } catch (error) {
    console.error("❌ Erro ao deletar imagem do Cloudinary:", error.message);
    throw new Error("Erro ao deletar a imagem: " + error.message);
  }
};

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
