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
            if (!referenciaValida(token)) {
                tokensResueltos.push("#REF!");
            } else if (!datosCeldas[token]) {
                tokensResueltos.push("#REF!");
            } else {
                let valorReferencia = datosCeldas[token].valor;
                tokensResueltos.push(valorReferencia);
            }
        }
    }

    return tokensResueltos;
}

function evaluarExpresion(tokensResueltos) {
        let expresion = [...tokensResueltos];

        if (expresion.includes("#REF!")){
            return "#REF!";
            
        }

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

function referenciaValida(nombreCelda) {

    let letra = nombreCelda[0];
    let fila = Number(nombreCelda.substring(1));

    let columnaExiste = letras.includes(letra);

    let filaExiste =
        fila >= 1 &&
        fila <= cantidadFilas;

    return columnaExiste && filaExiste;
}



function procesarFormula(contenido, celda) {

    if (contenido.startsWith("=")) { //aquí diferenciamos entre formula del demas contenido 
                    
     console.log("Es una fórmula");

    let formula = contenido.substring(1);


    if (formula.startsWith("SUMA(")) {
        console.log("Se detectó una función SUMA");

        let inicio=formula.indexOf ("(");
        let fin = formula.lastIndexOf(")");

        let contenidoSuma = formula.substring(inicio +1, fin);

        if (contenidoSuma.trim() === "") {
            datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
            celda.textContent = "#ERROR!";
            return;
        }
        let argumentos = contenidoSuma.split (",");

        if (contenidoSuma.includes(":")){

            let partesRango = contenidoSuma.split(":");

            let inicioRango = partesRango[0];
            let finRango = partesRango[1];

            let letraInicio=inicioRango[0];
            let filaInicio = Number(inicioRango.substring(1));

            let letraFin=finRango[0];
            let filaFin=Number(finRango.substring(1));

            let argumentosRango = [];

            for (let fila = filaInicio; fila <= filaFin; fila ++){
                argumentosRango.push(letraInicio + fila);

                console.log("Celdas del rango:", argumentosRango);
            }      

            argumentos = argumentosRango;
        
        }


        for (let i = 0; i < argumentos.length; i++) {

            let referencia = argumentos[i];

            if (!dependencias[referencia]) {
                dependencias[referencia] = [];
            }

            if (!dependencias[referencia].includes(celda.dataset.nombre)) {
                dependencias[referencia].push(celda.dataset.nombre);
            }
        }

            let resultadoSuma = 0;

            for (let i = 0; i < argumentos.length; i++) {

                let nombreCelda = argumentos[i];

                if (!referenciaValida(nombreCelda)) {
                    datosCeldas[celda.dataset.nombre].valor = "#REF!";
                    celda.textContent = "#REF!";
                    return;
                }

                if (datosCeldas[nombreCelda]) {

                    let valor = Number(datosCeldas[nombreCelda].valor);

                    if (isNaN(valor)) {
                        datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
                        celda.textContent = "#ERROR!";
                        return;
                    }

                    resultadoSuma = resultadoSuma + valor;
                }
            }    

        datosCeldas[celda.dataset.nombre].valor=resultadoSuma;

        celda.textContent=resultadoSuma;

        aplicarFormatoCelda(celda, celda.textContent);

        return;

    }

    if (formula.startsWith("PROMEDIO(")){

        console.log ("Se detectó una función PROMEDIO");

        let inicio = formula.indexOf("(");
        let fin = formula.lastIndexOf(")");

        let contenidoPromedio = formula.substring(inicio +1, fin);

        if (contenidoPromedio.trim() === "") {
            datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
            celda.textContent = "#ERROR!";
            return;
        }

        let argumentos = contenidoPromedio.split(",");


        if (contenidoPromedio.includes(":")) {

            let partesRango = contenidoPromedio.split(":");

            let inicioRango =partesRango[0];
            let finRango = partesRango [1];

            let letraInicio = inicioRango [0];
            let filaInicio =Number(inicioRango.substring(1));

            let filaFin = Number(finRango.substring(1));

            let argumentosRango=[];

            for (let fila = filaInicio; fila <= filaFin; fila++){
                argumentosRango.push(letraInicio + fila);

            }

            argumentos = argumentosRango;
        }    



        for (let i =0; i < argumentos.length; i++){

            let referencia = argumentos [i];

            if (!dependencias[referencia]){
                dependencias[referencia]=[];

            }
            if (!dependencias[referencia].includes(celda.dataset.nombre)){
                dependencias[referencia].push(celda.dataset.nombre);

            }
        }

        let sumaPromedio = 0;

        let cantidadValores = 0;

        for ( let i =0; i < argumentos.length; i++){

            let nombreCelda = argumentos[i];

            if (!referenciaValida(nombreCelda)) {
                datosCeldas[celda.dataset.nombre].valor = "#REF!";
                celda.textContent = "#REF!";
                return;
            }

            if (datosCeldas[nombreCelda]) {

                let valor = Number(datosCeldas[nombreCelda].valor);

                if (isNaN(valor)) {
                    datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
                    celda.textContent = "#ERROR!";
                    return;
                }

                sumaPromedio = sumaPromedio + valor;
                cantidadValores++;
            }
        }  


        if (cantidadValores === 0) {
            datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
            celda.textContent = "#ERROR!";
            return;
        }

        let resultadoPromedio =
            sumaPromedio / cantidadValores;
 
         datosCeldas[celda.dataset.nombre].valor = resultadoPromedio;

         celda.textContent=resultadoPromedio;

         aplicarFormatoCelda(celda, celda.textContent);

                
         return;

    }


    if (formula.startsWith("MAX(")){

        let inicio = formula.indexOf("(");
        let fin = formula.lastIndexOf(")");

        let contenidoMax = formula.substring(inicio +1, fin );

        if (contenidoMax.trim() === "") {
            datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
            celda.textContent = "#ERROR!";
            return;
        }

        let argumentos = contenidoMax.split(",");

        if (contenidoMax.includes(":")){

            let partesRango = contenidoMax.split(":");

            let inicioRango = partesRango[0];
            let finRango= partesRango[1];

            let letraInicio = inicioRango[0];
            let filaInicio = Number(inicioRango.substring(1));

            let filaFin = Number(finRango.substring(1));

            let argumentosRango= [];

            for (let fila= filaInicio; fila <= filaFin; fila ++) {
                argumentosRango.push(letraInicio + fila );

            }

            argumentos = argumentosRango;

        }

        for (let i = 0; i< argumentos.length; i++){

            let referencia = argumentos [i];

            if (!dependencias[referencia]) {
                dependencias [referencia] = [];

            }

            if (!dependencias[referencia].includes (celda.dataset.nombre)){
                dependencias[referencia].push(celda.dataset.nombre);

            }
        }

        let valores = [];

        for (let i = 0; i < argumentos.length; i++){

            let nombreCelda = argumentos[i];

            if (!referenciaValida(nombreCelda)) {
                datosCeldas[celda.dataset.nombre].valor = "#REF!";
                celda.textContent = "#REF!";
                return;
            }

            if (datosCeldas[nombreCelda]){
            let valor = Number(datosCeldas[nombreCelda].valor);

            if (isNaN(valor)) {
                datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
                celda.textContent = "#ERROR!";
                return;
            }

            valores.push(valor);
            }
        }

        if (valores.length === 0) {
            datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
            celda.textContent = "#ERROR!";
            return;
        }

        let resultadoMax = Math.max(...valores);

        datosCeldas[celda.dataset.nombre].valor = resultadoMax;

        celda.textContent= resultadoMax;

        aplicarFormatoCelda(celda, celda.textContent);
        
        return;
    
    }


    if (formula.startsWith("MIN(")){

        let inicio = formula.indexOf("(");
        let fin= formula.lastIndexOf(")");

        let contenidoMin = formula.substring(inicio +1, fin );

        if (contenidoMin.trim() === "") {
            datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
            celda.textContent = "#ERROR!";
            return;
        }

        let argumentos = contenidoMin.split(",");

        if (contenidoMin.includes(":")) {

            let partesRango = contenidoMin.split(":");

            let inicioRango = partesRango[0];
            let finRango = partesRango[1];

            let letraInicio = inicioRango[0];
            let filaInicio = Number(inicioRango.substring(1));

            let filaFin = Number(finRango.substring(1));

            let argumentosRango = [];

            for (let fila = filaInicio; fila <= filaFin; fila++) {
                argumentosRango.push(letraInicio + fila);
            }

            argumentos = argumentosRango;
        }

        for (let i = 0; i < argumentos.length; i++) {

            let referencia = argumentos[i];

            if (!dependencias[referencia]) {
                dependencias[referencia] = [];
            }

            if (!dependencias[referencia].includes(celda.dataset.nombre)) {
                dependencias[referencia].push(celda.dataset.nombre);
            }
        }


        let valores = [];

        for (let i=0; i < argumentos.length; i++){

            let nombreCelda= argumentos[i];

            if (!referenciaValida(nombreCelda)) {
                datosCeldas[celda.dataset.nombre].valor = "#REF!";
                celda.textContent = "#REF!";
                return;
            }

            if (datosCeldas[nombreCelda]){
            let valor = Number(datosCeldas[nombreCelda].valor);

            if (isNaN(valor)) {
                datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
                celda.textContent = "#ERROR!";
                return;
            }

            valores.push(valor);
            }
        }

        if (valores.length === 0) {
            datosCeldas[celda.dataset.nombre].valor = "#ERROR!";
            celda.textContent = "#ERROR!";
            return;
        }

        let resultadoMin = Math.min(...valores);

        datosCeldas[celda.dataset.nombre].valor = resultadoMin;

        celda.textContent= resultadoMin;

        aplicarFormatoCelda(celda, celda.textContent);

        return;

    }






    
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

    let resultadoFinal = evaluarExpresion(tokensResueltos);

    if (resultadoFinal === "#DIV/0!") {

    datosCeldas[celda.dataset.nombre].valor = resultadoFinal;
    celda.textContent = resultadoFinal;

    aplicarFormatoCelda(celda, resultadoFinal);

    return;
    }   


    console.log("Resultado final:", resultadoFinal);
    aplicarFormatoCelda(celda, resultadoFinal);

    console.log("Clase después del formato:", celda.className);

    datosCeldas[celda.dataset.nombre].valor = resultadoFinal;
    celda.textContent = resultadoFinal;

    } else if (!isNaN(contenido) && contenido.trim() !== "") {
                       
        console.log("Es un número");


    } else {
        console.log("Es un texto");
        
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
