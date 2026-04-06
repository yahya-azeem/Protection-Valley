<script lang="ts">
  import { dev, browser } from '$app/environment';
  import { page } from '$app/stores';
  
  /**
   * OptimizedImage.svelte
   * High-performance image loading with Vercel Image Optimization fallback.
   * Region-aware: Prepends the site origin in production to satisfy absolute URL requirement.
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

  // Redirect to Vercel Image Optimization endpoint with ABSOLUTE URL in production
  function getOptimizedUrl(sourceUrl: string, w: number) {
    if (!sourceUrl || dev) return sourceUrl;
    
    // Absolute URLs start with http:// or https://
    // Vercel optimizer requires internal URLs to be absolute too when passed as a param
    let absoluteUrl = sourceUrl;
    
    // If it's a relative internal path, prepend the origin
    if (sourceUrl.startsWith('/') && browser) {
      const origin = $page.url.origin;
      absoluteUrl = `${origin}${sourceUrl}`;
    }
    
    // Skip optimization for transient sources
    if (sourceUrl.startsWith('data:') || sourceUrl.startsWith('blob:')) return sourceUrl;
    
    // Encode the ABSOLUTE URL for Vercel's optimizer
    const encodedUrl = encodeURIComponent(absoluteUrl);
    return `/_vercel/image?url=${encodedUrl}&w=${w}&q=75`;
  }

  // Generate a srcset for responsive images (Only in production)
  const widths = [640, 750, 1080, 1200, 1920];
  const srcset = $derived(
    dev ? '' : widths
      .map((w) => `${getOptimizedUrl(src, w)} ${w}w`)
      .join(', ')
  );

  let hasError = $state(false);
</script>

<div 
  class="overflow-hidden bg-zinc-900 relative {className}" 
  style:aspect-ratio={width && height ? `${width}/${height}` : 'auto'}
>
  <img
    {src}
    {alt}
    srcset={!hasError ? (srcset || undefined) : undefined}
    {sizes}
    loading={priority ? 'eager' : loading}
    decoding={priority ? 'sync' : 'async'}
    class="w-full h-full object-cover transition-opacity duration-300"
    {width}
    {height}
    onerror={() => hasError = true}
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
