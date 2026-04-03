import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  describe('renderizado básico', () => {
    it('renderiza un input de tipo text por defecto', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renderiza el label cuando se proporciona', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('muestra el asterisco de requerido cuando required=true', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('no muestra asterisco si required no se pasa', () => {
      render(<Input label="Email" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

  });

  describe('estado de carga', () => {
    it('muestra skeleton en lugar del input cuando loading=true', () => {
      const { container } = render(<Input loading />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(container.querySelector('.skeleton')).toBeInTheDocument();
    });
  });

  describe('error', () => {
    it('muestra el mensaje de error', () => {
      render(<Input error="Campo requerido" />);
      expect(screen.getByText('Campo requerido')).toBeInTheDocument();
    });

    it('aplica aria-invalid="true" cuando hay error', () => {
      render(<Input error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('aplica aria-invalid="false" cuando no hay error', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('no muestra mensaje de error cuando error es null', () => {
      render(<Input error={null} />);
      expect(screen.queryByRole('textbox')).toBeInTheDocument();
      // No hay texto de error en el DOM
      expect(document.querySelector('[title]')).not.toBeInTheDocument();
    });
  });

  describe('prefix', () => {
    it('renderiza el prefijo cuando se proporciona', () => {
      render(<Input prefix="$" />);
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('renderiza sin prefix wrapper cuando prefix no se pasa', () => {
      render(<Input />);
      // El input está directamente, no dentro de un wrapper con flex
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('deshabilita el input cuando disabled=true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('deshabilita el input dentro del wrapper con prefix', () => {
      render(<Input prefix="$" disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('aria-required', () => {
    it('aplica aria-required="true" cuando required=true', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    });

    it('aplica aria-required="false" cuando required=false', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'false');
    });
  });

  describe('handleInput - validaciones', () => {
    it('trunca el valor al maxLength al disparar input', () => {
      render(<Input maxLength={5} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      Object.defineProperty(input, 'value', { writable: true, value: '123456' });
      fireEvent.input(input);
      expect(input.value).toBe('12345');
    });

    it('limita el valor al maxValue en inputs numéricos', () => {
      render(<Input type="number" maxValue={100} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      Object.defineProperty(input, 'value', { writable: true, value: '150' });
      fireEvent.input(input);
      expect(input.value).toBe('100');
    });

    it('aplica el minValue en inputs numéricos', () => {
      render(<Input type="number" minValue={10} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      Object.defineProperty(input, 'value', { writable: true, value: '5' });
      fireEvent.input(input);
      expect(input.value).toBe('10');
    });

    it('elimina el cero inicial en inputs numéricos', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      Object.defineProperty(input, 'value', { writable: true, value: '05' });
      fireEvent.input(input);
      expect(input.value).toBe('5');
    });

    it('llama al callback onInput externo', () => {
      const onInput = vi.fn();
      render(<Input onInput={onInput} />);
      fireEvent.input(screen.getByRole('textbox'));
      expect(onInput).toHaveBeenCalledTimes(1);
    });
  });
});
