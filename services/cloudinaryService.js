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
    console.log("Recebendo arquivo:", file);

    validateFileType(file, cloudinaryConfig.allowedFormats);

    const uploadOptions = {
      folder: folder,
      resource_type: "auto",
      transformation: cloudinaryConfig.transformations,
    };

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("❌ Erro ao fazer upload da imagem:", error);
            reject(new Error("Falha ao fazer upload da imagem no Cloudinary."));
          }
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    return result.secure_url;
  } catch (error) {
    console.error("❌ Erro no serviço do Cloudinary:", error.message);
    throw new Error(error.message || "Erro ao processar a imagem.");
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
