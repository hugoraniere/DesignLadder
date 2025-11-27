import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to remove Bolt.new badge injection
function removeBoltBadge() {
  return {
    name: 'remove-bolt-badge',
    transformIndexHtml(html: string) {
      return html.replace(/<script[^>]*bolt\.new\/badge\.js[^>]*><\/script>/gi, '');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), removeBoltBadge()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
