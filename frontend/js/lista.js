import { API } from './api.js';

renderHeader();

async function removerResponsavel(id) {
  if (!confirm("Excluir este responsável?")) return;

  try {
    await API.delete('filiacao', id);
    render();
  } catch (error) {
    console.error("Erro ao remover responsável:", error);
    alert("Erro ao remover responsável.");
  }
}

async function removerCrianca(respId, criancaId) {
  if (!confirm("Remover criança deste responsável?")) return;

  try {
    // Fetch the current filiacao record to get its data
    const filiacao = await API.getById('filiacao', respId);
    if (!filiacao) {
      alert("Filiação não encontrada.");
      return;
    }

    // Remove the child ID from the list
    const criancaIds = (filiacao.crianca_ids || []).filter(c => c !== criancaId);

    // Update the filiacao with the new list
    await API.create('filiacao', {
      ...filiacao,
      crianca_ids: criancaIds
    });

    render();
  } catch (error) {
    console.error("Erro ao remover criança:", error);
    alert("Erro ao remover criança.");
  }
}

async function abrirModal(resp) {
  try {
    const criancas = await API.getAll('criancas');
    const enderecos = await API.getAll('enderecos');

    const endereco = enderecos.find(e => e.id == resp.endereco_id);

    const listaCri = (resp.crianca_ids || [])
      .map(id => {
        const c = criancas.find(x => x.id == id);
        return c ? `• ${c.nome}` : "Não encontrada"; 
      })
      .join("<br>");

    document.getElementById("modalContent").innerHTML = `
      <p><strong>Nome:</strong> ${resp.nome}</p>
      <p><strong>Telefone:</strong> ${resp.telefone}</p>
      <p><strong>Email:</strong> ${resp.email}</p>
      <p><strong>Filiação:</strong> ${resp.tipo_filiacao}</p>

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
  } catch (error) {
    console.error("Erro ao abrir modal:", error);
    alert("Erro ao carregar dados.");
  }
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

async function render() {
  const container = document.getElementById("listaResponsaveis");

  try {
    const responsaveis = await API.getAll('filiacao');
    const criancas = await API.getAll('criancas');

    if (responsaveis.length === 0) {
      container.innerHTML = `<p class="text-center text-gray-500 text-lg">Nenhum responsável cadastrado.</p>`;
      return;
    }

    container.innerHTML = "";

    responsaveis.forEach(r => {
      const div = document.createElement("div");
      div.className = "bg-white shadow rounded-xl p-6";

      const criList = (r.crianca_ids || []).map(id => {
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

        <p class="text-gray-700"><strong>Filiação:</strong> ${r.tipo_filiacao}</p>

        <h3 class="text-xl font-semibold mt-4 border-b pb-1">Crianças</h3>
        <ul class="ml-6 list-disc">${criList || "<p>Nenhuma criança.</p>"}</ul>
      `;

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao renderizar lista:", error);
    container.innerHTML = `<p class="text-red-500">Erro ao carregar responsáveis.</p>`;
  }
}

render();

