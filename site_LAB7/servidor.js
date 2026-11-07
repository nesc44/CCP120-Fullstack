const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const PORTA = 80;


app.use(express.static(path.join(__dirname, 'public')));


app.get('/Home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/Project.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'project.html'));
});

const server = http.createServer(app);


server.listen(PORTA, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORTA}!`);
    console.log(`Acesse localmente: http://localhost/Home.html`);
});