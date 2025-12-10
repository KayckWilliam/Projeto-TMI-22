import { API } from './api.js';

renderHeader();

const formResp = document.getElementById("formResp");
const vinculosBox = document.getElementById("vinculosBox");

const fluxo = JSON.parse(localStorage.getItem("cadastroAtual") || "{}");

vinculosBox.innerText = `Endereço vinculado: ${fluxo.enderecoId ? "Sim" : "-"} | Número de crianças: ${fluxo.criancaIds?.length || 0}`;

formResp.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = Object.fromEntries(new FormData(e.target));

  try {
    await API.create('filiacao', {
      nome: dados.nome,
      cpf: dados.cpf,
      rg: dados.rg,
      telefone: dados.telefone,
      filiacao: dados.filiacao,
      crianca_id: fluxo.criancaIds?.[0] || 1
    });

    localStorage.removeItem("cadastroAtual");
    alert("Responsável cadastrado com sucesso!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Erro ao salvar responsável:", error);
    alert("Erro ao salvar responsável. Tente novamente.");
  }
});


