// inclui o módulo http
var http = require('http'); 

// inclui o módulo express
var express = require('express'); 

// cria a variável app, pela qual acessaremos os métodos/funções do express
var app = express(); 

// método use() utilizado para definir a pasta do seu conteúdo estático (HTML/CSS)
app.use(express.static('./public')); 

// cria o servidor
var server = http.createServer(app); 

// define o número da porta que o servidor ouvirá
server.listen(3000); 

// mensagem exibida no console para debug
console.log("servidor rodando...");