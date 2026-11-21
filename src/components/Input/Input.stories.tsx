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
    defaultValue: 'correo-invalido',
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
    defaultValue: 'REF-00123',
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

export const ConColor: Story = {
  name: 'Con punto de color',
  args: {
    name: 'con-color',
    label: 'Categoría',
    placeholder: 'Nombre de la categoría',
    color: '#6366f1',
  },
};

export const ConMascara: Story = {
  name: 'Con máscara',
  args: {
    name: 'telefono',
    label: 'Teléfono',
    mask: '(___) ___-____',
    placeholder: '(000) 000-0000',
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

export const ConHint: Story = {
  name: 'Con hint',
  args: {
    name: 'maxAgeDays',
    label: 'Caducidad (días)',
    type: 'number',
    hint: '0 desactiva la caducidad.',
  },
};

export const ConHintYError: Story = {
  name: 'Con hint y error',
  args: {
    name: 'maxAgeDays',
    label: 'Caducidad (días)',
    type: 'number',
    hint: '0 desactiva la caducidad.',
    error: 'Debe ser 365 o menos',
  },
};

export const SoloDigitos: Story = {
  name: 'Solo dígitos (digitsOnly)',
  args: {
    name: 'rnc',
    label: 'RNC',
    digitsOnly: true,
    inputMode: 'numeric',
    placeholder: 'Escribe 1-31-45502-6',
  },
};

export const NumeroConMinimo: Story = {
  name: 'Número con mínimo (se aplica al salir)',
  args: {
    name: 'trialDays',
    label: 'Días de prueba',
    type: 'number',
    minValue: 0,
    maxValue: 90,
    hint: 'Se puede escribir 0 y 0.5; vaciar el campo lo deja vacío.',
  },
};
