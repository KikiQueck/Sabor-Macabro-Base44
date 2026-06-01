// ====== SABOR MACABRO — CARRINHO ======
(function () {
  const WHATSAPP_NUMBER = '5511966666666'; 

  let cart = [];

  // Elementos
  const cartDrawer  = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItems   = document.getElementById('cartItems');
  const cartEmpty   = document.getElementById('cartEmpty');
  const cartFooter  = document.getElementById('cartFooter');
  const cartCount   = document.getElementById('cartCount');
  const cartTotal   = document.getElementById('cartTotal');
  const cartToast   = document.getElementById('cartToast');

  // Abrir / fechar drawer
  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('cartNavBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Toast
  let toastTimer;
  function showToast(msg) {
    cartToast.textContent = msg;
    cartToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => cartToast.classList.remove('show'), 2200);
  }

  // Formatar preço
  function fmt(val) {
    return 'R$ ' + val.toFixed(2).replace('.', ',');
  }

  // Atualizar UI
  function render() {
    // Contagem
    const total = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = total;
    cartCount.classList.toggle('visible', total > 0);

    // Itens vazios
    if (cart.length === 0) {
      cartEmpty.style.display = 'flex';
      cartFooter.style.display = 'none';
      cartItems.innerHTML = '';
      cartItems.appendChild(cartEmpty);
      return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'flex';

    // Renderizar itens
    cartItems.innerHTML = '';
    cart.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${fmt(item.price * item.qty)}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="dec" data-idx="${idx}">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-idx="${idx}">+</button>
        </div>
      `;
      cartItems.appendChild(div);
    });

    // Total
    const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cartTotal.textContent = fmt(sum);
  }

  // Adicionar ao carrinho
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name  = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const existing = cart.find(i => i.name === name);

      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      render();
      showToast(`🛒 ${name} adicionado!`);

      // Feedback visual no botão
      btn.classList.add('added');
      setTimeout(() => btn.classList.remove('added'), 600);
    });
  });

  // Botões de quantidade (delegação)
  cartItems.addEventListener('click', e => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx);
    const action = btn.dataset.action;

    if (action === 'inc') {
      cart[idx].qty++;
    } else {
      cart[idx].qty--;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
    }
    render();
  });

  // Limpar carrinho
  document.getElementById('btnClear').addEventListener('click', () => {
    cart = [];
    render();
  });

  // Finalizar via WhatsApp
  document.getElementById('btnCheckout').addEventListener('click', () => {
    if (cart.length === 0) return;

    const lines = cart.map(i =>
      `• ${i.name} x${i.qty} — ${fmt(i.price * i.qty)}`
    );
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const msg = [
      '🖤 *Pedido — Sabor Macabro*',
      '',
      ...lines,
      '',
      `*Total: ${fmt(total)}*`,
      '',
      'Olá! Gostaria de fazer esse pedido. 🕯️'
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    const a = document.createElement('a');
a.href = url;
a.target = '_blank';
a.rel = 'noopener noreferrer';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
  });

  // Filtros (já existentes no projeto, mantidos)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.catalog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'todos' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  render();
})();
