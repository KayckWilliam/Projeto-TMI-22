renderHeader();

let listaCriancas = JSON.parse(localStorage.getItem("criancas") || "[]");
let criancaSelecionada = null;

const campoPesquisa = document.getElementById("campoPesquisa");
const resultadosPesquisa = document.getElementById("resultadosPesquisa");

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


function definirDataAtual() {
  let hoje = new Date();
  let dia = String(hoje.getDate()).padStart(2, '0');
  let mes = String(hoje.getMonth() + 1).padStart(2, '0');
  let ano = hoje.getFullYear();

  document.getElementById("dataRelatorio").value = `DATA: ${dia}/${mes}/${ano}`;
}
definirDataAtual();


function salvarRelatorio() {
  if (!criancaSelecionada) {
    alert("Selecione uma criança antes de salvar o relatório!");
    return;
  }

  const texto = document.getElementById("textoRelatorio").value.trim();
  if (texto.length < 3) {
    alert("Digite o relatório antes de salvar!");
    return;
  }

  let relatorios = JSON.parse(localStorage.getItem("relatorios") || "[]");

  relatorios.push({
    id: Date.now(),
    criancaId: criancaSelecionada.id,
    criancaNome: criancaSelecionada.nome,
    data: document.getElementById("dataRelatorio").value,
    texto
  });

  localStorage.setItem("relatorios", JSON.stringify(relatorios));
  document.getElementById("textoRelatorio").value = "";
  carregarRelatorios();
  alert("Relatório salvo com sucesso!");
}


function carregarRelatorios() {
  const listaDiv = document.getElementById("listaRelatorios");
  const relatorios = JSON.parse(localStorage.getItem("relatorios") || "[]");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const admin = usuario?.nivel === "admin";

  if (relatorios.length === 0) {
    listaDiv.innerHTML = `<p class="text-gray-500">Nenhum relatório salvo.</p>`;
    return;
  }

  listaDiv.innerHTML = relatorios.map(r => `
    <div class="p-3 border rounded shadow-sm">
      <p><strong>Criança:</strong> ${r.criancaNome}</p>
      <p><strong>${r.data}</strong></p>
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
}
carregarRelatorios();


function apagarRelatorio(id) {
  let relatorios = JSON.parse(localStorage.getItem("relatorios") || "[]");
  relatorios = relatorios.filter(r => r.id !== id);
  localStorage.setItem("relatorios", JSON.stringify(relatorios));
  carregarRelatorios();
}

