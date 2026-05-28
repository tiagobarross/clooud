// Clooud Catalog - Lógica para renderização de produtos, filtros e buscas no catálogo

document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.querySelector(".products-grid");
  if (!gridContainer) return;

  // 1. Identificar o tipo de filtro padrão pela URL ou pelo nome do arquivo HTML atual
  const path = window.location.pathname;
  let activePlatform = null;
  let onlyOffers = false;

  if (path.includes("playstation.html")) activePlatform = "playstation";
  else if (path.includes("xbox.html")) activePlatform = "xbox";
  else if (path.includes("nintendo.html")) activePlatform = "nintendo";
  else if (path.includes("pc.html")) activePlatform = "pc";
  else if (path.includes("mobile.html")) activePlatform = "mobile";
  else if (path.includes("gift-cards.html")) activePlatform = "giftcard";
  else if (path.includes("offers.html")) onlyOffers = true;

  // 2. Elementos de Filtros e Busca adicionais (se existirem na página catalog.html)
  const sortSelect = document.getElementById("sort-select");
  const filterForm = document.getElementById("catalog-filters-form");
  const searchParams = new URLSearchParams(window.location.search);
  let searchQuery = searchParams.get("search") || "";

  // Se houver caixa de busca na página de catálogo, preenchê-la
  const catalogSearchInput = document.getElementById("catalog-search");
  if (catalogSearchInput && searchQuery) {
    catalogSearchInput.value = searchQuery;
  }

  // 3. Função Principal de Renderização dos Cards
  const renderCatalog = () => {
    let list = Database.getProducts();

    // Filtro por plataforma do arquivo HTML correspondente
    if (activePlatform) {
      list = list.filter(p => p.category === activePlatform);
    }

    // Filtro por Ofertas
    if (onlyOffers) {
      list = list.filter(p => p.isOffer === true);
    }

    // Filtro por termo de busca (da URL ou do input do catálogo)
    const currentSearch = catalogSearchInput ? catalogSearchInput.value.toLowerCase().trim() : searchQuery.toLowerCase().trim();
    if (currentSearch) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(currentSearch) ||
        p.description.toLowerCase().includes(currentSearch) ||
        p.category.toLowerCase().includes(currentSearch)
      );
    }

    // Filtros avançados do formulário lateral (somente em catalog.html)
    if (filterForm) {
      const selectedCategories = Array.from(filterForm.querySelectorAll("input[name='category']:checked")).map(el => el.value);
      const minPrice = parseFloat(filterForm.querySelector("#price-min").value) || 0;
      const maxPrice = parseFloat(filterForm.querySelector("#price-max").value) || 999999;

      if (selectedCategories.length > 0) {
        list = list.filter(p => selectedCategories.includes(p.category));
      }
      
      list = list.filter(p => {
        const finalPrice = p.discountPrice !== null && p.discountPrice !== undefined ? p.discountPrice : p.price;
        return finalPrice >= minPrice && finalPrice <= maxPrice;
      });
    }

    // Ordenação
    if (sortSelect) {
      const order = sortSelect.value;
      if (order === "price-asc") {
        list.sort((a, b) => {
          const pA = a.discountPrice !== null && a.discountPrice !== undefined ? a.discountPrice : a.price;
          const pB = b.discountPrice !== null && b.discountPrice !== undefined ? b.discountPrice : b.price;
          return pA - pB;
        });
      } else if (order === "price-desc") {
        list.sort((a, b) => {
          const pA = a.discountPrice !== null && a.discountPrice !== undefined ? a.discountPrice : a.price;
          const pB = b.discountPrice !== null && b.discountPrice !== undefined ? b.discountPrice : b.price;
          return pB - pA;
        });
      } else if (order === "rating-desc") {
        list.sort((a, b) => b.rating - a.rating);
      } else {
        // Padrão: Destaques primeiro
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      }
    }

    // Gerar o HTML
    if (list.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
          <i class="fas fa-gamepad" style="font-size: 3rem; margin-bottom: 20px; color: var(--text-muted);"></i>
          <h3>Nenhum produto encontrado</h3>
          <p style="margin-top: 8px; color: var(--text-muted);">Tente alterar seus filtros ou termo de busca.</p>
        </div>
      `;
      return;
    }

    // Determinar prefixo de links para as páginas internas
    const isAtRoot = !window.location.pathname.includes("/pages/");
    const pathPrefix = isAtRoot ? "pages/" : "";

    gridContainer.innerHTML = list.map(product => {
      const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
      const originalPrice = product.price;
      const finalPrice = hasDiscount ? product.discountPrice : product.price;
      
      const formattedOriginalPrice = originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const formattedFinalPrice = finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      // Cálculo da porcentagem de desconto
      let discountPctHtml = "";
      if (hasDiscount) {
        const pct = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
        discountPctHtml = `<span class="discount-badge">-${pct}%</span>`;
      }

      // Detalhe URL
      const detailUrl = `${pathPrefix}product-detail.html?id=${product.id}`;

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-card-img-wrapper">
            ${discountPctHtml}
            <span class="platform-badge-overlay">${product.category}</span>
            <a href="${detailUrl}">
              <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy">
            </a>
          </div>
          <div class="product-card-body">
            <span class="product-card-category">${product.category}</span>
            <h3 class="product-card-title">
              <a href="${detailUrl}">${product.name}</a>
            </h3>
            
            <div style="display: flex; align-items: center; gap: 4px; color: var(--color-warning); font-size: 0.8rem;">
              <i class="fas fa-star"></i>
              <span style="font-weight: 700; color: var(--text-primary);">${product.rating.toFixed(1)}</span>
            </div>

            <div class="product-card-price-container">
              <span class="price-original">${hasDiscount ? formattedOriginalPrice : ""}</span>
              <span class="price-current ${hasDiscount ? 'has-discount' : ''}">
                ${formattedFinalPrice}
              </span>
            </div>
            
            <button class="product-card-btn add-to-cart-btn" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i> Adicionar
            </button>
          </div>
        </article>
      `;
    }).join("");

    // Adicionar eventos para botões de adicionar ao carrinho
    const addBtns = gridContainer.querySelectorAll(".add-to-cart-btn");
    addBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        Cart.add(id);
      });
    });
  };

  // 4. Ouvintes de Eventos para Filtros de Tela de Catálogo
  if (sortSelect) {
    sortSelect.addEventListener("change", renderCatalog);
  }

  if (catalogSearchInput) {
    catalogSearchInput.addEventListener("input", renderCatalog);
  }

  if (filterForm) {
    // Escutar eventos de alteração e inputs nos filtros do painel lateral
    filterForm.querySelectorAll("input").forEach(input => {
      input.addEventListener("change", renderCatalog);
      input.addEventListener("input", renderCatalog);
    });

    // Resetar filtros
    const resetBtn = document.getElementById("btn-reset-filters");
    if (resetBtn) {
      resetBtn.addEventListener("click", (e) => {
        e.preventDefault();
        filterForm.reset();
        renderCatalog();
      });
    }
  }

  // Inicializar o catálogo
  renderCatalog();
});
