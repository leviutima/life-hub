import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  // Stories ficam colocadas ao lado do componente, em qualquer camada FSD
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
}

export default config
