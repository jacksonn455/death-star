const fs = require("fs");

function getTodosPacientes() {
  const pacientes = JSON.parse(fs.readFileSync("pacientes.json"));
  return pacientes;
}

function getPacientePorId(id) {
  const pacientes = getTodosPacientes();
  const paciente = pacientes.filter((paciente) => paciente.id == id)[0];
  return paciente;
}

function inserePaciente(PacienteNovo) {
  const pacientes = getTodosPacientes();

  const novaListaDePacientes = [...pacientes, PacienteNovo];

  fs.writeFileSync("pacientes.json", JSON.stringify(novaListaDePacientes));
}

function modificaPaciente(modificacoes, id) {
  let pacientesAtuais = getTodosPacientes();
  const indiceModificado = pacientesAtuais.findIndex(
    (paciente) => paciente.id === Number(id)
  );

  if (indiceModificado === -1) {
    throw new Error("Paciente não encontrado");
  }

  const conteudoMudado = {
    ...pacientesAtuais[indiceModificado],
    ...modificacoes,
  };
  pacientesAtuais[indiceModificado] = conteudoMudado;

  fs.writeFileSync("pacientes.json", JSON.stringify(pacientesAtuais));
}

function deletaPacientePorId(id) {
  const pacientes = getTodosPacientes();

  const pacientesFiltrados = pacientes.filter(
    (paciente) => paciente.id !== Number(id)
  );

  fs.writeFileSync("pacientes.json", JSON.stringify(pacientesFiltrados));
}

module.exports = {
  getTodosPacientes,
  getPacientePorId,
  inserePaciente,
  modificaPaciente,
  deletaPacientePorId,
};
