<script lang="ts">
  import { Mail, Phone, MapPin, MessageSquare } from 'lucide-svelte';
  import { BUSINESS } from '$lib/constants';
</script>

<svelte:head>
  <title>Contact Support | Protection Valley</title>
</svelte:head>

<div class="bg-black min-h-screen pt-32 pb-24">
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <!-- Contact Info -->
      <div class="space-y-12">
        <div>
          <h1 class="text-5xl font-serif text-white mb-6">Support & Inquiries</h1>
          <p class="text-lg text-zinc-400 leading-relaxed max-w-md">
            Our team is here to assist with technical gear specifications, wholesale accounts, and order fulfillment.
          </p>
        </div>

        <div class="space-y-8">
          <div class="flex items-start gap-6">
            <div class="w-12 h-12 bg-primary/10 rounded flex items-center justify-center shrink-0">
              <Phone class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 class="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-2">Phone</h3>
              <p class="text-xl text-white font-serif">{BUSINESS.phone}</p>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div class="w-12 h-12 bg-primary/10 rounded flex items-center justify-center shrink-0">
              <MapPin class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 class="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-2">Office</h3>
              <p class="text-xl text-white font-serif whitespace-pre-line">{BUSINESS.address.full}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Simple Form Placeholder -->
      <div class="bg-[#0A0A0A] border border-white/10 p-8 md:p-12 rounded shadow-2xl">
        <form class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-zinc-500" for="name">Full Name</label>
              <input type="text" id="name" class="w-full bg-black border border-white/15 rounded py-3 px-4 text-white focus:border-primary outline-none" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-zinc-500" for="email">Email Address</label>
              <input type="email" id="email" class="w-full bg-black border border-white/15 rounded py-3 px-4 text-white focus:border-primary outline-none" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-zinc-500" for="subject">Subject</label>
            <input type="text" id="subject" class="w-full bg-black border border-white/15 rounded py-3 px-4 text-white focus:border-primary outline-none" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-zinc-500" for="message">Message</label>
            <textarea id="message" rows="5" class="w-full bg-black border border-white/15 rounded py-3 px-4 text-white focus:border-primary outline-none"></textarea>
          </div>
          <button type="submit" class="btn-primary w-full py-4 tracking-[0.2em] text-xs">
            SEND MESSAGE
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
