import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// IMPORTANT: base must match your GitHub repo name for GitHub Pages to work.
// e.g. if your repo is github.com/<user>/pegasus-competition, keep base as '/pegasus-competition/'
// If you deploy to a custom domain or a "<user>.github.io" root repo, set base to '/'
export default defineConfig({
  base: '/Pegasus-Competition/',
  plugins: [react(), tailwindcss()],
})
