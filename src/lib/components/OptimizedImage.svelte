<script lang="ts">
  import { dev } from '$app/environment';
  
  /**
   * OptimizedImage.svelte
   * Leverages Vercel Image Optimization for high performance image delivery in production.
   * Region-aware: Defaults to standard images in development to prevent 404s.
   */
  interface Props {
    src: string;
    alt: string;
    class?: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    sizes?: string;
    priority?: boolean;
  }

  let { 
    src, 
    alt, 
    class: className = '', 
    width, 
    height, 
    loading = 'lazy',
    sizes = '100vw',
    priority = false 
  }: Props = $props();

  // Redirect to Vercel Image Optimization endpoint ONLY if in production
  function getOptimizedUrl(sourceUrl: string, w: number) {
    if (!sourceUrl || dev) return sourceUrl;
    
    // Skip optimization for transient sources
    if (sourceUrl.startsWith('data:') || sourceUrl.startsWith('blob:')) return sourceUrl;
    
    // Encode the URL for Vercel's optimizer
    const encodedUrl = encodeURIComponent(sourceUrl);
    return `/_vercel/image?url=${encodedUrl}&w=${w}&q=75`;
  }

  // Generate a srcset for responsive images (Only in production)
  const widths = [640, 750, 1080, 1200, 1920];
  const srcset = $derived(
    dev ? '' : widths
      .map((w) => `${getOptimizedUrl(src, w)} ${w}w`)
      .join(', ')
  );
</script>

<div 
  class="overflow-hidden bg-zinc-900 relative {className}" 
  style:aspect-ratio={width && height ? `${width}/${height}` : 'auto'}
>
  <img
    {src}
    {alt}
    srcset={srcset || undefined}
    {sizes}
    loading={priority ? 'eager' : loading}
    decoding={priority ? 'sync' : 'async'}
    class="w-full h-full object-cover transition-opacity duration-300"
    {width}
    {height}
  />
</div>

<style>
  div {
    /* Prevent layout shift while loading */
    background: linear-gradient(110deg, #09090b 8%, #18181b 18%, #09090b 33%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
  }

  @keyframes shimmer {
    to {
      background-position-x: -200%;
    }
  }

  img {
    will-change: opacity;
  }
</style>
