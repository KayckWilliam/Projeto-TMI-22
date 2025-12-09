renderHeader();

const formResp = document.getElementById("formResp");
const vinculosBox = document.getElementById("vinculosBox");

function gerarIdResp() {
  let lista = JSON.parse(localStorage.getItem("responsaveis") || "[]");
  return lista.length + 1;
}


const fluxo = JSON.parse(localStorage.getItem("cadastroAtual") || "{}");

vinculosBox.innerText = `Endereço vinculado: ${fluxo.enderecoId ? "Sim" : "-"} | Número de crianças: ${fluxo.criancaIds?.length || 0}`;

formResp.addEventListener("submit", (e) => {
  e.preventDefault();

  let lista = JSON.parse(localStorage.getItem("responsaveis") || "[]");

  const novo = Object.fromEntries(new FormData(e.target));

  novo.id = gerarIdResp();
  novo.enderecoId = fluxo.enderecoId;
  novo.criancaIds = fluxo.criancaIds || [];

  lista.push(novo);
  localStorage.setItem("responsaveis", JSON.stringify(lista));

  localStorage.removeItem("cadastroAtual");

  alert("Responsável cadastrado com sucesso!");
  window.location.href = "index.html";
});


