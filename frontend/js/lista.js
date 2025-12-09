renderHeader();

const carregar = (chave) => JSON.parse(localStorage.getItem(chave) || "[]");
const salvar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

function removerResponsavel(id) {
  if (!confirm("Excluir este responsável?")) return;

  let resp = carregar("responsaveis").filter(r => r.id !== id);
  salvar("responsaveis", resp);

  render();
}

function removerCrianca(respId, criancaId) {
  if (!confirm("Remover criança deste responsável?")) return;

  let lista = carregar("responsaveis");
  let r = lista.find(x => x.id == respId);
  if (!r) return;

  r.criancaIds = r.criancaIds.filter(c => c !== criancaId);

  salvar("responsaveis", lista);

  render();
}

function abrirModal(resp) {
  const criancas = carregar("criancas");
  const enderecos = carregar("enderecos");

  const endereco = enderecos.find(e => e.id == resp.enderecoId);

  const listaCri = resp.criancaIds
    .map(id => {
      const c = criancas.find(x => x.id == id);
      return c ? `• ${c.nome}` : "Não encontrada"; 
    })
    .join("<br>");

  document.getElementById("modalContent").innerHTML = `
    <p><strong>Nome:</strong> ${resp.nome}</p>
    <p><strong>Telefone:</strong> ${resp.telefone}</p>
    <p><strong>Email:</strong> ${resp.email}</p>
    <p><strong>Filiação:</strong> ${resp.filiacao}</p>

    <h3 class="text-lg font-semibold mt-4 border-b pb-1">Endereço</h3>
    ${
      endereco
        ? `${endereco.rua}, ${endereco.numero}<br>${endereco.bairro} - ${endereco.cidade}/${endereco.estado}`
        : "Nenhum endereço vinculado."
    }

    <h3 class="text-lg font-semibold mt-4 border-b pb-1">Crianças</h3>
    <p>${listaCri || "Nenhuma criança vinculada."}</p>
  `;

  document.getElementById("modal").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

function render() {
  const container = document.getElementById("listaResponsaveis");
  const responsaveis = carregar("responsaveis");
  const criancas = carregar("criancas");

  if (responsaveis.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 text-lg">Nenhum responsável cadastrado.</p>`;
    return;
  }

  container.innerHTML = "";

  responsaveis.forEach(r => {
    const div = document.createElement("div");
    div.className = "bg-white shadow rounded-xl p-6";

    const criList = r.criancaIds.map(id => {
      const c = criancas.find(x => x.id == id);
      return ` 
        <li class="flex justify-between items-center">
          ${c ? c.nome : "Não encontrada"} 
          <button class="text-red-600" onclick="removerCrianca(${r.id}, ${id})">Remover</button>
        </li>
      `; 
    }).join("");

    div.innerHTML = `
      <div class="flex justify-between">
        <button class="text-2xl font-bold text-blue-700 hover:underline"
          onclick='abrirModal(${JSON.stringify(r)})'>
          ${r.nome}
        </button>

        <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onclick="removerResponsavel(${r.id})">
          Excluir
        </button>
      </div>

      <p class="text-gray-700"><strong>Filiação:</strong> ${r.filiacao}</p>

      <h3 class="text-xl font-semibold mt-4 border-b pb-1">Crianças</h3>
      <ul class="ml-6 list-disc">${criList || "<p>Nenhuma criança.</p>"}</ul>
    `;

    container.appendChild(div);
  });
}

render();

