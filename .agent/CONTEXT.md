# Contexto del Proyecto: Costos Pro

Aplicación móvil (PWA) para gestión de costos, diseñada para funcionar de forma independiente en iOS.

## Estructura
- `index.html`: Estructura de la aplicación.
- `style.css`: Diseño premium (Glassmorphism, Modo Oscuro).
- `app.js`: Lógica de negocio y persistencia local (LocalStorage).
- `manifest.json`: Configuración PWA para instalación en iOS/Android.

## Decisiones Técnicas
- **Mobile First:** El diseño está optimizado para pantallas táctiles.
- **Sin Servidor:** Los datos se guardan en el dispositivo del usuario.
- **Portabilidad:** Se mantiene la carpeta `.agent` para sincronización entre PCs.
