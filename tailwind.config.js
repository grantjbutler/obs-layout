// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: [
    'src/**/*.vue'
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        system: {
          text: {
            DEFAULT: 'var(--color-text)'
          },
          background: {
            'nav-bar': {
              dark: '#3c363c'
            },
            'selected-content': 'var(--color-selected-content-background)',
            window: 'var(--color-window-background)'
          },
          accent: 'var(--color-accent)'
        }
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'macos', 'windows', 'window-blur'],
      backgroundOpacity: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'macos', 'windows', 'window-blur'],
      borderColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'macos', 'windows', 'window-blur'],
      borderOpacity: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'macos', 'windows', 'window-blur'],
      borderRadius: ['responsive', 'macos', 'windows'],
      boxShadow: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus', 'macos', 'windows', 'window-blur'],
      margin: ['responsive', 'macos', 'windows'],
      opacity: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus', 'macos', 'windows', 'window-blur'],
      padding: ['responsive', 'macos', 'windows'],
      textColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'macos', 'windows', 'window-blur'],
      textDecoration: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus', 'macos', 'windows', 'window-blur'],
      textOpacity: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'macos', 'windows', 'window-blur'],
    },
  },
  plugins: [
    plugin(function({ addUtilities, addVariant, e }) {
      addVariant('macos', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `html.darwin .${e(`macos${separator}${className}`)}`
        })
      })

      addVariant('windows', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `html.win32 .${e(`windows${separator}${className}`)}`
        })
      })

      addVariant('window-blur', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `html.blur .${e(`window-blur${separator}${className}`)}`
        })
      })

      addUtilities({
        '.app-region-drag': {
          WebkitAppRegion: 'drag'
        },
        '.app-region-no-drag': {
          WebkitAppRegion: 'no-drag'
        }
      })
    })
  ],
}
