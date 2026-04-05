<script lang="ts">
  /**
   * OptimizedImage.svelte
   * Leverages Vercel Image Optimization for high performance image delivery.
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

  // Redirect to Vercel Image Optimization endpoint if available
  // Format: /_vercel/image?url=URL&w=WIDTH&q=QUALITY
  function getOptimizedUrl(sourceUrl: string, w: number) {
    if (!sourceUrl) return '';
    // Skip external image optimization if desired or if not absolute
    if (sourceUrl.startsWith('data:') || sourceUrl.startsWith('blob:')) return sourceUrl;
    
    // We encode the URL to pass it to Vercel
    const encodedUrl = encodeURIComponent(sourceUrl);
    return `/_vercel/image?url=${encodedUrl}&w=${w}&q=75`;
  }

  // Generate a srcset for responsive images
  const widths = [640, 750, 1080, 1200, 1920, 2048, 3840];
  const srcset = $derived(
    widths
      .map((w) => `${getOptimizedUrl(src, w)} ${w}w`)
      .join(', ')
  );
</script>

<div class="overflow-hidden bg-zinc-900/50 relative {className}" style:aspect-ratio={width && height ? `${width}/${height}` : 'auto'}>
  <img
    {src}
    {alt}
    {srcset}
    {sizes}
    loading={priority ? 'eager' : loading}
    decoding={priority ? 'sync' : 'async'}
    class="w-full h-full object-cover transition-opacity duration-500 opacity-0"
    onload={(e) => (e.currentTarget as HTMLImageElement).classList.remove('opacity-0')}
    {width}
    {height}
  />
</div>

<style>
  img {
    will-change: opacity;
  }
</style>
