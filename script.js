let hoja =document.getElementById("hoja");

let cantidadFilas = 15
let cantidadColumnas = 10

let letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

let esquina = document.createElement("div");

esquina.classname = "encabezado";

hoja.appendChild(esquina);


for(let columna =0; columna< cantidadColumnas; columna++){

    let encabezado =document.createElement("div")

    encabezado.className="encabezado";

    encabezado.textContent=letras[columna];

    hoja.appendChild(encabezado);
}

for (let fila= 1; fila<= cantidadFilas; fila++){

let encabezadoFila =document.createElement("div");

encabezadoFila.classname="encabezado";

encabezadoFila.textContent=fila;

hoja.appendChild(encabezadoFila);

    for (let columna= 1; columna<= cantidadColumnas; columna++){

        let celda= document.createElement("div");

        celda.className= "celda";

hoja.appendChild(celda);

}

}




