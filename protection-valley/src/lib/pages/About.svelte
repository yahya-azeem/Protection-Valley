<script lang="ts">
  import { base } from '$app/paths';
  import { Award, Users, ShieldCheck } from 'lucide-svelte';
</script>

<div class="bg-[#0a0a0a] min-h-screen">
  <section class="relative py-24">
    <div class="absolute inset-0 bg-gradient-to-b from-dark-card to-[#0a0a0a]"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <img src="{base}/images/logo.png" alt="Protection Valley" class="h-24 w-auto mx-auto mb-8" />
      <h1 class="text-5xl md:text-6xl font-serif mb-6">Our Story</h1>
      <p class="text-xl text-dark-muted max-w-3xl mx-auto">
        At Protection Valley, we believe that quality workgear is essential for every tradesperson.
        Our mission is to protect your craft with gear that's built to last.
      </p>
    </div>
  </section>
  <section class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-dark-card p-8 rounded-lg text-center border border-dark-border">
          <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Award class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-xl font-medium mb-2">Premium Materials</h3>
          <p class="text-dark-muted">Full-grain leather and heavy-duty canvas built to last a lifetime.</p>
        </div>
        <div class="bg-dark-card p-8 rounded-lg text-center border border-dark-border">
          <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Users class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-xl font-medium mb-2">Tradesperson Designed</h3>
          <p class="text-dark-muted">Designed with input from real tradespeople who use our gear daily.</p>
        </div>
        <div class="bg-dark-card p-8 rounded-lg text-center border border-dark-border">
          <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <ShieldCheck class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-xl font-medium mb-2">Lifetime Warranty</h3>
          <p class="text-dark-muted">We stand behind our products with a lifetime craftsmanship guarantee.</p>
        </div>
      </div>
    </div>
  </section>
</div>
