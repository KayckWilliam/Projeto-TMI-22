import { API } from './api.js';

renderHeader();

async function pesquisar() {
  const termo = document.getElementById("campoPesquisa").value.toLowerCase();
  const resultadosDiv = document.getElementById("resultadosPesquisa");

  if (!termo.trim()) {
    resultadosDiv.innerHTML = "<p class='text-red-600 font-semibold'>Digite algo para pesquisar.</p>";
    return;
  }

  try {
    const criancas = await API.getAll('criancas');
    const responsaveis = await API.getAll('filiacao');
    const enderecos = await API.getAll('enderecos');

    const banco = [
      ...criancas.map(c => ({ tipo: "Criança", ...c })),
      ...responsaveis.map(r => ({ tipo: "Responsável", ...r })),
      ...enderecos.map(e => ({ tipo: "Endereço", ...e }))
    ];

    const resultados = banco.filter(item => {
      if (item.tipo === "Criança" || item.tipo === "Responsável") {
        return item.nome?.toLowerCase().includes(termo);
      }
      if (item.tipo === "Endereço") {
        return (
          item.rua?.toLowerCase().includes(termo) ||
          item.bairro?.toLowerCase().includes(termo) ||
          item.numero?.toString().includes(termo) ||
          item.cep?.toString().includes(termo)
        );
      }
      return false;
    });

    if (resultados.length === 0) {
      resultadosDiv.innerHTML = "<p class='text-gray-600'>Nenhum resultado encontrado.</p>";
      return;
    }

    resultadosDiv.innerHTML = resultados.map(r => `
      <div class="p-3 bg-white shadow rounded-lg border mb-2">
        <p><strong>Tipo:</strong> ${r.tipo}</p>

        ${r.tipo === "Criança" ? `
          <p><strong>Nome:</strong> ${r.nome}</p>
          <p><strong>Nasc.:</strong> ${r.data_nascimento}</p>
        ` : ""}

        ${r.tipo === "Responsável" ? `
          <p><strong>Nome:</strong> ${r.nome}</p>
          <p><strong>Telefone:</strong> ${r.telefone || "–"}</p>
          <p><strong>Filiação:</strong> ${r.tipo_filiacao || "–"}</p>
        ` : ""}

        ${r.tipo === "Endereço" ? `
          <p><strong>Logradouro:</strong> ${r.rua}</p>
          <p><strong>Nº:</strong> ${r.numero}</p>
          <p><strong>Bairro:</strong> ${r.bairro}</p>
          <p><strong>CEP:</strong> ${r.cep}</p>
        ` : ""}
      </div>
    `).join("");
  } catch (error) {
    console.error("Erro ao pesquisar:", error);
    resultadosDiv.innerHTML = "<p class='text-red-600'>Erro ao buscar dados.</p>";
  }
}

document.getElementById("btnPesquisar").addEventListener("click", pesquisar);
