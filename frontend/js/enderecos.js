import { API } from './api.js';

renderHeader();

// Função para validar CEP
function validarCEP(cep) {
  // Remove hífen e espaços
  const cepLimpo = cep.replace(/\D/g, '');
  
  // Verifica se tem exatamente 8 dígitos
  if (cepLimpo.length !== 8) {
    return false;
  }
  
  // Verifica se não é sequência inválida como 00000000
  if (/^0+$/.test(cepLimpo)) {
    return false;
  }
  
  return true;
}

// Função para formatar CEP automaticamente
function formatarCEP(value) {
  // Remove tudo que não é número
  let limpo = value.replace(/\D/g, '');
  
  // Limita a 8 dígitos
  limpo = limpo.substring(0, 8);
  
  // Adiciona hífen após 5 dígitos
  if (limpo.length > 5) {
    limpo = limpo.substring(0, 5) + '-' + limpo.substring(5);
  }
  
  return limpo;
}

// Adiciona máscara automática no campo CEP
const campoCep = document.getElementById("cep");
campoCep.addEventListener("input", (e) => {
  e.target.value = formatarCEP(e.target.value);
  
  // Remove mensagem de erro enquanto digita
  document.getElementById("cepError").classList.add("hidden");
});

document.getElementById("formEndereco").addEventListener("submit", async (e) => {
  e.preventDefault();

  const cep = document.getElementById("cep").value.trim();
  const rua = document.getElementById("rua").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const estado = document.getElementById("estado").value.trim();

  if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
    alert("Preencha todos os campos!");
    return;
  }

  // Valida CEP
  if (!validarCEP(cep)) {
    document.getElementById("cepError").classList.remove("hidden");
    campoCep.focus();
    return;
  }

  try {
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Salvando...";

    const resultado = await API.create('enderecos', {
      cep, rua, numero, bairro, cidade, estado
    });

    console.log("Endereço salvo com sucesso:", resultado);

    localStorage.setItem("cadastroAtual", JSON.stringify({
      enderecoId: resultado.id,
      criancaIds: []
    }));

    console.log("Redirecionando para criancas.html...");
    window.location.href = "criancas.html";
  } catch (error) {
    console.error("Erro ao salvar endereço:", error);
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    alert("Erro ao salvar endereço. Tente novamente. Verifique o console para detalhes.");
  }
});


