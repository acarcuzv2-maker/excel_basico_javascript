let cantidadFilas = 15
let cantidadColumnas = 10
let datosCeldas ={};
let dependencias ={};
let letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function guardarDatos (){
    localStorage.setItem(
        "hojaClaraDatos",
        JSON.stringify(datosCeldas)

    );
}

function cargarDatos() {

    let datosGuardados = localStorage.getItem("hojaClaraDatos");

    console.log("Datos guardados encontrados:", datosGuardados);

    if (datosGuardados) {
        datosCeldas = JSON.parse(datosGuardados);
        console.log("datosCeldas recuperado:", datosCeldas);


    }
}