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
  let imgEl: HTMLImageElement = $state()!;
  let mouseX = $state(0);
  let mouseY = $state(0);
  let showLens = $state(false);
  let showLightbox = $state(false);
  let imgReady = $state(false);

  function handleMouseMove(e: MouseEvent) {
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function handleMouseEnter() { showLens = true; }
  function handleMouseLeave() { showLens = false; imgReady = false; }
  function handleClick() { showLightbox = true; }
  function closeLightbox() { showLightbox = false; }
  function handleKeydown(e: KeyboardEvent) { if (e.key === 'Escape') closeLightbox(); }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Main image with hover magnifier -->
<div
  bind:this={containerEl}
  class="relative cursor-crosshair group"
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

  <!-- Magnifier lens -->
  {#if showLens}
    {@const halfLens = lensSize / 2}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="pointer-events-none absolute z-10 rounded-full border-2 border-primary/80 shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_0_40px_rgba(255,136,0,0.15)]"
      style:width="{lensSize}px"
      style:height="{lensSize}px"
      style:left="{mouseX - halfLens}px"
      style:top="{mouseY - halfLens}px"
      style:overflow="hidden"
    >
      <img
        bind:this={imgEl}
        {src}
        {alt}
        class="absolute block"
        style:width="{containerEl.clientWidth * zoom}px"
        style:height="{containerEl.clientHeight * zoom}px"
        style:left="{halfLens - mouseX * zoom}px"
        style:top="{halfLens - mouseY * zoom}px"
        draggable="false"
        onload={() => imgReady = true}
      />
    </div>

    <!-- Thin crosshair -->
    <div
      class="pointer-events-none absolute z-20 bg-primary/40"
      style:width="1px"
      style:height="{lensSize + 4}px"
      style:left="{mouseX}px"
      style:top="{mouseY - halfLens - 2}px"
    ></div>
    <div
      class="pointer-events-none absolute z-20 bg-primary/40"
      style:width="{lensSize + 4}px"
      style:height="1px"
      style:left="{mouseX - halfLens - 2}px"
      style:top="{mouseY}px"
    ></div>
  {/if}
</div>

<!-- Lightbox -->
{#if showLightbox}
  <div
    class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
    role="dialog"
    aria-modal="true"
    aria-label="Enlarged product image"
    onclick={closeLightbox}
    onkeydown={(e) => { if (e.key === 'Escape') closeLightbox(); }}
    tabindex="-1"
  >
    <button
      class="absolute top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-full text-white transition-all"
      onclick={closeLightbox}
      aria-label="Close"
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
