import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MultiSelect } from './MultiSelect';

const OPTIONS = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
];

const meta: Meta<typeof MultiSelect> = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  args: {
    label: 'Frameworks',
    options: OPTIONS,
    value: [],
  },
};

export const ConSeleccion: Story = {
  name: 'Con selección previa',
  args: {
    label: 'Frameworks',
    options: OPTIONS,
    value: ['react', 'nextjs', 'svelte'],
  },
};

export const ConError: Story = {
  name: 'Con error',
  args: {
    label: 'Frameworks',
    options: OPTIONS,
    value: [],
    error: 'Este campo es obligatorio',
  },
};

export const Cargando: Story = {
  name: 'Estado de carga',
  args: {
    label: 'Frameworks',
    options: OPTIONS,
    loading: true,
  },
};

export const Deshabilitado: Story = {
  name: 'Deshabilitado',
  args: {
    label: 'Frameworks',
    options: OPTIONS,
    value: ['react', 'vue'],
    disabled: true,
  },
};

export const Requerido: Story = {
  name: 'Campo requerido',
  args: {
    label: 'Frameworks',
    options: OPTIONS,
    required: true,
  },
};

export const ConColor: Story = {
  name: 'Con indicador de color',
  args: {
    label: 'Categoría',
    options: OPTIONS,
    color: '#6366f1',
    value: ['react'],
  },
};

export const SinOpciones: Story = {
  name: 'Sin opciones',
  args: {
    label: 'Frameworks',
    options: [],
  },
};

export const Interactivo: Story = {
  name: 'Interactivo (controlado)',
  render: (args) => {
    const [value, setValue] = useState<(string | number)[]>(['react']);
    return (
      <div style={{ maxWidth: 400 }}>
        <MultiSelect
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>
          Seleccionados: {value.length > 0 ? value.join(', ') : '—'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Frameworks',
    options: OPTIONS,
    required: true,
  },
};
