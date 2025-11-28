import { API } from "./api.js";

// Seletores
const form = document.getElementById("formResponsavel");
const lista = document.getElementById("listaResponsaveis");
const idGeradoDiv = document.getElementById("idGerado");

// Função para gerar ID automático
function gerarId() {
  return Math.floor(100000 + Math.random() * 900000);
}

// ID inicial
let idAtual = gerarId();
idGeradoDiv.innerText = idAtual;

// ============================
// CARREGAR LISTA
// ============================
async function carregarLista() {
  const dados = await API.getAll("responsaveis");

  lista.innerHTML = "";

  dados.forEach(r => {
    lista.innerHTML += `
      <tr class="border-b">
        <td class="p-2">${r.id}</td>
        <td class="p-2">${r.nome}</td>
        <td class="p-2">${r.telefone}</td>
        <td class="p-2">
          <button onclick="excluir(${r.id})"
            class="bg-red-500 text-white px-3 py-1 rounded">
            Excluir
          </button>
        </td>
      </tr>
    `;
  });
}

// ============================
// SALVAR RESPONSÁVEL
// ============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoResponsavel = {
    id: idAtual,
    nome: form.nome.value,
    data_nascimento: form.data_nascimento.value,
    cpf: form.cpf.value,
    rg: form.rg.value,
    crianca_id: form.crianca_id.value,

    // Endereço
    cep: form.cep.value,
    rua: form.rua.value,
    numero: form.numero.value,
    bairro: form.bairro.value,
    cidade: form.cidade.value,
    estado: form.estado.value,

    // Contato
    telefone: form.telefone.value,
    email: form.email.value,

    criado_em: new Date().toISOString()
  };

  await API.create("responsaveis", novoResponsavel);

  idAtual = gerarId();
  idGeradoDiv.innerText = idAtual;

  form.reset();
  carregarLista();
});

// ============================
// EXCLUIR
// ============================
async function excluir(id) {
  await API.delete("responsaveis", id);
  carregarLista();
}

carregarLista();
window.excluir = excluir;

