const { Icons } = require('tailwindcss-plugin-icons')

/**
 * @type {import('tailwindcss-plugin-icons').Options}
 */
const options = ({ theme }) => ({
  heroiconsOutline: {
    icons: {
      trash: {},
      'trash?bg': {},
      plusCircle: {
        cursor: 'pointer',
        color: theme('colors.emerald.600'),
        '&:hover': {
          color: theme('colors.emerald.800')
        }
      },
      chevronRight: {},
    },
    scale: 1.5,
    location: 'https://esm.sh/@iconify-json/heroicons-outline@1.1.4/icons.json'
  },
  carbon: { icons: { draggable: {}, home: {}, chartRose: {}, result: {}, settings: {}, chartBubblePacked: {}, logout: {} }, }
})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
    colors: {
      'back': '#161616',
      'card': '#303030',
      'item': '#3D3D3D',
      'txt': '#E5E5E5'
    }
  },
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [Icons(options)],
}
