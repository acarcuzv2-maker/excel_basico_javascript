let hoja =document.getElementById("hoja");

let cantidadFilas = 15
let cantidadColumnas = 10
let datosCeldas ={};

function procesarFormula(contenido, celda) {

                if (contenido.startsWith("=")) { //aquí diferenciamos entre formula del demas contenido 
                    
                    console.log("Es una fórmula");

                    let formula = contenido.substring (1);

                    let tokens =[];

                    let tokenActual ="";

                    for (let i = 0; i < formula.length; i++) {
                        
                        let caracter = formula[i];

                        if (
                            (caracter >= "0" && caracter <= "9") ||
                            (caracter >= "A" && caracter <= "Z")

                        ) {
                            tokenActual = tokenActual + caracter;

                            } else {

                                if (tokenActual !== "") {

                                    tokens.push (tokenActual);
                                   
                                    tokenActual= "";
                 
                                }

                                tokens.push(caracter);

                            }
                    }

                    if (tokenActual !== ""){

                        tokens.push(tokenActual);

                    }

                    console.log(tokens);

                    let tokensResueltos= [];

                    for (let i= 0; i < tokens.length; i++){
                        let token = tokens [i];

                        console.log(token);

                        if (!isNaN(token)){

                            console.log(token + " es un número ");

                            tokensResueltos.push(token);
                            
                        }

                        else if (
                            token === "+" ||
                            token === "-" ||
                            token === "*" ||
                            token === "/" 
                        ) {
                            console.log (token + " es un operador");

                            tokensResueltos.push(token);

                        }
                        else {
                            console.log(token + " es una referencia");

                            if (datosCeldas[token])  {

                                let valorReferencia = datosCeldas[token].contenido;

                                console.log(

                                    "El valor de " + token + " es " + valorReferencia
                                    
                                );

                                tokensResueltos.push(valorReferencia);

                            } else{

                                console.log(token + " está vacía");

                                tokensResueltos.push("0");

                            }

                        }

                        }

                        console.log("Tokens resueltos:", tokensResueltos);

                        let numero1 = Number(tokensResueltos[0]);

                        let operador = tokensResueltos[1];

                        let numero2 = Number(tokensResueltos[2]);

                        let resultado;

                        if (operador === "+") {

                        resultado = numero1 + numero2;

                        } else if (operador === "-") {

                            resultado = numero1 - numero2;

                        } else if (operador === "*") {

                            resultado = numero1 * numero2;

                        } else if (operador === "/") {

                            resultado = numero1 / numero2;

                        }

                        console.log("Resultado final: " + resultado);

                        datosCeldas[celda.dataset.nombre].valor = resultado;

                        celda.textContent = resultado;


                        

                } else if (!isNaN(contenido) && contenido.trim() !== "") {
                       
                    console.log("Es un número");

                    } else {
                        console.log("Es un texto");
        
                }

}

let letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

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

                    console.log(datosCeldas);

                    return;

                }

                datosCeldas[celda.dataset.nombre] = {

                        contenido: contenido,

                        valor: contenido
                    };
                
            });        

            celda.addEventListener("blur", function() {

                let contenido = celda.textContent;

                if (contenido.startsWith("=")) {
                    procesarFormula(contenido, celda);
                }

            });

        hoja.appendChild(celda);
        }
        }
        
