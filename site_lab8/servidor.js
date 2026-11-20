const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const PORTA = 80;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));


const usuarios = [];


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'project.html'));
});


app.use(express.static(path.join(__dirname, 'public')));


app.get('/Home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/Project.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'project.html'));
});


app.get('/cadastra', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'site_lab8', 'cadastro.html'));
});


app.post('/cadastra', (req, res) => {
    const nome = req.body.nome;
    const login = req.body.login;
    const senha = req.body.senha;

    
    const existe = usuarios.find(u => u.login === login);
    if (existe) {
        return res.render('resposta', {
            titulo: 'Erro no cadastro',
            mensagem: 'Esse login ja esta em uso. Escolha outro.',
            sucesso: false
        });
    }

    usuarios.push({ nome, login, senha });

    res.render('resposta', {
        titulo: 'Cadastro realizado!',
        mensagem: `Usuario ${nome} cadastrado com sucesso!`,
        sucesso: true
    });
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'site_lab8', 'login.html'));
});


app.post('/login', (req, res) => {
    const login = req.body.login;
    const senha = req.body.senha;

    const usuarioEncontrado = usuarios.find(u => u.login === login && u.senha === senha);

    if (usuarioEncontrado) {
        res.render('resposta', {
            titulo: 'Login realizado com sucesso!',
            mensagem: `Bem-vindo, ${usuarioEncontrado.nome}!`,
            sucesso: true
        });
    } else {
        res.render('resposta', {
            titulo: 'Falha no login',
            mensagem: 'Login ou senha incorretos. Tente novamente.',
            sucesso: false
        });
    }
});

const server = http.createServer(app);

server.listen(PORTA, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORTA}!`);
    console.log(`Acesse localmente: http://localhost/`);
});
