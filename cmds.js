const model = require('./model');

const {log, biglog, colorize, errorlog} = require("./out");

exports.helpCmd = rl => {
    log("Comandos:");
    log(" h|help - Muestra esta ayuda.");
    log(" list - Listar los quizzes existentes.");
    log(" show <id> - Muestra la pregunda y la respuesta del quiz indicado.");
    log(" add - Añadir un nuevo quiz interactivamente.");
    log(" delete <id> - Borrar el quiz indicado.");
    log(" edit <id> - Editar el quiz indicado.");
    log(" test <id> - Probar el quiz indicado.");
    log(" p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log(" credits - Créditos.");
    log(" q|quit - Salir del programa.");
    rl.prompt();

};

/**
 * Lista todos los quizzes
 * 
 */

exports.listCmd = rl => {
    model.getAll().forEach((quiz, id) => {
        
        
        log(`   [${colorize(id, 'magenta')}]: ${quiz.question}`);
        
    });
    
    
    rl.prompt();
};

exports.showCmd = (rl, id) => {
    
    
    if (typeof id  === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(`   [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};

exports.quitCmd = rl => {
    rl.close();
    rl.prompt();

};

exports.addCmd = rl => {

    rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize('Introduzca la respuesta: ','red'), answer => {
            

            model.add(question, answer);
            log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });
};

exports.testCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(colorize(`${quiz.question}? `, 'red'), answer => {
                if (answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                    log('La respuesta es correcta');
                    biglog(`Correcta`, "green");
                } else {
                    log('La respuesta es incorrecta');
                    biglog(`Incorrecta`, "red");
                }
                rl.prompt();
            });

        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};

exports.playCmd = rl => {
    let score = 0;
    let toBeResolved = [];
    let longitud = model.count();
    for(let i=0; i < model.count(); i++){
        toBeResolved[i]=i;
    }
    
    const playOne = ()=>{
        if(toBeResolved.length === 0){
            log('No quedan más preguntas por contestar.')
            log('Aciertos:')
            biglog(`${score}`, "green");
            rl.prompt();
        }
        else{
            let idAux= Math.floor(Math.random()*toBeResolved.length)
            let randomQuiz = toBeResolved[idAux];
            
            const quiz= model.getByIndex(randomQuiz);
            
            rl.question(colorize(`${quiz.question}: `, 'red'), answer => {
                
                if (answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                    toBeResolved.splice(idAux,1);
                    score++;
                    log(`CORRECTO - Lleva ${score} aciertos`,'green');
                    playOne();}
                    else{
                        log(`INCORRECTO -  ${score} aciertos`,'red');
                        log(`Fin del juego`,'blue');
                        biglog(`${score}`,'magenta');
                        
                         }
                         rl.prompt();
                });
                    
 
            }
             
        
    }
    
   playOne();

};

exports.deleteCmd = (rl,id) => {
     
    if (typeof id  === "undefined") {
        errorlog(`Falta el parámetro id.`);
    } else {
        try {
            model.deleteByIndex(id);
            
        } catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();

};

exports.editCmd = (rl, id) => {

    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
           
            rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
                rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
                    model.update(id, question, answer);
                    log(`   Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};


exports.creditsCmd = rl => {

    log('Autores de la practica');
    log('Jorge Garcia Perez');
    rl.prompt();

};



