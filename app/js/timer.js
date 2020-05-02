const { ipcRenderer } = require('electron');
const moment = require('moment');

// Para evitar o bug dos segundos, estamos setando a variável segundos com o valor 0
let segundos = 0;
let timer;
let tempo;

module.exports = {
    // el = elemento
    iniciar(el) {
        // .duration é uma função que pega a string e cria uma duração de tempo  
        tempo = moment.duration(el.textContent);
        segundos = tempo.asSeconds();

        // Limpando timer para evitar que seja executado mais de um timer ao mesmo tempo
        clearInterval(timer);

        // Para cada um segundo, implementa +1 segundo no texto
        // A função setInterval retorna um id
        timer = setInterval(() => {
            segundos++;
            el.textContent = this.segundosParaTempo(segundos);
        }, 1000);
    },

    parar(curso) {
        clearInterval(timer);
        
        let tempoEstudado = this.segundosParaTempo(segundos);
        ipcRenderer.send('curso-parado', curso, tempoEstudado);
    },

    segundosParaTempo(segundos) {
        // .startOf('day') = 00:00:00
        return moment().startOf('day').seconds(segundos).format('HH:mm:ss');
    }
}