import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    name: 'default',
    label: 'Nombre',
    placeholder: 'Escribe algo...',
  },
};

export const ConError: Story = {
  name: 'Con error',
  args: {
    name: 'con-error',
    label: 'Correo electrónico',
    placeholder: 'correo@ejemplo.com',
    value: 'correo-invalido',
    error: 'Ingresa un correo válido',
  },
};

export const Cargando: Story = {
  name: 'Estado de carga',
  args: {
    name: 'cargando',
    label: 'Nombre',
    loading: true,
  },
};

export const Deshabilitado: Story = {
  name: 'Deshabilitado',
  args: {
    name: 'deshabilitado',
    label: 'Referencia',
    value: 'REF-00123',
    disabled: true,
  },
};

export const Requerido: Story = {
  name: 'Campo requerido',
  args: {
    name: 'requerido',
    label: 'Apellido',
    placeholder: 'Tu apellido',
    required: true,
  },
};

export const ConPrefijo: Story = {
  name: 'Con prefijo',
  args: {
    name: 'con-prefijo',
    label: 'Precio',
    type: 'number',
    placeholder: '0',
    prefix: '$',
  },
};

export const ConPrefijoColor: Story = {
  name: 'Con prefijo de color',
  args: {
    name: 'con-prefijo-color',
    label: 'Porcentaje',
    type: 'number',
    placeholder: '0',
    prefix: '%',
    prefixColor: '#6366f1',
  },
};

export const TamanoSmall: Story = {
  name: 'Tamaño pequeño (sm)',
  args: {
    name: 'size-sm',
    label: 'Búsqueda',
    placeholder: 'Buscar...',
    size: 'sm',
  },
};

export const TamanoLarge: Story = {
  name: 'Tamaño grande (lg)',
  args: {
    name: 'size-lg',
    label: 'Descripción',
    placeholder: 'Escribe una descripción...',
    size: 'lg',
  },
};

export const TipoNumero: Story = {
  name: 'Tipo número con límites',
  args: {
    name: 'tipo-numero',
    label: 'Cantidad',
    type: 'number',
    placeholder: '0',
    minValue: 1,
    maxValue: 100,
  },
};

export const ConMaxLength: Story = {
  name: 'Con límite de caracteres',
  args: {
    name: 'max-length',
    label: 'Código (máx. 6)',
    placeholder: 'ABC123',
    maxLength: 6,
  },
};

export const Interactivo: Story = {
  name: 'Interactivo (controlado)',
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ maxWidth: 400 }}>
        <Input
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>
          Valor actual: {value || '—'}
        </p>
      </div>
    );
  },
  args: {
    name: 'interactivo',
    label: 'Escribe algo',
    placeholder: 'Empieza a escribir...',
    required: true,
  },
};
