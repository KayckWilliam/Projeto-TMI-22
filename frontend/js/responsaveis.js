import { API } from './api.js';

renderHeader();

const formResp = document.getElementById("formResp");
const vinculosBox = document.getElementById("vinculosBox");

const fluxo = JSON.parse(localStorage.getItem("cadastroAtual") || "{}");

vinculosBox.innerText = `Endereço vinculado: ${fluxo.enderecoId ? "Sim" : "-"} | Número de crianças: ${fluxo.criancaIds?.length || 0}`;

// ===== VALIDAÇÃO NOME =====
function validarNome(nome) {
  if (/\d/.test(nome)) {
    return false;
  }
  return true;
}

const campoNome = document.getElementById("nome");
campoNome.addEventListener("input", () => {
  document.getElementById("nomeError").classList.add("hidden");
});

// ===== VALIDAÇÃO DATA =====
function formatarData(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length >= 2) {
    valor = valor.substring(0, 2) + '/' + valor.substring(2);
  }
  if (valor.length >= 5) {
    valor = valor.substring(0, 5) + '/' + valor.substring(5, 9);
  }
  return valor;
}

function validarDataNascimento(data) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    return false;
  }
  
  const [dia, mes, ano] = data.split('/').map(Number);
  
  const anoAtual = new Date().getFullYear();
  if (ano < 1900 || ano > anoAtual) {
    return false;
  }
  
  if (mes < 1 || mes > 12) {
    return false;
  }
  
  const diasPorMes = [31, (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (dia < 1 || dia > diasPorMes[mes - 1]) {
    return false;
  }
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataInput = new Date(ano, mes - 1, dia);
  if (dataInput > hoje) {
    return false;
  }
  
  return true;
}

function converterDataParaISO(data) {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

const campoData = document.getElementById("data_nascimento");
campoData.addEventListener("input", (e) => {
  e.target.value = formatarData(e.target.value);
  document.getElementById("dataError").classList.add("hidden");
});

// ===== VALIDAÇÃO CPF =====
function formatarCPF(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return valor;
}

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }
  
  // Verifica se contém apenas números
  if (!/^\d{11}$/.test(cpf)) {
    return false;
  }
  
  return true;
}

const campoCPF = document.getElementById("cpf");
campoCPF.addEventListener("input", (e) => {
  e.target.value = formatarCPF(e.target.value);
  document.getElementById("cpfError").classList.add("hidden");
});

// ===== VALIDAÇÃO RG =====
function formatarRG(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length > 8) {
    valor = valor.substring(0, 8) + '-' + valor.substring(8, 9);
  }
  return valor;
}

function validarRG(rg) {
  const apenasNumeros = rg.replace(/\D/g, '');
  return /^\d{8,9}$/.test(apenasNumeros);
}

const campoRG = document.getElementById("rg");
campoRG.addEventListener("input", (e) => {
  e.target.value = formatarRG(e.target.value);
  document.getElementById("rgError").classList.add("hidden");
});

// ===== VALIDAÇÃO TELEFONE =====
function formatarTelefone(valor) {
  valor = valor.replace(/\D/g, '');
  
  if (valor.length <= 11) {
    // Formato: (XX) 9XXXX-XXXX
    valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
  }
  
  return valor;
}

function validarTelefone(telefone) {
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  // Aceita 11 dígitos (com DDD) ou 9 dígitos (sem DDD)
  if (apenasNumeros.length === 11) {
    // Com DDD: deve começar com DDD válido e o terceiro dígito deve ser 9
    const ddd = parseInt(apenasNumeros.substring(0, 2));
    const terceiroDigito = apenasNumeros[2];
    
    // DDDs válidos do Brasil (11-99)
    if (ddd < 11 || ddd > 99) {
      return false;
    }
    
    // Terceiro dígito deve ser 9 para celular
    if (terceiroDigito !== '9') {
      return false;
    }
    
    return true;
  } else if (apenasNumeros.length === 9) {
    // Sem DDD: primeiro dígito deve ser 9
    return apenasNumeros[0] === '9';
  }
  
  return false;
}

const campoTelefone = document.getElementById("telefone");
campoTelefone.addEventListener("input", (e) => {
  e.target.value = formatarTelefone(e.target.value);
  document.getElementById("telefoneError").classList.add("hidden");
});

// ===== SUBMIT FORM =====
formResp.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = Object.fromEntries(new FormData(e.target));
  
  // Validar nome
  if (!validarNome(dados.nome)) {
    document.getElementById("nomeError").classList.remove("hidden");
    campoNome.focus();
    return;
  }
  
  // Validar data
  if (!validarDataNascimento(dados.data_nascimento)) {
    document.getElementById("dataError").classList.remove("hidden");
    campoData.focus();
    return;
  }
  
  // Validar CPF
  if (!validarCPF(dados.cpf)) {
    document.getElementById("cpfError").classList.remove("hidden");
    campoCPF.focus();
    return;
  }
  
  // Validar RG
  if (!validarRG(dados.rg)) {
    document.getElementById("rgError").classList.remove("hidden");
    campoRG.focus();
    return;
  }
  
  // Validar telefone
  if (!validarTelefone(dados.telefone)) {
    document.getElementById("telefoneError").classList.remove("hidden");
    campoTelefone.focus();
    return;
  }

  try {
    await API.create('filiacao', {
      nome: dados.nome,
      cpf: dados.cpf.replace(/\D/g, ''),
      rg: dados.rg.replace(/\D/g, ''),
      telefone: dados.telefone.replace(/\D/g, ''),
      filiacao: dados.filiacao,
      crianca_id: fluxo.criancaIds?.[0] || 1
    });

    localStorage.removeItem("cadastroAtual");
    alert("Responsável cadastrado com sucesso!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Erro ao salvar responsável:", error);
    alert("Erro ao salvar responsável. Tente novamente.");
  }
});


