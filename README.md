# Calculadora Clínica de Parámetros Renales - PWA

Este es el proyecto de la Calculadora Renal adaptada como Progressive Web App (PWA) para funcionar tanto en navegadores de escritorio como en dispositivos móviles iOS y Android, con soporte offline y experiencia similar a una app nativa.

---

## Características

- Cálculo clínico de parámetros renales con interfaz amigable
- Adaptabilidad (responsive) para diferentes tamaños de pantalla
- Progressive Web App con instalación y funcionamiento offline
- Iconos personalizados para pantalla de inicio 
- Uso de Service Worker para cacheo y velocidad de carga

---

## Archivos principales

- `index.html`: Archivo principal, estructura y contenido de la calculadora
- `styles.css`: Estilos CSS, diseño y estilos responsive
- `scripts.js`: JavaScript con lógica de la calculadora y registro de Service Worker
- `manifest.json`: Configuración de la PWA (iconos, nombre, colores)
- `service-worker.js`: Service Worker para cacheo y soporte offline
- `icon-192.png` y `icon-512.png`: Iconos para la app

---

## Cómo usar

### Despliegue local

Puedes probar localmente usando un servidor simple:

Puedes probar localmente usando un servidor simple:

python -m http.server 8000

text

Luego abre en navegador: `http://localhost:8000`

### Publicación

Para desplegar en producción:

- Sube todo el proyecto a GitHub y activa GitHub Pages (rama main, carpeta root)
- O utiliza servicios como Netlify o Vercel para hosting gratuito con HTTPS

### Instalación en móvil

1. Abre la URL en Safari (iOS) o Chrome (Android)
2. Usa la opción de añadir a pantalla de inicio
3. Abre la app como una aplicación nativa

---

## Desarrollo

- Modifica y amplía el código en `index.html`, `styles.css` y `scripts.js`
- Actualiza versión del cache en `service-worker.js` para forzar refresco

## Licencia

Proyecto libre para uso educativo y clínico. Sin garantía.

---

## Contacto

Para dudas o mejoras: snake1984@gmail.com
