<script lang="ts">
  import { base } from '$app/paths';
  import { showPage } from '$lib/stores';
  import { Mail, Phone, MapPin } from 'lucide-svelte';

  const categories = ['Tool Belts', 'Pouches', 'Aprons', 'Accessories'];
</script>

<footer class="bg-black border-t border-white/5 pt-32 pb-16 text-white antialiased">
  <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-20">
    <!-- Brand / Mission -->
    <div class="md:col-span-5 space-y-10">
      <button onclick={() => showPage('home')} class="flex items-center space-x-6 hover:scale-105 transition-lux group">
        <!-- New Transparent Logo (Shield Removed) -->
        <div class="w-20 h-20 bg-dark-surface border border-white/5 p-0 rounded-sm group-hover:border-primary/40 transition-lux flex items-center justify-center overflow-hidden">
          <img src="{base}/images/logo-v3.png" alt="Protection Valley" class="w-full h-full object-contain" />
        </div>
        <div class="flex flex-col text-left">
          <span class="text-3xl font-serif text-white tracking-tight">Protection Valley</span>
          <span class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-primary">Est. 2025</span>
        </div>
      </button>
      <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-loose max-w-sm">
        Professional grade load-bearing equipment engineered for uncompromising durability. Handcrafted for the modern trade professional.
      </p>
      <div class="flex space-x-6 pt-4">
        {#each [1,2,3] as i}
          <div class="w-10 h-10 bg-dark-surface border border-white/5 hover:border-primary/40 transition-lux cursor-pointer rounded-sm"></div>
        {/each}
      </div>
    </div>

    <!-- Collection -->
    <div class="md:col-span-2 space-y-8">
      <h3 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary">Collection</h3>
      <ul class="space-y-4">
        {#each categories as cat}
          <li>
            <button 
              onclick={() => showPage('catalog')} 
              class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-lux"
            >
              {cat}
            </button>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Company -->
    <div class="md:col-span-2 space-y-8">
      <h3 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary">Company</h3>
      <ul class="space-y-4 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500">
        <li><button onclick={() => showPage('contact')} class="hover:text-white transition-lux">Support</button></li>
        <li><button class="hover:text-white transition-lux">Logistics</button></li>
        <li><button class="hover:text-white transition-lux">Warranty</button></li>
        <li><button onclick={() => showPage('about')} class="hover:text-white transition-lux">Heritage</button></li>
      </ul>
    </div>

    <!-- Contact -->
    <div class="md:col-span-3 space-y-8">
      <h3 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary">Contact</h3>
      <div class="space-y-6">
        <div class="flex items-start space-x-4 group">
          <MapPin class="w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux mt-1" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
            1234 Industrial Way<br/>Los Angeles, CA 90001
          </span>
        </div>
        <div class="flex items-center space-x-4 group">
          <Phone class="w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500">800-PRO-GEAR</span>
        </div>
        <div class="flex items-center space-x-4 group">
          <Mail class="w-4 h-4 text-zinc-600 group-hover:text-primary transition-lux" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500">HQ@PROTECTIONVALLEY.COM</span>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
    <p class="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-zinc-700">
      &copy; 2025 PROTECTION VALLEY // ALL RIGHTS RESERVED
    </p>
    <div class="flex space-x-8 text-[0.6rem] font-bold uppercase tracking-[0.4em] text-zinc-700">
      <button class="hover:text-white transition-lux">Privacy</button>
      <button class="hover:text-white transition-lux">Terms</button>
      <button class="hover:text-white transition-lux">Accessibility</button>
    </div>
  </div>
</footer>
