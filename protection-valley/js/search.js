/**
 * Protection Valley — Search Module
 * Handles search overlay, filtering, and result highlighting.
 */

function toggleSearch() {
  const overlay = document.getElementById('search-overlay');
  overlay.classList.toggle('hidden');
  if (!overlay.classList.contains('hidden')) {
    document.getElementById('search-input').focus();
  }
}

function handleSearch(query) {
  const resultsContainer = document.getElementById('search-results');

  if (!query.trim()) {
    resultsContainer.innerHTML = '';
    return;
  }

  const searchTerm = query.toLowerCase();
  const results = window.products.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm) ||
    p.type.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm)
  );

  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="text-center py-8 text-dark-muted">
        <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-2"></i>
        <p>No products found</p>
      </div>
    `;
  } else {
    resultsContainer.innerHTML = results.map(p => `
      <div onclick="selectSearchResult(${p.id})" class="flex items-center gap-4 p-3 hover:bg-dark-bg rounded-lg cursor-pointer transition-colors">
        <img src="${p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded-lg">
        <div class="flex-1">
          <h4 class="font-medium">${highlightMatch(p.name, searchTerm)}</h4>
          <p class="text-sm text-dark-muted">${p.category} • ${p.type}</p>
        </div>
        <span class="text-primary font-medium">$${(window.isWholesale ? p.wholesalePrice : p.price).toFixed(2)}</span>
      </div>
    `).join('');
  }
  lucide.createIcons();
}

function highlightMatch(text, searchTerm) {
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="text-primary">$1</span>');
}

function selectSearchResult(productId) {
  toggleSearch();
  window.showProductDetail(productId);
}

// Expose globally
window.toggleSearch = toggleSearch;
window.handleSearch = handleSearch;
window.selectSearchResult = selectSearchResult;
