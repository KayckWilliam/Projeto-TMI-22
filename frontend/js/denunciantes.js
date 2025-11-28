import { API } from "./api.js";

// Seletores
const form = document.getElementById("formDenunciante");
const lista = document.getElementById("listaDenunciantes");
const idGeradoDiv = document.getElementById("idGerado");

// Função de ID
function gerarId() {
  return Math.floor(100000 + Math.random() * 900000);
}

let idAtual = gerarId();
idGeradoDiv.innerText = idAtual;

// ============================
// CARREGAR LISTA
// ============================
async function carregarLista() {
  const dados = await API.getAll("denunciantes");

  if (lista) {
    lista.innerHTML = "";

    dados.forEach(d => {
      lista.innerHTML += `
        <tr class="border-b">
          <td class="p-2">${d.id}</td>
          <td class="p-2">${d.nome}</td>
          <td class="p-2">${d.telefone}</td>
          <td class="p-2">
            <button onclick="excluir(${d.id})"
              class="bg-red-500 text-white px-3 py-1 rounded">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });
  }
}

// ============================
// SALVAR DENUNCIANTE
// ============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoDenunciante = {
    id: idAtual,
    nome: form.nome.value,
    data_nascimento: form.data_nascimento.value,
    cpf: form.cpf.value,
    rg: form.rg.value,
    parentesco: form.parentesco.value,

    telefone: form.telefone.value,
    email: form.email.value,

    // Endereço
    cep: form.cep.value,
    rua: form.rua.value,
    numero: form.numero.value,
    bairro: form.bairro.value,
    cidade: form.cidade.value,
    estado: form.estado.value,

    crianca_id: form.crianca_id.value,

    criado_em: new Date().toISOString()
  };

  await API.create("denunciantes", novoDenunciante);

  idAtual = gerarId();
  idGeradoDiv.innerText = idAtual;

  form.reset();
  carregarLista();
});

// ============================
// EXCLUIR
// ============================
async function excluir(id) {
  await API.delete("denunciantes", id);
  carregarLista();
}

carregarLista();
window.excluir = excluir;
