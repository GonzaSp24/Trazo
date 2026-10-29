# Panel de Control (/admin)

Página de gestión de inventario con datos simulados (sin base de datos todavía), con el estilo de Trazo.

## Qué se construye
1. **Encabezado:** título "Panel de Control" con ícono, y botón mostaza "+ Nuevo Producto".
2. **Tabla de inventario:**
   - Producto (miniatura + nombre)
   - Categoría (píldora)
   - Variantes y precio (ej. "x50 unidades - $9.800", una línea por variante)
   - Acciones (lápiz para editar, tacho rojo para eliminar, con confirmación)
   - En celular, la tabla se desplaza horizontalmente y las columnas se compactan.
3. **Ventana de crear/editar:**
   - Nombre, selector de categoría, área "Subir foto" con vista previa local.
   - Variantes: filas con nombre, precio y stock; botones para agregar y quitar filas.
   - Botones "Cancelar" y "Guardar Cambios". Al guardar, la tabla se actualiza en el momento (solo en memoria) y aparece un aviso.
4. **Acceso escondido:** en el pie de página el texto pasa a "© 2026 Todos los derechos reservados · Trazo", y la palabra "Trazo" lleva a /admin, sin verse como un enlace.

## Datos simulados
Unos 8 productos de tarjetas, stickers y pines (más algún kit), cada uno con 1 a 3 variantes que tienen precio y stock. Quedan separados en su propio archivo para que después sea fácil conectarlos a tu base de datos.

## Aviso
Por ahora /admin queda abierto para cualquiera que conozca el enlace. La protección con contraseña se puede sumar cuando conectes la base de datos.

## Detalles técnicos
- Ruta nueva `src/routes/admin.tsx` con head() propio y `noindex`.
- Mock data en `src/lib/admin-data.ts` (tipo `AdminProduct { id, name, category, image, variants: {id,name,price,stock}[] }`).
- Componentes de shadcn: Table, Dialog, Select, Input, Label, Badge, AlertDialog. Se agregan los que falten.
- Estado de la página con useState. Imagen subida mediante URL.createObjectURL.
- Footer: se edita la línea del copyright en `Layout.tsx`.
