renderHeader();

function gerarIdEndereco() {
  const lista = JSON.parse(localStorage.getItem("enderecos") || "[]");
  return lista.length + 1;
}

document.getElementById("formEndereco").addEventListener("submit", (e) => {
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

  const lista = JSON.parse(localStorage.getItem("enderecos") || "[]");
  const novoId = gerarIdEndereco();

  const endereco = { id: novoId, cep, rua, numero, bairro, cidade, estado };
  lista.push(endereco);
  localStorage.setItem("enderecos", JSON.stringify(lista));

  localStorage.setItem("cadastroAtual", JSON.stringify({
    enderecoId: novoId,
    criancaIds: []
  }));

  window.location.href = "criancas.html";
});


