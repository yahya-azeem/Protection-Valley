/**
 * Protection Valley — App Entry Point
 * Initializes the application: loads products, renders UI, sets up icons.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Load products (API with fallback to local data)
  await window.loadProducts();

  // Initial render
  window.renderCatalog();
  window.renderFeaturedProducts();
  window.updateCartUI();
  window.updateUserUI();

  console.log('✓ Protection Valley initialized');
});
