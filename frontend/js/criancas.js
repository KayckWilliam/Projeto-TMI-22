import { API } from "./api.js";

// Seleciona elementos
const form = document.getElementById("formCrianca");
const lista = document.getElementById("listaCriancas");
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
  const dados = await API.getAll("criancas");

  lista.innerHTML = "";

  dados.forEach(c => {
    lista.innerHTML += `
      <tr class="border-b">
        <td class="p-2">${c.id}</td>
        <td class="p-2">${c.nome}</td>
        <td class="p-2">
          <button onclick="excluir(${c.id})"
            class="bg-red-500 text-white px-3 py-1 rounded">
            Excluir
          </button>
        </td>
      </tr>
    `;
  });
}

// ============================
// SALVAR CRIANÇA
// ============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novaCrianca = {
    id: idAtual,
    nome: form.nome.value,
    data_nascimento: form.data_nascimento.value,
    criado_em: new Date().toISOString()
  };

  await API.create("criancas", novaCrianca);

  // Novo ID para próximo cadastro
  idAtual = gerarId();
  idGeradoDiv.innerText = idAtual;

  form.reset();
  carregarLista();
});

// ============================
// EXCLUIR
// ============================
async function excluir(id) {
  await API.delete("criancas", id);
  carregarLista();
}

// Inicializa tabela
carregarLista();

// Deixa função disponível globalmente para onclick=""
window.excluir = excluir;
