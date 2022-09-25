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
      chevronDown: {}

    },
    scale: 1.5,
    location: 'https://esm.sh/@iconify-json/heroicons-outline@1.1.4/icons.json'
  },
  carbon: {
    icons: {
      draggable: {},
      home: {}, chartRose: {}, result: {},
      settings: {}, chartBubblePacked: {},
      logout: {}, caretRight: {},
      '3d-mpr-toggle': { color: '#B97D4C' }, 'webhook': { color: '#A7575F' },
      'lightning': { color: '#06AD86' }, 'checkbox': {}, 'CheckboxChecked': {}, 'checkmark': {},
      'add': {}, 'touch-1': {}, 'task-add': {}, 'save': {}, 'download': {}, 'subtract': {}, 'information': {}
    },
  },
  teenyicons: {
    icons: { 'eyeSolid': {}, 'eyeClosedSolid': {} }
  },
  ic: {
    icons: { 'roundKeyboardDoubleArrowRight': {}, 'roundKeyboardDoubleArrowLeft': {} }
  }
})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}',],
  theme: {
    extend: {},
    colors: {
      'back': '#161616',
      'card': '#303030',
      'item': '#3D3D3D',
      'txt': '#E5E5E5',
      'strip': '#2B2B2B',
      'stripDark': '#282828',
      'limonite': '#B97D4C',
      'e-black': '#1D1D1D',
      'red': '#A7575F',
      'blue': '#334D80',
      'light-blue': '#4772B3',
      'grey': '#444444',
      'input-grey': '#545454',
      'input-hover': '#656565'
    }
  },
  plugins: [Icons(options), require('@tailwindcss/forms'), require("daisyui")],
}
