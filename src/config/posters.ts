import type { ImageMetadata } from 'astro';

/**
 * Capturas de los proyectos, por slug: `src/assets/posters/<slug>.png`.
 * Si falta una, el build falla aquí con el nombre en vez de pintar un hueco.
 */
const archivos = import.meta.glob<{ default: ImageMetadata }>('../assets/posters/*.png', { eager: true });

export const poster = (slug: string): ImageMetadata => {
  const archivo = archivos[`../assets/posters/${slug}.png`];
  if (!archivo) throw new Error(`Falta la captura src/assets/posters/${slug}.png`);
  return archivo.default;
};

/**
 * Foto opcional de Sergio para «Sobre mí». Basta con dejar un archivo
 * `src/assets/sergio.jpg` (o .png/.webp) y aparece sola; sin archivo, la
 * sección se maqueta sin foto y no queda ningún hueco.
 */
const fotos = import.meta.glob<{ default: ImageMetadata }>('../assets/sergio.{jpg,jpeg,png,webp}', { eager: true });
export const fotoSergio: ImageMetadata | undefined = Object.values(fotos)[0]?.default;
