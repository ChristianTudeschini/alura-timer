const data = require('./data');
const { ipcMain } = require('electron');

module.exports = {
    templateInicial: null,

    // win = window
    geraTrayTemplate(win) {
        let template = [
            {
                label: 'Cursos'
            },
            {
                type: 'separator'
            }
        ];

        let cursos = data.pegaNomeDosCursos();

        cursos.forEach(curso => {
            let menuItem = {
                label: curso, 
                type: 'radio',
                click: () => {
                    win.send('curso-trocado', curso);
                }
            }
            template.push(menuItem);
        });

        // Isso possibilita que tenhamos acesso ao array fora do escopo da função
        this.templateInicial = template;

        return template;
    },

    adicionaCursoNoTray(curso, win) {
        this.templateInicial.push({
            label: curso, 
            type: 'radio',
            // Assim que o novo item for criado, já vai deixar um checked na TrayBar
            checked: true,
            click: () => {
                // Enviando evento pra tela principal
                win.send('curso-trocado', curso);
            }
        });

        return this.templateInicial;
    },

    geraMenuPrincipalTemplate(app) {
        // Criando Template do Menu
        let = templateMenu = [
            {
                label: 'View',
                submenu: [
                    {
                        role: 'reload'
                    },
                    {
                        role: 'toggledevtools'
                    }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    {
                        role: 'minimize',
                        accelerator: 'Alt+M'
                    },
                    {
                        role: 'close'
                    }
                ]
            },
            {
                label: 'Sobre',
                submenu: [{
                    label: 'Sobre o Alura Timer',
                    // Configurando tecla de atalho
                    // Command é do Mac
                    /* accelerator: CommandOrControl+i, */
                    accelerator: 'CmdOrCtrl+i',
                    click: () => {
                        // Como já estamos no processo principal, vamos usar o emit
                        ipcMain.emit('abrir-janela-sobre');
                    }
                }]
            }
        ];
        

        // !!!!! MAC !!!!!
        // Verificando se o programa está sendo executado no MacOS (pois o sistema de menus é diferente)
        if(process.platform == 'darwin') {
            // Como o template é um array, ele está adicionando os valores a seguir na primeira posição (a função unshift que faz isso)
            template.unshift({
                // Pegando o nome da aplicação (ele pega o nome que está no package.json)
                label: app.getName(),
                submenu: [{
                    label: 'Estou rodando no Mac'
                }] 
            })
        }

        return templateMenu;
    }
}