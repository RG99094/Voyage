import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 1000, // Increase the warning limit (in KBs)
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'react-vendor';
                        if (id.includes('framer-motion')) return 'animation-vendor';
                        if (id.includes('leaflet') || id.includes('react-leaflet')) return 'map-vendor';
                        if (id.includes('@react-google-maps')) return 'google-map-vendor';
                        if (id.includes('lucide-react')) return 'icon-vendor';
                        if (id.includes('recharts')) return 'charts-vendor';
                        if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf-vendor';
                        if (id.includes('@hello-pangea/dnd')) return 'dnd-vendor';
                        return 'vendor'; // Any other dependencies
                    }
                },
            },
        },
    },
});
