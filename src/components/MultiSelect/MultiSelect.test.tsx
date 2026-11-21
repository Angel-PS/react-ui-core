import { render, screen, fireEvent, within } from '@testing-library/react';
import { MultiSelect } from './MultiSelect';
import type { Option } from '@/types';

const options: Option[] = [
  { value: 1, label: 'Opción 1' },
  { value: 2, label: 'Opción 2' },
  { value: 3, label: 'Opción 3' },
];

describe('MultiSelect', () => {
  describe('renderizado básico', () => {
    it('renderiza el label', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      expect(screen.getByText('Categorías')).toBeInTheDocument();
    });

    it('muestra el asterisco cuando required=true', () => {
      render(<MultiSelect label="Categorías" options={options} required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('muestra el placeholder cuando no hay opción seleccionada', () => {
      render(<MultiSelect label="Categorías" options={options} placeholder="Elige una opción" />);
      expect(screen.getByText('Elige una opción')).toBeInTheDocument();
    });

    it('muestra placeholder por defecto cuando no se pasa placeholder ni hay selección', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });
  });

  describe('estado de carga', () => {
    it('muestra skeleton en lugar del trigger cuando loading=true', () => {
      const { container } = render(<MultiSelect label="Categorías" options={options} loading />);
      expect(container.querySelector('.skeleton')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Categorías' })).not.toBeInTheDocument();
    });
  });

  describe('error', () => {
    it('muestra el mensaje de error', () => {
      render(<MultiSelect label="Categorías" options={options} error="Campo requerido" />);
      expect(screen.getByText('Campo requerido')).toBeInTheDocument();
    });

    it('no muestra mensaje de error cuando error es null', () => {
      render(<MultiSelect label="Categorías" options={options} error={null} />);
      expect(screen.queryByTitle(/./)).not.toBeInTheDocument();
    });
  });

  describe('apertura del dropdown', () => {
    it('abre el dropdown al hacer click en el trigger', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      fireEvent.click(screen.getByRole('button', { name: 'Categorías' }));
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      expect(screen.getByText('Opción 1')).toBeInTheDocument();
      expect(screen.getByText('Opción 2')).toBeInTheDocument();
      expect(screen.getByText('Opción 3')).toBeInTheDocument();
    });

    it('abre el dropdown al presionar Enter en el trigger', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      fireEvent.keyDown(screen.getByRole('button', { name: 'Categorías' }), { key: 'Enter' });
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('no abre el dropdown cuando disabled=true', () => {
      render(<MultiSelect label="Categorías" options={options} disabled />);
      fireEvent.click(screen.getByRole('button', { name: 'Categorías' }));
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('muestra "No options" cuando options está vacío', () => {
      render(<MultiSelect label="Categorías" options={[]} />);
      fireEvent.click(screen.getByRole('button', { name: 'Categorías' }));
      expect(screen.getByText('No options')).toBeInTheDocument();
    });
  });

  describe('selección de opciones', () => {
    it('selecciona una opción y llama a onChange', () => {
      const onChange = vi.fn();
      render(<MultiSelect label="Categorías" options={options} onChange={onChange} />);
      fireEvent.click(screen.getByRole('button', { name: 'Categorías' }));
      fireEvent.click(screen.getByText('Opción 1'));
      expect(onChange).toHaveBeenCalledWith({ target: { name: undefined, value: [1] } });
    });

    it('deselecciona una opción ya seleccionada', () => {
      const onChange = vi.fn();
      render(<MultiSelect label="Categorías" options={options} value={[1]} onChange={onChange} />);
      fireEvent.click(screen.getByRole('button', { name: 'Categorías' })); // trigger
      // "Opción 1" aparece en el tag y en el dropdown; el dropdown es el último en el DOM
      const matches = screen.getAllByText('Opción 1');
      fireEvent.click(matches[matches.length - 1]);
      expect(onChange).toHaveBeenCalledWith({ target: { name: undefined, value: [] } });
    });

    it('emite el name correcto en el evento onChange', () => {
      const onChange = vi.fn();
      render(<MultiSelect label="Categorías" name="cats" options={options} onChange={onChange} />);
      fireEvent.click(screen.getByRole('button', { name: 'Categorías' }));
      fireEvent.click(screen.getByText('Opción 2'));
      expect(onChange).toHaveBeenCalledWith({ target: { name: 'cats', value: [2] } });
    });
  });

  describe('tags y eliminación', () => {
    it('renderiza tags para las opciones seleccionadas', () => {
      render(<MultiSelect label="Categorías" options={options} value={[1, 2]} />);
      expect(screen.getByText('Opción 1')).toBeInTheDocument();
      expect(screen.getByText('Opción 2')).toBeInTheDocument();
    });

    it('elimina un tag al hacer click en el botón X del tag', () => {
      const onChange = vi.fn();
      render(<MultiSelect label="Categorías" options={options} value={[1, 2]} onChange={onChange} />);
      const tag1 = screen.getByText('Opción 1').closest('span')!;
      fireEvent.click(within(tag1).getByRole('button'));
      expect(onChange).toHaveBeenCalledWith({ target: { name: undefined, value: [2] } });
    });

    it('muestra texto resumido cuando selectedOptions supera maxSelectedDisplay', () => {
      render(
        <MultiSelect
          label="Categorías"
          options={options}
          value={[1, 2, 3]}
          maxSelectedDisplay={2}
        />
      );
      expect(screen.getByText('3 selected')).toBeInTheDocument();
    });
  });

  describe('búsqueda', () => {
    it('filtra las opciones según el término de búsqueda', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      fireEvent.click(screen.getByRole('button', { name: 'Categorías' }));
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Opción 1' } });
      expect(screen.getByText('Opción 1')).toBeInTheDocument();
      expect(screen.queryByText('Opción 2')).not.toBeInTheDocument();
    });

    it('muestra "No results found" cuando no hay coincidencias', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      fireEvent.click(screen.getByRole('button', { name: 'Categorías' }));
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'xyz' } });
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  describe('sincronización con value externo', () => {
    it('refleja los valores iniciales del prop value como tags', () => {
      render(<MultiSelect label="Categorías" options={options} value={[2, 3]} />);
      expect(screen.getByText('Opción 2')).toBeInTheDocument();
      expect(screen.getByText('Opción 3')).toBeInTheDocument();
    });
  });

  describe('labels (i18n)', () => {
    it('acepta textos propios en lugar de los ingleses por defecto', () => {
      render(
        <MultiSelect
          label="Categorías"
          options={[]}
          labels={{
            placeholder: 'Selecciona una opción',
            search: 'Buscar...',
            noOptions: 'No hay opciones',
          }}
        />,
      );
      expect(screen.getByText('Selecciona una opción')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Categorías' }));
      expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
      expect(screen.getByText('No hay opciones')).toBeInTheDocument();
    });

    it('selectedCount y removeItem son funciones traducibles', () => {
      render(
        <MultiSelect
          label="Categorías"
          options={options}
          value={[1, 2, 3]}
          maxSelectedDisplay={2}
          labels={{ selectedCount: (n) => `${n} seleccionados` }}
        />,
      );
      expect(screen.getByText('3 seleccionados')).toBeInTheDocument();
    });

    it('el botón X de cada chip tiene nombre accesible', () => {
      render(
        <MultiSelect
          label="Categorías"
          options={options}
          value={[1]}
          labels={{ removeItem: (l) => `Quitar ${l}` }}
        />,
      );
      expect(screen.getByRole('button', { name: 'Quitar Opción 1' })).toBeInTheDocument();
    });
  });

  describe('accesibilidad', () => {
    it('el label nombra al disparador (aria-labelledby)', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      expect(screen.getByLabelText('Categorías')).toHaveAttribute('role', 'button');
    });

    it('hacer click en el label enfoca el disparador', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      fireEvent.click(screen.getByText('Categorías'));
      expect(screen.getByRole('button', { name: 'Categorías' })).toHaveFocus();
    });

    it('expone aria-expanded y aria-haspopup', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      const trigger = screen.getByRole('button', { name: 'Categorías' });
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('marca el error con aria-invalid y aria-describedby', () => {
      render(<MultiSelect label="Categorías" options={options} error="Campo requerido" />);
      const trigger = screen.getByRole('button', { name: 'Categorías' });
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
      expect(trigger).toHaveAccessibleDescription('Campo requerido');
    });

    it('deshabilitado sale del orden de tabulación', () => {
      render(<MultiSelect label="Categorías" options={options} disabled />);
      const trigger = screen.getByRole('button', { name: 'Categorías' });
      expect(trigger).toHaveAttribute('tabindex', '-1');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('estilos', () => {
    it('no pinta el fondo rojo sobrante detrás del disparador', () => {
      const { container } = render(<MultiSelect label="Categorías" options={options} />);
      expect(container.querySelector('.bg-red-500')).toBeNull();
    });

    it('el disparador tiene variantes de modo oscuro', () => {
      render(<MultiSelect label="Categorías" options={options} />);
      expect(screen.getByRole('button', { name: 'Categorías' })).toHaveClass(
        'dark:bg-slate-900',
        'dark:border-slate-700',
      );
    });
  });
});
