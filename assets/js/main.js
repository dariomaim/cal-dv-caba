var jsonObj = {A:"14",B:"01",C:"00",D:"16",E:"05",F:"20",G:"19",H:"09",I:"24",J:"07",K:"21",L:"08",M:"04",N:"13",O:"25",P:"22",Q:"18",R:"10",S:"02",T:"06",U:"12",V:"23",W:"11",X:"03",Y:"15",Z:"17"};

// Add event listeners
function onBodyLoad() {
    const elementPadron = document.getElementById("actualizarPadron");
    const elementDominio = document.getElementById("idDominio");
    elementPadron.addEventListener("click", getDatosCaba, false);
    elementDominio.addEventListener("click", idDominio, false);
}

function getDatosCaba() {
    "use strict"
    var requestUrl = "https://jsonblob.com/api/jsonBlob/9652473f-89c0-11e7-8b46-bb8c59b72b48";
    var request = new XMLHttpRequest();
    if (!request) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    request.onreadystatechange = cargarContenido;
    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.send();

    function cargarContenido() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                //request.onload = function() {
                jsonObj = request.response;
                console.log("El padrón se actualizó correctamente");
                //}
            } else {
                console.log("No se pudo actualizar el JSON, se usan los datos de cache.");
            }

        }
    }
}

function idDominio() {
    "use strict";
    var idDominio;
    idDominio = (document.getElementById("dominio").value).toUpperCase();
    validarDominio(idDominio);
    var dominioNumero = buscarCadena(idDominio);
    var arrayDominio = calcularDv(dominioNumero);
    var resultado = sumarDigitos(arrayDominio[0]) + "" + sumarDigitos(arrayDominio[1]);
    document.getElementById("resultado").value = resultado;
}

/*
Para tomar el número de patente/dominio y matchearlo con el código de número/letras que hace los calculos
*/
function buscarCadena(idDominio){
    "use strict";
    var letraNumero = jsonObj;
    var dominioNumero = [];
    for (let [key, valor] of Object.entries(idDominio)) {
        if (letraNumero[valor] !== undefined) {
            dominioNumero = dominioNumero + letraNumero[valor];
        } else
            dominioNumero = dominioNumero + idDominio[key];
    }
    return dominioNumero;
}


/*
 Se necesita para separar los números y sumarlos intercaladamente.
 Ej: 01234567 -> Suma de Pares 0 + 2 + 4 + 6; Suma de Impares 1 + 3 + 5 + 7
*/
function calcularDv(dominioNumero) {
    "use strict";
    var par = 0;
    var impar = 0;
    for (var i = 0; i < 11; i++) {
        if (i % 2 === 0) {
            par += Number(dominioNumero.slice(i, i + 1));
        } else {
            impar += Number(dominioNumero.slice(i, i + 1));
        }
    }
    return ([par, impar]);
}

/*
Función que se llama a si misma hasta que el argument es menor 10 (o sea, de un sólo dígito)
*/
function sumarDigitos(valor) {
    "use strict";
    var sum = 0;
    if (valor < 10) {
        sum = valor;
    }
    if (valor > 10) {
        var str = valor.toString();
        for (var i = 0; i < str.length; i++) {
            sum += parseInt(str.charAt(i), 10);
        }
    }
    /*
    Si el valor enviado es 10, o si la suma de los digitos es 10, devuelve 1, si es mayor a 10, vuelve a llamarse,
    Si es menor a 10, devuelve a suma de los dígitos.
    */
    return (valor === 10 || sum === 10) ? 1 :  (sum > 10) ? sumarDigitos(sum) : sum;
}

function validarDominio(idDominio){
    "use strict";
    var regExDominio2016 = /^[A-Z]{3}\d{3}$/;
    var regExDominio2017 = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
    if (!regExDominio2016.test(idDominio) && !regExDominio2017.test(idDominio)) {
        console.log("La patente ingresada es incorrecta");
    }
}


function HttpRequest(url, callback) {
    this.request = new XMLHttpRequest();
    this.request.open("GET", url);

    var tempRequest = this.request;

    function reqReadyStateChange(){
        if (tempRequest.readyState === 4 && tempRequest.status === 200) {
                callback(tempRequest.responseText);
        } else {
            console.log("Error en request.");
        }
    }
    this.request.onreadystatechange = reqReadyStateChange;

}

HttpRequest.prototype.send = function() {
    this.request.send(null);
}

function handleData(text){
    console.log(text);
}

var rUrl = "https://jsonblob.com/api/jsonBlob/9652473f-89c0-11e7-8b46-bb8c59b72b48";
var request = new HttpRequest(rUrl, handleData);
request.send();