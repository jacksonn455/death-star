const express = require("express");
const {
  getPacientes,
  getPacienteById,
  updatePaciente,
  deletePaciente,
} = require("../controllers/pacientes");
const {
  createPacienteService
} = require("../services/pacientes");
const { body, param, validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.use(express.json());

const validatePacienteData = [
  body("nome")
    .isString()
    .notEmpty()
    .withMessage("Nome do paciente é obrigatório"),
  body("idade")
    .isInt({ min: 0 })
    .withMessage("Idade deve ser um número inteiro maior ou igual a 0"),
  body("dataNascimento")
    .isDate()
    .withMessage("Data de nascimento deve ser válida")
];

const validateId = [param("id").isMongoId().withMessage("ID inválido")];

router.get("/", async (req, res) => {
  try {
    const pacientes = await getPacientes(req, res);
    res.status(200).json(pacientes);
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", validateId, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const paciente = await getPacienteById(req.params.id);
    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }
    res.status(200).json(paciente);
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', upload.single('image'), validatePacienteData, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let image = null;

    if (req.file) {
      const uploadFromBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "pacientes",
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
                console.error("❌ Erro no upload para o Cloudinary:", error);
                return reject(error);
              }

              resolve(result.secure_url);
            }
          );

          streamifier.createReadStream(buffer).pipe(uploadStream);
        });
      };

      image = await uploadFromBuffer(req.file.buffer);
    } else {
      image = null;
    }

    const newPaciente = await createPacienteService({ ...req.body, image });

    res.status(201).json(newPaciente);
  } catch (error) {
    console.error("❌ Erro ao criar paciente:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", [validateId, validatePacienteData], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedPaciente = await updatePaciente(req.params.id, req.body);
    if (!updatedPaciente) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }
    res.status(200).json(updatedPaciente);
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", validateId, async (req, res) => {
  try {
    const deletedPaciente = await deletePaciente(req.params.id);
    if (!deletedPaciente) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Erro ao excluir paciente:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;