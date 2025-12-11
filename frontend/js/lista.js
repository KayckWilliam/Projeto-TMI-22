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
    const encaminhamentos = await API.getAll('encaminhamentos');

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
    
    // Busca encaminhamentos da criança
    const encaminhamentosCrianca = crianca ? encaminhamentos.filter(e => e.crianca_id == crianca.id) : [];
    const listaEncaminhamentos = encaminhamentosCrianca.length > 0
      ? encaminhamentosCrianca.map(e => `
          <div class="bg-green-50 p-3 rounded mb-2 border-l-4 border-green-500">
            <p class="font-semibold text-green-800">${e.destino}</p>
            <p class="text-sm text-gray-600 mt-1">${e.descricao}</p>
            <p class="text-xs text-gray-500 mt-1">${e.criado_em}</p>
          </div>
        `).join('')
      : "<p class='text-gray-500'>Nenhum encaminhamento registrado.</p>";

    const listaCri = crianca ? `• ${crianca.nome} (nasc: ${crianca.data_nascimento})` : "Nenhuma criança vinculada.";
    const tipoDenuncia = crianca && crianca.denuncia ? crianca.denuncia : "Não informado";

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
      
      <h3 class="text-lg font-semibold mt-4 border-b pb-1">Tipo de Denúncia</h3>
      <p>${tipoDenuncia}</p>

      <h3 class="text-lg font-semibold mt-4 border-b pb-1">Relatórios</h3>
      ${listaRelatorios}
      
      <h3 class="text-lg font-semibold mt-4 border-b pb-1">Encaminhamentos</h3>
      ${listaEncaminhamentos}
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

let responsavelEditando = null;

// Funções de formatação
function formatarCPF(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return valor;
}

function formatarTelefone(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length <= 11) {
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
  }
  return valor;
}

function formatarCEP(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length <= 8) {
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
  }
  return valor;
}

function formatarRG(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length <= 9) {
    valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return valor;
}

// Função para abrir modal de edição
async function abrirModalEditar(id) {
  try {
    const responsavel = await API.getById('filiacao', id);
    const crianca = await API.getById('criancas', responsavel.crianca_id);
    const endereco = await API.getById('enderecos', crianca.endereco_id);
    
    responsavelEditando = { ...responsavel, crianca, endereco, endereco_id: crianca.endereco_id };
    
    // Preenche os campos do formulário com formatação
    document.getElementById('editNome').value = responsavel.nome;
    document.getElementById('editCpf').value = formatarCPF(responsavel.cpf);
    document.getElementById('editRg').value = formatarRG(responsavel.rg);
    document.getElementById('editTelefone').value = formatarTelefone(responsavel.telefone);
    document.getElementById('editFiliacao').value = responsavel.filiacao || '';
    
    document.getElementById('editCep').value = formatarCEP(endereco.cep);
    document.getElementById('editRua').value = endereco.rua;
    document.getElementById('editNumero').value = endereco.numero;
    document.getElementById('editBairro').value = endereco.bairro;
    document.getElementById('editCidade').value = endereco.cidade;
    document.getElementById('editEstado').value = endereco.estado;
    
    // Adiciona listeners para formatação em tempo real
    const camposCPF = document.getElementById('editCpf');
    const camposRG = document.getElementById('editRg');
    const camposTelefone = document.getElementById('editTelefone');
    const camposCEP = document.getElementById('editCep');
    
    camposCPF.addEventListener('input', (e) => {
      e.target.value = formatarCPF(e.target.value);
    });
    
    camposRG.addEventListener('input', (e) => {
      e.target.value = formatarRG(e.target.value);
    });
    
    camposTelefone.addEventListener('input', (e) => {
      e.target.value = formatarTelefone(e.target.value);
    });
    
    camposCEP.addEventListener('input', (e) => {
      e.target.value = formatarCEP(e.target.value);
    });
    
    document.getElementById('modalEditar').classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao carregar dados para edição:', error);
    alert('Erro ao carregar dados.');
  }
}

// Função para fechar modal de edição
function fecharModalEditar() {
  document.getElementById('modalEditar').classList.add('hidden');
  responsavelEditando = null;
}

// Função para salvar edição
async function salvarEdicao(e) {
  e.preventDefault();
  
  if (!responsavelEditando) return;
  
  // Validações básicas
  const cpf = document.getElementById('editCpf').value.replace(/\D/g, '');
  if (cpf.length !== 11) {
    alert('CPF deve ter 11 dígitos');
    return;
  }
  
  const cep = document.getElementById('editCep').value.replace(/\D/g, '');
  if (cep.length !== 8) {
    alert('CEP deve ter 8 dígitos');
    return;
  }
  
  try {
    // Atualiza endereço
    await API.update('enderecos', responsavelEditando.endereco_id, {
      cep: document.getElementById('editCep').value,
      rua: document.getElementById('editRua').value,
      numero: document.getElementById('editNumero').value,
      bairro: document.getElementById('editBairro').value,
      cidade: document.getElementById('editCidade').value,
      estado: document.getElementById('editEstado').value
    });
    
    // Atualiza responsável (filiacao)
    await API.update('filiacao', responsavelEditando.id, {
      nome: document.getElementById('editNome').value,
      cpf: document.getElementById('editCpf').value,
      rg: document.getElementById('editRg').value,
      telefone: document.getElementById('editTelefone').value,
      filiacao: document.getElementById('editFiliacao').value,
      crianca_id: responsavelEditando.crianca_id
    });
    
    alert('Dados atualizados com sucesso!');
    fecharModalEditar();
    window.location.reload();
  } catch (error) {
    console.error('Erro ao salvar:', error);
    alert('Erro ao salvar os dados.');
  }
}

// Expor funções ao escopo global para onclick
window.removerResponsavel = removerResponsavel;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.filtrarLista = filtrarLista;
window.abrirModalEditar = abrirModalEditar;
window.fecharModalEditar = fecharModalEditar;

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
        
        <div class="flex gap-2">
          <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onclick="abrirModalEditar(${r.id})">
            Editar
          </button>
          <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onclick="removerResponsavel(${r.id})">
            Excluir
          </button>
        </div>
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

// Adiciona listener ao formulário de edição
const formEditar = document.getElementById('formEditar');
if (formEditar) {
  formEditar.addEventListener('submit', salvarEdicao);
}

render();

