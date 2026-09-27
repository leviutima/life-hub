import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta = {
  title: 'shared/ui/Input',
  component: Input,
  args: {
    placeholder: 'voce@exemplo.com',
    'aria-label': 'E-mail',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Filled: Story = {
  args: { defaultValue: 'levi@lifehub.dev' },
}

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'levi@' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'levi@lifehub.dev' },
}

export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••', 'aria-label': 'Senha' },
}
