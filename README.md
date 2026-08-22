# Portafolio Web — Fabio

Sitio web personal para mostrar mis proyectos y habilidades como desarrollador web front-end.

## 🚀 Demo

Puedes ver el sitio en vivo aquí: `[agregar enlace cuando esté publicado]`

## 📂 Estructura del proyecto

```
portafolio/
│
├── index.html            # Página principal
├── admin.html             # Panel de administrador (facturación) — no listado en el menú
├── calculadora.html        # Calculadora de servicios/estimados
├── worker.js               # Cloudflare Worker (notificación por WhatsApp vía CallMeBot)
├── css/
│   ├── styles.css          # Estilos generales del sitio y de la calculadora
│   └── admin.css           # Estilos exclusivos del panel de administrador
├── js/
│   ├── main.js              # Lógica del sitio público (menú, scroll, terminal, contacto)
│   ├── admin.js              # Lógica del panel de administrador (login, facturas, PDF)
│   └── calculadora.js        # Lógica de la calculadora de servicios
├── img/
│   ├── portafo-1.webp        # Captura del proyecto Greilys Rivas Academy
│   ├── portafo-2.webp        # Captura del proyecto La Dolcería
│   └── portafo-3.webp        # Captura del proyecto Dr. Julio Estrada
└── README.md
```

## 🛠️ Tecnologías utilizadas

- **HTML5** — estructura semántica del sitio
- **CSS3** — estilos, responsive design y animaciones (estética oscura tipo "blueprint técnico")
- **JavaScript (Vanilla)** — toda la interactividad, sin frameworks
- **jsPDF** (CDN) — generación de facturas en PDF desde el navegador
- **Formspree** — envío del formulario de contacto por correo, sin backend propio
- **Cloudflare Workers** — notificación por WhatsApp (vía CallMeBot) cuando llega un mensaje de contacto

## ✨ Características

### Sitio público (`index.html`)
- Diseño responsive (adaptado a móvil, tablet y escritorio)
- Hero con una terminal animada (efecto de escritura) que presenta el stack y los proyectos
- Sección "Sobre mí" con presentación profesional
- **Galería de proyectos** en formato "bento": una tarjeta destacada, dos tarjetas horizontales apiladas y una última tarjeta a todo el ancho — con capturas reales de cada sitio (Greilys Rivas Academy, La Dolcería, Dr. Julio Estrada)
- **Habilidades**: bloques descriptivos + barras de nivel por categoría (Frontend / Automatización e infraestructura) con animación de carga al entrar en pantalla, y una fila de "Tech Stack" con las tecnologías usadas
- **Calculadora de servicios** enlazada desde el menú, con estimado de inversión
- Formulario de contacto (envío por correo vía Formspree)
- Animaciones al hacer scroll (Intersection Observer) y soporte para `prefers-reduced-motion`

### Calculadora de servicios (`calculadora.html`)
- Selección de **plan mensual** (Básico $40 / Avanzado $60 / Plus $100)
- Selección de **tipo de proyecto** (Landing Page, Portafolio, E-commerce, Adición de contenido, Actualización del sitio)
- Páginas adicionales y, para e-commerce, cantidad de productos (por tramos de precio)
- Integraciones extra seleccionables (WhatsApp, Instagram, pagos, soporte, blog, foro, galería), cada una con su propio costo
- Panel de administración como extra opcional
- Campo de requerimientos adicionales en texto libre
- Al calcular, muestra el estimado total y genera un botón que arma un mensaje de WhatsApp con el resumen completo, listo para enviar
- Todos los precios viven en el objeto `PRECIOS` al inicio de `calculadora.js`, fáciles de ajustar

### Panel de administrador (`admin.html`)
- Acceso protegido con contraseña (protección básica del lado del cliente — cambia `ADMIN_PASSWORD` en `admin.js` antes de publicar)
- Formulario para crear facturas: cliente, marca, plan, monto en USD y en moneda local (GTQ, MXN, COP, CLP, PEN, ARS, VES, USD u otra)
- Numeración automática de facturas, guardadas en `localStorage`
- Historial con opciones para **ver/imprimir**, **descargar como PDF** (con jsPDF) o **eliminar** cada factura
- No aparece enlazado en el menú público — se accede escribiendo la URL directamente

## 📦 Cómo usar este proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/portafolio.git
   ```
2. Entra a la carpeta del proyecto:
   ```bash
   cd portafolio
   ```
3. Abre `index.html` en tu navegador (o usa una extensión como Live Server en VS Code).

No requiere instalación de dependencias ni build: es HTML, CSS y JS puros (jsPDF se carga vía CDN).

### Configuración pendiente antes de publicar

- **Formspree**: reemplaza `TU_ID_DE_FORMSPREE` en el `action` del formulario de contacto (`index.html`) por tu ID real.
- **Admin**: cambia `ADMIN_PASSWORD` en `js/admin.js` por una contraseña propia.
- **WhatsApp del panel de admin (Cloudflare Worker)**: despliega `worker.js` en Cloudflare Workers y configura los *secrets* `WHATSAPP_NUMERO`, `WHATSAPP_APIKEY` y `ALLOWED_ORIGIN` (instrucciones dentro del archivo).
- **WhatsApp de la calculadora**: revisa `WHATSAPP_NUMERO` en `js/calculadora.js`.
- **Precios**: ajusta los valores del objeto `PRECIOS` en `js/calculadora.js` según tus tarifas reales.
- **Habilidades**: ajusta los porcentajes de las barras de nivel en `index.html` a tu propia autoevaluación.
- **4ª tarjeta de proyectos**: actualmente repite el contenido de "Dr. Julio Estrada" como marcador de posición — reemplázala con los datos del proyecto real.

## 📁 Secciones del sitio

| Sección      | Descripción                                              |
|--------------|-----------------------------------------------------------|
| Inicio       | Presentación, terminal animada y llamado a la acción       |
| Sobre mí     | Experiencia, formación y enfoque profesional               |
| Proyectos    | Galería estilo bento con capturas reales de cada sitio      |
| Habilidades  | Bloques descriptivos, barras de nivel y Tech Stack           |
| Calculadora  | Estimado de inversión + envío del resumen por WhatsApp       |
| Contacto     | Formulario (Formspree) y enlaces a redes/WhatsApp/correo     |

## 📬 Contacto

- **Correo:** fabiodevch@gmail.com
- **LinkedIn:** [tu perfil](#)
- **GitHub:** [tu perfil](#)

## 📄 Licencia

Este proyecto es de uso personal. Si deseas reutilizar partes del código, dame crédito 🙌

---

Hecho con 💻 y ☕ por Fabio
