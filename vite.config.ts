import { defineConfig } from 'vite'
import dts from "vite-plugin-dts"
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "TrialUI",
      fileName: (format) => `trial-ui.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    
  },

  plugins: [
    tailwindcss(),
    dts(),
    libInjectCss()
  ],
  
})