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
      expect(screen.getByRole('alert')).toHaveTextContent('Campo requerido');
    });

    it('no muestra mensaje de error cuando error es null', () => {
      render(<Input error={null} />);
      expect(screen.queryByRole('textbox')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('mask', () => {
    it('renderiza un input enmascarado cuando se pasa mask', () => {
      render(<Input mask="(___) ___-____" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('deshabilita el input cuando disabled=true', () => {
      render(<Input disabled />);
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

    it('elimina solo los ceros iniciales redundantes en inputs numéricos', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      Object.defineProperty(input, 'value', { writable: true, value: '05' });
      fireEvent.input(input);
      expect(input.value).toBe('5');
    });

    it.each(['0', '0.5', '0.'])(
      'conserva %s (un 0 solo, un decimal o un decimal a medio escribir)',
      (typed) => {
        render(<Input type="number" />);
        const input = screen.getByRole('spinbutton') as HTMLInputElement;
        Object.defineProperty(input, 'value', { writable: true, value: typed });
        fireEvent.input(input);
        expect(input.value).toBe(typed);
      },
    );

    it('respeta maxValue=0', () => {
      render(<Input type="number" maxValue={0} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      Object.defineProperty(input, 'value', { writable: true, value: '3' });
      fireEvent.input(input);
      expect(input.value).toBe('0');
    });

    it('digitsOnly quita todo lo que no es dígito', () => {
      render(<Input digitsOnly />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      Object.defineProperty(input, 'value', { writable: true, value: '1-31.45a5' });
      fireEvent.input(input);
      expect(input.value).toBe('131455');
    });

    it('sigue llamando al onInput del consumidor', () => {
      const onInput = vi.fn();
      render(<Input onInput={onInput} />);
      fireEvent.input(screen.getByRole('textbox'));
      expect(onInput).toHaveBeenCalledTimes(1);
    });
  });

  describe('minValue', () => {
    it('no reescribe mientras se escribe (se puede pasar por números menores)', () => {
      render(<Input type="number" minValue={10} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.input(input);
      expect(input.value).toBe('1');
    });

    it('sube al mínimo al perder el foco y avisa a onChange', () => {
      const onChange = vi.fn();
      const onBlur = vi.fn();
      render(
        <Input type="number" minValue={10} onChange={onChange} onBlur={onBlur} />,
      );
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '5' } });
      onChange.mockClear();
      fireEvent.blur(input);
      expect(input.value).toBe('10');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].target.value).toBe('10');
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('deja vacío un campo vaciado (no lo rellena con el mínimo)', () => {
      render(<Input type="number" minValue={0} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.input(input);
      fireEvent.blur(input);
      expect(input.value).toBe('');
    });
  });

  describe('accesibilidad', () => {
    it('asocia el label al control usando name cuando no hay id', () => {
      render(<Input label="Correo" name="email" />);
      const input = screen.getByLabelText('Correo');
      expect(input).toHaveAttribute('id', 'email');
    });

    it('usa el id cuando se pasa', () => {
      render(<Input label="Correo" id="contact-email" name="email" />);
      expect(screen.getByLabelText('Correo')).toHaveAttribute('id', 'contact-email');
    });

    it('asocia el label aunque no haya id ni name', () => {
      render(<Input label="Notas" />);
      expect(screen.getByLabelText('Notas')).toBeInTheDocument();
    });

    it('asocia el label también en el input enmascarado', () => {
      render(<Input label="Teléfono" name="phone" mask="(___) ___-____" />);
      expect(screen.getByLabelText('Teléfono')).toHaveAttribute('id', 'phone');
    });

    it('marca aria-invalid y describe el control con el error', () => {
      render(<Input label="Correo" name="email" error="Correo inválido" />);
      const input = screen.getByLabelText('Correo');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription('Correo inválido');
      expect(screen.getByRole('alert')).toHaveAttribute('id', 'email-error');
    });

    it('sin error no marca aria-invalid', () => {
      render(<Input label="Correo" name="email" />);
      expect(screen.getByLabelText('Correo')).not.toHaveAttribute('aria-invalid');
    });

    it('hint se muestra y forma parte de la descripción accesible', () => {
      render(<Input label="Días" name="days" hint="0 desactiva la expiración" />);
      expect(screen.getByText('0 desactiva la expiración')).toBeInTheDocument();
      expect(screen.getByLabelText('Días')).toHaveAccessibleDescription(
        '0 desactiva la expiración',
      );
    });

    it('combina aria-describedby del consumidor, error y hint', () => {
      render(
        <>
          <p id="extra">Extra</p>
          <Input
            label="Días"
            name="days"
            aria-describedby="extra"
            error="Requerido"
            hint="Pista"
          />
        </>,
      );
      expect(screen.getByLabelText('Días')).toHaveAttribute(
        'aria-describedby',
        'extra days-error days-hint',
      );
    });
  });
});
