import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: base must match your GitHub repo name exactly so assets
// resolve correctly on GitHub Pages (https://USERNAME.github.io/REPO_NAME/).
// If you rename the repo, update this value to match.
export default defineConfig({
  plugins: [react()],
  base: '/cadmech-fullstack-assessment/',
});
