/**
 * Protection Valley — Cart Module
 * Manages shopping cart state with localStorage persistence.
 */

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCartWithOptions() {
  const { selectedProduct, selectedColor, selectedSize, selectedImageIndex } = window;
  if (!selectedProduct) return;

  const cartItem = {
    id: selectedProduct.id,
    name: selectedProduct.name,
    price: window.isWholesale ? selectedProduct.wholesalePrice : selectedProduct.price,
    image: selectedProduct.images[selectedImageIndex],
    color: selectedColor.name,
    size: selectedSize,
    quantity: 1
  };

  const existing = cart.find(item =>
    item.id === cartItem.id &&
    item.color === cartItem.color &&
    item.size === cartItem.size
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push(cartItem);
  }

  saveCart();
  updateCartUI();
  window.showToast('Added to cart!');
}

function addToCart(productId) {
  const product = window.products.find(p => p.id === productId);
  if (!product) return;

  const cartItem = {
    id: product.id,
    name: product.name,
    price: window.isWholesale ? product.wholesalePrice : product.price,
    image: product.image,
    color: product.colors[0].name,
    size: product.sizes[0],
    quantity: 1
  };

  const existing = cart.find(item =>
    item.id === cartItem.id &&
    item.color === cartItem.color &&
    item.size === cartItem.size
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push(cartItem);
  }

  saveCart();
  updateCartUI();
  window.showToast('Added to cart!');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function updateQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    saveCart();
    updateCartUI();
  }
}

function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('hidden');
}

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartFooter = document.getElementById('cart-footer');
  const cartTotal = document.getElementById('cart-total');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.classList.remove('hidden');
    cartFooter.classList.remove('hidden');
    cartTotal.textContent = '$' + totalPrice.toFixed(2);

    cartItems.innerHTML = cart.map((item, i) => `
      <div class="flex gap-4 mb-4">
        <div class="w-20 h-20 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0 border border-dark-border">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-sm">${item.name}</h3>
          <p class="text-xs text-dark-muted">${item.color}, ${item.size}</p>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center border border-dark-border rounded">
              <button onclick="updateQuantity(${i}, -1)" class="px-2 py-1 hover:bg-dark-bg text-dark-muted">-</button>
              <span class="px-3 text-sm">${item.quantity}</span>
              <button onclick="updateQuantity(${i}, 1)" class="px-2 py-1 hover:bg-dark-bg text-dark-muted">+</button>
            </div>
            <span class="font-medium text-primary">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        <button onclick="removeFromCart(${i})" class="text-dark-muted hover:text-red-500">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `).join('');
  } else {
    cartCount.classList.add('hidden');
    cartFooter.classList.add('hidden');
    cartItems.innerHTML = `
      <div class="text-center py-8">
        <i data-lucide="shopping-bag" class="w-16 h-16 text-dark-border mx-auto mb-4"></i>
        <p class="text-dark-muted">Your cart is empty</p>
      </div>
    `;
  }
  lucide.createIcons();
}

function checkout() {
  alert('Checkout would integrate with Stripe here!');
}

// Expose globally
window.cart = cart;
window.addToCart = addToCart;
window.addToCartWithOptions = addToCartWithOptions;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.updateCartUI = updateCartUI;
window.checkout = checkout;
