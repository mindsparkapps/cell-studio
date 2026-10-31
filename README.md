# Arquitectura Celular (Cell Studio)

Explorador 3D de células en español: célula vegetal, animal, glóbulo blanco, neurona y ADN.
Modelos con Three.js 0.169.0; créditos en `CREDITS.md`.

## Uso local

```
npm install
npm run assets   # respaldo verificado de modelos y Draco (opcional: la app usa las URLs públicas)
npm run dev      # http://127.0.0.1:4173/
```

En Windows, `abrir-cell-studio.vbs` arranca el servidor oculto y abre la app.

## Plugin de ZenBan

1. Activa GitHub Pages del repo (rama `main`, carpeta raíz).
2. En ZenBan: ⚙️ Configuración › Plugins › pega `https://mindsparkapps.github.io/cell-studio/` › Agregar.

- `zenban-plugin.json`: nombre, ícono y tamaño del plugin.
- `zenban-plugin-sdk.js`: copia del SDK de ZenBan.
- El plugin guarda en el objeto la célula y la pestaña elegidas; el botón de pantalla completa maximiza la ventana del plugin.
- Fuera de ZenBan la app funciona igual.
