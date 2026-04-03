import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

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
      const { container } = render(<Modal><span>Content</span></Modal>);
      // ModalHeader retorna null si no hay title ni onHide
      expect(container.querySelector('h2')).not.toBeInTheDocument();
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
  });

  describe('backdrop (fondo)', () => {
    it('llama a onHide al hacer click en el backdrop cuando hideOnClickOutside=true', () => {
      const onHide = vi.fn();
      const { container } = render(
        <Modal onHide={onHide} hideOnClickOutside><span>Content</span></Modal>
      );
      const backdrop = container.querySelector('[aria-hidden="true"]')!;
      fireEvent.click(backdrop);
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('no llama a onHide al hacer click en el backdrop cuando hideOnClickOutside=false', () => {
      const onHide = vi.fn();
      const { container } = render(
        <Modal onHide={onHide} hideOnClickOutside={false}><span>Content</span></Modal>
      );
      const backdrop = container.querySelector('[aria-hidden="true"]')!;
      fireEvent.click(backdrop);
      expect(onHide).not.toHaveBeenCalled();
    });
  });

  describe('botón de cierre (X)', () => {
    it('renderiza el botón de cierre cuando canClose=true y onHide está definido', () => {
      const onHide = vi.fn();
      render(<Modal title="Test" onHide={onHide} canClose><span>Content</span></Modal>);
      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('no renderiza el botón de cierre cuando canClose=false', () => {
      const onHide = vi.fn();
      render(<Modal title="Test" onHide={onHide} canClose={false}><span>Content</span></Modal>);
      expect(screen.queryByRole('button', { name: /close modal/i })).not.toBeInTheDocument();
    });

    it('llama a onHide al hacer click en el botón de cierre', () => {
      const onHide = vi.fn();
      render(<Modal title="Test" onHide={onHide}><span>Content</span></Modal>);
      fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
      expect(onHide).toHaveBeenCalledTimes(1);
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
