<script lang="ts">
  import { base } from '$app/paths';
  import { showPage } from '$lib/stores';

  const categories = [
    { name: 'Tool Belts', page: 'catalog' },
    { name: 'Pouches', page: 'catalog' },
    { name: 'Aprons', page: 'catalog' },
    { name: 'Accessories', page: 'catalog' },
  ];
</script>

<footer class="bg-dark-card border-t border-dark-border">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <img src="{base}/images/logo.png" alt="Protection Valley" class="h-12 w-auto mb-4" />
        <p class="text-dark-muted max-w-sm">Premium workgear for the tradespeople who build our world. Crafted with care, built to last.</p>
      </div>
      <div>
        <h3 class="font-medium mb-4">Shop</h3>
        <ul class="space-y-2 text-dark-muted">
          {#each categories as cat}
            <li><button onclick={() => showPage('catalog')} class="hover:text-primary transition-colors">{cat.name}</button></li>
          {/each}
        </ul>
      </div>
      <div>
        <h3 class="font-medium mb-4">Support</h3>
        <ul class="space-y-2 text-dark-muted">
          <li><button onclick={() => showPage('contact')} class="hover:text-primary transition-colors">Contact Us</button></li>
          <li><span class="hover:text-primary transition-colors cursor-pointer">Shipping</span></li>
          <li><span class="hover:text-primary transition-colors cursor-pointer">Returns</span></li>
          <li><span class="hover:text-primary transition-colors cursor-pointer">Warranty</span></li>
        </ul>
      </div>
    </div>
    <div class="mt-12 pt-8 border-t border-dark-border text-center text-dark-muted text-sm">
      <p>&copy; 2025 Protection Valley. All rights reserved.</p>
    </div>
  </div>
</footer>
