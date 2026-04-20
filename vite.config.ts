import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { copyFontAssetsPlugin } from './build/copyFontAssetsPlugin';
import { copyStyleAssetsPlugin } from './build/copyStyleAssetsPlugin';
import { copyTailwindSourcesPlugin } from './build/copyTailwindSourcesPlugin';

const interFontsSourcePath = path.resolve(__dirname, 'src/assets/fonts/inter');
const interFontsOutputPath = path.resolve(__dirname, 'dist/fonts/inter');
const componentEntriesOutputPath = path.resolve(__dirname, 'dist/components/ui');
const templateEntriesOutputPath = path.resolve(__dirname, 'dist/templates');
const themeCssSourcePath = path.resolve(__dirname, 'src/styles/theme.css');
const themeCssOutputPath = path.resolve(__dirname, 'dist/theme.css');
const tailwindSourcesOutputPath = path.resolve(__dirname, 'dist/tailwind-sources');
const fontsCssSourcePath = path.resolve(__dirname, 'src/styles/fonts.css');
const fontsCssOutputPath = path.resolve(__dirname, 'dist/fonts.css');
const lightLogoSourcePath = path.resolve(
  __dirname,
  'src/assets/brand/tenurin-light-mode-icon.svg',
);
const lightLogoOutputPath = path.resolve(
  __dirname,
  'dist/assets/brand/tenurin-light-mode-icon.svg',
);
const darkLogoSourcePath = path.resolve(
  __dirname,
  'src/assets/brand/tenurin-dark-mode-icon.svg',
);
const darkLogoOutputPath = path.resolve(
  __dirname,
  'dist/assets/brand/tenurin-dark-mode-icon.svg',
);

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'font-manifest': path.resolve(__dirname, 'src/lib/fontManifest.ts'),
        accordion: path.resolve(__dirname, 'src/components/ui/accordion.tsx'),
        'alert-dialog': path.resolve(
          __dirname,
          'src/components/ui/alert-dialog.tsx'
        ),
        alert: path.resolve(__dirname, 'src/components/ui/alert.tsx'),
        avatar: path.resolve(__dirname, 'src/components/ui/avatar.tsx'),
        badge: path.resolve(__dirname, 'src/components/ui/badge.tsx'),
        'list-table': path.resolve(
          __dirname,
          'src/components/ui/list-table.tsx'
        ),
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
        'default-loader': path.resolve(
          __dirname,
          'src/components/ui/default-loader.tsx'
        ),
        dialog: path.resolve(__dirname, 'src/components/ui/dialog.tsx'),
        drawer: path.resolve(__dirname, 'src/components/ui/drawer.tsx'),
        'dropdown-menu': path.resolve(
          __dirname,
          'src/components/ui/dropdown-menu.tsx'
        ),
        'empty-state': path.resolve(
          __dirname,
          'src/components/ui/empty-state.tsx'
        ),
        empty: path.resolve(__dirname, 'src/components/ui/empty.tsx'),
        field: path.resolve(__dirname, 'src/components/ui/field.tsx'),
        'file-upload-field': path.resolve(
          __dirname,
          'src/components/ui/file-upload-field.tsx'
        ),
        form: path.resolve(__dirname, 'src/components/ui/form.tsx'),
        'form-field-shell': path.resolve(
          __dirname,
          'src/components/ui/form-field-shell.tsx'
        ),
        'form-section': path.resolve(
          __dirname,
          'src/components/ui/form-section.tsx'
        ),
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
        'list-toolbar': path.resolve(
          __dirname,
          'src/components/ui/list-toolbar.tsx'
        ),
        logo: path.resolve(__dirname, 'src/components/ui/logo.tsx'),
        menubar: path.resolve(__dirname, 'src/components/ui/menubar.tsx'),
        'navigation-menu': path.resolve(
          __dirname,
          'src/components/ui/navigation-menu.tsx'
        ),
        pagination: path.resolve(__dirname, 'src/components/ui/pagination.tsx'),
        'minimal-list-table': path.resolve(
          __dirname,
          'src/components/ui/minimal-list-table.tsx'
        ),
        popover: path.resolve(__dirname, 'src/components/ui/popover.tsx'),
        progress: path.resolve(__dirname, 'src/components/ui/progress.tsx'),
        'radio-group': path.resolve(
          __dirname,
          'src/components/ui/radio-group.tsx'
        ),
        'results-pagination': path.resolve(
          __dirname,
          'src/components/ui/results-pagination.tsx'
        ),
        resizable: path.resolve(__dirname, 'src/components/ui/resizable.tsx'),
        'scroll-area': path.resolve(
          __dirname,
          'src/components/ui/scroll-area.tsx'
        ),
        'search-input': path.resolve(
          __dirname,
          'src/components/ui/search-input.tsx'
        ),
        select: path.resolve(__dirname, 'src/components/ui/select.tsx'),
        'select-filter': path.resolve(
          __dirname,
          'src/components/ui/select-filter.tsx'
        ),
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
        'templates/sidebar': path.resolve(
          __dirname,
          'src/templates/sidebar/index.tsx'
        ),
        'templates/route-error': path.resolve(
          __dirname,
          'src/templates/route-error/index.tsx'
        ),
        'templates/post-detail': path.resolve(
          __dirname,
          'src/templates/post-detail/index.tsx'
        ),
        texteditor: path.resolve(__dirname, 'src/components/ui/texteditor.tsx'),
        'toggle-group': path.resolve(
          __dirname,
          'src/components/ui/toggle-group.tsx'
        ),
        toggle: path.resolve(__dirname, 'src/components/ui/toggle.tsx'),
        tooltip: path.resolve(__dirname, 'src/components/ui/tooltip.tsx'),
        'upload-surface': path.resolve(
          __dirname,
          'src/components/ui/upload-surface.tsx'
        ),
        'use-mobile': path.resolve(__dirname, 'src/hooks/use-mobile.ts'),
        utils: path.resolve(__dirname, 'src/lib/utils.ts'),
      },
      name: 'TenurinUI',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (entryName.startsWith('templates/')) {
          return `${entryName}.${format}.js`;
        }

        const basePath =
          entryName === 'utils' || entryName === 'font-manifest'
            ? 'lib'
            : entryName === 'use-mobile'
              ? 'hooks'
            : 'components/ui';
        return `${basePath}/${entryName}.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router'],
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
      include: ['src'],
    }),
    libInjectCss(),
    copyFontAssetsPlugin(interFontsSourcePath, interFontsOutputPath),
    copyStyleAssetsPlugin([
      {
        sourcePath: themeCssSourcePath,
        destinationPath: themeCssOutputPath,
      },
      {
        sourcePath: fontsCssSourcePath,
        destinationPath: fontsCssOutputPath,
      },
      {
        sourcePath: lightLogoSourcePath,
        destinationPath: lightLogoOutputPath,
      },
      {
        sourcePath: darkLogoSourcePath,
        destinationPath: darkLogoOutputPath,
      },
    ]),
    copyTailwindSourcesPlugin(
      [componentEntriesOutputPath, templateEntriesOutputPath],
      tailwindSourcesOutputPath,
    ),
  ],
});
