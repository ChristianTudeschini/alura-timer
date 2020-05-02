// Quem vai ser comunicar com o processo principal pra permitir a criação de novas telas
const { ipcRenderer } = require('electron');
const timer = require('./timer');
const data = require('../../data');

let linkSobre = document.getElementById('link-sobre');
let botaoPlay = document.querySelector('.botao-play');
let tempo = document.querySelector('.tempo');
let curso = document.querySelector('.curso');
let campoAdicionar = document.querySelector('.campo-adicionar');
let botaoAdicionar = document.querySelector('.botao-adicionar');

window.onload = () => {
    data.pegaDados(curso.textContent)
        .then((dados) => {
            tempo.textContent = dados.tempo;
        });
}

linkSobre.addEventListener('click', () => {
    // Enviando evento para o processo principal, onde vai ser gerado a janela de sobre
    ipcRenderer.send('abrir-janela-sobre');
});

// Criando array de imagens para trocar no clique do botão
let imgs = ['img/play-button.svg', 'img/stop-button.svg']
let play = false;
botaoPlay.addEventListener('click', () => {
    if(play) {
        timer.parar(curso.textContent);
        play = false;
        new Notification('Alura Timer',{
            body: `O curso ${curso.textContent} foi parado!`,
            icon: 'img/stop-button.png'
        });
    } else {
        timer.iniciar(tempo)
        play = true;
        new Notification('Alura Timer',{
            body: `O curso ${curso.textContent} foi iniciado!!`,
            icon: 'img/play-button.png'
        });
    }

    // Invertendo o array, pois assim, não precisamos ficar utilizando contadores para trocar de imagem
    imgs.reverse();
    botaoPlay.src = imgs[0];
});

ipcRenderer.on('curso-trocado', (event, nomeCurso) => {
    // Na hora da troca de curso, caso esteja rodando o timer, ele irá parar
    timer.parar(curso.textContent);

    // Pegando o tempo do curso
    data.pegaDados(nomeCurso)
        .then((dados) => {
            tempo.textContent = dados.tempo;
        }).catch((err) => {
            console.log('O curso ainda não possui um JSON');
            tempo.textContent = "00:00:00";
        });

    // Mudando o texto do curso
    curso.textContent = nomeCurso;
});

botaoAdicionar.addEventListener('click', () => {
    // Verificando se o campo está vazio
    if(campoAdicionar.value == "") {
        console.log('Não posso adicionar um curso com campo vazio');
        // Quebrando a função
        return;
    }

    let novoCurso = campoAdicionar.value;
    curso.textContent = novoCurso;
    tempo.textContent = '00:00:00';
    campoAdicionar.value = '';
    ipcRenderer.send('curso-adicionado', novoCurso);
});

// Simulando clique do Timer por meio de atalho global
ipcRenderer.on('atalho-iniciar-parar', () => {
    console.log('Atalho no renderer process');
    let click = new MouseEvent('click');
    botaoPlay.dispatchEvent(click);
});
