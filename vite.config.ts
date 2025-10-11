import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        accordion: path.resolve(__dirname, 'src/components/ui/accordion.tsx'),
        'alert-dialog': path.resolve(
          __dirname,
          'src/components/ui/alert-dialog.tsx'
        ),
        alert: path.resolve(__dirname, 'src/components/ui/alert.tsx'),
        avatar: path.resolve(__dirname, 'src/components/ui/avatar.tsx'),
        badge: path.resolve(__dirname, 'src/components/ui/badge.tsx'),
        breadcrumb: path.resolve(__dirname, 'src/components/ui/breadcrumb.tsx'),
        'button-group': path.resolve(
          __dirname,
          'src/components/ui/button-group.tsx'
        ),
        button: path.resolve(__dirname, 'src/components/ui/button.tsx'),
        calendar: path.resolve(__dirname, 'src/components/ui/calendar.tsx'),
        card: path.resolve(__dirname, 'src/components/ui/card.tsx'),
        carousel: path.resolve(__dirname, 'src/components/ui/carousel.tsx'),
        chart: path.resolve(__dirname, 'src/components/ui/chart.tsx'),
        checkbox: path.resolve(__dirname, 'src/components/ui/checkbox.tsx'),
        collapsible: path.resolve(
          __dirname,
          'src/components/ui/collapsible.tsx'
        ),
        command: path.resolve(__dirname, 'src/components/ui/command.tsx'),
        'context-menu': path.resolve(
          __dirname,
          'src/components/ui/context-menu.tsx'
        ),
        'datetime-picker': path.resolve(
          __dirname,
          'src/components/ui/datetime-picker.tsx'
        ),
        dialog: path.resolve(__dirname, 'src/components/ui/dialog.tsx'),
        drawer: path.resolve(__dirname, 'src/components/ui/drawer.tsx'),
        'dropdown-menu': path.resolve(
          __dirname,
          'src/components/ui/dropdown-menu.tsx'
        ),
        empty: path.resolve(__dirname, 'src/components/ui/empty.tsx'),
        field: path.resolve(__dirname, 'src/components/ui/field.tsx'),
        form: path.resolve(__dirname, 'src/components/ui/form.tsx'),
        'hover-card': path.resolve(
          __dirname,
          'src/components/ui/hover-card.tsx'
        ),
        'input-group': path.resolve(
          __dirname,
          'src/components/ui/input-group.tsx'
        ),
        'input-otp': path.resolve(__dirname, 'src/components/ui/input-otp.tsx'),
        input: path.resolve(__dirname, 'src/components/ui/input.tsx'),
        item: path.resolve(__dirname, 'src/components/ui/item.tsx'),
        kbd: path.resolve(__dirname, 'src/components/ui/kbd.tsx'),
        label: path.resolve(__dirname, 'src/components/ui/label.tsx'),
        menubar: path.resolve(__dirname, 'src/components/ui/menubar.tsx'),
        'navigation-menu': path.resolve(
          __dirname,
          'src/components/ui/navigation-menu.tsx'
        ),
        pagination: path.resolve(__dirname, 'src/components/ui/pagination.tsx'),
        popover: path.resolve(__dirname, 'src/components/ui/popover.tsx'),
        progress: path.resolve(__dirname, 'src/components/ui/progress.tsx'),
        'radio-group': path.resolve(
          __dirname,
          'src/components/ui/radio-group.tsx'
        ),
        resizable: path.resolve(__dirname, 'src/components/ui/resizable.tsx'),
        'scroll-area': path.resolve(
          __dirname,
          'src/components/ui/scroll-area.tsx'
        ),
        select: path.resolve(__dirname, 'src/components/ui/select.tsx'),
        separator: path.resolve(__dirname, 'src/components/ui/separator.tsx'),
        sheet: path.resolve(__dirname, 'src/components/ui/sheet.tsx'),
        sidebar: path.resolve(__dirname, 'src/components/ui/sidebar.tsx'),
        skeleton: path.resolve(__dirname, 'src/components/ui/skeleton.tsx'),
        slider: path.resolve(__dirname, 'src/components/ui/slider.tsx'),
        sonner: path.resolve(__dirname, 'src/components/ui/sonner.tsx'),
        spinner: path.resolve(__dirname, 'src/components/ui/spinner.tsx'),
        switch: path.resolve(__dirname, 'src/components/ui/switch.tsx'),
        table: path.resolve(__dirname, 'src/components/ui/table.tsx'),
        tabs: path.resolve(__dirname, 'src/components/ui/tabs.tsx'),
        textarea: path.resolve(__dirname, 'src/components/ui/textarea.tsx'),
        texteditor: path.resolve(__dirname, 'src/components/ui/texteditor.tsx'),
        'toggle-group': path.resolve(
          __dirname,
          'src/components/ui/toggle-group.tsx'
        ),
        toggle: path.resolve(__dirname, 'src/components/ui/toggle.tsx'),
        tooltip: path.resolve(__dirname, 'src/components/ui/tooltip.tsx'),
        utils: path.resolve(__dirname, 'src/lib/utils.ts'),
      },
      name: 'TenurinUI',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const basePath = entryName === 'utils' ? 'lib' : 'components/ui';
        return `${basePath}/${entryName}.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [
    tailwindcss(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
      include: ['src/components/ui', 'src/lib/utils.ts'],
    }),
    libInjectCss(),
  ],
});
