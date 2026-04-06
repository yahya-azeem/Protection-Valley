<script lang="ts">
  import { base } from '$app/paths';
  import { Award, Users, ShieldCheck, Heart, Map, Sparkles } from 'lucide-svelte';
</script>

<div class="bg-black min-h-screen text-white antialiased">
  <!-- Boutique Hero -->
  <section class="relative py-48 overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      <img src="{base}/images/hero-bg.jpg" alt="Background" class="w-full h-full object-cover grayscale" />
    </div>
    
    <div class="relative max-w-5xl mx-auto px-6 text-center space-y-12">
      <span class="text-[0.65rem] font-bold uppercase tracking-[0.5em] text-primary">Established 2025</span>
      <h1 class="text-6xl md:text-8xl font-serif text-white tracking-tight leading-[0.9]">
        Defined by <br/><span class="italic text-primary">Craftsmanship.</span>
      </h1>
      <p class="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-zinc-500 max-w-2xl mx-auto leading-loose border-y border-white/5 py-12">
        We create the load-bearing systems that define the modern professional. Built for longevity. Designed for excellence.
      </p>
    </div>
  </section>

  <!-- Heritage Pillars -->
  <section class="py-32 bg-black border-t border-white/5">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-16">
        <div class="space-y-8 group">
          <div class="w-14 h-14 bg-dark-surface border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-lux">
            <Award class="w-6 h-6 text-primary" />
          </div>
          <h3 class="text-2xl font-serif tracking-tight">Pure Materials</h3>
          <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
            Every hide and fiber is selected for purity and performance. We source only the finest full-grain leathers and premium synthetics.
          </p>
        </div>
        
        <div class="space-y-8 group">
          <div class="w-14 h-14 bg-dark-surface border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-lux">
            <Users class="w-6 h-6 text-primary" />
          </div>
          <h3 class="text-2xl font-serif tracking-tight">Master Guild</h3>
          <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
            Our designs are forged through generations of trade expertise. We don't just build gear; we support the legacy of your craft.
          </p>
        </div>
        
        <div class="space-y-8 group">
          <div class="w-14 h-14 bg-dark-surface border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-lux">
            <ShieldCheck class="w-6 h-6 text-primary" />
          </div>
          <h3 class="text-2xl font-serif tracking-tight">Lifetime Integrity</h3>
          <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
            Every stitch is a promise. Our commitment to your performance is absolute. If our gear fails your standard, we replace the unit.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Detail Focus -->
  <section class="py-32 bg-dark-surface">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <div class="space-y-12">
        <h2 class="text-4xl md:text-5xl font-serif tracking-tight leading-tight">Authentic Heritage,<br/><span class="text-primary italic">Modern Utility.</span></h2>
        <div class="space-y-10">
          <div class="flex items-start space-x-6">
            <div class="text-primary font-serif italic text-2xl">01.</div>
            <div>
              <h4 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] mb-2">Artisanal Sourcing</h4>
              <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">Only materials that meet our threshold for aesthetic and durability are permitted for construction.</p>
            </div>
          </div>
          <div class="flex items-start space-x-6">
            <div class="text-primary font-serif italic text-2xl">02.</div>
            <div>
              <h4 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] mb-2">Heritage Assembly</h4>
              <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">Hand-bonded stress points and triple-stitching patterns ensure a structural integrity that outlives the user.</p>
            </div>
          </div>
          <div class="flex items-start space-x-6">
            <div class="text-primary font-serif italic text-2xl">03.</div>
            <div>
              <h4 class="text-[0.65rem] font-bold uppercase tracking-[0.4em] mb-2">Field Performance</h4>
              <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">Rigorous operational validation ensures every piece of equipment excels in the professional landscape.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="relative group">
        <div class="absolute -inset-4 border border-primary/20 scale-95 group-hover:scale-105 transition-lux duration-1000"></div>
        <div class="relative aspect-[4/5] bg-black overflow-hidden shadow-2xl">
          <img src="{base}/images/hero-bg.jpg" alt="Craftsmanship" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>
      </div>
    </div>
  </section>
</div>
