import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 8080,
    },
    plugins: [
        react()
    ],
    base: '/',
    build: {
        outDir: 'dist', // 标准输出目录
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})