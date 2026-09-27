import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      options: {
        light: { name: 'Light', value: '#ffffff' },
        dark: { name: 'Dark', value: '#000000' },
      },
    },
    a11y: { test: 'error' },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
  tags: ['autodocs'],
}

export default preview
