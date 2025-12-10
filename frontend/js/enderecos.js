import { API } from './api.js';

renderHeader();

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


