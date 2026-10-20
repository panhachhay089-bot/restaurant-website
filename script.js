const MENU = [
  // Starters
  { id: 'mango-salad', name: 'Green Mango Salad', price: 5.5, cat: 'starters', img: 'image/mango-salad.jpg', desc: 'Shredded mango, peanuts, dried shrimp, chili lime.' },
  { id: 'spring-rolls', name: 'Fresh Spring Rolls', price: 4.5, cat: 'starters', img: 'image/spring-rolls.jpg', desc: 'Rice paper, herbs, prawn, peanut sauce.' },
  { id: 'soup', name: 'Samlor Machu', price: 5.0, cat: 'starters', img: 'image/soup.jpg', desc: 'Sour fish soup, pineapple, tamarind, dill.' },
  { id: 'garlic-bread', name: 'Garlic Herb Bread', price: 3.5, cat: 'starters', img: 'image/garlic-bread.jpg', desc: 'Warm baked bread, garlic butter, herbs.' },

  // Mains
  { id: 'amok', name: 'Fish Amok', price: 9.5, cat: 'mains', img: 'image/amok.jpg', desc: 'Steamed curry custard, snakehead fish, banana leaf.' },
  { id: 'skewers', name: 'Char-Grilled Pork Skewers', price: 7.0, cat: 'mains', img: 'image/skewers.jpg', desc: 'Lemongrass-marinated, served with broken rice.' },
  { id: 'lok-lak', name: 'Beef Lok Lak', price: 8.5, cat: 'mains', img: 'image/lok-lak.jpg', desc: 'Seared beef cubes, fried egg, lime-pepper dip.' },
  { id: 'chicken', name: 'Grilled Lemongrass Chicken', price: 7.5, cat: 'mains', img: 'image/chicken.jpg', desc: 'Charcoal-grilled thigh, herb marinade, jasmine rice.' },

  // Pizza & Pasta
  { id: 'margherita', name: 'Margherita Pizza', price: 8.0, cat: 'pizza-pasta', img: 'image/margherita.jpg', desc: 'San Marzano tomato, mozzarella, fresh basil.' },
  { id: 'pepperoni', name: 'Pepperoni Pizza', price: 9.0, cat: 'pizza-pasta', img: 'image/pepperoni.jpg', desc: 'Spicy pepperoni, mozzarella, oregano.' },
  { id: 'mushroom-pasta', name: 'Creamy Mushroom Pasta', price: 7.5, cat: 'pizza-pasta', img: 'image/mushroom-pasta.jpg', desc: 'Fettuccine, wild mushrooms, parmesan cream.' },
  { id: 'bolognese', name: 'Spaghetti Bolognese', price: 8.0, cat: 'pizza-pasta', img: 'image/bolognese.jpg', desc: 'Slow-cooked beef ragù, parmesan, basil.' },

  // Desserts
  { id: 'sticky-rice', name: 'Mango Sticky Rice', price: 4.0, cat: 'desserts', img: 'image/sticky-rice.jpg', desc: 'Coconut sticky rice, ripe mango, sesame.' },
  { id: 'caramel', name: 'Palm Sugar Custard', price: 3.5, cat: 'desserts', img: 'image/caramel.jpg', desc: 'Steamed egg custard, palm sugar caramel.' },
  { id: 'tiramisu', name: 'Tiramisu', price: 4.5, cat: 'desserts', img: 'image/tiramisu.jpg', desc: 'Espresso-soaked sponge, mascarpone cream.' },

  // Drinks
  { id: 'iced-coffee', name: 'Khmer Iced Coffee', price: 2.5, cat: 'drinks', img: 'image/iced-coffee.jpg', desc: 'Condensed milk, dark roast, over ice.' },
  { id: 'lemongrass-tea', name: 'Lemongrass Tea', price: 2.0, cat: 'drinks', img: 'image/lemongrass-tea.jpg', desc: 'Fresh lemongrass, ginger, palm sugar.' },
  { id: 'lime-soda', name: 'Sparkling Lime Soda', price: 2.0, cat: 'drinks', img: 'image/lime-soda.jpg', desc: 'Fresh lime, soda water, mint.' },
];

function getCart() {
  try { return JSON.parse(localStorage.getItem('nham-cart')) || {}; }
  catch (e) { return {}; }
}
function saveCart(cart) {
  localStorage.setItem('nham-cart', JSON.stringify(cart));
  updateNavBadge();
}
function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  renderCart();
}
function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}
function cartCount() {
  return Object.values(getCart()).reduce((a, b) => a + b, 0);
}
function updateNavBadge() {
  const pill = document.getElementById('navCartPill');
  if (pill) pill.textContent = `Cart · ${cartCount()}`;
}

function renderMenu(category) {
  const list = document.getElementById('menuList');
  if (!list) return;
  list.style.animation = 'none';
  void list.offsetWidth;
  list.style.animation = 'fadeIn .3s ease';

  const items = MENU.filter(m => m.cat === category);
  list.innerHTML = items.map(item => `
    <div class="menu-item">
      <div class="menu-thumb"><img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'"></div>
      <div class="menu-item-info">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <p class="price">$${item.price.toFixed(2)}</p>
      </div>
      <div class="menu-item-action">
        <button class="btn btn-dark btn-small" data-add="${item.id}">Add</button>
      </div>
    </div>
  `).join('');
  list.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.add));
  });
}

function renderCart() {
  const linesEl = document.getElementById('cartLines');
  if (!linesEl) return;
  const cart = getCart();
  const ids = Object.keys(cart);
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (ids.length === 0) {
    linesEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    totalEl.style.display = 'none';
    checkoutBtn.disabled = true;
    return;
  }

  let total = 0;
  linesEl.innerHTML = ids.map(id => {
    const item = MENU.find(m => m.id === id);
    const qty = cart[id];
    const lineTotal = item.price * qty;
    total += lineTotal;
    return `
      <div class="cart-line">
        <span>${item.name} × ${qty}</span>
        <span>$${lineTotal.toFixed(2)} <button data-remove="${id}">remove</button></span>
      </div>
    `;
  }).join('');

  totalEl.style.display = 'flex';
  document.getElementById('cartTotalValue').textContent = `$${total.toFixed(2)}`;
  checkoutBtn.disabled = false;

  linesEl.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.remove));
  });
}

function initMenuPage() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderMenu(tab.dataset.cat);
    });
  });
  renderMenu('starters');
  renderCart();

  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn.addEventListener('click', () => {
    saveCart({});
    renderCart();
    const msg = document.getElementById('confirmMsg');
    msg.style.display = 'block';
    setTimeout(() => (msg.style.display = 'none'), 4000);
  });
}

function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const fields = {
    name: v => v.trim().length > 1,
    phone: v => /^[0-9+\s-]{7,}$/.test(v.trim()),
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    date: v => !!v && v >= new Date().toISOString().slice(0, 10),
    time: v => !!v,
    party: v => !!v,
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    Object.keys(fields).forEach(name => {
      const input = form.elements[name];
      const wrap = document.getElementById('f-' + name);
      const ok = fields[name](input.value);
      wrap.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) return;

    const successBox = document.getElementById('successBox');
    const d = form.elements['date'].value;
    const t = form.elements['time'].value;
    const p = form.elements['party'].value;
    document.getElementById('successDetail').textContent =
      `Table for ${p} on ${d} at ${t}. A confirmation will be sent to ${form.elements['email'].value}.`;
    successBox.style.display = 'block';
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavBadge();
  initMenuPage();
  initBookingForm();
});
