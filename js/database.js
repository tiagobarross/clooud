// Clooud Database - Simulação de Banco de Dados com LocalStorage

const MOCK_PRODUCTS = [
  // PLAYSTATION
  {
    id: "ps-gow-ragnarok",
    name: "God of War Ragnarök",
    description: "Embarque em uma jornada épica e emocionante com Kratos e Atreus na luta contra as forças de Asgard conforme o Ragnarök se aproxima.",
    price: 349.90,
    discountPrice: 249.90,
    category: "playstation",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop", // Ilustrativo gamer
    rating: 4.9,
    isFeatured: true,
    isOffer: true
  },
  {
    id: "ps-ghost-tsushima",
    name: "Ghost of Tsushima Director's Cut",
    description: "No final do século XIII, o império mongol assolou nações inteiras em sua campanha para conquistar o Oriente. Jin Sakai deve se tornar o Fantasma para libertar sua terra.",
    price: 299.90,
    discountPrice: 199.90,
    category: "playstation",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    isFeatured: true,
    isOffer: true
  },
  {
    id: "ps-spiderman-2",
    name: "Marvel's Spider-Man 2",
    description: "Os Spider-Men Peter Parker e Miles Morales enfrentam o teste definitivo de força dentro e fora da máscara enquanto lutam para salvar a cidade.",
    price: 349.90,
    discountPrice: null,
    category: "playstation",
    image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    isFeatured: true,
    isOffer: false
  },

  // XBOX
  {
    id: "xbox-forza-5",
    name: "Forza Horizon 5",
    description: "Sua aventura Horizon definitiva está esperando! Explore as paisagens de mundo aberto vibrantes e em constante evolução do México com ação de condução ilimitada.",
    price: 249.90,
    discountPrice: 149.90,
    category: "xbox",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    isFeatured: true,
    isOffer: true
  },
  {
    id: "xbox-halo-infinite",
    name: "Halo Infinite",
    description: "A lendária série de tiro em primeira pessoa retorna com a maior campanha do Master Chief até hoje e uma experiência multijogador gratuita revolucionária.",
    price: 249.90,
    discountPrice: 99.90,
    category: "xbox",
    image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
    isFeatured: false,
    isOffer: true
  },
  {
    id: "xbox-starfield",
    name: "Starfield",
    description: "Neste RPG de próxima geração ambientado entre as estrelas, crie o personagem que quiser e explore com liberdade incomparável em uma jornada épica.",
    price: 299.90,
    discountPrice: null,
    category: "xbox",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
    isFeatured: true,
    isOffer: false
  },

  // NINTENDO
  {
    id: "nin-zelda-totk",
    name: "The Legend of Zelda: Tears of the Kingdom",
    description: "Nesta continuação de Breath of the Wild, você decidirá seu próprio caminho pelas paisagens extensas de Hyrule e pelas ilhas flutuantes nos céus misteriosos.",
    price: 349.90,
    discountPrice: null,
    category: "nintendo",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    rating: 5.0,
    isFeatured: true,
    isOffer: false
  },
  {
    id: "nin-mario-odyssey",
    name: "Super Mario Odyssey",
    description: "Explore locais incríveis longe do Reino do Cogumelo com o Mario e o novo aliado Cappy em um imenso jogo de plataforma 3D em estilo sandbox.",
    price: 299.90,
    discountPrice: 229.90,
    category: "nintendo",
    image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    isFeatured: true,
    isOffer: true
  },

  // PC
  {
    id: "pc-elden-ring",
    name: "Elden Ring",
    description: "Levante-se, Maculado, e seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias.",
    price: 229.90,
    discountPrice: 159.90,
    category: "pc",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    isFeatured: true,
    isOffer: true
  },
  {
    id: "pc-cyberpunk",
    name: "Cyberpunk 2077: Ultimate Edition",
    description: "Cyberpunk 2077 é um RPG de ação e aventura em mundo aberto ambientado em Night City, uma megalópole obcecada por poder, glamour e modificações corporais.",
    price: 199.90,
    discountPrice: null,
    category: "pc",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    isFeatured: true,
    isOffer: false
  },
  {
    id: "pc-rdr2",
    name: "Red Dead Redemption 2",
    description: "Estados Unidos, 1899. O fim da era do Velho Oeste começou, e os homens da lei caçam as últimas gangues de fora da lei que restam.",
    price: 249.90,
    discountPrice: 82.40,
    category: "pc",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    isFeatured: false,
    isOffer: true
  },

  // MOBILE
  {
    id: "mob-minecraft",
    name: "Minecraft Pocket Edition",
    description: "Explore mundos gerados aleatoriamente e construa das coisas mais simples, como casas, às mais grandiosas, como castelos.",
    price: 39.90,
    discountPrice: null,
    category: "mobile",
    image: "https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    isFeatured: false,
    isOffer: false
  },

  // GIFT CARDS
  {
    id: "gc-psn-100",
    name: "Gift Card PlayStation Store R$ 100",
    description: "Adicione créditos à sua conta na PlayStation Network de forma rápida e segura. Resgate em jogos, complementos e assinaturas.",
    price: 100.00,
    discountPrice: null,
    category: "giftcard",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600&auto=format&fit=crop", // Ilustração console PS
    rating: 4.8,
    isFeatured: true,
    isOffer: false
  },
  {
    id: "gc-xbox-ultimate",
    name: "Gift Card Xbox Game Pass Ultimate - 3 Meses",
    description: "Jogue mais de 100 jogos de alta qualidade no console, PC e dispositivos móveis, além de multijogador online e assinatura EA Play.",
    price: 149.99,
    discountPrice: 134.99,
    category: "giftcard",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=600&auto=format&fit=crop", // Xbox console
    rating: 4.9,
    isFeatured: true,
    isOffer: true
  },
  {
    id: "gc-nintendo-100",
    name: "Gift Card Nintendo eShop R$ 100",
    description: "O presente perfeito para quem adora jogar! Use para baixar seus jogos favoritos diretamente no seu console Nintendo Switch.",
    price: 100.00,
    discountPrice: null,
    category: "giftcard",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop", // Switch ilustrativo
    rating: 4.7,
    isFeatured: false,
    isOffer: false
  },
  {
    id: "gc-steam-100",
    name: "Gift Card Steam R$ 100",
    description: "Adicione fundos à sua Carteira Steam e compre seus jogos favoritos de PC, softwares e itens de mercado da comunidade.",
    price: 100.00,
    discountPrice: 95.00,
    category: "giftcard",
    image: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?q=80&w=600&auto=format&fit=crop", // Steam deck / PC gaming
    rating: 4.9,
    isFeatured: true,
    isOffer: true
  }
];

const MOCK_USERS = [
  {
    id: "usr-admin",
    name: "Administrador Clooud",
    email: "admin@clooud.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: "usr-cliente",
    name: "Tiago Dev",
    email: "cliente@clooud.com",
    password: "cliente123",
    role: "client"
  }
];

const MOCK_ORDERS = [
  {
    id: "ORD-9832",
    userId: "usr-cliente",
    userName: "Tiago Dev",
    items: [
      { productId: "ps-gow-ragnarok", name: "God of War Ragnarök", quantity: 1, price: 249.90 },
      { productId: "gc-steam-100", name: "Gift Card Steam R$ 100", quantity: 1, price: 95.00 }
    ],
    total: 344.90,
    paymentMethod: "Pix",
    status: "Concluído",
    date: "2026-05-27T14:30:00-03:00"
  },
  {
    id: "ORD-1152",
    userId: "usr-cliente",
    userName: "Tiago Dev",
    items: [
      { productId: "nin-zelda-totk", name: "The Legend of Zelda: Tears of the Kingdom", quantity: 1, price: 349.90 }
    ],
    total: 349.90,
    paymentMethod: "Cartão de Crédito",
    status: "Processando",
    date: "2026-05-28T10:15:00-03:00"
  }
];

// Funções de Inicialização e API do localStorage
class Database {
  static init() {
    if (!localStorage.getItem("clooud_products")) {
      localStorage.setItem("clooud_products", JSON.stringify(MOCK_PRODUCTS));
    }
    if (!localStorage.getItem("clooud_users")) {
      localStorage.setItem("clooud_users", JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem("clooud_orders")) {
      localStorage.setItem("clooud_orders", JSON.stringify(MOCK_ORDERS));
    }
    if (!localStorage.getItem("clooud_cart")) {
      localStorage.setItem("clooud_cart", JSON.stringify([]));
    }
    if (!localStorage.getItem("clooud_session")) {
      localStorage.setItem("clooud_session", JSON.stringify(null));
    }
    console.log("Clooud Database inicializado no localStorage.");
  }

  // --- PRODUTOS ---
  static getProducts() {
    return JSON.parse(localStorage.getItem("clooud_products")) || [];
  }

  static saveProducts(products) {
    localStorage.setItem("clooud_products", JSON.stringify(products));
  }

  static getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  }

  // --- USUÁRIOS ---
  static getUsers() {
    return JSON.parse(localStorage.getItem("clooud_users")) || [];
  }

  static saveUsers(users) {
    localStorage.setItem("clooud_users", JSON.stringify(users));
  }

  // --- PEDIDOS ---
  static getOrders() {
    return JSON.parse(localStorage.getItem("clooud_orders")) || [];
  }

  static saveOrders(orders) {
    localStorage.setItem("clooud_orders", JSON.stringify(orders));
  }

  // --- CARRINHO ---
  static getCart() {
    return JSON.parse(localStorage.getItem("clooud_cart")) || [];
  }

  static saveCart(cart) {
    localStorage.setItem("clooud_cart", JSON.stringify(cart));
  }

  // --- SESSÃO DO USUÁRIO ---
  static getSession() {
    return JSON.parse(localStorage.getItem("clooud_session")) || null;
  }

  static saveSession(session) {
    localStorage.setItem("clooud_session", JSON.stringify(session));
  }
}

// Inicializar banco de dados imediatamente ao carregar o script
Database.init();
window.Database = Database; // Exportar globalmente para facilitar o acesso entre scripts
