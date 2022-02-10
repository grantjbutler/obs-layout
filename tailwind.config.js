const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    'packages/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
        system: {
          text: {
            DEFAULT: 'var(--color-text)',
            secondary: 'var(--color-text-secondary)',
            control: 'var(--color-text-control)',
            'selected-control': 'var(--color-text-selected-control)',
          },
          background: {
            'nav-bar': 'var(--color-nav-bar-background)',
            control: 'var(--color-control-background)',
            'selected-content': 'var(--color-selected-content-background)',
            'under-page': 'var(--color-under-page-background)',
            window: 'var(--color-window-background)',
          },
          accent: 'var(--color-accent)',
          separator: 'var(--color-separator)',
          divider: 'var(--color-divider)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function({ addUtilities, addVariant, e }) {
      addVariant('macos', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `html.darwin .${e(`macos${separator}${className}`)}`;
        });
      });

      addVariant('windows', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `html.win32 .${e(`windows${separator}${className}`)}`;
        });
      });

      addVariant('window-blur', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `html.blur .${e(`window-blur${separator}${className}`)}`;
        });
      });

      addUtilities({
        '.app-region-drag': {
          WebkitAppRegion: 'drag',
        },
        '.app-region-no-drag': {
          WebkitAppRegion: 'no-drag',
        },
      });
    }),
  ],
};
