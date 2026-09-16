# HojaClara

Proyecto desarrollado como parte del curso de Algoritmos.

HojaClara es una hoja de cálculo básica desarrollada con HTML5, CSS3 y JavaScript puro. La aplicación funciona directamente en el navegador y no necesita instalación.

## Funcionalidades

- Cuadrícula editable de 15 filas y 10 columnas.
- Ingreso de números, texto y fórmulas.
- Operaciones de suma, resta, multiplicación y división.
- Prioridad de operadores y uso de paréntesis.
- Referencias entre celdas.
- Recálculo automático de celdas dependientes.
- Funciones SUMA, PROMEDIO, MAX y MIN.
- Manejo de errores en fórmulas y referencias.
- Detección de referencias circulares.
- Almacenamiento local de los datos.
- Exportación de la hoja a CSV.
- Resaltado de valores negativos.
- Barra de información de la celda seleccionada.
- Opción para limpiar la hoja.

## Cómo ejecutar HojaClara

1. Descargar el repositorio.
2. Descomprimir los archivos si se descargó como ZIP.
3. Abrir el archivo `index.html` con un navegador web.
4. HojaClara estará lista para utilizarse.

No es necesario instalar programas adicionales ni utilizar un servidor.

## Organización del código

- `index.html`: estructura principal de la aplicación.
- `style.css`: estilos visuales.
- `modelo.js`: estructuras de datos y almacenamiento.
- `formulas.js`: procesamiento de fórmulas, referencias, dependencias y recálculo.
- `interfaz.js`: creación de la cuadrícula e interacción con el usuario.

## Uso básico

Para realizar una fórmula se debe comenzar con el signo `=`.

Ejemplos:

`=A1+A2`

`=(A1+A2)*2`

`=SUMA(A1:A10)`

`=PROMEDIO(A1:A10)`

`=MAX(A1:A10)`

`=MIN(A1:A10)`

## Documentación técnica

La documentación técnica completa del proyecto se encuentra disponible en:

[Ver documentación técnica](Documentacion_HojaClara.pdf)

## Video de demostración

[Ver video de demostración](AQUI-PEGAS-TU-ENLACE)


## Autor

Anthony Carcuz