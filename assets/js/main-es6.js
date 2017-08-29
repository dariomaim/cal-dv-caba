{
    // Event Listeners
    function onBodyLoad() {
        const IDPADRON = document.getElementById("actualizarPadron");
        const IDDOMINIO = document.getElementById("idDominio");
        IDPADRON.addEventListener("click", getDatosCaba, false);
        IDDOMINIO.addEventListener("click", procesarDominio, false);
        document.getElementById("fechaActualizacion").value =  getTodayDate(-(Math.floor(Math.random()*2)));
    }

    // Buscar fecha del dia
    getTodayDate = (fechaActualizacion = 1) => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + fechaActualizacion; //January is 0!

        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + '/' + mm + '/' + yyyy;
        return today;
    };

    {
        let jsonObj = {
            A: "14",
            B: "01",
            C: "00",
            D: "16",
            E: "05",
            F: "20",
            G: "19",
            H: "09",
            I: "24",
            J: "07",
            K: "21",
            L: "08",
            M: "04",
            N: "13",
            O: "25",
            P: "22",
            Q: "18",
            R: "10",
            S: "02",
            T: "06",
            U: "12",
            V: "23",
            W: "11",
            X: "03",
            Y: "15",
            Z: "17"
        };
        let updateDateJson = () => document.getElementById("fechaActualizacion").value =  getTodayDate();
        let getDominio = () => (document.getElementById("dominio").value).toUpperCase();
        let writeDominio = (resultado) => document.getElementById("resultado").value = resultado;
        {   /*
            Funcion reutilizable para hacer llamadas , queda como funcion y no como arrow
            porque es un constructor
             */

            function HttpRequest(url, callback) {
                this.request = new XMLHttpRequest();
                this.request.open("GET", url);

                let tempRequest = this.request;

                function reqReadyStateChange() {
                    if (tempRequest.readyState === 4 && tempRequest.status === 200) {
                        callback(tempRequest.response);
                        updateDateJson();

                    } else {
                        console.log("Error en request. Ready State: " + tempRequest.readyState);
                    }
                }

                this.request.onreadystatechange = reqReadyStateChange;
            }

            // No entiendo muy bien que hace esto
            HttpRequest.prototype.send = function () {
                this.request.send(null);
            };

            handleData = (data) => jsonObj = JSON.parse(data);

            getDatosCaba = () => {
                let rUrl = "https://jsonblob.com/api/jsonBlob/9652473f-89c0-11e7-8b46-bb8c59b72b48";
                let request = new HttpRequest(rUrl, handleData);
                request.send();
            };
        }
        procesarDominio = () => {
            "use strict";
            let idDominio = getDominio();
            validarDominio(idDominio);
            //let arrayDominio = calcularDv(buscarCadena(idDominio));
            let digitoPar = buscarParImpar(buscarCadena(idDominio), 0);
            let digitoImpar = buscarParImpar(buscarCadena(idDominio), 1);
            let resultado = `${sumarDigitos(digitoPar)}` + `${sumarDigitos(digitoImpar)}`;
            writeDominio(resultado);
        };

        /*
        Para tomar el número de patente/dominio y matchearlo con el código de número/letras que hace los calculos
        */
        let buscarCadena = (idDominio) => {
            "use strict";
            let letraNumero = jsonObj;
            let dominioNumero = [];
            for (let [key, valor] of Object.entries(idDominio)) {
                if (letraNumero[valor] !== undefined) {
                    dominioNumero = dominioNumero + letraNumero[valor];
                } else
                    dominioNumero = dominioNumero + idDominio[key];
            }
            return dominioNumero;
        };


        /*
         Esta función fue la primera que hice, después la reemplace con
         buscarParImpar.

         Se necesita para separar los números y sumarlos intercaladamente.
         Ej: 01234567 -> Suma de Pares 0 + 2 + 4 + 6; Suma de Impares 1 + 3 + 5 + 7

        let calcularDv = (dominioNumero) => {
            "use strict";
            let par = 0;
            let impar = 0;
            for (let i = 0; i < 11; i++) {
                if (i % 2 === 0) {
                    par += Number(dominioNumero.slice(i, i + 1));
                } else {
                    impar += Number(dominioNumero.slice(i, i + 1));
                }
            }
            return ([par, impar]);
        };
        */

        /* Para buscar par enviar el dominio y 0, para buscar impar enviar el dominio y
        un numero diferente de 0. Igual hay que revisarlo, porque 0 es false.
         */
        let buscarParImpar = (dominioNumero, par) => {
            let resultado = 0;
            let dominioLength = dominioNumero.length + 2;
            if (par === 0) {
                for (let i = 0; i < dominioLength; i++) {
                     if (i % 2 === 0) {
                        resultado += Number(dominioNumero.slice(i, i + 1));
                }
            }
            } else  {
                for (let i = 0; i < dominioLength; i++) {
                    if (i % 2 !== 0) {
                        resultado += Number(dominioNumero.slice(i, i + 1));
                    }
                }
            }
            return resultado;
        };

        /*
        Función que se llama a si misma hasta que el argument es menor 10 (o sea, de un sólo dígito)
        */
        let sumarDigitos = (valor, reductor = 10) => {
            let sum = 0;
            if (valor < reductor) {
                sum = valor;
            }
            if (valor > reductor) {
                let str = valor.toString();
                for (let i = 0; i < str.length; i++) {
                    sum += parseInt(str.charAt(i), 10);
                }
            }
            /*
            Si el valor enviado es 10, o si la suma de los digitos es 10, devuelve 1, si es mayor a 10,
            vuelve a llamarse, si es menor a 10, devuelve a suma de los dígitos.
            */
            return (valor === reductor || sum === reductor) ? 1 : (sum > reductor) ? sumarDigitos(sum) : sum;
        };

        /*
        Valida que los dominios/patentes ingresadas sean validas
        - Correspondan a una patente AAA000, AA000AA o 000AAA (moto)
         */
        let validarDominio = (idDominio) => {
            "use strict";
            const REGEXDOMINIO2016 = /^[A-Z]{3}\d{3}$/;
            const REGEXDOMINIOMOTO = /^\d{3}[A-Z]{3}$/;
            const REGEXDOMINIO2017 = /^[A-Z]{2}\d{3}[A-Z]{2}$/;
            if (!REGEXDOMINIO2016.test(idDominio) && !REGEXDOMINIO2017.test(idDominio) && !REGEXDOMINIOMOTO.test(idDominio)) {
                console.log("La patente ingresada es incorrecta");
                return false
            }
        };
    }

}