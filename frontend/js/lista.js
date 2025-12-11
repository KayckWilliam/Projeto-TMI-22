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



async function abrirModal(resp) {
  try {
    const criancas = await API.getAll('criancas');
    const enderecos = await API.getAll('enderecos');
    const relatorios = await API.getAll('relatorios');

    const crianca = criancas.find(x => x.id == resp.crianca_id);
    const endereco = crianca ? enderecos.find(e => e.id == crianca.endereco_id) : null;
    
    // Busca relatórios da criança
    const relatoriosCrianca = crianca ? relatorios.filter(r => r.crianca_id == crianca.id) : [];
    const listaRelatorios = relatoriosCrianca.length > 0 
      ? relatoriosCrianca.map(r => `
          <div class="bg-gray-50 p-3 rounded mb-2">
            <p class="text-sm text-gray-600"><strong>Criado em:</strong> ${r.criado_em}</p>
            <p class="mt-2">${r.texto}</p>
          </div>
        `).join('')
      : "<p class='text-gray-500'>Nenhum relatório cadastrado.</p>";

    const listaCri = crianca ? `• ${crianca.nome} (nasc: ${crianca.data_nascimento})` : "Nenhuma criança vinculada.";

    document.getElementById("modalContent").innerHTML = `
      <p><strong>Nome:</strong> ${resp.nome}</p>
      <p><strong>CPF:</strong> ${resp.cpf}</p>
      <p><strong>RG:</strong> ${resp.rg}</p>
      <p><strong>Telefone:</strong> ${resp.telefone}</p>
      <p><strong>Filiação:</strong> ${resp.filiacao || 'Não informado'}</p>

      <h3 class="text-lg font-semibold mt-4 border-b pb-1">Endereço</h3>
      ${
        endereco
          ? `<p>${endereco.rua}, ${endereco.numero}<br>${endereco.bairro} - ${endereco.cidade}/${endereco.estado}<br>CEP: ${endereco.cep}</p>`
          : "<p class='text-gray-500'>Nenhum endereço vinculado.</p>"
      }

      <h3 class="text-lg font-semibold mt-4 border-b pb-1">Criança</h3>
      <p>${listaCri}</p>

      <h3 class="text-lg font-semibold mt-4 border-b pb-1">Relatórios</h3>
      ${listaRelatorios}
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

// Expor funções ao escopo global para onclick
window.removerResponsavel = removerResponsavel;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.filtrarLista = filtrarLista;

let todosResponsaveis = [];
let todasCriancas = [];

// Função para filtrar responsáveis
function filtrarLista() {
  const campoPesquisa = document.getElementById("pesquisa");
  if (!campoPesquisa) {
    console.error("Campo de pesquisa não encontrado");
    return;
  }
  
  const termo = campoPesquisa.value.toLowerCase().trim();
  
  if (!termo) {
    renderizarLista(todosResponsaveis, todasCriancas);
    return;
  }
  
  const filtrados = todosResponsaveis.filter(r => {
    // Pesquisa por nome do responsável
    if (r.nome && r.nome.toLowerCase().includes(termo)) {
      return true;
    }
    
    // Pesquisa por CPF (só se o termo contiver números)
    const termoNumerico = termo.replace(/\D/g, '');
    if (termoNumerico && r.cpf && r.cpf.includes(termoNumerico)) {
      return true;
    }
    
    // Pesquisa por nome da criança
    const crianca = todasCriancas.find(c => c.id == r.crianca_id);
    if (crianca && crianca.nome && crianca.nome.toLowerCase().includes(termo)) {
      return true;
    }
    
    return false;
  });
  
  renderizarLista(filtrados, todasCriancas);
}

function renderizarLista(responsaveis, criancas) {
  const container = document.getElementById("listaResponsaveis");
  
  if (responsaveis.length === 0) {
    const campoPesquisa = document.getElementById("pesquisa");
    const termo = campoPesquisa ? campoPesquisa.value : "";
    const mensagem = termo ? 
      `Nenhum responsável encontrado para "${termo}".` : 
      "Nenhum responsável cadastrado.";
    container.innerHTML = `<p class="text-center text-gray-500 text-lg">${mensagem}</p>`;
    return;
  }
  
  container.innerHTML = "";
  
  responsaveis.forEach(r => {
    const div = document.createElement("div");
    div.className = "bg-white shadow rounded-xl p-6";
    
    const crianca = criancas.find(x => x.id == r.crianca_id);
    const criList = crianca ? `<li>${crianca.nome} (nasc: ${crianca.data_nascimento})</li>` : "<p>Nenhuma criança.</p>";
    
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
      
      <p class="text-gray-700"><strong>Filiação:</strong> ${r.filiacao || 'Não informado'}</p>
      
      <h3 class="text-xl font-semibold mt-4 border-b pb-1">Crianças</h3>
      <ul class="ml-6 list-disc">${criList || "<p>Nenhuma criança.</p>"}</ul>
    `;
    
    container.appendChild(div);
  });
}

async function render() {
  const container = document.getElementById("listaResponsaveis");

  try {
    todosResponsaveis = await API.getAll('filiacao');
    todasCriancas = await API.getAll('criancas');
    
    renderizarLista(todosResponsaveis, todasCriancas);
    
    // Adiciona listeners para pesquisa
    const btnPesquisar = document.getElementById("btnPesquisar");
    const btnLimpar = document.getElementById("btnLimpar");
    const campoPesquisa = document.getElementById("pesquisa");
    
    if (btnPesquisar) {
      btnPesquisar.addEventListener("click", filtrarLista);
    }
    
    if (btnLimpar) {
      btnLimpar.addEventListener("click", () => {
        if (campoPesquisa) campoPesquisa.value = "";
        renderizarLista(todosResponsaveis, todasCriancas);
      });
    }
    
    // Permite pesquisar ao pressionar Enter
    if (campoPesquisa) {
      campoPesquisa.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          filtrarLista();
        }
      });
    }
  } catch (error) {
    console.error("Erro ao renderizar lista:", error);
    container.innerHTML = `<p class="text-red-500">Erro ao carregar responsáveis.</p>`;
  }
}

render();

