import { API } from './api.js';

renderHeader();

let listaTemp = [];
const fluxo = JSON.parse(localStorage.getItem("cadastroAtual") || "{}");

// Função para validar nome (não pode conter números)
function validarNome(nome) {
  // Verifica se contém números
  if (/\d/.test(nome)) {
    return false;
  }
  return true;
}

// Função para formatar data com máscara DD/MM/AAAA
function formatarData(valor) {
  valor = valor.replace(/\D/g, ''); // Remove não-dígitos
  if (valor.length >= 2) {
    valor = valor.substring(0, 2) + '/' + valor.substring(2);
  }
  if (valor.length >= 5) {
    valor = valor.substring(0, 5) + '/' + valor.substring(5, 9);
  }
  return valor;
}

// Função para validar data de nascimento no formato DD/MM/AAAA
function validarDataNascimento(data) {
  // Verifica formato DD/MM/AAAA
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    return false;
  }
  
  const [dia, mes, ano] = data.split('/').map(Number);
  
  // Verifica se o ano está entre 1900 e ano atual
  const anoAtual = new Date().getFullYear();
  if (ano < 1900 || ano > anoAtual) {
    return false;
  }
  
  // Verifica se mês é válido
  if (mes < 1 || mes > 12) {
    return false;
  }
  
  // Verifica se dia é válido para o mês
  const diasPorMes = [31, (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (dia < 1 || dia > diasPorMes[mes - 1]) {
    return false;
  }
  
  // Verifica se não é data futura
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataInput = new Date(ano, mes - 1, dia);
  if (dataInput > hoje) {
    return false;
  }
  
  return true;
}

// Função para converter DD/MM/AAAA para YYYY-MM-DD (para API)
function converterDataParaISO(data) {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

// Função para converter YYYY-MM-DD para DD/MM/AAAA (para exibição)
function converterDataParaBR(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Adiciona validação em tempo real no campo nome
const campoNome = document.getElementById("nome");
campoNome.addEventListener("input", (e) => {
  document.getElementById("nomeError").classList.add("hidden");
});

// Adiciona formatação automática no campo data
const campoData = document.getElementById("data_nascimento");
campoData.addEventListener("input", (e) => {
  e.target.value = formatarData(e.target.value);
  document.getElementById("dataError").classList.add("hidden");
});

// Implementa busca no dropdown de denúncia
const campoDenunciaBusca = document.getElementById("denunciaBusca");
const selectDenuncia = document.getElementById("denuncia");
const todasOpcoesDenuncia = Array.from(selectDenuncia.options).slice(1); // Remove a primeira opção vazia

campoDenunciaBusca.addEventListener("input", (e) => {
  const termoBusca = e.target.value.toLowerCase();
  
  // Remove todas as opções exceto a primeira
  selectDenuncia.innerHTML = '<option value="">Selecione o tipo de denúncia</option>';
  
  // Filtra e adiciona opções que correspondem à busca
  todasOpcoesDenuncia.forEach(opcao => {
    if (opcao.text.toLowerCase().includes(termoBusca)) {
      selectDenuncia.appendChild(opcao.cloneNode(true));
    }
  });
});

// Quando selecionar no dropdown, atualiza o campo de busca
selectDenuncia.addEventListener("change", (e) => {
  if (e.target.value) {
    campoDenunciaBusca.value = e.target.value;
  }
});

function atualizarListaTemp() {
  const ul = document.getElementById("listaTemp");
  ul.innerHTML = "";

  listaTemp.forEach((c, index) => {
    const li = document.createElement("li");
    li.className = "p-3 bg-gray-100 rounded flex justify-between items-center";

    const dataBR = converterDataParaBR(c.data_nascimento);
    const denunciaResumida = c.denuncia ? c.denuncia.split('(')[0].trim() : 'Sem denúncia';
    li.innerHTML = `
      <span>${c.nome} (nasc: ${dataBR}) - ${denunciaResumida}</span>
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

// Expor ao escopo global para onclick
window.removerTemp = removerTemp;

document.getElementById("btnAdicionar").addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const data = document.getElementById("data_nascimento").value;
  const denuncia = document.getElementById("denuncia").value;

  if (!nome || !data || !denuncia) {
    alert("Preencha todos os campos!");
    return;
  }

  // Valida nome
  if (!validarNome(nome)) {
    document.getElementById("nomeError").classList.remove("hidden");
    campoNome.focus();
    return;
  }

  // Valida data
  if (!validarDataNascimento(data)) {
    document.getElementById("dataError").classList.remove("hidden");
    campoData.focus();
    return;
  }

  listaTemp.push({ nome, data_nascimento: converterDataParaISO(data), denuncia });
  atualizarListaTemp();

  document.getElementById("nome").value = "";
  document.getElementById("data_nascimento").value = "";
  document.getElementById("denuncia").value = "";
  campoDenunciaBusca.value = "";
});

document.getElementById("btnSalvarContinuar").addEventListener("click", async () => {
  if (listaTemp.length === 0) {
    alert("Adicione pelo menos uma criança!");
    return;
  }

  try {
    const criancaIds = [];
    for (const crianca of listaTemp) {
      const resultado = await API.create('criancas', {
        nome: crianca.nome,
        data_nascimento: crianca.data_nascimento,
        endereco_id: fluxo.enderecoId || 1,
        denuncia: crianca.denuncia
      });
      criancaIds.push(resultado.id);
    }

    fluxo.criancaIds = criancaIds;
    localStorage.setItem("cadastroAtual", JSON.stringify(fluxo));

    listaTemp = [];
    atualizarListaTemp();

    window.location.href = "responsaveis.html";
  } catch (error) {
    console.error("Erro ao salvar crianças:", error);
    alert("Erro ao salvar crianças. Tente novamente.");
  }
});





