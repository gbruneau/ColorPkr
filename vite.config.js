import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json';
const appVersion = pkg.version;

function buildNumberFromDate(d = new Date()) {
    const pad = (n , l = 2) => String(n).padStart(l, '0')
    const y = d.getFullYear()
    const m = pad(d.getMonth() + 1)
    const day = pad(d.getDate())
    const h = pad(d.getHours())
    const min = pad(d.getMinutes())
    // yyyymmdd.hhmm
    return `${y}${m}${day}.${h}${min}`
}


export default defineConfig({
    root: "src",
    base: "./",
    clearScreen: false,
    server: { 
        https: false,
        host: true
    },
    publicDir: 'asset',
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            strategies: 'generateSW',
            includeAssets: ['ColorPkrIcon.svg', 'ColorPkrIcon-192.png', 'ColorPkrIcon-512.png'],
            manifest: {
                name: 'Color Pkr',
                short_name: 'ColorPkr',
                description: 'A professional color picker and palette management tool',
                theme_color: '#3498db',
                background_color: '#2c3e50',
                display: 'standalone',
                orientation: 'any',
                scope: './',
                start_url: './',
                icons: [
                    {
                        src: './ColorPkrIcon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: './ColorPkrIcon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: './ColorPkrIcon.svg',
                        sizes: 'any',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ],
                categories: ['productivity', 'utilities', 'design'],
                lang: 'en'
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            }
                        }
                    }
                ]
            }
        })
    ],
    build:
    {
        outDir: "../dist/ColorPkr",
        manifest: true
    },
    define: {
        'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
        'import.meta.env.VITE_BUILD_NUMBER': JSON.stringify(buildNumberFromDate())
    }
})
