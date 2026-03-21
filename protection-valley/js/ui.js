/**
 * Protection Valley — UI Rendering Module
 * Handles page navigation, product cards, detail pages, filters, auth, and toasts.
 */

// State
window.isWholesale = localStorage.getItem('userRole') === 'wholesale';
window.currentUser = JSON.parse(localStorage.getItem('user') || 'null');
window.selectedProduct = null;
window.selectedSize = null;
window.selectedColor = null;
window.selectedImageIndex = 0;
window.currentType = 'All';
window.currentCategory = 'All';

let previousPage = 'home';

/* ── Page Navigation ── */

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const el = document.getElementById(`page-${page}`);
  if (el) el.classList.remove('hidden');
  window.scrollTo(0, 0);
  lucide.createIcons();
  if (page !== 'product-detail') previousPage = page;
}

function goBack() {
  showPage(previousPage);
}

/* ── Product Card Rendering ── */

function renderProductCard(product) {
  const price = window.isWholesale ? product.wholesalePrice : product.price;
  const originalPrice = window.isWholesale ? product.price : null;

  return `
    <div class="bg-dark-card rounded-lg overflow-hidden border border-dark-border hover:border-primary transition-colors group cursor-pointer" onclick="showProductDetail(${product.id})">
      <div class="aspect-square overflow-hidden bg-dark-bg">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-primary">${product.type}</span>
          <span class="text-xs text-dark-muted">•</span>
          <span class="text-xs text-dark-muted">${product.category}</span>
        </div>
        <h3 class="font-medium text-lg mb-2 group-hover:text-primary transition-colors">${product.name}</h3>
        <div class="flex items-center gap-2">
          ${originalPrice ? `
            <span class="text-xl font-serif text-primary">$${price.toFixed(2)}</span>
            <span class="text-sm text-dark-muted line-through">$${originalPrice.toFixed(2)}</span>
          ` : `
            <span class="text-xl font-serif text-primary">$${price.toFixed(2)}</span>
          `}
        </div>
      </div>
    </div>
  `;
}

/* ── Catalog ── */

function renderCatalog(sortBy = 'featured') {
  let filtered = window.getFilteredProducts();

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => (window.isWholesale ? a.wholesalePrice : a.price) - (window.isWholesale ? b.wholesalePrice : b.price));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => (window.isWholesale ? b.wholesalePrice : b.price) - (window.isWholesale ? a.wholesalePrice : a.price));
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const grid = document.getElementById('catalog-grid');
  const emptyState = document.getElementById('catalog-empty');
  const countEl = document.getElementById('catalog-count');

  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    if (grid) grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    if (grid) grid.innerHTML = filtered.map(renderProductCard).join('');
  }
}

function renderFeaturedProducts() {
  const featured = window.products.slice(0, 4);
  const grid = document.getElementById('featured-products');
  if (grid) grid.innerHTML = featured.map(renderProductCard).join('');
}

/* ── Filters ── */

function filterByType(type) {
  window.currentType = type;
  updateFilterButtons();
  renderCatalog();
  updateActiveFilters();
}

function filterByCategory(category) {
  window.currentCategory = category;
  updateFilterButtons();
  showPage('catalog');
  renderCatalog();
  updateActiveFilters();
}

function updateFilterButtons() {
  document.querySelectorAll('.filter-type').forEach(btn => {
    const isActive = btn.dataset.type === window.currentType;
    btn.classList.toggle('bg-primary', isActive);
    btn.classList.toggle('text-dark-bg', isActive);
    btn.classList.toggle('bg-dark-bg', !isActive);
    btn.classList.toggle('border-dark-border', !isActive);
    btn.classList.toggle('text-dark-text', !isActive);
  });

  document.querySelectorAll('.filter-category').forEach(btn => {
    const isActive = btn.dataset.category === window.currentCategory;
    btn.classList.toggle('bg-primary', isActive);
    btn.classList.toggle('text-dark-bg', isActive);
    btn.classList.toggle('bg-dark-bg', !isActive);
    btn.classList.toggle('border-dark-border', !isActive);
    btn.classList.toggle('text-dark-text', !isActive);
  });
}

function updateActiveFilters() {
  const container = document.getElementById('active-filters');
  if (!container) return;
  const hasFilters = window.currentType !== 'All' || window.currentCategory !== 'All';
  container.classList.toggle('hidden', !hasFilters);
}

function clearFilters() {
  window.currentType = 'All';
  window.currentCategory = 'All';
  updateFilterButtons();
  renderCatalog();
  updateActiveFilters();
}

function sortProducts(sortBy) {
  renderCatalog(sortBy);
}

/* ── Product Detail ── */

function showProductDetail(productId) {
  window.selectedProduct = window.products.find(p => p.id === productId);
  window.selectedSize = window.selectedProduct.sizes[0];
  window.selectedColor = window.selectedProduct.colors[0];
  window.selectedImageIndex = 0;

  const price = window.isWholesale ? window.selectedProduct.wholesalePrice : window.selectedProduct.price;
  const originalPrice = window.isWholesale ? window.selectedProduct.price : null;
  const sp = window.selectedProduct;

  const content = document.getElementById('product-detail-content');
  content.innerHTML = `
    <!-- Image Gallery -->
    <div>
      <div class="aspect-square bg-dark-card rounded-lg overflow-hidden mb-4 border border-dark-border">
        <img id="main-image" src="${sp.images[0]}" alt="${sp.name}" class="w-full h-full object-cover">
      </div>
      ${sp.images.length > 1 ? `
        <div class="flex gap-2">
          ${sp.images.map((img, i) => `
            <button onclick="selectImage(${i})" class="w-20 h-20 rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary' : 'border-dark-border'} hover:border-primary transition-colors">
              <img src="${img}" class="w-full h-full object-cover">
            </button>
          `).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Product Info -->
    <div>
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-primary">${sp.type}</span>
        <span class="text-sm text-dark-muted">•</span>
        <span class="text-sm text-dark-muted">${sp.category}</span>
      </div>
      <h1 class="text-3xl font-serif mb-4">${sp.name}</h1>
      <div class="flex items-center gap-3 mb-6">
        <span class="text-3xl font-serif text-primary">$${price.toFixed(2)}</span>
        ${originalPrice ? `<span class="text-lg text-dark-muted line-through">$${originalPrice.toFixed(2)}</span>` : ''}
      </div>
      <p class="text-dark-muted mb-8">${sp.description}</p>

      <!-- Color Selection -->
      ${sp.colors.length > 1 ? `
        <div class="mb-6">
          <label class="block text-sm font-medium mb-3">Color: <span id="selected-color-name" class="text-dark-muted">${window.selectedColor.name}</span></label>
          <div class="flex gap-3">
            ${sp.colors.map((color, i) => `
              <button onclick="selectColor(${i})" class="color-option ${i === 0 ? 'active' : ''}" style="background-color: ${color.hex};" title="${color.name}"></button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Size Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-3">Size: <span id="selected-size-name" class="text-dark-muted">${window.selectedSize}</span></label>
        <div class="flex flex-wrap gap-2">
          ${sp.sizes.map(size => `
            <button onclick="selectSize('${size}')" class="size-option ${size === window.selectedSize ? 'active' : ''}">${size}</button>
          `).join('')}
        </div>
      </div>

      <!-- Add to Cart -->
      <div class="flex gap-4">
        <button onclick="addToCartWithOptions()" class="flex-1 btn-primary py-4 text-lg">Add to Cart</button>
      </div>

      <!-- Features -->
      <div class="mt-8 pt-8 border-t border-dark-border">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-2 text-dark-muted">
            <i data-lucide="truck" class="w-5 h-5 text-primary"></i>
            <span class="text-sm">Free shipping over $100</span>
          </div>
          <div class="flex items-center gap-2 text-dark-muted">
            <i data-lucide="shield-check" class="w-5 h-5 text-primary"></i>
            <span class="text-sm">Lifetime warranty</span>
          </div>
          <div class="flex items-center gap-2 text-dark-muted">
            <i data-lucide="rotate-ccw" class="w-5 h-5 text-primary"></i>
            <span class="text-sm">30-day returns</span>
          </div>
          <div class="flex items-center gap-2 text-dark-muted">
            <i data-lucide="package" class="w-5 h-5 text-primary"></i>
            <span class="text-sm">${sp.stock} in stock</span>
          </div>
        </div>
      </div>
    </div>
  `;

  showPage('product-detail');
  lucide.createIcons();
}

function selectImage(index) {
  window.selectedImageIndex = index;
  document.getElementById('main-image').src = window.selectedProduct.images[index];
}

function selectColor(index) {
  window.selectedColor = window.selectedProduct.colors[index];
  document.getElementById('selected-color-name').textContent = window.selectedColor.name;
  document.getElementById('main-image').src = window.selectedColor.image;
  document.querySelectorAll('.color-option').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

function selectSize(size) {
  window.selectedSize = size;
  document.getElementById('selected-size-name').textContent = size;
  document.querySelectorAll('.size-option').forEach(el => {
    el.classList.toggle('active', el.textContent === size);
  });
}

/* ── Toast ── */

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  toastMessage.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}

/* ── Auth ── */

function loginWithGoogle() {
  const user = { name: 'John Smith', email: 'john@gmail.com', role: 'retail', provider: 'google' };
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userRole', 'retail');
  window.currentUser = user;
  window.isWholesale = false;
  updateUserUI();
  showToast('Signed in with Google!');
  showPage('home');
}

function loginWithApple() {
  const user = { name: 'Jane Doe', email: 'jane@icloud.com', role: 'retail', provider: 'apple' };
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userRole', 'retail');
  window.currentUser = user;
  window.isWholesale = false;
  updateUserUI();
  showToast('Signed in with Apple!');
  showPage('home');
}

function handleEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (email === 'wholesale@protectionvalley.com' && password === 'password') {
    const user = { name: 'Wholesale Customer', email, role: 'wholesale' };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', 'wholesale');
    window.currentUser = user;
    window.isWholesale = true;
  } else {
    const user = { name: 'Customer', email, role: 'retail' };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', 'retail');
    window.currentUser = user;
    window.isWholesale = false;
  }

  updateUserUI();
  showToast('Signed in!');
  showPage('home');
}

function updateUserUI() {
  const userBtn = document.getElementById('user-btn');
  if (window.currentUser) {
    userBtn.innerHTML = `<span class="text-sm">${window.currentUser.name}</span>`;
    userBtn.onclick = logout;
  } else {
    userBtn.innerHTML = `<i data-lucide="user" class="w-5 h-5"></i>`;
    userBtn.onclick = () => showPage('login');
  }
  lucide.createIcons();
  renderCatalog();
  renderFeaturedProducts();
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  window.currentUser = null;
  window.isWholesale = false;
  updateUserUI();
  showToast('Signed out');
}

// Expose globally
window.showPage = showPage;
window.goBack = goBack;
window.renderCatalog = renderCatalog;
window.renderFeaturedProducts = renderFeaturedProducts;
window.filterByType = filterByType;
window.filterByCategory = filterByCategory;
window.clearFilters = clearFilters;
window.sortProducts = sortProducts;
window.showProductDetail = showProductDetail;
window.selectImage = selectImage;
window.selectColor = selectColor;
window.selectSize = selectSize;
window.showToast = showToast;
window.loginWithGoogle = loginWithGoogle;
window.loginWithApple = loginWithApple;
window.handleEmailLogin = handleEmailLogin;
window.updateUserUI = updateUserUI;
window.logout = logout;
