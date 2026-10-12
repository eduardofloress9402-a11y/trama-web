# Trama · web

Sitio de Trama (trama-dev.netlify.app). Es estático: `index.html` se publica tal cual en Netlify.

- `index.html`: la página (estilos, animaciones de scroll y formulario de presupuesto con Netlify Forms).
- `sw.js`, `service-worker.js`, `firebase-messaging-sw.js`: limpian un service worker de otra app que se publicó por error en este dominio. Se pueden borrar más adelante.

Se publica sola: Netlify (sitio trama-dev) está conectado a la rama `main` de este repositorio.

