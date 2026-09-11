let hoja =document.getElementById("hoja");
let cantidadFilas = 15
let cantidadColumnas = 10
let datosCeldas ={};
let dependencias ={};
let letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let esquina = document.createElement("div");
esquina.className = "encabezado";
hoja.appendChild(esquina);




function crearTokens(formula) {

    let tokens = [];
    let tokenActual = "";

    for (let i = 0; i < formula.length; i++) {

        let caracter = formula[i];

        if (
            (caracter >= "0" && caracter <= "9") ||
            (caracter >= "A" && caracter <= "Z")
        ) {
            tokenActual = tokenActual + caracter;
        } else {

            if (tokenActual !== "") {
                tokens.push(tokenActual);
                tokenActual = "";
            }

            tokens.push(caracter);
        }
    }

    if (tokenActual !== "") {
        tokens.push(tokenActual);
    }

    return tokens;
}


function obtenerReferencias(formula) {

    let tokens = crearTokens(formula);
    let referencias = [];

    for (let i = 0; i < tokens.length; i++) {

        let token = tokens[i];

        if (
            isNaN(token) &&
            token !== "+" &&
            token !== "-" &&
            token !== "*" &&
            token !== "/" &&
            token !== "(" &&
            token !== ")"
        ) {
            referencias.push(token);
        }
    }

    return referencias;
}


function resolverTokens(tokens) {

    let tokensResueltos = [];

    for (let i = 0; i < tokens.length; i++) {

        let token = tokens[i];

        if (!isNaN(token)) {

            tokensResueltos.push(token);

        } else if (
            token === "+" ||
            token === "-" ||
            token === "*" ||
            token === "/"
        ) {

            tokensResueltos.push(token);

        } else {

            if (datosCeldas[token]) {

                let valorReferencia = datosCeldas[token].valor;

                tokensResueltos.push(valorReferencia);

            } else {

                tokensResueltos.push("0");

            }
        }
    }

    return tokensResueltos;
}


function registrarDependencias(nombreCelda, formula){

    let referencias = obtenerReferencias(formula);

    for (let i = 0; i < referencias.length; i++) {

        let referencia = referencias[i];

        if (!dependencias[referencia]) {
            dependencias[referencia] = [];
        }

        if (!dependencias[referencia].includes(nombreCelda)) {
            dependencias[referencia].push(nombreCelda);
        }

    }
}


function recalcularDependientes(nombreCelda,visitadas= []){

    if (visitadas.includes(nombreCelda)){
        console.log("Referencia circular detectada en: ", nombreCelda);
        
        let celdaCircular = document.querySelector(
            '[data-nombre="' + nombreCelda +'"]'
        );

        if (celdaCircular){
            celdaCircular.textContent="#CIRCULAR!"
        }

        if(datosCeldas[nombreCelda]){
            datosCeldas[nombreCelda].valor = "#CIRCULAR!";

        }

        return;

    }

    visitadas.push(nombreCelda);

    if (!dependencias[nombreCelda]) {

        return;

    }

    for (let i = 0; i < dependencias[nombreCelda].length; i++){

        let nombreDependiente = dependencias[nombreCelda][i];

        let celdaDependiente = document.querySelector(
          
            '[data-nombre="' + nombreDependiente + '"]'
       
        );

        let formulaDependiente = 
        datosCeldas[nombreDependiente].contenido;

        procesarFormula(formulaDependiente, celdaDependiente);

        recalcularDependientes(nombreDependiente, [...visitadas]);

        console.log("Recalculada:", nombreDependiente);

    }

}


function limpiarDependencias (nombreCelda){

    for (let referencia in dependencias){

        dependencias[referencia] =
        dependencias[referencia].filter(function(celda) {
            return celda!== nombreCelda;

        });

        if (dependencias[referencia].length ===0) {
            delete dependencias[referencia];
        }

    }
}



function procesarFormula(contenido, celda) {

    if (contenido.startsWith("=")) { //aquí diferenciamos entre formula del demas contenido 
                    
     console.log("Es una fórmula");

    let formula = contenido.substring(1);

    registrarDependencias(celda.dataset.nombre,formula);

    console.log("Dependencias:", dependencias);

    let cantidadAbiertos = 0;
    let cantidadCerrados = 0;
    let balance =0;

    for (let i = 0; i < formula.length; i++) {

        if (formula[i] === "(") {
            cantidadAbiertos++;
            balance++;
        }

        if (formula[i] === ")") {
            cantidadCerrados++;
            balance--;

            if (balance <0){

                datosCeldas[celda.dataset.nombre].valor = "ERROR!";
                celda.textContent="ERROR!";
                return;

            }

        }
    }

    if (cantidadAbiertos !== cantidadCerrados) {

    datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
    celda.textContent = "#ERROR!";

    return;
    }

    while (formula.includes("(")) {

    let inicio = formula.lastIndexOf("(");
    let fin = formula.indexOf(")", inicio);

    let contenidoParentesis = formula.substring(inicio + 1, fin);

    console.log("Contenido del paréntesis:", contenidoParentesis);

    let tokensParentesis = crearTokens(contenidoParentesis);

    let tokensParentesisResueltos = resolverTokens(tokensParentesis);

    let resultadoParentesis = evaluarExpresion(tokensParentesisResueltos);

        formula =
            formula.substring(0, inicio) +
             resultadoParentesis +
            formula.substring(fin + 1);

            console.log("Fórmula después de resolver paréntesis:", formula);
                
    }

    let tokens = crearTokens(formula);

    console.log(tokens);

    let tokensResueltos=resolverTokens(tokens);

    console.log("Tokens resueltos:", tokensResueltos);

    function evaluarExpresion(tokensResueltos) {
        let expresion = [...tokensResueltos];

        if (expresion.length === 0 || expresion.length % 2 === 0) {
            return "#ERROR!";
        }

        for (let i = 0; i < expresion.length; i++) {

    if (i % 2 === 0) {

        if (isNaN(Number(expresion[i]))) {
            return "#ERROR!";
        }

        } else {

            if (
                expresion[i] !== "+" &&
                expresion[i] !== "-" &&
                expresion[i] !== "*" &&
                expresion[i] !== "/"
            ) {
                return "#ERROR!";
            }
          }
        }

        for (let i = 0; i < expresion.length; i++) {

            if (expresion[i] === "*" || expresion[i] === "/") {

                let izquierda = Number(expresion[i - 1]);
                let operador = expresion[i];
                let derecha = Number(expresion[i + 1]);

                let resultadoPrioritario;

                   if (operador === "*") {

                     resultadoPrioritario = izquierda * derecha;

                   }else {

                        if(derecha===0){
                            return "#DIV/0!";

                        }
                        
                        resultadoPrioritario=izquierda/derecha;
                    
                    }

                    expresion.splice(i - 1, 3, resultadoPrioritario);

                    i = i - 2;
            }
        }

        for (let i = 0; i < expresion.length; i++) {

            if (expresion[i] === "+" || expresion[i] === "-") {

             let izquierda = Number(expresion[i - 1]);
             let operador = expresion[i];
             let derecha = Number(expresion[i + 1]);

             let resultadoSecundario;

                if (operador === "+") {
                      resultadoSecundario = izquierda + derecha;
                   } else {
                      resultadoSecundario = izquierda - derecha;
                }

                expresion.splice(i - 1, 3, resultadoSecundario);

                i = i - 2;
            }
        }

        return expresion[0];
    }

    let resultadoFinal = evaluarExpresion(tokensResueltos);

    if (resultadoFinal === "#DIV/0!") {

    datosCeldas[celda.dataset.nombre].valor = resultadoFinal;
    celda.textContent = resultadoFinal;

    return;
    }   


    console.log("Resultado final:", resultadoFinal);

    datosCeldas[celda.dataset.nombre].valor = resultadoFinal;
    celda.textContent = resultadoFinal;

    } else if (!isNaN(contenido) && contenido.trim() !== "") {
                       
        console.log("Es un número");


    } else {
        console.log("Es un texto");
        
    }

}




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

            });

        hoja.appendChild(celda);
        }
}

