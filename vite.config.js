// vite.config.js
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


export default {
    root: "src",
    base: "./",
    clearScreen: false,
    server: { https: false },
    build:
    {
        outDir: "../dist/ColorPkr",
        manifest: true
    },
    define: {
        'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
        'import.meta.env.VITE_BUILD_NUMBER': JSON.stringify(buildNumberFromDate())
    }
}
