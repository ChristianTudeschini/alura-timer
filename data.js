const jsonfile = require('jsonfile-promised');
const fs = require('fs');

module.exports = {
    // Caso já não exista arquivo de curso salvo, ele vai criar um novo
    criaArquivoDeCurso(nomeArquivo, conteudoArquivo) {
        // É uma promise, portanto, podemos usar o .then .catch
        return jsonfile.writeFile(nomeArquivo, conteudoArquivo)
            .then(() => {
                console.log('Arquivo Criado');
            }).catch((err) => {
                console.log(err);
            });
    },

    AdicionaTempoCurso(arquivoCurso, tempo) {
        let dados = {
            ultimoEstudo: new Date().toString(),
            tempo
        }

        // spaces formata o json
        jsonfile.writeFile(arquivoCurso, dados, {spaces: 2})
            .then(() => {
                console.log('Tempo salvo com sucesso');
            }).catch((err) => {
                console.log(err);
            })
    },

    salvaDados(curso, tempoEstudado) {
        let arquivoCurso = __dirname + '/data/' + curso + '.json';

        // Verifica se já existe o arquivo com o nome do curso
        if(fs.existsSync(arquivoCurso)) {
            // Salvar
            this.AdicionaTempoCurso(arquivoCurso, tempoEstudado);
        } else {
            // Criar e Salvar 
            // this. pois faz parte do módulo data
            this.criaArquivoDeCurso(arquivoCurso, {})
                .then(() => {
                    // Salvar Dados
                    this.AdicionaTempoCurso(arquivoCurso, tempoEstudado);
                }) 
        }
    },

    pegaDados(nomeCurso) {
        let caminho = __dirname + '/data/' + nomeCurso + '.json';
        // Como ele é uma promise, vamos retonar ele pra quem chamou o evento
        return jsonfile.readFile(caminho);
    },

    pegaNomeDosCursos() {
        // Requisitando os nomes dos arquivos da pasta data e tirando a extensão .json
        let arquivos = fs.readdirSync(__dirname + '/data/');
        let cursos = arquivos.map((arquivo) => {
            // A função lastIndexOf retorna a posição do último caracter . (ponto)
            return arquivo.substr(0, arquivo.lastIndexOf('.'));
        })
        
        return cursos;
    }
}