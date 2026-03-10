import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 2000, // Increase the warning limit (in KBs) to silence the Vercel warning without breaking the app
    },
});
