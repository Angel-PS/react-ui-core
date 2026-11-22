import { act, render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Modal } from './Modal';

/** The overlay is the dialog's parent: the element that owns dismissal. */
const overlayOf = () => screen.getByRole('dialog').parentElement!;

/** Runs the deferred (requestAnimationFrame) focus restore. */
const flushFrame = () =>
  act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));

describe('Modal', () => {
  describe('renderizado básico', () => {
    it('renderiza los children', () => {
      render(<Modal><p>Contenido del modal</p></Modal>);
      expect(screen.getByText('Contenido del modal')).toBeInTheDocument();
    });

    it('renderiza el título cuando se proporciona', () => {
      render(<Modal title="Mi Modal"><span>Content</span></Modal>);
      expect(screen.getByText('Mi Modal')).toBeInTheDocument();
    });

    it('no renderiza el header cuando no hay title ni onHide', () => {
      render(<Modal><span>Content</span></Modal>);
      // ModalHeader retorna null si no hay title ni onHide
      expect(document.querySelector('h2')).not.toBeInTheDocument();
    });

    it('se renderiza en document.body (portal), fuera del contenedor del consumidor', () => {
      const { container } = render(
        <div data-testid="host">
          <Modal title="Portal"><span>Content</span></Modal>
        </div>,
      );
      const dialog = screen.getByRole('dialog');
      expect(container.contains(dialog)).toBe(false);
      expect(document.body.contains(dialog)).toBe(true);
    });

    it('mantiene la clase animate-scaleIn en el panel (los tests de navegador la usan)', () => {
      render(<Modal title="T"><span>Content</span></Modal>);
      expect(screen.getByRole('dialog')).toHaveClass('animate-scaleIn');
    });
  });

  describe('semántica de diálogo', () => {
    it('expone role="dialog" y aria-modal, nombrado por el título', () => {
      render(<Modal title="Editar cliente"><span>Content</span></Modal>);
      const dialog = screen.getByRole('dialog', { name: 'Editar cliente' });
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      const heading = screen.getByRole('heading', { name: 'Editar cliente' });
      expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
    });

    it('usa ariaLabel cuando el header es personalizado', () => {
      render(
        <Modal title="Ignorado" ariaLabel="Detalle" headerContent={<div>Custom</div>}>
          <span>Content</span>
        </Modal>,
      );
      expect(screen.getByRole('dialog', { name: 'Detalle' })).toBeInTheDocument();
    });

    it('cae en dialogLabel cuando no hay título ni ariaLabel', () => {
      render(<Modal headerContent={null} dialogLabel="Diálogo"><span>Content</span></Modal>);
      expect(screen.getByRole('dialog', { name: 'Diálogo' })).toBeInTheDocument();
    });

    it('enlaza aria-describedby', () => {
      render(
        <Modal title="T" ariaDescribedBy="desc"><p id="desc">Descripción</p></Modal>,
      );
      expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Descripción');
    });
  });

  describe('cierre con teclado (ESC)', () => {
    it('llama a onHide al presionar Escape', () => {
      const onHide = vi.fn();
      render(<Modal onHide={onHide}><span>Content</span></Modal>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('no llama a onHide con otras teclas', () => {
      const onHide = vi.fn();
      render(<Modal onHide={onHide}><span>Content</span></Modal>);
      fireEvent.keyDown(document, { key: 'Enter' });
      expect(onHide).not.toHaveBeenCalled();
    });

    it('limpia el listener al desmontar', () => {
      const onHide = vi.fn();
      const { unmount } = render(<Modal onHide={onHide}><span>Content</span></Modal>);
      unmount();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onHide).not.toHaveBeenCalled();
    });

    it('no cierra con Escape cuando canClose=false', () => {
      const onHide = vi.fn();
      render(<Modal onHide={onHide} canClose={false}><span>Content</span></Modal>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onHide).not.toHaveBeenCalled();
    });

    it('no cierra con Escape cuando hideOnClickOutside=false (salvo closeOnEscape)', () => {
      const onHide = vi.fn();
      const { rerender } = render(
        <Modal onHide={onHide} hideOnClickOutside={false}><span>Content</span></Modal>,
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onHide).not.toHaveBeenCalled();

      rerender(
        <Modal onHide={onHide} hideOnClickOutside={false} closeOnEscape>
          <span>Content</span>
        </Modal>,
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('closeOnEscape={false} desactiva Escape aunque se pueda cerrar', () => {
      const onHide = vi.fn();
      render(<Modal onHide={onHide} closeOnEscape={false}><span>Content</span></Modal>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onHide).not.toHaveBeenCalled();
    });

    it('con modales anidados, Escape cierra solo el de arriba', () => {
      const outer = vi.fn();
      const inner = vi.fn();
      // The nested dialog opens after its parent, as it does in real use.
      const { rerender } = render(
        <Modal title="Exterior" onHide={outer}><span>Content</span></Modal>,
      );
      rerender(
        <Modal title="Exterior" onHide={outer}>
          <Modal title="Interior" onHide={inner}><span>Content</span></Modal>
        </Modal>,
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(inner).toHaveBeenCalledTimes(1);
      expect(outer).not.toHaveBeenCalled();
    });

    it('ignora un Escape que un control interno ya consumió (preventDefault)', () => {
      const onHide = vi.fn();
      render(
        <Modal onHide={onHide}>
          <input
            aria-label="combo"
            onKeyDown={(e) => {
              if (e.key === 'Escape') e.preventDefault();
            }}
          />
        </Modal>,
      );
      fireEvent.keyDown(screen.getByLabelText('combo'), { key: 'Escape' });
      expect(onHide).not.toHaveBeenCalled();
    });
  });

  describe('overlay (fondo)', () => {
    it('llama a onHide al presionar el overlay cuando hideOnClickOutside=true', () => {
      const onHide = vi.fn();
      render(<Modal onHide={onHide} hideOnClickOutside><span>Content</span></Modal>);
      fireEvent.mouseDown(overlayOf(), { button: 0 });
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('no llama a onHide al presionar el overlay cuando hideOnClickOutside=false', () => {
      const onHide = vi.fn();
      render(
        <Modal onHide={onHide} hideOnClickOutside={false}><span>Content</span></Modal>,
      );
      fireEvent.mouseDown(overlayOf(), { button: 0 });
      expect(onHide).not.toHaveBeenCalled();
    });

    it('no cierra cuando el mousedown empieza dentro del panel (arrastre de selección)', () => {
      const onHide = vi.fn();
      render(<Modal onHide={onHide}><p>Texto seleccionable</p></Modal>);
      fireEvent.mouseDown(screen.getByText('Texto seleccionable'), { button: 0 });
      // the drag is released on the overlay: a click there must not dismiss either
      fireEvent.click(overlayOf());
      expect(onHide).not.toHaveBeenCalled();
    });

    it('ignora el botón derecho del ratón', () => {
      const onHide = vi.fn();
      render(<Modal onHide={onHide}><span>Content</span></Modal>);
      fireEvent.mouseDown(overlayOf(), { button: 2 });
      expect(onHide).not.toHaveBeenCalled();
    });

    it('el backdrop es decorativo (pointer-events-none)', () => {
      render(<Modal><span>Content</span></Modal>);
      const backdrop = overlayOf().querySelector('[aria-hidden="true"]')!;
      expect(backdrop).toHaveClass('pointer-events-none');
    });
  });

  describe('botón de cierre (X)', () => {
    it('renderiza el botón de cierre cuando canClose=true y onHide está definido', () => {
      const onHide = vi.fn();
      render(<Modal title="Test" onHide={onHide} canClose><span>Content</span></Modal>);
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('no renderiza el botón de cierre cuando canClose=false', () => {
      const onHide = vi.fn();
      render(<Modal title="Test" onHide={onHide} canClose={false}><span>Content</span></Modal>);
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    it('llama a onHide al hacer click en el botón de cierre', () => {
      const onHide = vi.fn();
      render(<Modal title="Test" onHide={onHide}><span>Content</span></Modal>);
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('es type="button": no envía el formulario que envuelve', () => {
      const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <Modal title="Test" onHide={() => {}}>
          <form onSubmit={onSubmit}><input aria-label="campo" /></form>
        </Modal>,
      );
      const close = screen.getByRole('button', { name: /close/i });
      expect(close).toHaveAttribute('type', 'button');
    });
  });

  describe('foco', () => {
    it('mueve el foco al diálogo al abrir y lo devuelve al disparador al cerrar', async () => {
      const Harness = () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button onClick={() => setOpen(true)}>Abrir</button>
            {open && (
              <Modal title="Foco" onHide={() => setOpen(false)}>
                <span>Content</span>
              </Modal>
            )}
          </>
        );
      };
      render(<Harness />);
      const trigger = screen.getByRole('button', { name: 'Abrir' });
      trigger.focus();
      fireEvent.click(trigger);
      expect(screen.getByRole('dialog')).toHaveFocus();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await flushFrame();
      expect(trigger).toHaveFocus();
    });

    it('no roba el foco a un hijo con autoFocus', () => {
      render(
        <Modal title="T"><input aria-label="primero" autoFocus /></Modal>,
      );
      expect(screen.getByLabelText('primero')).toHaveFocus();
    });

    it('atrapa Tab dentro del diálogo (último → primero y Shift+Tab primero → último)', () => {
      // jsdom has no layout: give every element a client rect so it counts as reachable.
      const spy = vi
        .spyOn(HTMLElement.prototype, 'getClientRects')
        .mockReturnValue([{}] as unknown as DOMRectList);
      try {
        render(
          <Modal title="Trampa" onHide={() => {}}>
            <input aria-label="nombre" />
            <button>Guardar</button>
          </Modal>,
        );
        const close = screen.getByRole('button', { name: /close/i });
        const save = screen.getByRole('button', { name: 'Guardar' });

        save.focus();
        fireEvent.keyDown(save, { key: 'Tab' });
        expect(close).toHaveFocus();

        fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
        expect(save).toHaveFocus();
      } finally {
        spy.mockRestore();
      }
    });
  });

  describe('scroll del body', () => {
    it('bloquea el scroll del body mientras está montado', () => {
      render(<Modal><span>Content</span></Modal>);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restaura el overflow del body al desmontar', () => {
      document.body.style.overflow = '';
      const { unmount } = render(<Modal><span>Content</span></Modal>);
      unmount();
      expect(document.body.style.overflow).toBe('');
    });
  });
});
