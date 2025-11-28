import { API } from "./api.js";

const container = document.getElementById("detalhes");

// Pega parâmetros da URL
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");
const id = params.get("id");

// ================================
// CARREGAR DETALHES
// ================================
async function carregarDetalhes() {
  const item = await API.get(tipo, id);

  if (!item) {
    container.innerHTML = "<p>Registro não encontrado.</p>";
    return;
  }

  let html = `
    <h1 class="text-3xl font-bold mb-6">Detalhes do Cadastro</h1>

    <p><strong>ID:</strong> ${item.id}</p>
    <p><strong>Nome:</strong> ${item.nome}</p>
    <p><strong>Criado em:</strong> ${new Date(item.criado_em).toLocaleString()}</p>

    <hr class="my-4">
    <h2 class="text-2xl font-semibold mb-2">Todos os Dados</h2>
    <pre class="bg-gray-100 p-4 rounded">${JSON.stringify(item, null, 2)}</pre>
  `;

  container.innerHTML = html;
}

carregarDetalhes();

