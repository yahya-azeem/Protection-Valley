<script lang="ts">
  import { Star, Send, Loader2 } from 'lucide-svelte';
  import { showToast, currentUser } from '$lib/stores';
  import { API_CONFIG } from '$lib/config';
  import type { Review } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  interface Props {
    productId: number;
  }

  let { productId }: Props = $props();

  let rating = $state(5);
  let comment = $state('');
  let submitting = $state(false);
  let hoverRating = $state(0);

  async function handleSubmit() {
    if (!$currentUser) {
      showToast('Please sign in to leave a review.');
      return;
    }

    if (!comment.trim()) {
      showToast('Please enter a comment.');
      return;
    }

    submitting = true;
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment
        })
      });

      if (response.ok) {
        const newReview: Review = await response.json();
        showToast('Thank you! Your verified review has been posted.');
        comment = '';
        rating = 5;
        dispatch('reviewPosted', newReview);
        return;
      }

      const err = await response.json();
      showToast(err.error || 'Failed to post review.');
    } catch {
      showToast('Service unavailable. Please try again later.');
    } finally {
      submitting = false;
    }
  }
</script>

<div class="bg-[#0A0A0A] border border-white/5 p-8 rounded shadow-2xl space-y-6">
  <div class="space-y-1">
    <h3 class="text-xl font-serif text-white uppercase tracking-tight">Write a Verified Review</h3>
    <p class="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">As a confirmed purchaser, your feedback is invaluable.</p>
  </div>

  <div class="space-y-4">
    <!-- Star Selection -->
    <div>
      <span class="block text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Rating</span>
      <div class="flex items-center gap-2">
        {#each Array(5) as _, i}
          <button 
            type="button"
            onclick={() => rating = i + 1}
            onmouseenter={() => hoverRating = i + 1}
            onmouseleave={() => hoverRating = 0}
            class="transition-lux hover:scale-125 focus:outline-none"
          >
            <Star 
              class="w-6 h-6 { (hoverRating || rating) > i ? 'text-primary fill-primary' : 'text-zinc-800' }" 
            />
          </button>
        {/each}
        <span class="ml-4 text-sm font-serif text-white opacity-50">{rating} / 5</span>
      </div>
    </div>

    <!-- Comment Area -->
    <div>
      <span class="block text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Your Experience</span>
      <textarea 
        bind:value={comment}
        placeholder="How is the quality and performance of the gear?"
        class="w-full bg-black border border-white/10 rounded p-4 text-sm text-white placeholder:text-zinc-700 focus:ring-1 focus:ring-primary focus:border-primary transition-lux outline-none min-h-[120px]"
      ></textarea>
    </div>

    <button 
      onclick={handleSubmit}
      disabled={submitting}
      class="w-full btn-primary py-4 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] relative overflow-hidden"
    >
      {#if submitting}
        <Loader2 class="w-4 h-4 animate-spin" />
        POSTING...
      {:else}
        <Send class="w-4 h-4" />
        SUBMIT VERIFIED REVIEW
      {/if}
    </button>
  </div>
</div>
