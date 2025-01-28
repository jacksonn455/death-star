const { Router } = require("express");
const { getPacientes, getPaciente, postPaciente, patchPaciente, deletePaciente } = require("../controllers/pacientes");

const router = Router();

router.get("/", getPacientes);

router.get("/:id", getPaciente);

router.post("/", postPaciente);

router.patch('/:id', patchPaciente);

router.put("/", getPacientes);

router.delete("/:id", deletePaciente);

module.exports = router;