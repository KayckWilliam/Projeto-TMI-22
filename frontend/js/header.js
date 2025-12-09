function renderHeader() {
  const container = document.createElement("div");
  container.innerHTML = `
    <header class="bg-white shadow mb-8">
      <div class="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">

        <!-- Título clicável -->
        <h1 onclick="window.location.href='index.html'"
            class="text-2xl font-bold text-blue-600 cursor-pointer hover:opacity-80">
          SISTEMA DE CADASTRO
        </h1>

        <!-- Área do usuário -->
        <div id="headerUserArea"></div>
      </div>
    </header>

    <!-- MODAL DE LOGIN -->
    <div id="headerLoginModal" 
         class="hidden fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-8 rounded-xl shadow-xl w-96">

        <h2 class="text-xl font-bold mb-4 text-center">Login</h2>

        <label class="font-medium">Usuário</label>
        <input id="headerLoginUser" class="w-full p-2 border rounded mb-4">

        <label class="font-medium">Senha</label>
        <input id="headerLoginPass" type="password" class="w-full p-2 border rounded mb-6">

        <div class="flex justify-between">
          <button onclick="headerFazerLogin()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Entrar
          </button>

          <button onclick="headerFecharLogin()"
            class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.prepend(container);

  headerAtualizarUI();
}




function headerAtualizarUI() {
  const area = document.getElementById("headerUserArea");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!area) return;

  if (!usuario) {
    area.innerHTML = `
      <button onclick="headerAbrirLogin()"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Login
      </button>
    `;
    return;
  }

  area.innerHTML = `
    <div class="flex items-center gap-4">
      <span class="text-gray-700 font-semibold">
        Olá, ${usuario.user} (${usuario.nivel})
      </span>

      <button onclick="headerLogout()"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
        Logout
      </button>
    </div>
  `;
}




function headerAbrirLogin() {
  document.getElementById("headerLoginModal").classList.remove("hidden");
}

function headerFecharLogin() {
  document.getElementById("headerLoginModal").classList.add("hidden");
}




function headerFazerLogin() {
  const user = document.getElementById("headerLoginUser").value;
  const senha = document.getElementById("headerLoginPass").value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  const encontrado = usuarios.find(u => u.user === user && u.senha === senha);

  if (!encontrado) {
    alert("Usuário ou senha inválidos");
    return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(encontrado));

  headerFecharLogin();
  headerAtualizarUI();
}




function headerLogout() {
  localStorage.removeItem("usuarioLogado");
  headerAtualizarUI();
}




(function inicializarUsuarios() {
  let users = JSON.parse(localStorage.getItem("usuarios") || "[]");

  if (!users.some(u => u.user === "helmer")) {
    users.push({
      user: "helmer",
      senha: "123456",
      nivel: "admin"
    });
    localStorage.setItem("usuarios", JSON.stringify(users));
  }
})();
