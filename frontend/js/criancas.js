renderHeader();

let listaTemp = [];


function gerarIdCrianca() {
  let lista = JSON.parse(localStorage.getItem("criancas") || "[]");
  return lista.length + 1;
}


function atualizarListaTemp() {
  const ul = document.getElementById("listaTemp");
  ul.innerHTML = "";

  listaTemp.forEach((c, index) => {
    const li = document.createElement("li");
    li.className = "p-3 bg-gray-100 rounded flex justify-between items-center";

    li.innerHTML = `
      <span>${c.nome} (nasc: ${c.data_nascimento})</span>
      <button onclick="removerTemp(${index})"
        class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
        Remover
      </button>
    `;
    ul.appendChild(li);
  });
}


function removerTemp(index) {
  listaTemp.splice(index, 1);
  atualizarListaTemp();
}


document.getElementById("btnAdicionar").addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const data = document.getElementById("data_nascimento").value;

  if (!nome || !data) {
    alert("Preencha todos os campos!");
    return;
  }

  const novoId = gerarIdCrianca() + listaTemp.length;

  listaTemp.push({ id: novoId, nome, data_nascimento: data });

  atualizarListaTemp();

  document.getElementById("nome").value = "";
  document.getElementById("data_nascimento").value = "";
});


document.getElementById("btnSalvarContinuar").addEventListener("click", () => {
  if (listaTemp.length === 0) {
    alert("Adicione pelo menos uma criança!");
    return;
  }

  let lista = JSON.parse(localStorage.getItem("criancas") || "[]");
  lista.push(...listaTemp);
  localStorage.setItem("criancas", JSON.stringify(lista));

  let fluxo = JSON.parse(localStorage.getItem("cadastroAtual") || "{}");
  fluxo.criancaIds = listaTemp.map(c => c.id);
  localStorage.setItem("cadastroAtual", JSON.stringify(fluxo));

  listaTemp = [];
  atualizarListaTemp();

  window.location.href = "responsaveis.html";
});





