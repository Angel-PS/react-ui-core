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

`/styles` es el CSS ya compilado. Si tu app usa Tailwind v4 y quieres compartir los tokens (y que tus propias clases `bg-primary-blue-*` funcionen), importa el tema crudo y deja que tu Tailwind escanee el bundle de la librería:

```css
@import "tailwindcss";
@import "@angelps/react-ui-core/css";
@source "../node_modules/@angelps/react-ui-core/dist/**/*.js";
```

El modo oscuro se activa añadiendo la clase `dark` a `<html>`. Todo texto visible se puede traducir con la prop `labels` de cada componente (los valores por defecto están en inglés).

---

## Novedades en 0.6.0

Sincroniza la librería con las mejoras que `bluepos-client` hizo a sus copias locales y añade componentes nuevos.

**Componentes nuevos:** `SectionHeading`, `FormActions`, `ModalHeader`, `CurrencyInput`, `ColorInput`, `TagInput`, `EmptyState`, `ErrorState`, `Card` + `SettingRow`, `Switch`, `Tabs` + `TabPanel`, `ErrorBoundary` (también como `errorBoundary`/`contentKey` en `AppLayout`), `Sparkline`, `Trend`, `CompanySwitcherDialog`. Hooks nuevos: `useDialogA11y`, `useGlobalHotkey`, `useReducedMotion`. Utilidades nuevas: `normalize`, `formatCompact`, `formatDateIntl`, `formatDateRangeIntl`, `defaultHiddenAccessors`, `resolveHiddenAccessors`, `pickHorizontalAnchor`/`horizontalAnchorFor`/`fixedPopoverPosition`. Clases CSS nuevas: `surface-card`, `surface-card-interactive`, `surface-inset`, `text-2xs`.

**Mejoras en componentes existentes (resumen):** variantes de `Button` (`segment-*`, `segment-brand-*`, `link`, `chip`, `fab`) y `ref`; `Input`/`Select` con `hint`, `aria-invalid`/`aria-describedby` y label asociado al control; `Input` con `digitsOnly`; `InputCheckbox` con `indeterminate`/`compact`; columnas `defaultHidden`, `adornment` en celdas de estado, `subValue` en celdas simples y `timeZone` en `Table`; paneles de `ColumnManager`/filtros que se voltean para no quedar recortados; etiquetas traducibles de paginación, filtros y columnas a través de `MaintenanceLayout`; `loading` en `Sidebar`, `CompanySwitcher` y `UserMenu`; `tone` en las notificaciones; búsqueda sin acentos en `CommandPalette`; estados genéricos nuevos en `statusStyles` y `getStatusStyle(status, overrides)`.

**Cambios de comportamiento (revisa al actualizar):**

1. **`Modal` se renderiza en un portal** dentro de `document.body`. Los tests que buscaban el contenido con `container.querySelector` deben usar `screen`/`document`, y el CSS que dependía de un ancestro ya no aplica. El panel es el elemento `role="dialog"` (conserva la clase `animate-scaleIn`).
2. **Cierre del `Modal`:** se cierra con un `mousedown` del botón izquierdo sobre el fondo (arrastrar una selección de texto fuera del panel ya no lo cierra). `Escape` cierra solo el diálogo superior y, por defecto, solo si `canClose && hideOnClickOutside`; usa `closeOnEscape` para cambiarlo. `ConfirmDialog` ya no se cierra con `Escape` mientras `isLoading`.
3. **`Input`/`Select` siempre ponen un `id`** en el control (`id ?? name`): dos campos con el mismo `name` en una página tendrán ids duplicados — pasa `id` explícito en ese caso.
4. **Números en `Input`:** solo se quitan los ceros a la izquierda redundantes (`0`, `0.5`, `0.` se pueden escribir); `minValue` se aplica al salir del campo y un campo vacío se queda vacío. Los `onInput`/`onBlur`/`onFocus` del consumidor ya no reemplazan a los internos: se ejecutan después.
5. **Errores en línea:** el mensaje de error de `Input`/`Select`/`MultiSelect` va en el flujo normal con `role="alert"` (desde 0.5.1). Si tu app pintaba su propio error con `role="alert"`, quítalo para no anunciarlo dos veces.
6. **Columnas:** `applyColumnPrefs` oculta las columnas `defaultHidden` aunque no haya preferencia guardada, y `MaintenanceLayout` aplica preferencias siempre que haya `tableKey`.
7. **`Pagination`:** las opciones por defecto son `[10, 25, 50, 100, 200]` y un tamaño fuera de la lista aparece como opción propia.
8. **Barra de filtros:** los filtros en línea quedan a la izquierda y el botón "Filters" a la derecha (`ml-auto`), en vez de repartirse con `justify-between`.
9. **`MultiSelect`:** los textos por defecto pasan a inglés (`"3 selected"`); pasa `labels` para otro idioma.
10. **`CompanySwitcher`:** sin compañía activa muestra `labels.noCompany` en vez de "-", y permite elegir aunque solo haya una compañía. **`NewActionMenu`** no se pinta si todos sus grupos están vacíos.

**Notas de los componentes nuevos:**

- `CurrencyInput.onChange` recibe `number | null`: borrar el campo envía `null` y el campo vacío se queda vacío al salir (no se inventa `0.00`). Al salir del campo se envía el valor redondeado a `decimals` (y subido a `minValue`) si cambió, de modo que el formulario siempre tiene lo que se ve. `NaN` se pinta como vacío.
- `Card`, `SettingRow` y `EmptyState` se pintan con los tokens semánticos (`bg-card`, `border-border`, `text-muted-foreground`, `bg-muted`), así que una app que re-tematiza esos tokens re-tematiza también estos componentes. `Card` tiene `action` (slot a la derecha del header) y `variant="compact"` (tarjeta de dashboard); `EmptyState`/`ErrorState` tienen `variant="plain"` para usarse dentro de una tarjeta, y `ErrorState.onRetry` es opcional.
- `FormActions` acepta `submitDisabled`, `cancelDisabled`, `cancelVariant` y `submitLabel`. `Trend` acepta `labels.noBaseline` (texto para lectores de pantalla del "—") y `tone="inherit"` para chips sobre superficies de marca. `TagInput` reenvía `ref` y acepta `onBlur` (integración con react-hook-form).

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
| `placeholder`        | `string`                                   | `labels.placeholder`    | Texto cuando no hay selección                         |
| `labels`             | `Partial<MultiSelectLabels>`               | inglés                  | Textos (`placeholder`, `search`, `noOptions`, `noResults`, `selectedCount(n)`, `removeItem(label)`) |
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
| `hideOnClickOutside` | `boolean`         | `true`      | Cierra el modal al presionar sobre el fondo        |
| `canClose`           | `boolean`         | `true`      | Muestra el botón "×" en el header                  |
| `closeOnEscape`      | `boolean`         | `canClose && hideOnClickOutside` | Cierra con `Escape` (solo el diálogo superior) |
| `ariaLabel`          | `string`          | —           | Nombre accesible cuando no hay `title` (p. ej. con `headerContent`) |
| `ariaDescribedBy`    | `string`          | —           | Id del elemento que describe el diálogo            |
| `headerContent`      | `ReactNode`       | —           | Header propio (p. ej. `<ModalHeader>`) en lugar del título |
| `closeLabel` / `dialogLabel` | `string`  | `"Close"` / `"Dialog"` | Textos accesibles del botón × y del diálogo |

> El modal se renderiza en un portal en `document.body`, bloquea el scroll del body, atrapa el foco con `Tab` y lo devuelve al cerrar.

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
