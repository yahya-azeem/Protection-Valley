<script lang="ts">
  import { Mail, Phone, MapPin, Clock } from 'lucide-svelte';
  import { BUSINESS } from '$lib/constants';
</script>

<svelte:head>
  <title>Contact Support | {BUSINESS.name}</title>
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24">
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <!-- Contact Info -->
      <div class="space-y-12">
        <div>
          <h1 class="text-5xl font-serif text-white mb-6 tracking-tighter">Support & Inquiries</h1>
          <p class="text-lg text-zinc-400 leading-relaxed max-w-md">
            Our team is here to assist with technical gear specifications, wholesale accounts, and order fulfillment.
          </p>
        </div>

        <div class="space-y-8">
          <div class="flex items-start gap-6 group">
            <div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 rounded flex items-center justify-center shrink-0 transition-lux group-hover:border-primary/50">
              <Phone class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">Phone</h3>
              <p class="text-2xl text-white font-serif">{BUSINESS.phone}</p>
            </div>
          </div>

          <div class="flex items-start gap-6 group">
            <div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 rounded flex items-center justify-center shrink-0 transition-lux group-hover:border-primary/50">
              <Mail class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">Electronic Mail</h3>
              <p class="text-2xl text-white font-serif tracking-tight">{BUSINESS.email}</p>
            </div>
          </div>

          <div class="flex items-start gap-6 group">
            <div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 rounded flex items-center justify-center shrink-0 transition-lux group-hover:border-primary/50">
              <MapPin class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">Regional Headquarters</h3>
              <p class="text-xl text-white font-serif whitespace-pre-line leading-snug">{BUSINESS.address.full}</p>
            </div>
          </div>
          
          <div class="flex items-start gap-6 group">
            <div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 rounded flex items-center justify-center shrink-0 transition-lux group-hover:border-primary/50">
              <Clock class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">Operations</h3>
              <p class="text-xl text-white font-serif leading-snug">{BUSINESS.hours}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Google Maps Restore -->
      <div class="relative h-[400px] lg:h-auto min-h-[450px] bg-[#0A0A0A] border border-white/10 rounded overflow-hidden shadow-2xl">
        <iframe 
          src={BUSINESS.mapsEmbedUrl} 
          title="Protection Valley Location"
          class="w-full h-full grayscale invert opacity-70 border-0" 
          allowfullscreen 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        
        <div class="absolute inset-0 pointer-events-none border border-white/5"></div>
      </div>
    </div>
  </div>
</div>
