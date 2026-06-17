import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { copyFontAssetsPlugin } from "./build/copyFontAssetsPlugin";
import { copyStyleAssetsPlugin } from "./build/copyStyleAssetsPlugin";
import { copyTailwindSourcesPlugin } from "./build/copyTailwindSourcesPlugin";

const interFontsSourcePath = path.resolve(__dirname, "src/assets/fonts/inter");
const interFontsOutputPath = path.resolve(__dirname, "dist/fonts/inter");
const componentEntriesOutputPath = path.resolve(
  __dirname,
  "dist/components/ui",
);
const analyticsEntriesOutputPath = path.resolve(
  __dirname,
  "dist/components/analytics",
);
const templateEntriesOutputPath = path.resolve(__dirname, "dist/templates");
const themeCssSourcePath = path.resolve(__dirname, "src/styles/theme.css");
const themeCssOutputPath = path.resolve(__dirname, "dist/theme.css");
const tailwindSourcesOutputPath = path.resolve(
  __dirname,
  "dist/tailwind-sources",
);
const distSharedChunksPath = path.resolve(__dirname, "dist");
const fontsCssSourcePath = path.resolve(__dirname, "src/styles/fonts.css");
const fontsCssOutputPath = path.resolve(__dirname, "dist/fonts.css");
const brandIconSourcePath = path.resolve(
  __dirname,
  "src/assets/brand/tenurin-brand-icon.svg",
);
const brandIconOutputPath = path.resolve(
  __dirname,
  "dist/assets/brand/tenurin-brand-icon.svg",
);

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        "font-manifest": path.resolve(__dirname, "src/lib/fontManifest.ts"),
        "truncate-middle": path.resolve(__dirname, "src/lib/truncateMiddle.ts"),
        "blob-upload": path.resolve(__dirname, "src/lib/blob-upload.ts"),
        accordion: path.resolve(__dirname, "src/components/ui/accordion.tsx"),
        "alert-dialog": path.resolve(
          __dirname,
          "src/components/ui/alert-dialog.tsx",
        ),
        alert: path.resolve(__dirname, "src/components/ui/alert.tsx"),
        "alert-surface": path.resolve(
          __dirname,
          "src/components/ui/alert-surface.tsx",
        ),
        analytics: path.resolve(
          __dirname,
          "src/components/analytics/index.ts",
        ),
        "auth-form": path.resolve(
          __dirname,
          "src/components/ui/auth-form.tsx",
        ),
        avatar: path.resolve(__dirname, "src/components/ui/avatar.tsx"),
        badge: path.resolve(__dirname, "src/components/ui/badge.tsx"),
        "list-table": path.resolve(
          __dirname,
          "src/components/ui/list-table.tsx",
        ),
        breadcrumb: path.resolve(__dirname, "src/components/ui/breadcrumb.tsx"),
        "button-group": path.resolve(
          __dirname,
          "src/components/ui/button-group.tsx",
        ),
        button: path.resolve(__dirname, "src/components/ui/button.tsx"),
        "dashboard-actions": path.resolve(
          __dirname,
          "src/components/ui/dashboard-actions.tsx",
        ),
        "data-collection": path.resolve(
          __dirname,
          "src/components/ui/data-collection.tsx",
        ),
        calendar: path.resolve(__dirname, "src/components/ui/calendar.tsx"),
        card: path.resolve(__dirname, "src/components/ui/card.tsx"),
        carousel: path.resolve(__dirname, "src/components/ui/carousel.tsx"),
        chart: path.resolve(__dirname, "src/components/ui/chart.tsx"),
        checkbox: path.resolve(__dirname, "src/components/ui/checkbox.tsx"),
        "compensation-frequency": path.resolve(
          __dirname,
          "src/components/ui/compensation-frequency.tsx",
        ),
        "listing-compensation": path.resolve(
          __dirname,
          "src/components/ui/listing-compensation.ts",
        ),
        collapsible: path.resolve(
          __dirname,
          "src/components/ui/collapsible.tsx",
        ),
        command: path.resolve(__dirname, "src/components/ui/command.tsx"),
        "context-menu": path.resolve(
          __dirname,
          "src/components/ui/context-menu.tsx",
        ),
        "datetime-picker": path.resolve(
          __dirname,
          "src/components/ui/datetime-picker.tsx",
        ),
        "default-loader": path.resolve(
          __dirname,
          "src/components/ui/default-loader.tsx",
        ),
        "detail-section": path.resolve(
          __dirname,
          "src/components/ui/detail-section.tsx",
        ),
        "detail-hero": path.resolve(
          __dirname,
          "src/components/ui/detail-hero.tsx",
        ),
        dialog: path.resolve(__dirname, "src/components/ui/dialog.tsx"),
        drawer: path.resolve(__dirname, "src/components/ui/drawer.tsx"),
        "dropdown-menu": path.resolve(
          __dirname,
          "src/components/ui/dropdown-menu.tsx",
        ),
        "empty-state": path.resolve(
          __dirname,
          "src/components/ui/empty-state.tsx",
        ),
        empty: path.resolve(__dirname, "src/components/ui/empty.tsx"),
        field: path.resolve(__dirname, "src/components/ui/field.tsx"),
        "editable-form-field-list": path.resolve(
          __dirname,
          "src/components/ui/editable-form-field-list.tsx",
        ),
        "file-upload-field": path.resolve(
          __dirname,
          "src/components/ui/file-upload-field.tsx",
        ),
        "multi-files-field": path.resolve(
          __dirname,
          "src/components/ui/multi-files-field.tsx",
        ),
        form: path.resolve(__dirname, "src/components/ui/form.tsx"),
        "form-field-shell": path.resolve(
          __dirname,
          "src/components/ui/form-field-shell.tsx",
        ),
        "form-field-input": path.resolve(
          __dirname,
          "src/components/ui/form-field-input.tsx",
        ),
        "form-section": path.resolve(
          __dirname,
          "src/components/ui/form-section.tsx",
        ),
        "hover-card": path.resolve(
          __dirname,
          "src/components/ui/hover-card.tsx",
        ),
        "input-group": path.resolve(
          __dirname,
          "src/components/ui/input-group.tsx",
        ),
        "inline-field-error": path.resolve(
          __dirname,
          "src/components/ui/inline-field-error.tsx",
        ),
        "input-otp": path.resolve(__dirname, "src/components/ui/input-otp.tsx"),
        input: path.resolve(__dirname, "src/components/ui/input.tsx"),
        item: path.resolve(__dirname, "src/components/ui/item.tsx"),
        kbd: path.resolve(__dirname, "src/components/ui/kbd.tsx"),
        label: path.resolve(__dirname, "src/components/ui/label.tsx"),
        "legal-dialog": path.resolve(
          __dirname,
          "src/components/ui/legal-dialog.tsx",
        ),
        "messaging-chat-skeleton": path.resolve(
          __dirname,
          "src/components/ui/messaging-chat-skeleton.tsx",
        ),
        "messaging-chat-attachment": path.resolve(
          __dirname,
          "src/components/ui/messaging-chat-attachment.tsx",
        ),
        "messaging-chat-message-bubble": path.resolve(
          __dirname,
          "src/components/ui/messaging-chat-message-bubble.tsx",
        ),
        "messaging-chat-message-list": path.resolve(
          __dirname,
          "src/components/ui/messaging-chat-message-list.tsx",
        ),
        "messaging-chat-message-types": path.resolve(
          __dirname,
          "src/components/ui/messaging-chat-message-types.ts",
        ),
        "messaging-conversation-item": path.resolve(
          __dirname,
          "src/components/ui/messaging-conversation-item.tsx",
        ),
        "messaging-message-content": path.resolve(
          __dirname,
          "src/components/ui/messaging-message-content.tsx",
        ),
        "list-toolbar": path.resolve(
          __dirname,
          "src/components/ui/list-toolbar.tsx",
        ),
        logo: path.resolve(__dirname, "src/components/ui/logo.tsx"),
        menubar: path.resolve(__dirname, "src/components/ui/menubar.tsx"),
        "middle-truncated-text": path.resolve(
          __dirname,
          "src/components/ui/middle-truncated-text.tsx",
        ),
        "navigation-menu": path.resolve(
          __dirname,
          "src/components/ui/navigation-menu.tsx",
        ),
        pagination: path.resolve(__dirname, "src/components/ui/pagination.tsx"),
        "minimal-list-table": path.resolve(
          __dirname,
          "src/components/ui/minimal-list-table.tsx",
        ),
        popover: path.resolve(__dirname, "src/components/ui/popover.tsx"),
        "policy-summary-card": path.resolve(
          __dirname,
          "src/components/ui/policy-summary-card.tsx",
        ),
        progress: path.resolve(__dirname, "src/components/ui/progress.tsx"),
        "radio-group": path.resolve(
          __dirname,
          "src/components/ui/radio-group.tsx",
        ),
        "results-pagination": path.resolve(
          __dirname,
          "src/components/ui/results-pagination.tsx",
        ),
        "results-empty-layout": path.resolve(
          __dirname,
          "src/components/ui/results-empty-layout.tsx",
        ),
        resizable: path.resolve(__dirname, "src/components/ui/resizable.tsx"),
        "scroll-area": path.resolve(
          __dirname,
          "src/components/ui/scroll-area.tsx",
        ),
        "search-input": path.resolve(
          __dirname,
          "src/components/ui/search-input.tsx",
        ),
        "searchable-pill-picker": path.resolve(
          __dirname,
          "src/components/ui/searchable-pill-picker.tsx",
        ),
        select: path.resolve(__dirname, "src/components/ui/select.tsx"),
        "select-filter": path.resolve(
          __dirname,
          "src/components/ui/select-filter.tsx",
        ),
        separator: path.resolve(__dirname, "src/components/ui/separator.tsx"),
        "settings-account": path.resolve(
          __dirname,
          "src/components/ui/settings-account.tsx",
        ),
        sheet: path.resolve(__dirname, "src/components/ui/sheet.tsx"),
        sidebar: path.resolve(__dirname, "src/components/ui/sidebar.tsx"),
        skeleton: path.resolve(__dirname, "src/components/ui/skeleton.tsx"),
        slider: path.resolve(__dirname, "src/components/ui/slider.tsx"),
        sonner: path.resolve(__dirname, "src/components/ui/sonner.tsx"),
        spinner: path.resolve(__dirname, "src/components/ui/spinner.tsx"),
        "surface-card": path.resolve(
          __dirname,
          "src/components/ui/surface-card.tsx",
        ),
        switch: path.resolve(__dirname, "src/components/ui/switch.tsx"),
        table: path.resolve(__dirname, "src/components/ui/table.tsx"),
        tabs: path.resolve(__dirname, "src/components/ui/tabs.tsx"),
        textarea: path.resolve(__dirname, "src/components/ui/textarea.tsx"),
        "templates/sidebar": path.resolve(
          __dirname,
          "src/templates/sidebar/index.tsx",
        ),
        "templates/auth": path.resolve(
          __dirname,
          "src/templates/auth/index.tsx",
        ),
        "templates/messaging": path.resolve(
          __dirname,
          "src/templates/messaging/index.tsx",
        ),
        "templates/access-denied": path.resolve(
          __dirname,
          "src/templates/access-denied/index.tsx",
        ),
        "templates/route-error": path.resolve(
          __dirname,
          "src/templates/route-error/index.tsx",
        ),
        "templates/post-detail": path.resolve(
          __dirname,
          "src/templates/post-detail/index.tsx",
        ),
        "templates/status-page": path.resolve(
          __dirname,
          "src/templates/status-page/index.tsx",
        ),
        "templates/dashboard-account": path.resolve(
          __dirname,
          "src/templates/dashboard-account/index.tsx",
        ),
        "templates/help-request": path.resolve(
          __dirname,
          "src/templates/help-request/index.tsx",
        ),
        texteditor: path.resolve(__dirname, "src/components/ui/texteditor.tsx"),
        "toggle-group": path.resolve(
          __dirname,
          "src/components/ui/toggle-group.tsx",
        ),
        toggle: path.resolve(__dirname, "src/components/ui/toggle.tsx"),
        tooltip: path.resolve(__dirname, "src/components/ui/tooltip.tsx"),
        "responsive-hint": path.resolve(
          __dirname,
          "src/components/ui/responsive-hint.tsx",
        ),
        "upload-surface": path.resolve(
          __dirname,
          "src/components/ui/upload-surface.tsx",
        ),
        "use-mobile": path.resolve(__dirname, "src/hooks/use-mobile.ts"),
        utils: path.resolve(__dirname, "src/lib/utils.ts"),
      },
      name: "TenurinUI",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        if (entryName.startsWith("templates/")) {
          return `${entryName}.${format}.js`;
        }

        if (entryName === "analytics") {
          return `components/analytics/index.${format}.js`;
        }

        const basePath =
          entryName === "utils" ||
          entryName === "font-manifest" ||
          entryName === "truncate-middle" ||
          entryName === "blob-upload"
            ? "lib"
            : entryName === "use-mobile"
              ? "hooks"
              : "components/ui";
        return `${basePath}/${entryName}.${format}.js`;
      },
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-router", "react-hook-form"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-hook-form": "ReactHookForm",
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
      include: ["src"],
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
        sourcePath: brandIconSourcePath,
        destinationPath: brandIconOutputPath,
      },
    ]),
    copyTailwindSourcesPlugin(
      [
        {
          sourceDirectory: componentEntriesOutputPath,
          outputSubdirectory: "components/ui",
        },
        {
          sourceDirectory: analyticsEntriesOutputPath,
          outputSubdirectory: "components/analytics",
        },
        {
          sourceDirectory: templateEntriesOutputPath,
          outputSubdirectory: "templates",
        },
        {
          sourceDirectory: distSharedChunksPath,
          outputSubdirectory: "chunks",
        },
      ],
      tailwindSourcesOutputPath,
    ),
  ],
});
