import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Modal } from './Modal';

// Resets body scroll when navigating away from a story
const RestoreScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => () => { document.body.style.overflow = ''; }, []);
  return <>{children}</>;
};

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const [isOpen, setIsOpen] = useState(true);

      if (context.parameters?.standalone) return <Story />;

      return (
        <RestoreScroll>
          {isOpen ? (
            <Story args={{ ...context.args, onHide: () => setIsOpen(false) }} />
          ) : (
            <div style={{ padding: 24 }}>
              <button
                onClick={() => setIsOpen(true)}
                style={{ padding: '8px 16px', cursor: 'pointer' }}
              >
                Abrir modal
              </button>
            </div>
          )}
        </RestoreScroll>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    title: 'Título del modal',
    children: 'Contenido del modal aquí.',
  },
};

export const SinTitulo: Story = {
  name: 'Sin título',
  args: {
    children: 'Modal sin título, solo con botón de cierre.',
  },
};

export const SinBotonCerrar: Story = {
  name: 'Sin botón de cerrar',
  args: {
    title: 'Modal bloqueado',
    children: 'Este modal no tiene botón de cierre.',
    canClose: false,
  },
};

export const SinCerrarAlClickar: Story = {
  name: 'Sin cerrar al hacer clic fuera',
  args: {
    title: 'Click fuera deshabilitado',
    children: 'El clic en el fondo no cierra este modal.',
    hideOnClickOutside: false,
  },
};

export const SinHeader: Story = {
  name: 'Sin header',
  args: {
    children: 'Modal sin título ni botón de cierre.',
    canClose: false,
  },
};

export const Interactivo: Story = {
  name: 'Interactivo (controlado)',
  parameters: {
    standalone: true,
    layout: 'padded',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Abrir modal
        </button>
        {isOpen && (
          <Modal {...args} onHide={() => setIsOpen(false)}>
            <p>Modal controlado por estado.</p>
          </Modal>
        )}
      </div>
    );
  },
  args: {
    title: 'Modal interactivo',
  },
};

export const SinEscape: Story = {
  name: 'Escape desactivado (formulario a medio editar)',
  args: {
    title: 'Editar cliente',
    children:
      'hideOnClickOutside=false: ni el fondo ni Escape cierran el diálogo, salvo closeOnEscape.',
    hideOnClickOutside: false,
  },
};

export const ContenidoLargo: Story = {
  name: 'Contenido largo (solo el cuerpo hace scroll)',
  args: {
    title: 'Términos',
    children: (
      <div>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i} className="text-sm">
            Párrafo {i + 1}: el encabezado queda fijo y el panel nunca se corta arriba.
          </p>
        ))}
      </div>
    ),
  },
};

export const Anidados: Story = {
  name: 'Modales anidados (Escape cierra solo el de arriba)',
  parameters: { standalone: true, layout: 'padded' },
  render: () => {
    const [outer, setOuter] = useState(false);
    const [inner, setInner] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <button onClick={() => setOuter(true)} style={{ padding: '8px 16px' }}>
          Abrir
        </button>
        {outer && (
          <Modal title="Exterior" onHide={() => setOuter(false)}>
            <button onClick={() => setInner(true)} style={{ padding: '8px 16px' }}>
              Abrir el interior
            </button>
            {inner && (
              <Modal title="Interior" size="md" onHide={() => setInner(false)}>
                <p>Escape cierra este; el exterior sigue abierto.</p>
              </Modal>
            )}
          </Modal>
        )}
      </div>
    );
  },
};
