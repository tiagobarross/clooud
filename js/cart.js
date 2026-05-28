// Clooud Cart - Módulo de Gerenciamento do Carrinho de Compras e Finalização de Pedido

const Cart = {
  // Adiciona um produto ao carrinho
  add(productId, quantity = 1) {
    const cart = Database.getCart();
    const product = Database.getProductById(productId);

    if (!product) {
      console.error("Produto não encontrado para adicionar ao carrinho.");
      return;
    }

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: productId,
        quantity: quantity
      });
    }

    Database.saveCart(cart);
    this.updateBadge();
    
    // Feedback visual para o usuário
    this.showToast(`${product.name} adicionado ao carrinho!`);
  },

  // Remove um produto do carrinho
  remove(productId) {
    let cart = Database.getCart();
    cart = cart.filter(item => item.productId !== productId);
    Database.saveCart(cart);
    this.updateBadge();
  },

  // Altera a quantidade de um produto
  updateQuantity(productId, quantity) {
    const cart = Database.getCart();
    const item = cart.find(item => item.productId === productId);

    if (item) {
      item.quantity = parseInt(quantity);
      if (item.quantity <= 0) {
        this.remove(productId);
        return;
      }
      Database.saveCart(cart);
      this.updateBadge();
    }
  },

  // Limpa o carrinho
  clear() {
    Database.saveCart([]);
    this.updateBadge();
  },

  // Retorna a contagem total de itens no carrinho
  getCount() {
    const cart = Database.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Retorna os detalhes completos dos itens no carrinho (junta com info de produtos)
  getDetails() {
    const cart = Database.getCart();
    const products = Database.getProducts();
    
    let subtotal = 0;
    let total = 0;

    const items = cart.map(cartItem => {
      const prod = products.find(p => p.id === cartItem.productId);
      if (!prod) return null;

      const priceUnit = prod.discountPrice !== null && prod.discountPrice !== undefined ? prod.discountPrice : prod.price;
      const originalPriceUnit = prod.price;
      const totalItem = priceUnit * cartItem.quantity;
      const originalTotalItem = originalPriceUnit * cartItem.quantity;

      subtotal += originalTotalItem;
      total += totalItem;

      return {
        ...prod,
        quantity: cartItem.quantity,
        priceUnit: priceUnit,
        totalItem: totalItem
      };
    }).filter(item => item !== null);

    const discount = subtotal - total;

    return {
      items: items,
      subtotal: subtotal,
      discount: discount,
      total: total
    };
  },

  // Atualiza o contador visual do carrinho no cabeçalho
  updateBadge() {
    const badge = document.querySelector(".cart-badge");
    if (badge) {
      const count = this.getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  },

  // Finaliza a compra criando um pedido
  checkout(paymentMethod) {
    const session = Auth.getCurrentUser();
    if (!session) {
      return { success: false, message: "Você precisa fazer login para finalizar a compra." };
    }

    const details = this.getDetails();
    if (details.items.length === 0) {
      return { success: false, message: "O seu carrinho está vazio." };
    }

    const orders = Database.getOrders();
    const orderItems = details.items.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.priceUnit
    }));

    const newOrder = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      userId: session.id,
      userName: session.name,
      items: orderItems,
      total: details.total,
      paymentMethod: paymentMethod,
      status: "Processando",
      date: new Date().toISOString()
    };

    orders.unshift(newOrder); // Adicionar no topo
    Database.saveOrders(orders);
    
    // Limpar carrinho
    this.clear();

    return { success: true, order: newOrder };
  },

  // Cria e exibe um Toast temporário para feedback de ação do carrinho
  showToast(message) {
    // Remover toast anterior se existir
    const oldToast = document.querySelector(".cart-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.innerHTML = `<i class="fas fa-shopping-cart" style="color: var(--color-accent);"></i> <span>${message}</span>`;
    
    // Estilos do toast
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      backgroundColor: "var(--bg-secondary)",
      color: "var(--text-primary)",
      padding: "16px 24px",
      borderRadius: "var(--border-radius-md)",
      border: "1px solid var(--color-accent)",
      boxShadow: "var(--shadow-lg), var(--shadow-glow)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      zIndex: "9999",
      fontFamily: "var(--font-family-body)",
      fontSize: "0.9rem",
      fontWeight: "600",
      animation: "slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
    });

    // Inserir animação no documento dinamicamente se não houver
    if (!document.getElementById("toast-animation")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "toast-animation";
      styleSheet.innerText = `
        @keyframes slideInUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateY(20px); }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    document.body.appendChild(toast);

    // Remover após 3 segundos com animação
    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Sincronizar badge ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  Cart.updateBadge();
});

window.Cart = Cart; // Exportar globalmente
