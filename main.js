// Como não queremos importar TODO o electron, estamos importanto apenas o módulo app
// Ele é responsável pelo ciclo de vida da aplicação
const { app } = require('electron');
// Importando uma janela
const { BrowserWindow } = require('electron');
// Responsável por escutar requisições de outros arquivos (exemplo, no renderer)
// Resumindo, vai permitir nós criarmos novas telas em outros arquivos
const { ipcMain } = require('electron');
// Importando o módulo Tray (pra usar a "Traybar do sistema")
const { Tray } = require('electron');
// Para criar Menu
const { Menu } = require('electron');
// Para habilitar atalhos globais (que funcionam mesmo com a aplicação sendo executada em segundo plano)
const { globalShortcut } = require('electron');

const templateGenerator = require('./template');

const data = require('./data');

// Declarando a variável Tray
let tray = null;

// Declarando a tela principal
let mainWindow = null;

// Poderiamos importar assim tbm
/* const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow; */

app.on('ready', () => {
    // Criando janela
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        icon: __dirname + '/app/img/icon.png'
    });

    /* // Carregando site na janela
    mainWindow.loadURL('https://rm07.com.br/testing/falcon/'); */
    
    // Criando uma instância do Traybar, e passando uma img padrão de parâmetro
    tray = new Tray(__dirname + '/app/img/alura-logo-tray.png');

    /* // Configurando o Tray
    let trayMenu = Menu.buildFromTemplate([
        {label: 'Cursos'},
        {label: '', type: 'separator'},
        {label: 'JavaScript', type: 'radio'},
        {label: 'Photoshop', type: 'radio'}
    ]); */

    let template = templateGenerator.geraTrayTemplate(mainWindow);
    let trayMenu = Menu.buildFromTemplate(template);
    tray.setContextMenu(trayMenu);


    // Adicionando o Template do Menu
    let templateMenu = templateGenerator.geraMenuPrincipalTemplate(app);
    let menuPrincipal = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menuPrincipal);

    // Registrando atalho global
    globalShortcut.register('CmdOrCtrl+Shift+S', () => {
        mainWindow.send('atalho-iniciar-parar');
    });

    // Como configuramos um novo menu, perdemos a DevTools, então para manter a mesma com esse novo Menu, usamos essa função:
    /* mainWindow.openDevTools(); */

    // Carregando index.html
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
});

// Evento que, ao clicar no botão de fechar, fecha o programa
app.on('windows-all-closed', () => {
    app.quit();
})

let sobreWindow = null;
ipcMain.on('abrir-janela-sobre', () => {
    if(sobreWindow == null) {
        sobreWindow = new BrowserWindow({
            width: 360,
            height: 265,
            alwaysOnTop: true,
            // Barra superior da janela (Fechar, maximizar etc)
            frame: false
        });

        // Para o JS não destruir a janela
        sobreWindow.on('closed', () => {
            sobreWindow = null;
        });
    }

    sobreWindow.loadURL(`file://${__dirname}/app/sobre.html`)
});

ipcMain.on('fechar-janela-sobre', () => {
    sobreWindow.close();
});

// Event é um parâmetro padrão, mas podemos passar outros além dele
ipcMain.on('curso-parado', (event, curso, tempoEstudado) => {
    console.log(`O curso ${curso} foi estudado por ${tempoEstudado}`);
    data.salvaDados(curso, tempoEstudado);
});




ipcMain.on('curso-adicionado', (event, novoCurso) => {
    let novoTemplate = templateGenerator.adicionaCursoNoTray(novoCurso, mainWindow);
    let novoTrayMenu = Menu.buildFromTemplate(novoTemplate);
    tray.setContextMenu(novoTrayMenu);
});