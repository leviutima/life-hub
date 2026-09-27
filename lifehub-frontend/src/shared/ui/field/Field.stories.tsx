import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Field } from './Field'

const meta = {
  title: 'shared/ui/Field',
  component: Field,
  args: {
    label: 'E-mail',
    type: 'email',
    placeholder: 'voce@exemplo.com',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: '••••••••',
    hint: 'Mínimo de 8 caracteres.',
  },
}

export const WithError: Story = {
  args: {
    defaultValue: 'levi@',
    error: 'Informe um e-mail válido.',
  },
  // Garante a ligacao de acessibilidade: o leitor de tela anuncia o erro
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('E-mail')

    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('— Informe um e-mail válido.')
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'levi@lifehub.dev' },
}

export const LoginForm: Story = {
  render: () => (
    <form className="flex flex-col gap-4">
      <Field label="E-mail" type="email" placeholder="voce@exemplo.com" />
      <Field label="Senha" type="password" placeholder="••••••••" error="E-mail ou senha invalidos." />
    </form>
  ),
}
