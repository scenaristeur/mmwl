import { defineConfig } from 'vite'

// eslint-disable-next-line no-undef
const base = process.env.NODE_ENV === 'production' ? '/mmlw/' : '/'

// https://vitejs.dev/config/
export default defineConfig({
    base: base,
    // plugins: [

    // ],
})