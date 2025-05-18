import { src, dest, watch, parallel } from "gulp";
import plumber from "gulp-plumber";
import cache from "gulp-cache";
import sass from "gulp-sass";

// Importación de 'sass' para compatibilidad con Gulp (necesitamos usar `require` con `sass`)
import * as sassModule from "sass";
const compileSass = sass(sassModule);

// Función para compilar SASS
function css() {
  return src("src/scss/**/*.scss") // Identificar el archivo de SASS
    .pipe(plumber()) // Manejar errores sin detener el proceso
    .pipe(compileSass()) // Compilar el archivo SASS
    .pipe(dest("build/css")); // Almacenar en la carpeta build/css
}

// Función para optimizar imágenes
async function imagenes() {
  const imagemin = (await import("gulp-imagemin")).default;
  const mozjpeg = (await import("gulp-imagemin")).mozjpeg;
  const optipng = (await import("gulp-imagemin")).optipng;

  return src("src/img/**/*.{png,jpg,jpeg}")
    .pipe(
      imagemin(
        [
          mozjpeg({ quality: 75, progressive: true }),
          optipng({ optimizationLevel: 3 }),
        ],
        { verbose: true } // Para ver detalles en la terminal
      )
    )
    .pipe(dest("build/img"));
}

// Función para convertir imágenes a WebP
async function versionWebp() {
  const webp = (await import("gulp-webp")).default;
  return src("src/img/**/*.{png,jpg,jpeg}")
    .pipe(webp({ quality: 50 })) // Configuración de calidad de las imágenes WebP
    .pipe(dest("build/img")); // Almacena las imágenes en "build/img"
}

// Función para observar cambios en archivos
function dev() {
  watch("src/scss/**/*.scss", css); // Observa los cambios en archivos .scss
  watch("src/img/**/*.{png,jpg,jpeg}", imagenes); // Observa las imágenes
}

// Exportar tareas
export { css, versionWebp, dev, imagenes };
export const build = parallel(imagenes, versionWebp, dev); // Tarea de build
