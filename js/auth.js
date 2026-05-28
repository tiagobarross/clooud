// Clooud Authentication - Módulo de login, cadastro e controle de acesso

const Auth = {
  // Realiza o login do usuário
  login(email, password) {
    const users = Database.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      return { success: false, message: "E-mail não cadastrado." };
    }

    if (user.password !== password) {
      return { success: false, message: "Senha incorreta." };
    }

    // Salvar sessão do usuário logado
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    Database.saveSession(sessionUser);
    
    // Sincronizar carrinho se houver algo local
    console.log(`Usuário ${user.name} logado com sucesso.`);
    return { success: true, user: sessionUser };
  },

  // Realiza o cadastro de um novo cliente
  register(name, email, password) {
    const users = Database.getUsers();
    
    // Validar se o e-mail já existe
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (emailExists) {
      return { success: false, message: "Este e-mail já está cadastrado no sistema." };
    }

    // Criar novo usuário
    const newUser = {
      id: "usr-" + Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: "client" // Todos os novos cadastros são clientes padrão
    };

    users.push(newUser);
    Database.saveUsers(users);

    return { success: true, message: "Cadastro realizado com sucesso!" };
  },

  // Realiza o logout
  logout() {
    Database.saveSession(null);
    // Redireciona para a home
    const isInsidePages = window.location.pathname.includes('/pages/');
    window.location.href = isInsidePages ? 'home.html' : 'pages/home.html';
  },

  // Retorna os dados do usuário atualmente logado
  getCurrentUser() {
    return Database.getSession();
  },

  // Verifica se o usuário está autenticado
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // Verifica se o usuário atual é administrador
  isAdmin() {
    const user = this.getCurrentUser();
    return user !== null && user.role === "admin";
  },

  // Proteção de rotas das páginas
  checkPageAccess() {
    const user = this.getCurrentUser();
    const path = window.location.pathname;

    // Se estiver na tela de administração e não for administrador
    if (path.includes("admin.html")) {
      if (!user || user.role !== "admin") {
        alert("Acesso negado. Esta área é restrita a administradores.");
        // Redireciona para a home
        window.location.href = path.includes('/pages/') ? 'home.html' : 'pages/home.html';
      }
    }

    // Se já estiver logado e tentar ir para login ou cadastro
    if (path.includes("login.html") || path.includes("register.html")) {
      if (user) {
        window.location.href = "home.html";
      }
    }
  }
};

// Executar proteção de página imediatamente ao carregar o script
document.addEventListener("DOMContentLoaded", () => {
  Auth.checkPageAccess();
});

window.Auth = Auth; // Exportar globalmente
