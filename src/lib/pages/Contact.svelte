<script lang="ts">
  import { Phone, Mail, MapPin, Globe } from 'lucide-svelte';
  import { BUSINESS } from '$lib/constants';
</script>

<div class="bg-black min-h-screen text-white antialiased">
  <!-- Header -->
  <section class="pt-32 pb-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="space-y-4 mb-8">
        <span class="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Get In Touch</span>
        <h1 class="text-5xl md:text-6xl font-serif text-white tracking-tight leading-none">
          Visit Our <span class="italic text-primary">Store</span>
        </h1>
      </div>
    </div>
  </section>

  <div class="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
    <!-- Contact Info -->
    <div class="lg:col-span-4 space-y-12">
      <div class="space-y-8">
        <div class="flex items-start gap-5 group">
          <div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-lux flex-shrink-0">
            <MapPin class="w-5 h-5 text-primary" />
          </div>
          <div class="space-y-1">
            <h3 class="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Location</h3>
            <p class="text-lg font-serif">{BUSINESS.address.city}</p>
            <p class="text-sm text-zinc-500">{BUSINESS.address.street}</p>
            <p class="text-sm text-zinc-500">{BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}</p>
          </div>
        </div>

        <div class="flex items-start gap-5 group">
          <div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-lux flex-shrink-0">
            <Phone class="w-5 h-5 text-primary" />
          </div>
          <div class="space-y-1">
            <h3 class="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Phone</h3>
            <p class="text-lg font-serif">{BUSINESS.phone}</p>
            <p class="text-sm text-zinc-500">{BUSINESS.hours}</p>
          </div>
        </div>

        <div class="flex items-start gap-5 group">
          <div class="w-12 h-12 bg-[#0A0A0A] border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-lux flex-shrink-0">
            <Mail class="w-5 h-5 text-primary" />
          </div>
          <div class="space-y-1">
            <h3 class="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Email</h3>
            <p class="text-lg font-serif break-all">{BUSINESS.email}</p>
          </div>
        </div>
      </div>

      <div class="p-6 bg-[#0A0A0A] border border-white/10 rounded">
        <h4 class="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">Global Presence</h4>
        <div class="flex items-center gap-4 text-zinc-500">
          <Globe class="w-8 h-8 opacity-30 flex-shrink-0" />
          <p class="text-sm leading-relaxed">
            Supporting trade professionals across North America, Europe, and Asia-Pacific.
          </p>
        </div>
      </div>
    </div>

    <!-- Google Maps -->
    <div class="lg:col-span-8">
      <div class="bg-[#0A0A0A] border border-white/10 rounded overflow-hidden shadow-2xl">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3352.05!2d-96.8903!3d32.869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e9f06fad9cfcf%3A0xa64addf43e8f7a4f!2s11456%20Harry%20Hines%20Blvd%20%23103%2C%20Dallas%2C%20TX%2075229!5e0!3m2!1sen!2sus!4v1711234567890!5m2!1sen!2sus"
          width="100%"
          height="500"
          style="border:0; filter: invert(90%) hue-rotate(180deg) saturate(0.3) brightness(0.6);"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Protection Valley Store Location"
          class="w-full"
        ></iframe>
        <div class="p-4 text-center">
          <a
            href="https://www.google.com/maps/place/11456+Harry+Hines+Blvd+%23103,+Dallas,+TX+75229"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-semibold text-primary hover:text-white transition-lux"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
