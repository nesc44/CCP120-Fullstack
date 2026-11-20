const express = require('express');
const path = require('path');
const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORTA = 80;


const MONGO_URI = 'mongodb+srv://brenobastosr_db_user:TG1PeWm9P9W8LXAT@lab9.oqhy2xy.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


let colecaoPosts;     // LAB 9 
let colecaoUsuarios;  // LAB 10 
let colecaoCarros;    // LAB 10 

async function conectarBanco() {
    await client.connect();


    const dbBlog = client.db('blog_db');
    colecaoPosts = dbBlog.collection('posts');


    const dbCarros = client.db('carros_db');
    colecaoUsuarios = dbCarros.collection('usuarios');
    colecaoCarros = dbCarros.collection('carros');

    console.log('Conectado ao MongoDB Atlas!');
}

// --- Funcoes de acesso ao BD  ---
async function cadastrarPost(titulo, resumo, conteudo) {
    await colecaoPosts.insertOne({ titulo, resumo, conteudo });
}

async function buscarPosts() {
    return await colecaoPosts.find().toArray();
}

// --- Funcoes de acesso ao BD ---


async function cadastrarUsuario(nome, login, senha) {
    await colecaoUsuarios.insertOne({
        nome: nome,
        login: login,
        senha: senha
    });
}


async function buscarUsuario(login, senha) {
    return await colecaoUsuarios.findOne({ login: login, senha: senha });
}


async function cadastrarCarro(marca, modelo, ano, qtde_disponivel) {
    await colecaoCarros.insertOne({
        marca: marca,
        modelo: modelo,
        ano: Number(ano),
        qtde_disponivel: Number(qtde_disponivel)
    });
}


async function buscarCarros() {
    return await colecaoCarros.find().toArray();
}


async function atualizarCarro(id, marca, modelo, ano, qtde_disponivel) {
    const filtro = { _id: new ObjectId(id) };
    const novosDados = {
        $set: {
            marca: marca,
            modelo: modelo,
            ano: Number(ano),
            qtde_disponivel: Number(qtde_disponivel)
        }
    };
    return await colecaoCarros.updateOne(filtro, novosDados);
}


async function venderCarro(id) {
    const filtro = { _id: new ObjectId(id), qtde_disponivel: { $gt: 0 } };
    const atualizacao = { $inc: { qtde_disponivel: -1 } };
    return await colecaoCarros.updateOne(filtro, atualizacao);
}


async function removerCarro(id) {
    const filtro = { _id: new ObjectId(id) };
    return await colecaoCarros.deleteOne(filtro);
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));


const usuariosLab8 = [];


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
    const { nome, login, senha } = req.body;
    const existe = usuariosLab8.find(u => u.login === login);
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

    usuariosLab8.push({ nome, login, senha });
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
    const { login, senha } = req.body;
    const usuarioEncontrado = usuariosLab8.find(u => u.login === login && u.senha === senha);

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
    const { titulo, resumo, conteudo } = req.body;
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


app.get('/carros', async (req, res) => {
    try {
        const carros = await buscarCarros();
        res.render('carros', { carros: carros });
    } catch (erro) {
        console.log('Erro ao listar carros:', erro);
        res.render('resposta', {
            titulo: 'Erro ao carregar carros',
            mensagem: 'Nao foi possivel buscar os carros no banco de dados.',
            sucesso: false,
            linkPrincipal: '/',
            textoLinkPrincipal: 'Voltar para Projetos',
            linkSecundario: '/carros',
            textoLinkSecundario: 'Tentar novamente'
        });
    }
});


app.get('/carros/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'site_lab10', 'cadastro_usuario.html'));
});

app.post('/carros/cadastro', async (req, res) => {
    const { nome, login, senha } = req.body;
    try {
        const existe = await colecaoUsuarios.findOne({ login: login });
        if (existe) {
            return res.render('resposta', {
                titulo: 'Login ja cadastrado',
                mensagem: 'Esse login ja existe no banco de dados. Tente outro.',
                sucesso: false,
                linkPrincipal: '/carros/cadastro',
                textoLinkPrincipal: 'Tentar novamente',
                linkSecundario: '/carros/login',
                textoLinkSecundario: 'Fazer Login'
            });
        }

        await cadastrarUsuario(nome, login, senha);
        res.render('resposta', {
            titulo: 'Usuario cadastrado!',
            mensagem: `Usuario ${nome} salvo no banco de dados com sucesso!`,
            sucesso: true,
            linkPrincipal: '/carros/login',
            textoLinkPrincipal: 'Ir para Login',
            linkSecundario: '/carros',
            textoLinkSecundario: 'Ver Carros'
        });
    } catch (erro) {
        console.log('Erro ao cadastrar usuario:', erro);
        res.render('resposta', {
            titulo: 'Erro no cadastro',
            mensagem: 'Nao foi possivel cadastrar o usuario.',
            sucesso: false,
            linkPrincipal: '/carros/cadastro',
            textoLinkPrincipal: 'Tentar novamente',
            linkSecundario: '/carros',
            textoLinkSecundario: 'Voltar para Carros'
        });
    }
});


app.get('/carros/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'site_lab10', 'login_usuario.html'));
});


app.post('/carros/login', async (req, res) => {
    const { login, senha } = req.body;
    try {
        const usuario = await buscarUsuario(login, senha);
        if (usuario) {
            res.render('resposta', {
                titulo: 'Login realizado!',
                mensagem: `Bem-vindo, ${usuario.nome}! Agora voce pode gerenciar os carros.`,
                sucesso: true,
                linkPrincipal: '/carros/gerencia',
                textoLinkPrincipal: 'Ir para Gerencia de Carros',
                linkSecundario: '/carros',
                textoLinkSecundario: 'Ver Carros Disponiveis'
            });
        } else {
            res.render('resposta', {
                titulo: 'Falha no login',
                mensagem: 'Login ou senha incorretos.',
                sucesso: false,
                linkPrincipal: '/carros/login',
                textoLinkPrincipal: 'Tentar novamente',
                linkSecundario: '/carros/cadastro',
                textoLinkSecundario: 'Criar conta'
            });
        }
    } catch (erro) {
        console.log('Erro ao fazer login:', erro);
        res.render('resposta', {
            titulo: 'Erro no login',
            mensagem: 'Nao foi possivel consultar o banco de dados.',
            sucesso: false,
            linkPrincipal: '/carros/login',
            textoLinkPrincipal: 'Tentar novamente',
            linkSecundario: '/carros',
            textoLinkSecundario: 'Voltar para Carros'
        });
    }
});


app.get('/carros/gerencia', async (req, res) => {
    try {
        const carros = await buscarCarros();
        res.render('gerencia_carros', { carros: carros });
    } catch (erro) {
        console.log('Erro ao abrir gerencia:', erro);
        res.render('resposta', {
            titulo: 'Erro ao carregar gerencia',
            mensagem: 'Nao foi possivel buscar os carros no banco de dados.',
            sucesso: false,
            linkPrincipal: '/carros',
            textoLinkPrincipal: 'Voltar para Carros',
            linkSecundario: '/',
            textoLinkSecundario: 'Projetos'
        });
    }
});


app.post('/carros/cadastrar', async (req, res) => {
    const { marca, modelo, ano, qtde_disponivel } = req.body;
    try {
        await cadastrarCarro(marca, modelo, ano, qtde_disponivel);
        res.redirect('/carros/gerencia');
    } catch (erro) {
        console.log('Erro ao cadastrar carro:', erro);
        res.render('resposta', {
            titulo: 'Erro ao cadastrar carro',
            mensagem: 'Nao foi possivel salvar o carro no banco de dados.',
            sucesso: false,
            linkPrincipal: '/carros/gerencia',
            textoLinkPrincipal: 'Voltar para Gerencia',
            linkSecundario: '/carros',
            textoLinkSecundario: 'Ver Carros'
        });
    }
});


app.post('/carros/atualizar', async (req, res) => {
    const { id, marca, modelo, ano, qtde_disponivel } = req.body;
    try {
        await atualizarCarro(id, marca, modelo, ano, qtde_disponivel);
        res.redirect('/carros/gerencia');
    } catch (erro) {
        console.log('Erro ao atualizar carro:', erro);
        res.render('resposta', {
            titulo: 'Erro ao atualizar carro',
            mensagem: 'Nao foi possivel atualizar os dados do carro.',
            sucesso: false,
            linkPrincipal: '/carros/gerencia',
            textoLinkPrincipal: 'Voltar para Gerencia',
            linkSecundario: '/carros',
            textoLinkSecundario: 'Ver Carros'
        });
    }
});


app.post('/carros/vender', async (req, res) => {
    const { id } = req.body;
    try {
        await venderCarro(id);
        res.redirect('/carros/gerencia');
    } catch (erro) {
        console.log('Erro ao vender carro:', erro);
        res.render('resposta', {
            titulo: 'Erro ao vender carro',
            mensagem: 'Nao foi possivel registrar a venda.',
            sucesso: false,
            linkPrincipal: '/carros/gerencia',
            textoLinkPrincipal: 'Voltar para Gerencia',
            linkSecundario: '/carros',
            textoLinkSecundario: 'Ver Carros'
        });
    }
});


app.post('/carros/remover', async (req, res) => {
    const { id } = req.body;
    try {
        await removerCarro(id);
        res.redirect('/carros/gerencia');
    } catch (erro) {
        console.log('Erro ao remover carro:', erro);
        res.render('resposta', {
            titulo: 'Erro ao remover carro',
            mensagem: 'Nao foi possivel remover o carro do banco de dados.',
            sucesso: false,
            linkPrincipal: '/carros/gerencia',
            textoLinkPrincipal: 'Voltar para Gerencia',
            linkSecundario: '/carros',
            textoLinkSecundario: 'Ver Carros'
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
