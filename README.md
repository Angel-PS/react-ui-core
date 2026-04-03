# @angelps/react-ui-core

Librería de componentes React reutilizables, construida con TypeScript y Tailwind CSS.

## Requisitos

- React >= 17
- react-dom >= 17

## Instalación

```bash
npm install @angelps/react-ui-core
```

## Configuración de estilos

Importa los estilos globales una sola vez en el punto de entrada de tu aplicación:

```tsx
import '@angelps/react-ui-core/styles';
```

---

## Componentes

### Input

Campo de texto con soporte para label, error, prefijo, tamaños y estado de carga.

```tsx
import { Input } from '@angelps/react-ui-core';

<Input
  name="email"
  label="Correo electrónico"
  placeholder="correo@ejemplo.com"
/>
```

#### Props

| Prop          | Tipo                    | Por defecto | Descripción                                     |
|---------------|-------------------------|-------------|-------------------------------------------------|
| `label`       | `string`                | —           | Etiqueta visible sobre el campo                 |
| `error`       | `string \| null`        | —           | Mensaje de error (pone borde rojo)              |
| `loading`     | `boolean`               | `false`     | Muestra un skeleton en lugar del input          |
| `required`    | `boolean`               | `false`     | Muestra asterisco rojo junto al label           |
| `size`        | `"sm" \| "md" \| "lg"` | `"md"`      | Tamaño del campo                                |
| `prefix`      | `string`                | —           | Texto prefijo dentro del input (ej. `"$"`)      |
| `prefixColor` | `string`                | —           | Color CSS para el texto del prefijo             |
| `maxLength`   | `number`                | —           | Límite de caracteres (se aplica en tiempo real) |
| `maxValue`    | `number`                | —           | Valor máximo para inputs de tipo `number`       |
| `minValue`    | `number`                | —           | Valor mínimo para inputs de tipo `number`       |
| `...rest`     | `InputHTMLAttributes`   | —           | Todos los atributos nativos de `<input>`        |

#### Ejemplos

```tsx
// Con error
<Input name="nombre" label="Nombre" error="Este campo es obligatorio" />

// Con prefijo y tipo número
<Input name="precio" label="Precio" type="number" prefix="$" maxValue={9999} />

// Con tamaño pequeño y estado deshabilitado
<Input name="ref" label="Referencia" size="sm" disabled />

// Con skeleton de carga
<Input name="desc" label="Descripción" loading />
```

---

### MultiSelect

Selector múltiple con búsqueda, tags removibles y portal.

```tsx
import { MultiSelect } from '@angelps/react-ui-core';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
];

<MultiSelect
  label="Frameworks"
  options={options}
  value={selected}
  onChange={(e) => setSelected(e.target.value)}
/>
```

#### Props

| Prop                 | Tipo                                       | Por defecto             | Descripción                                           |
|----------------------|--------------------------------------------|-------------------------|-------------------------------------------------------|
| `label`              | `string`                                   | —                       | Etiqueta visible sobre el selector (**requerido**)    |
| `name`               | `string`                                   | —                       | Nombre del campo (se incluye en el evento onChange)   |
| `options`            | `Option[]`                                 | `[]`                    | Lista de opciones disponibles                         |
| `value`              | `(string \| number)[]`                     | `[]`                    | Valores seleccionados (modo controlado)               |
| `onChange`           | `(e: { target: { name?, value[] } }) => void` | —                    | Callback cuando cambia la selección                   |
| `error`              | `string \| null`                           | `null`                  | Mensaje de error                                      |
| `loading`            | `boolean`                                  | `false`                 | Muestra un skeleton                                   |
| `placeholder`        | `string`                                   | `"Selecciona una opción"` | Texto cuando no hay selección                       |
| `disabled`           | `boolean`                                  | `false`                 | Deshabilita el selector                               |
| `required`           | `boolean`                                  | `false`                 | Muestra asterisco rojo junto al label                 |
| `color`              | `string`                                   | —                       | Color CSS para el indicador de punto junto al label   |
| `maxSelectedDisplay` | `number`                                   | `3`                     | Máximo de tags visibles antes de mostrar contador     |
| `className`          | `string`                                   | `""`                    | Clases extra para el trigger                          |

#### Tipo `Option`

```ts
interface Option {
  label: string;
  value: string | number;
  selected?: boolean;
  data?: unknown;    // payload adicional que puedes guardar
}
```

#### Ejemplos

```tsx
// Modo controlado
const [frameworks, setFrameworks] = useState<(string | number)[]>([]);

<MultiSelect
  label="Frameworks"
  name="frameworks"
  options={options}
  value={frameworks}
  onChange={(e) => setFrameworks(e.target.value)}
/>

// Con error y campo requerido
<MultiSelect
  label="Categorías"
  options={options}
  value={[]}
  required
  error="Selecciona al menos una categoría"
/>

// Con indicador de color y límite de tags visibles
<MultiSelect
  label="Etiquetas"
  options={options}
  value={['react', 'vue', 'angular', 'svelte']}
  color="#6366f1"
  maxSelectedDisplay={2}
/>
```

---

### Modal

Ventana modal con fondo difuminado, soporte para cerrar con ESC, clic fuera o botón.

```tsx
import { Modal } from '@angelps/react-ui-core';

const [open, setOpen] = useState(false);

{open && (
  <Modal title="Confirmar acción" onHide={() => setOpen(false)}>
    <p>¿Estás seguro de que deseas continuar?</p>
    <button onClick={() => setOpen(false)}>Aceptar</button>
  </Modal>
)}
```

#### Props

| Prop                 | Tipo              | Por defecto | Descripción                                        |
|----------------------|-------------------|-------------|----------------------------------------------------|
| `children`           | `ReactNode`       | —           | Contenido del modal (**requerido**)                |
| `title`              | `string`          | —           | Título que aparece en el header                    |
| `onHide`             | `() => void`      | —           | Callback para cerrar el modal                      |
| `hideOnClickOutside` | `boolean`         | `true`      | Cierra el modal al hacer clic en el fondo          |
| `canClose`           | `boolean`         | `true`      | Muestra el botón "×" en el header                  |

> El modal bloquea el scroll del body mientras está abierto y se cierra al presionar `Escape`.

#### Ejemplos

```tsx
// Sin botón de cierre (el usuario debe confirmar una acción)
<Modal title="Acción requerida" onHide={handleHide} canClose={false}>
  <p>Debes completar el formulario para continuar.</p>
</Modal>

// Sin cerrar al hacer clic fuera
<Modal title="Datos importantes" onHide={handleHide} hideOnClickOutside={false}>
  <p>Lee esto antes de continuar.</p>
</Modal>

// Solo contenido, sin header
<Modal>
  <img src="/success.svg" alt="Éxito" />
  <p>Operación completada.</p>
</Modal>
```

---

## Storybook

Para explorar los componentes de forma interactiva:

```bash
npm run storybook
```

Accede a `http://localhost:6006` en tu navegador.

## Tests

Los tests corren a través de Vitest con Storybook como fuente de pruebas:

```bash
npx vitest
```

## Build

```bash
npm run build
```

Genera los archivos en `dist/`:

| Archivo              | Formato  |
|----------------------|----------|
| `ui-core.es.js`      | ESModule |
| `ui-core.cjs.js`     | CommonJS |
| `style.css`          | CSS      |
| `index.d.ts`         | Tipos TS |
