const mongoose = require("mongoose");
const { body, validationResult, param } = require("express-validator");
const moment = require("moment");
const { User } = require("../models/users");

const validateIdMiddleware = [
  param("id")
    .custom((id) => {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID inválido.");
      }
      return true;
    })
    .withMessage("ID inválido."),
];

const validateId = (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("ID inválido.");
  }
};

const validateRequiredFields = (data, requiredFields) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`O campo "${field}" é obrigatório.`);
    }
  }
};

const validateFileType = (file, allowedFormats) => {
  if (!file || !file.mimetype) {
    throw new Error("Arquivo não válido ou sem tipo MIME.");
  }

  const fileType = file.mimetype.split("/")[1];

  if (!allowedFormats.includes(fileType)) {
    throw new Error(`Tipo de arquivo não suportado: ${fileType}`);
  }
};

const validateEmailUniqueness = async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email já está em uso");
  }
};

const validateProductData = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Nome do produto é obrigatório"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantidade deve ser um número inteiro maior que 0"),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Preço deve ser um número positivo e maior que 0"),
  body("validity")
    .optional()
    .custom((value) => {
      if (value && !moment(value, moment.ISO_8601, true).isValid()) {
        throw new Error("Validade deve ser uma data válida");
      }
      return true;
    }),
];

const validatePacienteData = [
  body("nome")
    .isString()
    .notEmpty()
    .withMessage("Nome do paciente é obrigatório"),
  body("idade")
    .isInt({ min: 0 })
    .withMessage("Idade deve ser um número inteiro maior ou igual a 0"),
  body("dataNascimento")
    .isISO8601()
    .withMessage("Data de nascimento deve ser válida"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validatePlannerData = [
  body("date").isISO8601().withMessage("Data inválida"),
  body("time").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora inválida"),
  body("paciente").isString().notEmpty().withMessage("Paciente é obrigatório"),
];

module.exports = {
  validateId,
  validateIdMiddleware,
  validateRequiredFields,
  validateFileType,
  validateEmailUniqueness,
  validateProductData,
  validatePacienteData,
  handleValidationErrors,
  validatePlannerData,
};
