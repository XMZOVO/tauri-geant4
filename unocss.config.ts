import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  // transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'

import { presetForms } from '@julr/unocss-preset-forms'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  theme: {
    colors: {
      back: {
        DEFAULT: '#161616',
      },
      card: {
        DEFAULT: '#303030',
        item: '#3D3D3D',
        strip: '#2B2B2B',
        stripDark: '#282828',
        tabBar: '#1D1D1D',
        collapse: '#3D3D3D',
        hover: '#3F3F3F',
      },
      input: {
        DEFAULT: '#545454',
        hover: '#656565',
      },
      txt: { DEFAULT: '#E5E5E5' },
      yellow: { DEFAULT: '#B97D4C' },
      red: { DEFAULT: '#A7575F' },
      green: { DEFAULT: '#06AD86' },
      blue: { DEFAULT: '#334D80', light: '#4772B3' },
    },
  },
  shortcuts: [
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'icon-btn',
      'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 !outline-none',
    ],
    ['sb', 'scrollbar scrollbar-rounded scrollbar-track-color-card-tabBar scrollbar-thumb-color-input scrollbar-w-4px scrollbar-radius-2 scrollbar-track-radius-4 scrollbar-thumb-radius-4'],
    ['set-nav-btn', 'py-1 px-2 op-80 hover:bg-card rounded-md hover:op100 cursor-pointer'],
    ['set-nav-info', 'py-1 px-2 text-xs op40'],
    ['set-nav-divide', ' border-b mx-2 my-2 op20'],
  ],
  presets: [
    presetUno(),
    presetForms(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
    presetScrollbar({
      // config
    }),
  ],
  // transformers: [
  //   transformerDirectives(),
  //   transformerVariantGroup(),
  // ],
})
