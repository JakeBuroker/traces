import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        server: {
            proxy: {
                "/api":'http://localhost:5001',
            }
        },
        plugins: [react(), mkcert()],
    };
});