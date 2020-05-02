// Módulo shell serve pra gerenciar coisas externas, exemplo: abrir navegador
const { ipcRenderer, shell } = require('electron');
// É um módulo do próprio Node que informa informações do software e do sistema, etc
const process = require('process');

let linkFechar = document.getElementById('link-fechar');
let linkGithub = document.getElementById('link-github');
let versaoElectron = document.getElementById('versao-electron');

window.onload = () => {
    versaoElectron.textContent = process.versions.electron;
}

linkFechar.addEventListener('click', () => {
    ipcRenderer.send('fechar-janela-sobre');
});

// Para abrir no Navegador
linkGithub.addEventListener('click', () => {
    shell.openExternal("https://github.com/ChristianTudeschini");
});

/* https://github.com/ChristianTudeschini */