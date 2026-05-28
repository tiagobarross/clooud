// Clooud Main - Script compartilhado responsável pelo Header, Sidebar e Busca Global

document.addEventListener("DOMContentLoaded", () => {
  // 1. Determinar o prefixo de caminho baseado na pasta atual
  // index.html está na raiz, outras páginas estão em /pages/
  const isAtRoot = !window.location.pathname.includes("/pages/");
  const pathPrefix = isAtRoot ? "pages/" : "";
  const rootPrefix = isAtRoot ? "" : "../";

  // 2. Elementos de UI Compartilhados
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.querySelector(".toggle-sidebar-btn");
  const searchInput = document.querySelector(".search-input");
  const searchDropdown = document.querySelector(".search-results-dropdown");
  const headerActions = document.querySelector(".header-actions");
  
  // 3. Controle da Sidebar Responsiva (Mobile)
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("active");
    });

    // Fechar sidebar ao clicar fora em telas mobile
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
          sidebar.classList.remove("active");
        }
      }
    });
  }

  // Marcar item ativo no menu da Sidebar
  const activeMenuItem = () => {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll(".menu-item-link");
    
    menuLinks.forEach(link => {
      const href = link.getAttribute("href");
      const li = link.closest(".menu-item");
      
      if (!li) return;
      
      // Remover classe ativa anterior
      li.classList.remove("active");
      
      // Comparar caminhos
      if (currentPath.endsWith(href) || (isAtRoot && href === "pages/home.html" && currentPath.endsWith("index.html"))) {
        li.classList.add("active");
      }
    });
  };
  activeMenuItem();

  // 4. Mecanismo de Busca Global Dinâmica
  if (searchInput && searchDropdown) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      
      if (query.length < 2) {
        searchDropdown.style.display = "none";
        searchDropdown.innerHTML = "";
        return;
      }

      const products = Database.getProducts();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      ).slice(0, 5); // Limitar a 5 resultados para o dropdown

      if (filtered.length === 0) {
        searchDropdown.innerHTML = `
          <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
            Nenhum produto encontrado.
          </div>
        `;
      } else {
        searchDropdown.innerHTML = filtered.map(p => {
          const finalPrice = p.discountPrice !== null && p.discountPrice !== undefined ? p.discountPrice : p.price;
          const formattedPrice = finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          const detailUrl = `${pathPrefix}product-detail.html?id=${p.id}`;
          
          return `
            <a href="${detailUrl}" class="search-result-item">
              <img src="${p.image}" alt="${p.name}" class="search-result-img">
              <div class="search-result-info">
                <span class="search-result-name">${p.name}</span>
                <span class="search-result-category">${p.category}</span>
              </div>
              <span class="search-result-price">${formattedPrice}</span>
            </a>
          `;
        }).join("");
      }
      searchDropdown.style.display = "flex";
    });

    // Submeter busca ao pressionar Enter
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `${pathPrefix}catalog.html?search=${encodeURIComponent(query)}`;
        }
      }
    });

    // Ocultar dropdown de busca ao clicar fora
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.style.display = "none";
      }
    });
  }

  // 5. Atualizar Estado de Autenticação no Cabeçalho e Sidebar
  const renderUserAuthNavbar = () => {
    const user = Auth.getCurrentUser();
    
    // Atualizar Widget de Perfil da Sidebar (Seção inferior)
    const userProfileWidget = document.querySelector(".user-profile-widget");
    if (userProfileWidget) {
      if (user) {
        const initials = user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
        userProfileWidget.innerHTML = `
          <div class="user-avatar">${initials}</div>
          <div class="user-info">
            <span class="user-name">${user.name}</span>
            <span class="user-role">${user.role === 'admin' ? 'Admin' : 'Cliente'}</span>
          </div>
        `;
        // Adicionar clique para ir ao admin (se for admin) ou perfil
        userProfileWidget.style.cursor = "pointer";
        userProfileWidget.addEventListener("click", () => {
          if (user.role === 'admin') {
            window.location.href = `${pathPrefix}admin.html`;
          } else {
            // Clientes podem ir ao carrinho ou ver histórico
            window.location.href = `${pathPrefix}cart.html`;
          }
        });
      } else {
        userProfileWidget.innerHTML = `
          <div class="user-avatar"><i class="fas fa-user-circle"></i></div>
          <div class="user-info">
            <span class="user-name">Convidado</span>
            <span class="user-role">Fazer Login</span>
          </div>
        `;
        userProfileWidget.style.cursor = "pointer";
        userProfileWidget.addEventListener("click", () => {
          window.location.href = `${pathPrefix}login.html`;
        });
      }
    }

    // Atualizar Ações do Header (Carrinho e Botões de Login)
    if (headerActions) {
      const cartHtml = `
        <a href="${pathPrefix}cart.html" class="cart-icon-btn" title="Ver Carrinho">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-badge" style="display: none;">0</span>
        </a>
      `;

      if (user) {
        let adminBtn = "";
        if (user.role === "admin") {
          // Se estiver na página admin, mostrar botão para ir à home, senão mostrar Painel Admin
          const isInsideAdmin = window.location.pathname.includes("admin.html");
          if (isInsideAdmin) {
            adminBtn = `<button class="header-btn header-btn-login" onclick="window.location.href='home.html'"><i class="fas fa-home"></i> Loja</button>`;
          } else {
            adminBtn = `<button class="header-btn header-btn-login" onclick="window.location.href='${pathPrefix}admin.html'"><i class="fas fa-cog"></i> Painel Admin</button>`;
          }
        }

        headerActions.innerHTML = `
          ${cartHtml}
          ${adminBtn}
          <button class="header-btn header-btn-logout" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Sair</button>
        `;

        document.getElementById("logout-btn").addEventListener("click", () => {
          Auth.logout();
        });
      } else {
        headerActions.innerHTML = `
          ${cartHtml}
          <button class="header-btn header-btn-login" onclick="window.location.href='${pathPrefix}login.html'">Entrar</button>
          <button class="header-btn header-btn-register" onclick="window.location.href='${pathPrefix}register.html'">Cadastrar</button>
        `;
      }
      
      // Sincronizar badge imediatamente
      if (window.Cart) {
        window.Cart.updateBadge();
      }
    }
  };

  renderUserAuthNavbar();
});
