let hoja =document.getElementById("hoja");
let botonExportar = document.getElementById("exportarCsv");
let botonLimpiar = document.getElementById("limpiarHoja");
let celdaActual= document.getElementById("celdaActual");
let contenidoActual = document.getElementById("contenidoActual");
let esquina = document.createElement("div");
esquina.className = "encabezado";
hoja.appendChild(esquina);


for(let columna =0; columna< cantidadColumnas; columna++){

    let encabezado =document.createElement("div")

    encabezado.className="encabezado";

    encabezado.textContent=letras[columna];

    hoja.appendChild(encabezado);
}


for (let fila= 1; fila<= cantidadFilas; fila++){

let encabezadoFila =document.createElement("div");

encabezadoFila.className="encabezado";

encabezadoFila.textContent=fila;

hoja.appendChild(encabezadoFila);

    
for (let columna= 1; columna<= cantidadColumnas; columna++){

    let celda= document.createElement("div");

        celda.className= "celda";

        celda.contentEditable = true;

        let nombreCelda = letras [columna -1] + fila;

        celda.dataset.nombre = nombreCelda;

        celda.addEventListener("click", function() {

            let anterior = document.querySelector(" .celda-seleccionada");
            
            if (anterior) {
            
                anterior.classList.remove("celda-seleccionada");

            }

            celda.classList.add("celda-seleccionada");
            
            let nombre= celda.dataset.nombre;

            celdaActual.textContent="Celda: " + nombre;

            if (datosCeldas[nombre]) {
                contenidoActual.textContent=
                "Contenido: " + datosCeldas[nombre].contenido;

            } else {
                contenidoActual.textContent="Contenido: ";
            }

            console.log("Seleccionaste " + nombre);

            if (datosCeldas [nombre]) {
                console.log("Contenido: " + datosCeldas[nombre].contenido);

            } else { 
                console.log("La celda está vacía");
            }

        });

            celda.addEventListener("input", function(){

                let contenido = celda.textContent

                if (contenido.trim() === ""){
                    delete datosCeldas[celda.dataset.nombre];

                    celda.classList.remove("valor-negativo");

                    console.log(datosCeldas);
                    return;

                }

                datosCeldas[celda.dataset.nombre] = {

                        contenido: contenido,

                        valor: contenido
                    };

                aplicarFormatoCelda(celda, contenido);

            });        


            celda.addEventListener("blur", function() {

                let contenido = celda.textContent;

                limpiarDependencias(celda.dataset.nombre);

                if (contenido.startsWith("=")) {
                    procesarFormula(contenido, celda);
                }

                console.log(
                    "voy a recalcular:",
                    celda.dataset.nombre,
                    dependencias[celda.dataset.nombre]
                );

                recalcularDependientes(celda.dataset.nombre);

                guardarDatos();

            });

        hoja.appendChild(celda);
        }
}




cargarDatos();

console.log("Después de cargarDatos:", datosCeldas);


console.log(dependencias);

for (let nombreCelda in datosCeldas) {

    let celda = document.querySelector(
        '[data-nombre="' + nombreCelda + '"]'
    );

    console.log("Buscando:", nombreCelda, celda);

    if (celda) {
        celda.textContent = datosCeldas[nombreCelda].valor;
        aplicarFormatoCelda(celda, datosCeldas[nombreCelda].valor);

    }
}

for (let nombreCelda in datosCeldas) {

    let contenido = datosCeldas[nombreCelda].contenido;

    if (contenido && contenido.startsWith("=")) {

        let celda = document.querySelector(
            '[data-nombre="' + nombreCelda + '"]'
        );

        procesarFormula(contenido, celda);
    }
}

function aplicarFormatoCelda (celda, valor) {
    
    if (Number(valor) <0 ) {
        celda.classList.add("valor-negativo");

    }else {
        celda.classList.remove("valor-negativo");
    }
}


botonExportar.addEventListener("click", function(){

    let contenidoCsv= "";

    for (let fila = 1; fila <= cantidadFilas; fila ++) {
        
        let datosFila=[];

        for (let columna = 0; columna < cantidadColumnas; columna++) {
            
            let nombreCelda= letras[columna] + fila; 

            let valorCelda = "";

            if (datosCeldas[nombreCelda]) {
                valorCelda = datosCeldas[nombreCelda].valor;
            
            }

            datosFila.push(valorCelda);

        }

        contenidoCsv=contenidoCsv + datosFila.join(",") + "\n";

    }

    console.log(contenidoCsv);

    let archivo = new Blob( 
        [contenidoCsv],
        { type : "text/csv"}


    );

    let enlace = document. createElement("a");

    enlace.href = URL.createObjectURL(archivo);

    enlace.download = "HojaClara.csv";

    enlace.click();

});

botonLimpiar.addEventListener("click", function() {

    datosCeldas={};
    dependencias = {};

    localStorage.removeItem("hojaClaraDatos");

    let celdas = document.querySelectorAll(".celda");

    for (let i = 0; i < celdas.length; i++) {
        celdas [i].textContent="";

    }

    celdaActual.textContent="Celda: -";
    contenidoActual.textContent="Contenido: -";
});

