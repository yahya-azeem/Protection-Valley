import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: '/Protection-Valley/',
  plugins: [svelte()],
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
