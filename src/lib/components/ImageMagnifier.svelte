<script lang="ts">
  import { X } from 'lucide-svelte';

  interface Props {
    src: string;
    alt: string;
    zoom?: number;
  }

  let { src, alt, zoom = 2.5 }: Props = $props();

  let containerEl: HTMLDivElement;
  let lensX = $state(0);
  let lensY = $state(0);
  let showLens = $state(false);
  let showLightbox = $state(false);

  function handleMouseMove(e: MouseEvent) {
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    lensX = ((e.clientX - rect.left) / rect.width) * 100;
    lensY = ((e.clientY - rect.top) / rect.height) * 100;
  }

  function handleMouseEnter() {
    showLens = true;
  }

  function handleMouseLeave() {
    showLens = false;
  }

  function handleClick() {
    showLightbox = true;
  }

  function closeLightbox() {
    showLightbox = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeLightbox();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Main image with hover magnifier -->
<div
  bind:this={containerEl}
  class="relative cursor-zoom-in overflow-hidden group"
  role="button"
  tabindex="0"
  aria-label="Click to enlarge image"
  onclick={handleClick}
  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onmousemove={handleMouseMove}
>
  <slot />

  <!-- Magnifying lens -->
  {#if showLens}
    <div
      class="pointer-events-none absolute z-10 w-40 h-40 rounded-full border-2 border-primary/60 shadow-[0_0_30px_rgba(255,136,0,0.15)] overflow-hidden transition-opacity duration-150"
      style:left="calc({lensX}% - 80px)"
      style:top="calc({lensY}% - 80px)"
    >
      <div
        class="w-full h-full"
        style:background-image="url('{src}')"
        style:background-size="{zoom * 100}%"
        style:background-position="{lensX}% {lensY}%"
      ></div>
    </div>
    <!-- Crosshair -->
    <div
      class="pointer-events-none absolute z-20 w-px h-8 bg-primary/40"
      style:left="{lensX}%"
      style:top="calc({lensY}% - 16px)"
    ></div>
    <div
      class="pointer-events-none absolute z-20 h-px w-8 bg-primary/40"
      style:left="calc({lensX}% - 16px)"
      style:top="{lensY}%"
    ></div>
  {/if}

  <!-- Hover hint -->
  <div class="absolute bottom-3 right-3 z-10 bg-black/70 backdrop-blur-sm border border-white/10 rounded px-2.5 py-1 text-[10px] text-zinc-400 uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
    Hover to zoom · Click to expand
  </div>
</div>

<!-- Lightbox modal -->
{#if showLightbox}
  <div
    class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
    role="dialog"
    aria-modal="true"
    aria-label="Enlarged product image"
    onclick={closeLightbox}
    onkeydown={(e) => { if (e.key === 'Escape') closeLightbox(); }}
    tabindex="-1"
  >
    <!-- Close button -->
    <button
      class="absolute top-4 right-4 z-[110] p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white transition-all duration-200"
      onclick={closeLightbox}
      aria-label="Close enlarged image"
    >
      <X class="w-5 h-5" />
    </button>

    <!-- Full image -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img
      {src}
      {alt}
      class="max-w-full max-h-full object-contain rounded select-none"
      onclick={(e) => e.stopPropagation()}
      draggable="false"
    />
  </div>
{/if}
