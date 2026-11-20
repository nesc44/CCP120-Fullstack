const express = require('express');
const path = require('path');
const http = require('http');
const { MongoClient } = require('mongodb');

const app = express();
const PORTA = 80;


const MONGO_URI = 'mongodb+srv://brenobastosr_db_user:TG1PeWm9P9W8LXAT@lab9.oqhy2xy.mongodb.net/?retryWrites=true&w=majority';
const NOME_BANCO = 'blog_db';
const NOME_COLECAO = 'posts';

const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let colecaoPosts;


async function conectarBanco() {
    await client.connect();
    const db = client.db(NOME_BANCO);
    colecaoPosts = db.collection(NOME_COLECAO);
    console.log('Conectado ao MongoDB Atlas!');
}


async function cadastrarPost(titulo, resumo, conteudo) {
    const novoPost = {
        titulo: titulo,
        resumo: resumo,
        conteudo: conteudo
    };
    await colecaoPosts.insertOne(novoPost);
}


async function buscarPosts() {
    const posts = await colecaoPosts.find().toArray();
    return posts;
}


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
            sucesso: false,
            linkPrincipal: '/cadastra',
            textoLinkPrincipal: 'Voltar para Cadastro',
            linkSecundario: '/login',
            textoLinkSecundario: 'Ir para Login'
        });
    }

    usuarios.push({ nome, login, senha });

    res.render('resposta', {
        titulo: 'Cadastro realizado!',
        mensagem: `Usuario ${nome} cadastrado com sucesso!`,
        sucesso: true,
        linkPrincipal: '/login',
        textoLinkPrincipal: 'Ir para Login',
        linkSecundario: '/cadastra',
        textoLinkSecundario: 'Voltar para Cadastro'
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
            sucesso: true,
            linkPrincipal: '/',
            textoLinkPrincipal: 'Ir para Projetos',
            linkSecundario: '/login',
            textoLinkSecundario: 'Voltar para Login'
        });
    } else {
        res.render('resposta', {
            titulo: 'Falha no login',
            mensagem: 'Login ou senha incorretos. Tente novamente.',
            sucesso: false,
            linkPrincipal: '/login',
            textoLinkPrincipal: 'Tentar novamente',
            linkSecundario: '/cadastra',
            textoLinkSecundario: 'Criar conta'
        });
    }
});




app.get('/blog', async (req, res) => {
    try {
        const posts = await buscarPosts();
        res.render('blog', { posts: posts });
    } catch (erro) {
        console.log('Erro ao buscar posts:', erro);
        res.render('resposta', {
            titulo: 'Erro ao carregar o blog',
            mensagem: 'Nao foi possivel conectar ao banco de dados.',
            sucesso: false,
            linkPrincipal: '/',
            textoLinkPrincipal: 'Voltar para Projetos',
            linkSecundario: '/blog',
            textoLinkSecundario: 'Tentar novamente'
        });
    }
});


app.get('/cadastrar_post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'site_lab9', 'cadastrar_post.html'));
});


app.post('/cadastrar_post', async (req, res) => {
    const titulo = req.body.titulo;
    const resumo = req.body.resumo;
    const conteudo = req.body.conteudo;

    try {
        await cadastrarPost(titulo, resumo, conteudo);
        res.render('resposta', {
            titulo: 'Post Cadastrado',
            mensagem: `O post "${titulo}" foi salvo no banco de dados!`,
            sucesso: true,
            linkPrincipal: '/blog',
            textoLinkPrincipal: 'Voltar para o Blog',
            linkSecundario: '/Home.html',
            textoLinkSecundario: 'Home'
        });
    } catch (erro) {
        console.log('Erro ao cadastrar post:', erro);
        res.render('resposta', {
            titulo: 'Erro ao cadastrar',
            mensagem: 'Nao foi possivel salvar o post no banco de dados.',
            sucesso: false,
            linkPrincipal: '/cadastrar_post',
            textoLinkPrincipal: 'Tentar novamente',
            linkSecundario: '/blog',
            textoLinkSecundario: 'Voltar para o Blog'
        });
    }
});

const server = http.createServer(app);


conectarBanco()
    .then(() => {
        server.listen(PORTA, '0.0.0.0', () => {
            console.log(`Servidor rodando na porta ${PORTA}!`);
            console.log(`Acesse localmente: http://localhost/`);
        });
    })
    .catch((erro) => {
        console.log('Erro ao conectar no MongoDB:', erro);
    });