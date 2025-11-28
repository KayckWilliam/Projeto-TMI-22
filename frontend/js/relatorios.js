import { API } from "./api.js";

const tabelaCriancas = document.getElementById("listaCriancas");
const tabelaResp = document.getElementById("listaResponsaveis");
const tabelaDen = document.getElementById("listaDenunciantes");

// ================================
// Carregar relatórios
// ================================
async function carregarRelatorios() {

  // Crianças
  const criancas = await API.getAll("criancas");
  tabelaCriancas.innerHTML = "";
  criancas.forEach(c => {
    tabelaCriancas.innerHTML += `
      <tr class="border-b">
        <td class="p-2">${c.id}</td>
        <td class="p-2">
          <a href="detalhes.html?tipo=criancas&id=${c.id}"
             class="text-blue-600 underline">
            ${c.nome}
          </a>
        </td>
      </tr>
    `;
  });

  // Responsáveis
  const resp = await API.getAll("responsaveis");
  tabelaResp.innerHTML = "";
  resp.forEach(r => {
    tabelaResp.innerHTML += `
      <tr class="border-b">
        <td class="p-2">${r.id}</td>
        <td class="p-2">
          <a href="detalhes.html?tipo=responsaveis&id=${r.id}"
             class="text-blue-600 underline">
            ${r.nome}
          </a>
        </td>
      </tr>
    `;
  });

  // Denunciantes
  const den = await API.getAll("denunciantes");
  tabelaDen.innerHTML = "";
  den.forEach(d => {
    tabelaDen.innerHTML += `
      <tr class="border-b">
        <td class="p-2">${d.id}</td>
        <td class="p-2">
          <a href="detalhes.html?tipo=denunciantes&id=${d.id}"
             class="text-blue-600 underline">
            ${d.nome}
          </a>
        </td>
      </tr>
    `;
  });
}

carregarRelatorios();

