import { API } from './api.js';

renderHeader();

let listaCriancas = [];
let criancaSelecionada = null;

const campoPesquisa = document.getElementById("campoPesquisa");
const resultadosPesquisa = document.getElementById("resultadosPesquisa");

// Carregar crianças da API ao iniciar
async function carregarCriancas() {
  try {
    listaCriancas = await API.getAll('criancas');
    console.log("Crianças carregadas:", listaCriancas);
    
    if (!listaCriancas || listaCriancas.length === 0) {
      console.warn("Nenhuma criança encontrada na API");
    }
  } catch (error) {
    console.error("Erro ao carregar crianças:", error);
    alert("Erro ao carregar crianças. Verifique se o backend está rodando.");
    listaCriancas = [];
  }
}

// Carregar crianças e aguardar conclusão
await carregarCriancas();

campoPesquisa.addEventListener("input", filtrarCriancas);

function filtrarCriancas() {
  const texto = campoPesquisa.value.toLowerCase();
  resultadosPesquisa.innerHTML = "";

  if (texto.trim() === "") {
    resultadosPesquisa.classList.add("hidden");
    return;
  }

  const filtradas = listaCriancas.filter(c => c.nome.toLowerCase().includes(texto));

  if (filtradas.length === 0) {
    resultadosPesquisa.innerHTML = `<li class="p-2 text-gray-500">Nenhuma criança encontrada...</li>`;
  } else {
    filtradas.forEach(c => {
      resultadosPesquisa.innerHTML += `
        <li>
          <button 
            onclick="selecionarCrianca(${c.id}, '${c.nome}')"
            class="block w-full text-left p-2 rounded hover:bg-blue-50 cursor-pointer">
            ${c.nome}
          </button>
        </li>
      `;
    });
  }

  resultadosPesquisa.classList.remove("hidden");
}

function selecionarCrianca(id, nome) {
  criancaSelecionada = { id, nome };
  campoPesquisa.value = nome;
  resultadosPesquisa.classList.add("hidden");
}

// Expor funções usadas em atributos inline (HTML usa onclick="...")
window.selecionarCrianca = selecionarCrianca;


function definirDataAtual() {
  let hoje = new Date();
  let dia = String(hoje.getDate()).padStart(2, '0');
  let mes = String(hoje.getMonth() + 1).padStart(2, '0');
  let ano = hoje.getFullYear();

  document.getElementById("dataRelatorio").value = `DATA: ${dia}/${mes}/${ano}`;
}
definirDataAtual();


async function salvarRelatorio() {
  if (!criancaSelecionada) {
    alert("Selecione uma criança antes de salvar o relatório!");
    return;
  }

  const texto = document.getElementById("textoRelatorio").value.trim();
  if (texto.length < 3) {
    alert("Digite o relatório antes de salvar!");
    return;
  }

  try {
    const dataValue = document.getElementById("dataRelatorio").value;
    console.log("Salvando relatório com dados:", {
      texto,
      criado_em: dataValue,
      crianca_id: criancaSelecionada.id
    });

    const resultado = await API.create('relatorios', {
      texto,
      criado_em: dataValue,
      crianca_id: criancaSelecionada.id
    });

    console.log("Resposta do servidor:", resultado);

    document.getElementById("textoRelatorio").value = "";
    criancaSelecionada = null;
    document.getElementById("campoPesquisa").value = "";
    
    await carregarRelatorios();
    alert("Relatório salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar relatório:", error);
    alert("Erro ao salvar relatório. Verifique se o backend está rodando e tente novamente.");
  }
}
// Tornar acessível ao onclick inline
window.salvarRelatorio = salvarRelatorio;


async function carregarRelatorios() {
  const listaDiv = document.getElementById("listaRelatorios");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const admin = usuario?.nivel === "admin";

  try {
    const relatorios = await API.getAll('relatorios');

    if (relatorios.length === 0) {
      listaDiv.innerHTML = `<p class="text-gray-500">Nenhum relatório salvo.</p>`;
      return;
    }

    listaDiv.innerHTML = relatorios.map(r => `
      <div class="p-3 border rounded shadow-sm">
        <p><strong>Relatório #${r.id}</strong> — Criança ID: ${r.crianca_id}</p>
        <p><strong>${r.criado_em || 'N/A'}</strong></p>
        <p class="mt-2">${r.texto}</p>

        ${admin ? `
        <button 
          onclick="apagarRelatorio(${r.id})"
          class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Apagar
        </button>` : ""}
      </div>
    `).join("");
  } catch (error) {
    console.error("Erro ao carregar relatórios:", error);
    listaDiv.innerHTML = `<p class="text-red-500">Erro ao carregar relatórios.</p>`;
  }
}
carregarRelatorios();


async function apagarRelatorio(id) {
  if (!confirm("Tem certeza que deseja apagar este relatório?")) return;

  try {
    await API.delete('relatorios', id);
    carregarRelatorios();
  } catch (error) {
    console.error("Erro ao apagar relatório:", error);
    alert("Erro ao apagar relatório.");
  }
}

// Tornar acessível ao onclick inline
window.apagarRelatorio = apagarRelatorio;

