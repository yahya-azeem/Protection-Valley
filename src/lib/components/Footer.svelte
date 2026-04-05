<script lang="ts">
  import { base } from '$app/paths';
  import { BUSINESS, CATEGORIES } from '$lib/constants';
  import { currentCategory } from '$lib/stores';
</script>

<footer class="bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-16">
    <!-- Brand -->
    <div class="md:col-span-5 space-y-6">
      <a href="/" class="flex items-center gap-4 hover:scale-105 transition-lux group">
        <div class="w-16 h-16 bg-[#0A0A0A] border border-white/10 rounded group-hover:border-primary/40 transition-lux flex items-center justify-center overflow-hidden">
          <img src="{base}/images/logo-v3.png" alt="Protection Valley" class="w-full h-full object-contain" />
        </div>
        <div>
          <h2 class="text-xl font-serif text-white tracking-tight">{BUSINESS.name}</h2>
          <p class="text-xs text-zinc-500 uppercase tracking-widest">{BUSINESS.tagline}</p>
        </div>
      </a>
      <p class="text-sm text-zinc-400 leading-relaxed max-w-sm">
        Forged for the rugged, built for the professional. 
        Premium protection gear engineered for durability and uncompromising safety.
      </p>
    </div>

    <!-- Links -->
    <div class="md:col-span-2 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-primary">Catalog</h3>
      <ul class="space-y-2">
        {#each CATEGORIES.filter(c => c !== 'All').slice(0, 5) as cat}
          <li>
            <a
              href="/catalog"
              onclick={() => currentCategory.set(cat)}
              class="text-sm text-zinc-500 hover:text-white transition-lux"
            >
              {cat}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <div class="md:col-span-2 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-primary">Company</h3>
      <ul class="space-y-2 text-sm text-zinc-500">
        <li><a href="/contact" class="hover:text-white transition-lux">Support</a></li>
        <li><a href="/about" class="hover:text-white transition-lux">Our Heritage</a></li>
        <li><a href="/login" class="hover:text-white transition-lux">Wholesale Portal</a></li>
      </ul>
    </div>

    <!-- Contact -->
    <div class="md:col-span-3 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-primary">Location</h3>
      <div class="space-y-4">
        <p class="text-sm text-zinc-400 leading-relaxed">
          {BUSINESS.address.full}<br/>
          {BUSINESS.phone}
        </p>
        <p class="text-xs text-zinc-600 italic">
          {BUSINESS.hours}
        </p>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
    <p class="text-[10px] uppercase tracking-widest text-zinc-600">
      © {BUSINESS.established} {BUSINESS.name}. All Rights Reserved.
    </p>
    <div class="flex gap-8">
      <a href="/privacy" class="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-lux">Privacy</a>
      <a href="/terms" class="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white transition-lux">Terms</a>
    </div>
  </div>
</footer>
