/* Jersey HUB — main.js */

var WA = '233555139824';
var SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

var PRODUCTS = [
  { id: 1,  name: 'Barcelona Home',                club: 'La Liga',       cat: 'laliga',   price: 240, img: 'images/barcelona-home.jpeg' },
  { id: 2,  name: 'Real Madrid Away, black',       club: 'La Liga',       cat: 'laliga',   price: 240, img: 'images/real-madrid-away-black.jpeg' },
  { id: 3,  name: 'Real Madrid Away, orange',      club: 'La Liga',       cat: 'laliga',   price: 240, img: 'images/real-madrid-away-orange.jpeg' },
  { id: 4,  name: 'Manchester City Home',          club: 'Premier League', cat: 'epl',     price: 240, img: 'images/man-city-home.jpeg' },
  { id: 5,  name: 'Manchester City Away',          club: 'Premier League', cat: 'epl',     price: 240, img: 'images/man-city-away.jpeg' },
  { id: 6,  name: 'Liverpool Home',                club: 'Premier League', cat: 'epl',     price: 240, img: 'images/liverpool-home.jpeg' },
  { id: 7,  name: 'Manchester United Home',        club: 'Premier League', cat: 'epl',     price: 240, img: 'images/man-united-home.jpeg' },
  { id: 8,  name: 'Arsenal Home',                  club: 'Premier League', cat: 'epl',     price: 240, img: 'images/arsenal-home.jpeg' },
  { id: 9,  name: 'Ipswich Town Home',             club: 'Premier League', cat: 'epl',     price: 240, img: 'images/ipswich-home.jpeg' },
  { id: 10, name: 'Lyon Home',                     club: 'Ligue 1',       cat: 'ligue1',   price: 240, img: 'images/lyon-home.jpeg' },
  { id: 11, name: 'Germany Home',                  club: 'National teams', cat: 'national', price: 220, img: 'images/germany-home.jpeg' },
  { id: 12, name: 'Germany Retro',                 club: 'National teams', cat: 'national', price: 220, img: 'images/germany-retro.jpeg' },
  { id: 13, name: 'Spain Home',                    club: 'National teams', cat: 'national', price: 220, img: 'images/spain-home.jpeg' },
  { id: 14, name: 'Custom Kit, black and white stripes', club: 'Custom print', cat: 'custom', price: 220, img: 'images/custom-stripes.jpeg' },
  { id: 15, name: 'Custom Kit, red pattern',       club: 'Custom print',  cat: 'custom',   price: 220, img: 'images/custom-red-pattern.jpeg' },
  { id: 16, name: 'Custom Kit, number 10',         club: 'Custom print',  cat: 'custom',   price: 220, img: 'images/custom-number-10.jpeg' },
  { id: 17, name: 'Custom Kit, blue stripes',      club: 'Custom print',  cat: 'custom',   price: 220, img: 'images/custom-blue-stripes.jpeg' },
  { id: 18, name: 'Custom Kit, red and blue',      club: 'Custom print',  cat: 'custom',   price: 220, img: 'images/custom-red-blue.jpeg' },
  { id: 19, name: 'Custom Kit, navy and lime',     club: 'Custom print',  cat: 'custom',   price: 220, img: 'images/custom-navy-lime.jpeg' },
  { id: 20, name: 'Custom Kit, grey team name',    club: 'Custom print',  cat: 'custom',   price: 220, img: 'images/custom-grey.jpeg' },
  { id: 21, name: 'Custom Kit, blue',              club: 'Custom print',  cat: 'custom',   price: 220, img: 'images/custom-blue.jpeg' }
];

/* ── Utilities ── */

var $ = function (s) { return document.querySelector(s); };

function load() {
  try { return JSON.parse(localStorage.getItem('jh-cart')) || []; } catch (e) { return []; }
}

function save() {
  try { localStorage.setItem('jh-cart', JSON.stringify(cart)); } catch (e) {}
}

function money(n) {
  return 'GH\u20B3' + n.toFixed(2);
}

function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function toast(msg) {
  var t = el('div', 'toast', msg);
  t.setAttribute('role', 'status');
  t.setAttribute('aria-live', 'polite');
  document.body.appendChild(t);
  setTimeout(function () { t.remove(); }, 2200);
}

function product(id) {
  return PRODUCTS.find(function (p) { return p.id === id; });
}

/* ── Cart state ── */
/* Each cart entry: { id: number, qty: number, size: string } */
var cart = load();

/* ── Cart sanitization ── */
/* Remove stale entries (product IDs no longer in PRODUCTS) and persist */
function sanitizeCart() {
  var before = cart.length;
  cart = cart.filter(function (l) { return product(l.id); });
  if (cart.length !== before) { save(); }
}

/* ── Product grid ── */

function renderProducts() {
  var grid = $('#grid');
  if (!grid) { return; }

  var qEl   = $('#q');
  var catEl = $('#cat');
  var sortEl = $('#sort');

  var q    = qEl   ? qEl.value.trim().toLowerCase()  : '';
  var cat  = catEl ? catEl.value                      : 'all';
  var sort = sortEl ? sortEl.value                    : 'default';

  var list = PRODUCTS.filter(function (p) {
    return (cat === 'all' || p.cat === cat) &&
           (p.name + ' ' + p.club).toLowerCase().indexOf(q) !== -1;
  });

  if (sort === 'low')  list.sort(function (a, b) { return a.price - b.price; });
  if (sort === 'high') list.sort(function (a, b) { return b.price - a.price; });
  if (sort === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });

  grid.replaceChildren();

  var countEl = $('#count');
  if (countEl) { countEl.textContent = list.length + (list.length === 1 ? ' item' : ' items'); }

  var emptyEl = $('#empty');
  if (emptyEl) { emptyEl.hidden = list.length > 0; }

  list.forEach(function (p) {
    var card  = el('article', 'card');
    var thumb = el('div', 'thumb');

    /* Product image */
    var img = document.createElement('img');
    img.src = encodeURI(p.img);
    img.alt = p.name;
    img.loading = 'lazy';
    img.onerror = function () {
      img.replaceWith(el('div', 'noimg', 'Photo coming soon'));
    };
    thumb.appendChild(img);

    /* Size selector */
    var sizeRow = el('div', 'size-row');
    sizeRow.setAttribute('role', 'group');
    sizeRow.setAttribute('aria-label', 'Select size');
    var selectedSize = null;

    SIZES.forEach(function (size) {
      var btn = el('button', 'size-btn', size);
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', 'Size ' + size);
      btn.onclick = function () {
        /* deselect all */
        sizeRow.querySelectorAll('.size-btn').forEach(function (b) {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        /* select this one */
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
        selectedSize = size;
        addBtn.disabled = false;
      };
      sizeRow.appendChild(btn);
    });

    /* Add to cart button */
    var addBtn = el('button', 'btn', 'Add to cart');
    addBtn.setAttribute('type', 'button');
    addBtn.disabled = true; /* disabled until size chosen */
    addBtn.onclick = function () {
      if (!selectedSize) return;
      add(p.id, selectedSize);
      /* reset size selection on this card */
      selectedSize = null;
      sizeRow.querySelectorAll('.size-btn').forEach(function (b) {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      addBtn.disabled = true;
    };

    card.append(
      thumb,
      el('h3', null, p.name),
      el('div', 'club', p.club),
      el('div', 'price', money(p.price)),
      sizeRow,
      addBtn
    );

    grid.appendChild(card);
  });
}

/* ── Cart operations ── */

function add(id, size) {
  /* each (product id + size) is a distinct cart line */
  var line = cart.find(function (l) { return l.id === id && l.size === size; });
  if (line) {
    line.qty++;
  } else {
    cart.push({ id: id, qty: 1, size: size });
  }
  save();
  renderCart();
  toast('Added to cart');
}

function change(id, size, d) {
  var line = cart.find(function (l) { return l.id === id && l.size === size; });
  if (!line) return;
  line.qty += d;
  if (line.qty < 1) {
    cart = cart.filter(function (l) { return !(l.id === id && l.size === size); });
  }
  save();
  renderCart();
}

/* ── Cart drawer render ── */

function renderCart() {
  var box = $('#items');
  if (!box) { return; }

  var total = 0;
  var n = 0;

  box.replaceChildren();

  /* remove any lines with invalid product ids */
  cart = cart.filter(function (l) { return product(l.id); });

  cart.forEach(function (l) {
    var p = product(l.id);
    total += p.price * l.qty;
    n += l.qty;

    var row = el('div', 'line');

    var nameEl  = el('span', 'item-name', p.name);
    var sizeEl  = el('span', 'item-size', 'Size: ' + l.size);
    var priceEl = el('strong', 'item-price', money(p.price * l.qty));

    var minus = el('button', null, '\u2212');
    var plus  = el('button', null, '+');
    var rm    = el('button', 'rm', 'Remove');

    minus.setAttribute('aria-label', 'Decrease quantity of ' + p.name + ' size ' + l.size);
    plus.setAttribute('aria-label', 'Increase quantity of ' + p.name + ' size ' + l.size);
    rm.setAttribute('aria-label', 'Remove ' + p.name + ' size ' + l.size + ' from cart');
    minus.setAttribute('type', 'button');
    plus.setAttribute('type', 'button');
    rm.setAttribute('type', 'button');

    /* closure captures l.id and l.size at this iteration */
    (function (lineId, lineSize) {
      minus.onclick = function () { change(lineId, lineSize, -1); };
      plus.onclick  = function () { change(lineId, lineSize, +1); };
      rm.onclick    = function () { change(lineId, lineSize, -l.qty); };
    })(l.id, l.size);

    var qty = el('div', 'qty');
    qty.append(minus, el('span', null, String(l.qty)), plus);

    row.append(nameEl, priceEl, sizeEl, qty, rm);
    box.appendChild(row);
  });

  if (!cart.length) {
    box.appendChild(el('p', 'empty', 'Your cart is empty. Add a kit to get started.'));
  }

  var totalEl = $('#total');
  if (totalEl) { totalEl.textContent = money(total); }

  var badge = $('#badge');
  if (badge) { badge.textContent = n; }

  /* update mobile badge too */
  var mb = $('#mobileBadge');
  if (mb) { mb.textContent = n; }

  var orderBtn = $('#order');
  if (orderBtn) { orderBtn.disabled = !cart.length; }
}

/* ── Cart drawer open/close ── */

function setCart(open) {
  var drawer = $('#drawer');
  var overlay = $('#overlay');
  if (!drawer || !overlay) { return; }

  drawer.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';

  if (open) {
    var closeBtn = $('#closeCart');
    if (closeBtn) { closeBtn.focus(); }
  } else {
    /* return focus to whichever button opened it */
    var cartBtn = $('#cartBtn');
    if (cartBtn && cartBtn.offsetParent !== null) {
      cartBtn.focus();
    } else {
      var mb = $('#mobileCartBtn');
      if (mb) { mb.focus(); }
    }
  }
}

/* ── WhatsApp order ── */

function orderOnWhatsApp() {
  if (!cart.length) return;
  var total = 0;
  var lines = cart.map(function (l) {
    var p = product(l.id);
    total += p.price * l.qty;
    return '- ' + l.qty + ' x ' + p.name + ' (Size: ' + l.size + ') \u2014 ' + money(p.price * l.qty);
  });
  var msg = 'Hello Jersey HUB, I would like to order:\n' +
    lines.join('\n') +
    '\n\nTotal: ' + money(total) +
    '\n\nI will confirm delivery address here.';
  window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
}

/* ── Event listeners ── */

var qEl = $('#q');
if (qEl) { qEl.addEventListener('input', renderProducts); }

var catEl = $('#cat');
if (catEl) { catEl.addEventListener('change', renderProducts); }

var sortEl = $('#sort');
if (sortEl) { sortEl.addEventListener('change', renderProducts); }

var resetBtn = $('#reset');
if (resetBtn) {
  resetBtn.onclick = function () {
    if (qEl)    { qEl.value = ''; }
    if (catEl)  { catEl.value = 'all'; }
    if (sortEl) { sortEl.value = 'default'; }
    renderProducts();
  };
}

var cartBtn = $('#cartBtn');
if (cartBtn) { cartBtn.onclick = function () { setCart(true); }; }

var closeCartBtn = $('#closeCart');
if (closeCartBtn) { closeCartBtn.onclick = function () { setCart(false); }; }

var overlayEl = $('#overlay');
if (overlayEl) { overlayEl.onclick = function () { setCart(false); }; }

var orderBtn = $('#order');
if (orderBtn) { orderBtn.onclick = orderOnWhatsApp; }

/* mobile cart button */
var mobileCartBtn = $('#mobileCartBtn');
if (mobileCartBtn) {
  mobileCartBtn.onclick = function () { setCart(true); };
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { setCart(false); }
});

/* ── Init ── */
sanitizeCart();
renderProducts();
renderCart();
