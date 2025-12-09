renderHeader();

let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios"));
if (!usuariosRegistrados) {
  localStorage.setItem("usuarios", JSON.stringify([
    { nome: "helmer", senha: "123456", nivel: "admin" }
  ]));
}

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
  alert("Você precisa estar logado para acessar esta página.");
  window.location.href = "index.html";
}

const conteudo = document.getElementById("conteudo");

if (usuarioLogado.nivel !== "admin") {
  conteudo.innerHTML = `
    <div class="p-4 bg-red-200 rounded-xl text-red-800 mb-4">
      ❌ Acesso negado! Apenas administradores podem acessar esta página.
    </div>
    <a href="index.html" 
       class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
      Voltar
    </a>
  `;
} else {
  carregarTelaAdmin();
}

function carregarTelaAdmin() {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  conteudo.innerHTML = `
    <h2 class="text-2xl font-semibold mb-4">Usuários Cadastrados</h2>

    <table class="w-full bg-white shadow rounded-xl overflow-hidden mb-6">
      <thead class="bg-gray-200 text-gray-700">
        <tr>
          <th class="p-3 text-left">Nome</th>
          <th class="p-3 text-left">Nível</th>
          <th class="p-3 text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        ${usuarios.map((u, index) => `
          <tr class="border-b">
            <td class="p-3">${u.nome}</td>
            <td class="p-3 capitalize">${u.nivel}</td>
            <td class="p-3 text-center flex gap-2 justify-center">
              <button onclick="alterarNivel(${index})"
                class="px-3 py-1 bg-yellow-400 rounded">
                Alterar Nível
              </button>
              <button onclick="removerUsuario(${index})"
                class="px-3 py-1 bg-red-500 text-white rounded">
                Excluir
              </button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <button onclick="adicionarUsuario()" 
      class="px-4 py-2 bg-green-600 text-white rounded-lg shadow">
      ➕ Novo Usuário
    </button>

    <br><br>

    <a href="index.html" 
       class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
      Voltar
    </a>
  `;
}

function adicionarUsuario() {
  let nome = prompt("Nome do usuário:");
  if (!nome) return;

  let senha = prompt("Digite a senha:");
  if (!senha || senha.trim() === "") {
    alert("A senha não pode ser vazia!");
    return;
  }

  let nivel = prompt("Nível (admin / tecnico):").toLowerCase();
  if (nivel !== "admin" && nivel !== "tecnico") {
    alert("Nível inválido!");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.push({ nome, senha, nivel });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  carregarTelaAdmin();
}

function removerUsuario(index) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (!confirm(`Deseja remover o usuário ${usuarios[index].nome}?`)) return;

  usuarios.splice(index, 1);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  carregarTelaAdmin();
}

function alterarNivel(index) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios[index].nivel = usuarios[index].nivel === "admin" ? "tecnico" : "admin";
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  carregarTelaAdmin();
}
