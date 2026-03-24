<script lang="ts">
  import { base } from '$app/paths';
  import { showPage, currentCategory } from '$lib/stores';
  import { Mail, Phone, MapPin } from 'lucide-svelte';
  import { BUSINESS, CATEGORIES } from '$lib/constants';
</script>

<footer class="bg-black border-t border-white/5 pt-20 pb-12 text-white antialiased">
  <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-16">
    <!-- Brand -->
    <div class="md:col-span-5 space-y-6">
      <button onclick={() => showPage('home')} class="flex items-center gap-4 hover:scale-105 transition-lux group">
        <div class="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded group-hover:border-primary/40 transition-lux flex items-center justify-center overflow-hidden">
          <img src="{base}/images/logo-v3.png" alt="Protection Valley" class="w-full h-full object-contain" />
        </div>
        <div class="flex flex-col text-left">
          <span class="text-xl font-serif text-white">{BUSINESS.name}</span>
          <span class="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">Est. {BUSINESS.established}</span>
        </div>
      </button>
      <p class="text-sm text-zinc-500 leading-relaxed max-w-sm">
        Professional grade load-bearing equipment engineered for uncompromising durability. Handcrafted for the modern trade professional.
      </p>
    </div>

    <!-- Catalog -->
    <div class="md:col-span-2 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-primary">Catalog</h3>
      <ul class="space-y-2">
        {#each CATEGORIES.filter(c => c !== 'All') as cat}
          <li>
            <button 
              onclick={() => { currentCategory.set(cat); showPage('catalog'); }}
              class="text-sm text-zinc-500 hover:text-white transition-lux"
            >
              {cat}
            </button>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Company -->
    <div class="md:col-span-2 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-primary">Company</h3>
      <ul class="space-y-2 text-sm text-zinc-500">
        <li><button onclick={() => showPage('contact')} class="hover:text-white transition-lux">Support</button></li>
        <li><button class="hover:text-white transition-lux">Logistics</button></li>
        <li><button class="hover:text-white transition-lux">Warranty</button></li>
        <li><button onclick={() => showPage('about')} class="hover:text-white transition-lux">Heritage</button></li>
      </ul>
    </div>

    <!-- Contact -->
    <div class="md:col-span-3 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-primary">Contact</h3>
      <div class="space-y-4">
        <div class="flex items-start gap-3 group">
          <MapPin class="w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux mt-0.5 flex-shrink-0" />
          <span class="text-sm text-zinc-500 leading-relaxed">{BUSINESS.address.full}</span>
        </div>
        <div class="flex items-center gap-3 group">
          <Phone class="w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux flex-shrink-0" />
          <span class="text-sm text-zinc-500">{BUSINESS.phone}</span>
        </div>
        <div class="flex items-center gap-3 group">
          <Mail class="w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux flex-shrink-0" />
          <span class="text-sm text-zinc-500">{BUSINESS.email}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
    <p class="text-xs text-zinc-600">
      &copy; {BUSINESS.established} {BUSINESS.name.toUpperCase()} &mdash; ALL RIGHTS RESERVED
    </p>
    <div class="flex gap-6 text-xs text-zinc-600">
      <button class="hover:text-white transition-lux">Privacy</button>
      <button class="hover:text-white transition-lux">Terms</button>
      <button class="hover:text-white transition-lux">Accessibility</button>
    </div>
  </div>
</footer>
