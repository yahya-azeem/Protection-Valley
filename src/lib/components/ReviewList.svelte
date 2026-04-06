<script lang="ts">
  import { Star, CheckCircle } from 'lucide-svelte';
  import type { Review } from '$lib/types';

  interface Props {
    reviews: Review[];
  }

  let { reviews }: Props = $props();

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<div class="space-y-8">
  {#if reviews.length === 0}
    <div class="py-12 border-y border-white/5 text-center">
      <p class="text-sm text-zinc-500 uppercase tracking-widest">No reviews yet. Be the first to share your experience.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-8">
      {#each reviews as review}
        <div class="flex flex-col gap-4 pb-8 border-b border-white/5 last:border-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              {#each Array(5) as _, i}
                <Star 
                  class="w-3 h-3 {i < review.rating ? 'text-primary fill-primary' : 'text-zinc-800'}" 
                />
              {/each}
            </div>
            <span class="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
              {formatDate(review.created_at)}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-white">{review.user_name}</span>
            {#if review.is_verified}
              <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <CheckCircle class="w-2.5 h-2.5 text-primary" />
                <span class="text-[9px] text-primary font-bold uppercase tracking-tighter">Verified Purchase</span>
              </div>
            {/if}
          </div>

          <p class="text-sm text-zinc-400 leading-relaxed max-w-2xl italic">
            "{review.comment}"
          </p>
        </div>
      {/each}
    </div>
  {/if}
</div>
