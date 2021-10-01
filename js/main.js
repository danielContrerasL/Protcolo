angular.module('todoApp', [])
.controller('TodoListController', function ($timeout) {
        const app = this;
        const timeWait = 5000;
        app.message = "";
        app.commandBack = null;
        app.msmsList = [];
        app.isListening = false;
        app.reset = false;
        app.currentMessage = "";
        /**
         * case: 0 MAYUS, 1 munus
         * state: 1 valido, 0 invalido o erroneo
         */
        const ABC = {
            "A": {error: "0", state:"1", case:"0", code: "00001", val: 1},
            "B": {error: "0", state:"1", case:"0", code: "00010", val: 2},
            "C": {error: "0", state:"1", case:"0", code: "00011", val: 3},
            "D": {error: "0", state:"1", case:"0", code: "00100", val: 4},
            "E": {error: "0", state:"1", case:"0", code: "00101", val: 5},
            "F": {error: "0", state:"1", case:"0", code: "00110", val: 6},
            "G": {error: "0", state:"1", case:"0", code: "00111", val: 7},
            "H": {error: "0", state:"1", case:"0", code: "01000", val: 8},
            "I": {error: "0", state:"1", case:"0", code: "01001", val: 9},
            "J": {error: "0", state:"1", case:"0", code: "01010", val: 10},
            "K": {error: "0", state:"1", case:"0", code: "01011", val: 11},
            "L": {error: "0", state:"1", case:"0", code: "01100", val: 12},
            "M": {error: "0", state:"1", case:"0", code: "01101", val: 13},
            "N": {error: "0", state:"1", case:"0", code: "01110", val: 14},
            "O": {error: "0", state:"1", case:"0", code: "01111", val: 15},
            "P": {error: "0", state:"1", case:"0", code: "10000", val: 16},
            "Q": {error: "0", state:"1", case:"0", code: "10001", val: 17},
            "R": {error: "0", state:"1", case:"0", code: "10010", val: 18},
            "S": {error: "0", state:"1", case:"0", code: "10011", val: 19},
            "T": {error: "0", state:"1", case:"0", code: "10100", val: 20},
            "U": {error: "0", state:"1", case:"0", code: "10101", val: 21},
            "V": {error: "0", state:"1", case:"0", code: "10110", val: 22},
            "W": {error: "0", state:"1", case:"0", code: "10111", val: 23},
            "X": {error: "0", state:"1", case:"0", code: "11000", val: 24},
            "Y": {error: "0", state:"1", case:"0", code: "11001", val: 25},
            "Z": {error: "0", state:"1", case:"0", code: "11010", val: 26},
        };
        const abc = {
            "a": {error: "0", state:"1", case:"1", code: "00001", val: 1},
            "b": {error: "0", state:"1", case:"1", code: "00010", val: 2},
            "c": {error: "0", state:"1", case:"1", code: "00011", val: 3},
            "d": {error: "0", state:"1", case:"1", code: "00100", val: 4},
            "e": {error: "0", state:"1", case:"1", code: "00101", val: 5},
            "f": {error: "0", state:"1", case:"1", code: "00110", val: 6},
            "g": {error: "0", state:"1", case:"1", code: "00111", val: 7},
            "h": {error: "0", state:"1", case:"1", code: "01000", val: 8},
            "i": {error: "0", state:"1", case:"1", code: "01001", val: 9},
            "j": {error: "0", state:"1", case:"1", code: "01010", val: 10},
            "k": {error: "0", state:"1", case:"1", code: "01011", val: 11},
            "l": {error: "0", state:"1", case:"1", code: "01100", val: 12},
            "m": {error: "0", state:"1", case:"1", code: "01101", val: 13},
            "n": {error: "0", state:"1", case:"1", code: "01110", val: 14},
            "o": {error: "0", state:"1", case:"1", code: "01111", val: 15},
            "p": {error: "0", state:"1", case:"1", code: "10000", val: 16},
            "q": {error: "0", state:"1", case:"1", code: "10001", val: 17},
            "r": {error: "0", state:"1", case:"1", code: "10010", val: 18},
            "s": {error: "0", state:"1", case:"1", code: "10011", val: 19},
            "t": {error: "0", state:"1", case:"1", code: "10100", val: 20},
            "u": {error: "0", state:"1", case:"1", code: "10101", val: 21},
            "v": {error: "0", state:"1", case:"1", code: "10110", val: 22},
            "w": {error: "0", state:"1", case:"1", code: "10111", val: 23},
            "x": {error: "0", state:"1", case:"1", code: "11000", val: 24},
            "y": {error: "0", state:"1", case:"1", code: "11001", val: 25},
            "z": {error: "0", state:"1", case:"1", code: "11010", val: 26},
        };
        const command = {
            "0K": {code: "01011011", isCommand: true, name: "OK"},
            "0S": {code: "01011110", isCommand: true, name: "Inicio"},
            "0E": {code: "01011111", isCommand: true, name: "Fin"},
            "0R": {code: "10000000", isCommand: true, name: "Reintentar"},
            "0B": {code: "01100000", isCommand: true, name: "Espacio vacio"},
            "0N": {code: "01000000", isCommand: true, name: "Carácter desconocido"},
        };

        app.start = () => {
            app.msmsList.push(command["0S"]);
            app.msmsList[0].$first = true;
            app.reset = true;
            $timeout(() => {
                app.reset = false;
                app.msmsList.shift();
                app.receptorAction("0K");
                app.isListening = !app.isListening;
            }, (timeWait));
        };

        app.changeLinteningstate = () => {
            app.isListening = !app.isListening;
        };

        app.sendMessage = () => {
            app.msmsList = app.message.split("").map((letter, i) => {
                if (/[A-Z]/.test(letter)) {
                    return {id: i, letter, msm: ABC[letter].code, ...ABC[letter]};
                }else if (/[a-z]/.test(letter)) {
                    return {id: i, letter, msm: abc[letter].code, ...abc[letter]};
                } else if(/ /.test(letter)){
                    return {id: i, letter: "_", ...command["0B"]};
                }
                return {id: i, letter: "*!", ...command["0N"]};
            }).filter((data) => data);
            app.msmsList.push(command["0E"]);
            app.emiterAction();
            
            app.isListening = !app.isListening;
        };

        app.emiterAction = () => {
            $timeout(() => {
                $timeout(() => {app.reset = false;})
                if (app.msmsList.length === 0) {
                    return;
                } else {
                    app.msmsList[0].$first = true;
                }
                $timeout(() => {app.reset = true;})
                $timeout(() => {
                    app.receptorAction("0K")
                }, timeWait)
            });
        };

        app.receptorAction = (code) => {
            if (code) {
                app.commandBack = command[code];
                $timeout(() => {app.reset = false;})
                if ((app.msmsList[0] || {}).letter) {
                    console.log(app.msmsList[0]);
                    if ((app.msmsList[0].isCommand && app.msmsList[0].code === command["0B"].code) ) {
                        app.currentMessage += " ";
                    } else if (app.msmsList[0].code !== command["0N"].code){
                        app.currentMessage += app.msmsList[0].letter;
                    }
                }
                app.msmsList.shift();
                $timeout(() => {app.commandBack = null; app.emiterAction();}, timeWait)
            }
        };
    });
