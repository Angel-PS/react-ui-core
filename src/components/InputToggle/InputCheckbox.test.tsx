import { render, screen, fireEvent } from '@testing-library/react';
import { InputCheckbox, InputToggle } from './InputCheckbox';

describe('InputCheckbox', () => {
  describe('renderizado básico', () => {
    it('renderiza un input de tipo checkbox', () => {
      render(<InputCheckbox id="cb1" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renderiza el label cuando se proporciona', () => {
      render(<InputCheckbox id="cb1" label="Acepto los términos" />);
      expect(screen.getByText('Acepto los términos')).toBeInTheDocument();
    });

    it('no renderiza texto de label si no se proporciona', () => {
      render(<InputCheckbox id="cb1" />);
      const labels = screen.queryAllByText(/.+/);
      expect(labels).toHaveLength(0);
    });

    it('vincula el label al input mediante htmlFor e id', () => {
      render(<InputCheckbox id="cb1" label="Mi opción" />);
      const input = screen.getByRole('checkbox');
      expect(input).toHaveAttribute('id', 'cb1');
      const label = screen.getByText('Mi opción').closest('label');
      expect(label).toHaveAttribute('for', 'cb1');
    });
  });

  describe('estado de carga', () => {
    it('muestra skeleton en lugar del checkbox cuando loading=true', () => {
      const { container } = render(<InputCheckbox id="cb1" loading />);
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
      expect(container.querySelector('.skeleton')).toBeInTheDocument();
    });

    it('muestra el checkbox cuando loading=false', () => {
      render(<InputCheckbox id="cb1" loading={false} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('deshabilita el checkbox cuando disabled=true', () => {
      render(<InputCheckbox id="cb1" disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('no deshabilita el checkbox por defecto', () => {
      render(<InputCheckbox id="cb1" />);
      expect(screen.getByRole('checkbox')).not.toBeDisabled();
    });
  });

  describe('checked / onChange', () => {
    it('refleja el estado checked cuando se pasa como prop', () => {
      render(<InputCheckbox id="cb1" checked onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('llama al callback onChange al hacer click', () => {
      const onChange = vi.fn();
      render(<InputCheckbox id="cb1" onChange={onChange} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});

describe('InputToggle', () => {
  describe('renderizado básico', () => {
    it('renderiza un input de tipo checkbox', () => {
      render(<InputToggle id="tg1" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renderiza el label cuando se proporciona', () => {
      render(<InputToggle id="tg1" label="Activar notificaciones" />);
      expect(screen.getByText('Activar notificaciones')).toBeInTheDocument();
    });

    it('no renderiza texto de label si no se proporciona', () => {
      render(<InputToggle id="tg1" />);
      expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
    });

    it('vincula el label al input mediante htmlFor e id', () => {
      render(<InputToggle id="tg1" label="Mi toggle" />);
      const input = screen.getByRole('checkbox');
      expect(input).toHaveAttribute('id', 'tg1');
      const label = screen.getByText('Mi toggle').closest('label');
      expect(label).toHaveAttribute('for', 'tg1');
    });
  });

  describe('estado de carga', () => {
    it('muestra skeleton en lugar del toggle cuando loading=true', () => {
      const { container } = render(<InputToggle id="tg1" loading />);
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
      expect(container.querySelector('.skeleton')).toBeInTheDocument();
    });

    it('muestra el toggle cuando loading=false', () => {
      render(<InputToggle id="tg1" loading={false} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('deshabilita el toggle cuando disabled=true', () => {
      render(<InputToggle id="tg1" disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('no deshabilita el toggle por defecto', () => {
      render(<InputToggle id="tg1" />);
      expect(screen.getByRole('checkbox')).not.toBeDisabled();
    });
  });

  describe('checked / onChange', () => {
    it('refleja el estado checked cuando se pasa como prop', () => {
      render(<InputToggle id="tg1" checked onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('llama al callback onChange al hacer click', () => {
      const onChange = vi.fn();
      render(<InputToggle id="tg1" onChange={onChange} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
