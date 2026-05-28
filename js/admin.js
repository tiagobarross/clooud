// Clooud Admin - Gerenciamento Administrativo (CRUD de Produtos e Controle de Pedidos)

document.addEventListener("DOMContentLoaded", () => {
  // Garantir acesso exclusivo para administradores
  if (!Auth.isAdmin()) {
    console.warn("Acesso bloqueado: usuário não é administrador.");
    return; 
  }

  // 1. Carregar Estatísticas Gerais do Dashboard
  const loadDashboardStats = () => {
    const products = Database.getProducts();
    const orders = Database.getOrders();
    const users = Database.getUsers();

    // Faturamento Total (Apenas pedidos Concluídos ou Processando)
    const revenue = orders
      .filter(o => o.status === "Concluído" || o.status === "Processando")
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrdersCount = orders.filter(o => o.status === "Processando" || o.status === "Pendente").length;

    // Atualizar no DOM se os elementos existirem
    const statRevenue = document.getElementById("stat-revenue");
    const statProducts = document.getElementById("stat-products");
    const statOrders = document.getElementById("stat-orders");
    const statUsers = document.getElementById("stat-users");

    if (statRevenue) statRevenue.textContent = revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (statProducts) statProducts.textContent = products.length;
    if (statOrders) statOrders.textContent = pendingOrdersCount;
    if (statUsers) statUsers.textContent = users.length;
  };

  // ==========================================================================
  // SECTION: CRUD DE PRODUTOS
  // ==========================================================================
  const productTableBody = document.getElementById("admin-products-table-body");
  const productModal = document.getElementById("product-modal");
  const productForm = document.getElementById("product-form");
  const btnAddProduct = document.getElementById("btn-add-product");
  const modalCloseBtns = document.querySelectorAll(".modal-close-btn, .btn-close-modal");
  const modalTitle = document.getElementById("modal-title");
  let editingProductId = null;

  // Renderizar Tabela de Produtos
  const renderProductsTable = () => {
    if (!productTableBody) return;

    const products = Database.getProducts();
    productTableBody.innerHTML = products.map(p => {
      const priceVal = p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const discVal = p.discountPrice !== null && p.discountPrice !== undefined ? 
        p.discountPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "-";

      return `
        <tr id="row-${p.id}">
          <td><img src="${p.image}" alt="${p.name}" class="table-img" onerror="this.src='https://placehold.co/40x50/121620/fff?text=Jogo'"></td>
          <td style="font-weight:600; color:var(--text-primary);">${p.name}</td>
          <td><span class="badge badge-${p.category}">${p.category}</span></td>
          <td>${priceVal}</td>
          <td style="color:var(--color-green); font-weight:600;">${discVal}</td>
          <td><i class="fas fa-star" style="color:var(--color-warning);"></i> ${p.rating.toFixed(1)}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-secondary btn-icon edit-product-btn" data-id="${p.id}" title="Editar Produto">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-icon delete-product-btn" data-id="${p.id}" title="Excluir Produto">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Vincular botões de ação do CRUD
    productTableBody.querySelectorAll(".edit-product-btn").forEach(btn => {
      btn.addEventListener("click", () => openEditProductModal(btn.getAttribute("data-id")));
    });

    productTableBody.querySelectorAll(".delete-product-btn").forEach(btn => {
      btn.addEventListener("click", () => deleteProduct(btn.getAttribute("data-id")));
    });
  };

  // Abrir Modal para Criação de Produto
  if (btnAddProduct) {
    btnAddProduct.addEventListener("click", () => {
      editingProductId = null;
      productForm.reset();
      document.getElementById("prod-id").disabled = false; // Permitir definir ID manual
      if (modalTitle) modalTitle.textContent = "Adicionar Novo Produto";
      if (productModal) productModal.classList.add("active");
    });
  }

  // Abrir Modal para Edição de Produto
  const openEditProductModal = (id) => {
    const product = Database.getProductById(id);
    if (!product) return;

    editingProductId = id;
    
    // Preencher campos do formulário
    document.getElementById("prod-id").value = product.id;
    document.getElementById("prod-id").disabled = true; // Impedir alteração de ID único
    document.getElementById("prod-name").value = product.name;
    document.getElementById("prod-description").value = product.description;
    document.getElementById("prod-category").value = product.category;
    document.getElementById("prod-price").value = product.price;
    document.getElementById("prod-discount").value = product.discountPrice || "";
    document.getElementById("prod-image").value = product.image;
    document.getElementById("prod-rating").value = product.rating;
    document.getElementById("prod-featured").checked = product.isFeatured || false;
    document.getElementById("prod-offer").checked = product.isOffer || false;

    if (modalTitle) modalTitle.textContent = "Editar Produto: " + product.name;
    if (productModal) productModal.classList.add("active");
  };

  // Salvar Produto (Create / Update)
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const id = document.getElementById("prod-id").value.trim();
      const name = document.getElementById("prod-name").value.trim();
      const description = document.getElementById("prod-description").value.trim();
      const category = document.getElementById("prod-category").value;
      const price = parseFloat(document.getElementById("prod-price").value);
      const discountVal = document.getElementById("prod-discount").value;
      const discountPrice = discountVal !== "" ? parseFloat(discountVal) : null;
      const image = document.getElementById("prod-image").value.trim() || "https://placehold.co/300x375/121620/fff?text=Clooud+Games";
      const rating = parseFloat(document.getElementById("prod-rating").value) || 5.0;
      const isFeatured = document.getElementById("prod-featured").checked;
      const isOffer = document.getElementById("prod-offer").checked;

      const products = Database.getProducts();

      if (editingProductId) {
        // Atualizar
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
          products[index] = {
            ...products[index],
            name,
            description,
            category,
            price,
            discountPrice,
            image,
            rating,
            isFeatured,
            isOffer
          };
        }
      } else {
        // Validar ID único na criação
        if (products.some(p => p.id === id)) {
          alert("Erro: Já existe um produto cadastrado com este ID único.");
          return;
        }

        // Criar
        products.push({
          id,
          name,
          description,
          category,
          price,
          discountPrice,
          image,
          rating,
          isFeatured,
          isOffer
        });
      }

      Database.saveProducts(products);
      renderProductsTable();
      loadDashboardStats();
      closeModals();
    });
  }

  // Excluir Produto
  const deleteProduct = (id) => {
    if (confirm("Tem certeza de que deseja remover este produto definitivamente do catálogo?")) {
      let products = Database.getProducts();
      products = products.filter(p => p.id !== id);
      Database.saveProducts(products);
      renderProductsTable();
      loadDashboardStats();
    }
  };

  // ==========================================================================
  // SECTION: GERENCIAMENTO DE PEDIDOS
  // ==========================================================================
  const orderTableBody = document.getElementById("admin-orders-table-body");

  // Renderizar Tabela de Pedidos
  const renderOrdersTable = () => {
    if (!orderTableBody) return;

    const orders = Database.getOrders();
    orderTableBody.innerHTML = orders.map(order => {
      const totalVal = order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const orderDate = new Date(order.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Detalhamento simplificado de itens
      const itemsOverview = order.items.map(it => `${it.name} (x${it.quantity})`).join(", ");

      return `
        <tr>
          <td style="font-family:monospace; font-weight:700; color:var(--text-primary);">${order.id}</td>
          <td>
            <div style="font-weight:600; color:var(--text-primary);">${order.userName}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${order.userId}</div>
          </td>
          <td style="font-size:0.85rem;">${orderDate}</td>
          <td style="max-width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${itemsOverview}">
            ${itemsOverview}
          </td>
          <td>${order.paymentMethod}</td>
          <td style="font-weight:700; color:var(--color-accent);">${totalVal}</td>
          <td>
            <select class="form-control order-status-select" data-id="${order.id}" style="padding:6px 12px; font-size:0.85rem; border-radius:50px; width:auto; border-color:var(--border-color);">
              <option value="Pendente" ${order.status === "Pendente" ? "selected" : ""}>Pendente</option>
              <option value="Processando" ${order.status === "Processando" ? "selected" : ""}>Processando</option>
              <option value="Concluído" ${order.status === "Concluído" ? "selected" : ""}>Concluído</option>
              <option value="Cancelado" ${order.status === "Cancelado" ? "selected" : ""}>Cancelado</option>
            </select>
          </td>
        </tr>
      `;
    }).join("");

    // Vincular evento de alteração de status
    orderTableBody.querySelectorAll(".order-status-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const orderId = select.getAttribute("data-id");
        const newStatus = e.target.value;
        updateOrderStatus(orderId, newStatus);
      });
    });
  };

  // Alterar Status do Pedido
  const updateOrderStatus = (orderId, newStatus) => {
    const orders = Database.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = newStatus;
      Database.saveOrders(orders);
      loadDashboardStats(); // Recalcular ganhos
      console.log(`Status do pedido ${orderId} atualizado para: ${newStatus}`);
    }
  };

  // ==========================================================================
  // MODAIS CLOSE LOGIC
  // ==========================================================================
  const closeModals = () => {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
    editingProductId = null;
  };

  modalCloseBtns.forEach(btn => {
    btn.addEventListener("click", closeModals);
  });

  // Fechar clicando no fundo escuro do modal
  document.querySelectorAll(".modal-overlay").forEach(m => {
    m.addEventListener("click", (e) => {
      if (e.target === m) closeModals();
    });
  });

  // Inicializar o Painel Administrativo
  loadDashboardStats();
  renderProductsTable();
  renderOrdersTable();
});
