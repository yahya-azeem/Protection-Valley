<script lang="ts">
  import { X } from 'lucide-svelte';

  interface Props {
    src: string;
    alt: string;
    zoom?: number;
    lensSize?: number;
  }

  let { src, alt, zoom = 2.5, lensSize = 160 }: Props = $props();

  let containerEl: HTMLDivElement = $state()!;
  let mouseX = $state(0);
  let mouseY = $state(0);
  let showLens = $state(false);
  let showLightbox = $state(false);

  function handleMouseMove(e: MouseEvent) {
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function handleMouseEnter() { showLens = true; }
  function handleMouseLeave() { showLens = false; }
  function handleClick() { showLightbox = true; }
  function closeLightbox() { showLightbox = false; }
  function handleKeydown(e: KeyboardEvent) { if (e.key === 'Escape') closeLightbox(); }

  // Pixel-based positioning — no percentage rounding issues
  let lensLeft = $derived(mouseX - lensSize / 2);
  let lensTop = $derived(mouseY - lensSize / 2);

  // The magnified image is zoom * container size, offset so cursor point is centered
  let imgWidth = $derived(containerEl ? containerEl.clientWidth * zoom : 0);
  let imgHeight = $derived(containerEl ? containerEl.clientHeight * zoom : 0);
  let imgLeft = $derived(-(mouseX * zoom - lensSize / 2));
  let imgTop = $derived(-(mouseY * zoom - lensSize / 2));
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
      class="pointer-events-none absolute z-10 rounded-full border-2 border-primary/70 shadow-[0_0_40px_rgba(255,136,0,0.2)] overflow-hidden"
      style:width="{lensSize}px"
      style:height="{lensSize}px"
      style:left="{lensLeft}px"
      style:top="{lensTop}px"
    >
      <img
        {src}
        {alt}
        class="absolute pointer-events-none select-none"
        style:width="{imgWidth}px"
        style:height="{imgHeight}px"
        style:left="{imgLeft}px"
        style:top="{imgTop}px"
        draggable="false"
      />
    </div>

    <!-- Crosshair on cursor -->
    <div
      class="pointer-events-none absolute z-20 w-px bg-primary/50"
      style:width="1px"
      style:height="{lensSize * 0.6}px"
      style:left="{mouseX}px"
      style:top="{mouseY - lensSize * 0.3}px"
    ></div>
    <div
      class="pointer-events-none absolute z-20 bg-primary/50"
      style:width="{lensSize * 0.6}px"
      style:height="1px"
      style:left="{mouseX - lensSize * 0.3}px"
      style:top="{mouseY}px"
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
    <button
      class="absolute top-4 right-4 z-[110] p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white transition-all duration-200"
      onclick={closeLightbox}
      aria-label="Close enlarged image"
    >
      <X class="w-5 h-5" />
    </button>

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
