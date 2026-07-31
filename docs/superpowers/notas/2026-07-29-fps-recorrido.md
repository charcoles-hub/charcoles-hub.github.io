# FPS del recorrido 3D — 2026-07-29

Medición del criterio del spec §5 (FPS ≥ 50 durante el viaje).

- **Escritorio headless** (chromium, GPU software, 1440×900): **60 fps** de media en 8 muestras recorriendo el viaje entero.
- **Móvil emulado** (390×844, DPR 2, CPU throttling ×4): **60 fps** de media en 8 muestras.

Las dos lecturas están topadas por vsync (60), así que el margen real es mayor.
Pendiente para Sergio antes de publicar: una pasada en un móvil real (el
headless no mide GPU de verdad). Si alguna vez baja de 50, los recortes
previstos en el plan, en orden: `setPixelRatio` a 1.5 en `escena.js`, luego
`N_PARTICULAS` a 300.
