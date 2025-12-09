renderHeader();

function pesquisar() {
  const termo = document.getElementById("campoPesquisa").value.toLowerCase();
  const resultadosDiv = document.getElementById("resultadosPesquisa");

  if (!termo.trim()) {
    resultadosDiv.innerHTML = "<p class='text-red-600 font-semibold'>Digite algo para pesquisar.</p>";
    return;
  }

  const criancas = JSON.parse(localStorage.getItem("criancas") || "[]");
  const responsaveis = JSON.parse(localStorage.getItem("responsaveis") || "[]");
  const enderecos = JSON.parse(localStorage.getItem("enderecos") || "[]");

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
        item.logradouro?.toLowerCase().includes(termo) ||
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
        <p><strong>Filiação:</strong> ${r.filiacao || "–"}</p>
      ` : ""}

      ${r.tipo === "Endereço" ? `
        <p><strong>Logradouro:</strong> ${r.logradouro}</p>
        <p><strong>Nº:</strong> ${r.numero}</p>
        <p><strong>Bairro:</strong> ${r.bairro}</p>
        <p><strong>CEP:</strong> ${r.cep}</p>
      ` : ""}
    </div>
  `).join("");
}

document.getElementById("btnPesquisar").addEventListener("click", pesquisar);
