import { API } from "./api.js";

const tabela = document.getElementById("listaEnderecos");

async function carregarEnderecos() {

  const criancas = await API.getAll("criancas");
  const responsaveis = await API.getAll("responsaveis");
  const denunciantes = await API.getAll("denunciantes");

  const todos = [...responsaveis, ...denunciantes]; // crianças não têm endereço

  tabela.innerHTML = "";

  todos.forEach(x => {
    tabela.innerHTML += `
      <tr class="border-b">
        <td class="p-2">${x.id}</td>
        <td class="p-2">${x.nome}</td>
        <td class="p-2">${x.rua}, ${x.numero} - ${x.bairro}</td>
        <td class="p-2">${x.cidade} / ${x.estado}</td>
        <td class="p-2">${x.cep}</td>
      </tr>
    `;
  });

}

carregarEnderecos();

