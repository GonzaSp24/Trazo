# Trazo Espacio Gráfico — E-commerce frontend

Tienda minimalista (sin backend), datos estáticos, estética "trazo de pincel".

## Identidad visual
- Logo del cliente (cuadro con trazo grunge + barras, "TRAZO / ESPACIO GRÁFICO"): recortado y usado en navbar, footer y favicon (ícono del cuadro). La "A" sin travesaño y el trazo de pincel amarillo del logo inspiran los detalles del sitio.
- Tipografía principal geométrica espaciada (ej. "Jost"/"Outfit") para coincidir con el logo.
- Fondo off-white, texto negro carbón, acento mostaza #E5B745 (tokens oklch en styles.css).
- Tipografías: display con carácter manuscrito (ej. "Caveat Brush" / "Permanent Marker") para acentos + sans limpia (ej. "Space Grotesk") para texto.
- Trazos SVG amarillos detrás de títulos, subrayados a mano, bordes irregulares (border-radius asimétrico), sombras "offset" tipo sticker, hover con leve rotación/elevación.

## Páginas
- **Navbar + Footer** compartidos: "TRAZO" destacado, links (Inicio, Productos, Mural), ícono carrito con contador.
- **/ Home**: hero con título creativo + trazo amarillo, grilla de destacados (Tarjetas, Stickers, Pines, Kits emprendedores), banner CTA grande al Creador de Mural.
- **/productos**: catálogo completo con filtro por categoría (datos estáticos, ~12 productos).
- **/mural** (estrella):
  - Izquierda: "puerta de heladera" gris claro con imanes 5x5 arrastrables (drag con pointer events dentro del contenedor).
  - Derecha: panel "Armá tu mural": subir fotos (preview local), selector de pack (x6 / x9 / x12), contador, precio, "Agregar al carrito".
  - En móvil el panel queda debajo.
- **Carrito**: drawer (Sheet de shadcn) con items, cantidades y total; toast al agregar.

## Técnico
- TanStack routes: index, productos, mural; layout en __root; head() por ruta.
- Estado del carrito en contexto React (memoria local).
- shadcn: Button, Sheet, Dialog, Badge, Input; sonner para toasts; lucide-react íconos.
- Imágenes de productos generadas con IA.
