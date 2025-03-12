import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        alert: path.resolve(__dirname, "src/components/ui/alert.tsx"),
        avatar: path.resolve(__dirname, "src/components/ui/avatar.tsx"),
        breadcrumb: path.resolve(__dirname, "src/components/ui/breadcrumb.tsx"),
        button: path.resolve(__dirname, "src/components/ui/button.tsx"),
        card: path.resolve(__dirname, "src/components/ui/card.tsx"),
        collapsible: path.resolve(__dirname, "src/components/ui/collapsible.tsx"),
        "dropdown-menu": path.resolve(__dirname, "src/components/ui/dropdown-menu.tsx"),
        input: path.resolve(__dirname, "src/components/ui/input.tsx"),
        label: path.resolve(__dirname, "src/components/ui/label.tsx"),
        select: path.resolve(__dirname, "src/components/ui/select.tsx"),
        separator: path.resolve(__dirname, "src/components/ui/separator.tsx"),
        sheet: path.resolve(__dirname, "src/components/ui/sheet.tsx"),
        sidebar: path.resolve(__dirname, "src/components/ui/sidebar.tsx"),
        skeleton: path.resolve(__dirname, "src/components/ui/skeleton.tsx"),
        sonner: path.resolve(__dirname, "src/components/ui/sonner.tsx"),
        table: path.resolve(__dirname, "src/components/ui/table.tsx"),
        tooltip: path.resolve(__dirname, "src/components/ui/tooltip.tsx"),
      },
      name: "TenurinUI",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `components/ui/${entryName}.${format}.js`, 
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
    dts({
      entryRoot: "src",
      outDir: "dist", 
      tsconfigPath: "./tsconfig.json",
      include: ["src/components/ui"],
    }),
    libInjectCss(),
  ],
});
