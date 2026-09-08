let hoja =document.getElementById("hoja");

let cantidadFilas = 15
let cantidadColumnas = 10
let datosCeldas ={};

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

            console.log("Seleccionaste " + nombre);

            if (datosCeldas [nombre]) {
                console.log("Contenido: " + datosCeldas[nombre].contenido);

            } else { 
                console.log("La celda está vacía");

            };

            celda.addEventListener("input", function(){

                let contenido = celda.textContent

                if (contenido.trim() === ""){
                    delete datosCeldas[celda.dataset.nombre];

                    console.log(datosCeldas);
                    return;
                    
                }

                datosCeldas[celda.dataset.nombre] = {

                        contenido: contenido
                    };

                if (contenido.startsWith("=")) { //aquí diferenciamos entre formula del demas contenido 
                    
                    console.log("Es una fórmula");
                    
                } else if (!isNaN(contenido) && contenido.trim() !== "") {
                       
                    console.log("Es un número");

                    } else {
                        console.log("Es un texto");
        
                }

            }); 
            
            

            celda.classList.add("celda-seleccionada");

            console.log("Seleccionaste " + celda.dataset.nombre);

            console.log(datosCeldas[celda.dataset.nombre]);

        });

        hoja.appendChild(celda);

}

}
