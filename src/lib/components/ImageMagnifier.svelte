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
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  bind:this={containerEl}
  class="relative cursor-crosshair"
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

  {#if showLens}
    {@const half = lensSize / 2}
    {@const bgW = containerEl ? containerEl.clientWidth * zoom : 0}
    {@const bgH = containerEl ? containerEl.clientHeight * zoom : 0}
    <!-- bgPosition: map cursor to zoomed coordinates -->
    {@const bgX = (mouseX / (containerEl?.clientWidth || 1)) * bgW}
    {@const bgY = (mouseY / (containerEl?.clientHeight || 1)) * bgH}

    <div
      class="pointer-events-none absolute z-30 rounded-full border-2 border-primary shadow-[0_0_0_2px_rgba(0,0,0,0.6),0_8px_32px_rgba(0,0,0,0.5)]"
      style:width="{lensSize}px"
      style:height="{lensSize}px"
      style:left="{mouseX - half}px"
      style:top="{mouseY - half}px"
      style:background-image="url('{src}')"
      style:background-size="{bgW}px {bgH}px"
      style:background-position="{-bgX + half}px {-bgY + half}px"
      style:background-repeat="no-repeat"
    ></div>

    <div
      class="pointer-events-none absolute z-40 bg-primary/60"
      style:width="1px"
      style:height="{lensSize}px"
      style:left="{mouseX}px"
      style:top="{mouseY - half}px"
    ></div>
    <div
      class="pointer-events-none absolute z-40 bg-primary/60"
      style:width="{lensSize}px"
      style:height="1px"
      style:left="{mouseX - half}px"
      style:top="{mouseY}px"
    ></div>
  {/if}
</div>

{#if showLightbox}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
    role="dialog"
    aria-modal="true"
    onclick={closeLightbox}
    onkeydown={handleKeydown}
    tabindex="-1"
  >
    <button
      class="absolute top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
      onclick={closeLightbox}
    >
      <X class="w-5 h-5" />
    </button>
    <img
      {src}
      {alt}
      class="max-w-full max-h-full object-contain rounded"
      onclick={(e) => e.stopPropagation()}
      draggable="false"
    />
  </div>
{/if}
