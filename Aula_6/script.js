console.log( document.getElementById("nome") .innerHTML );

document. getElementById("nome").innerHTML = "Breno";

function imprimir(){
    let x = document.getElementById ("i1").value;
    console.log(x);
    document.getElementById("s1").innerHTML = x;
}

function ex1(){
    let nome = document.getElementById("ex1_nome").value;
    let idade = document.getElementById("ex1_idade").value;
    let ano_atual = 2026;
    let ano_nasc = ano_atual - idade;
    let resposta = "olá " + nome + ", seu ano de nascimento é: " + ano_nasc + "!";
    document.getElementById("r1").innerHTML = resposta;
}
function soma (a, b){
    return a+b;
}

console.log (soma (8,4));

function multi (a, b){
    return a*b;
}
console.log (multi(8,4));