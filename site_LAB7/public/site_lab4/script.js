const numeroAleatorio = Math.random() * 100;
const numeroSecreto = Math.floor(numeroAleatorio);

const campoNumero = document.getElementById("campoNumero");
const btnTestar = document.getElementById("btnTestar");
const elementoResposta = document.getElementById("resposta");
const elementoHistorico = document.getElementById("historico");

function testarPalpite() {
    const valorTexto = campoNumero.value.trim();

    if (valorTexto === "") {
        elementoResposta.innerText = "Por favor, digite um número!";
        document.getElementById("resposta").style.setProperty("background-color", "red");
        return;
    }

    const palpite = Number(valorTexto);

    if (isNaN(palpite) || palpite < 0 || palpite > 99) {
        elementoResposta.innerText = "Digite um número válido entre 0 e 99!";
        document.getElementById("resposta").style.setProperty("background-color", "red");
        return;
    }

    const itemHistorico = document.createElement("li");
    itemHistorico.innerText = palpite;
    elementoHistorico.appendChild(itemHistorico);

    if (palpite === numeroSecreto) {
        elementoResposta.innerText = "Parabéns! Você acertou o número " + numeroSecreto + "!";
        document.getElementById("resposta").style.setProperty("background-color", "green");
        campoNumero.disabled = true;
        btnTestar.disabled = true;
    } else if (palpite < numeroSecreto) {
        elementoResposta.innerText = "Errou! O número secreto é MAIOR que " + palpite + ".";
        document.getElementById("resposta").style.setProperty("background-color", "red");
    } else if (palpite > numeroSecreto) {
        elementoResposta.innerText = "Errou! O número secreto é MENOR que " + palpite + ".";
        document.getElementById("resposta").style.setProperty("background-color", "red");
    }

    campoNumero.value = "";
    campoNumero.focus();
}

btnTestar.addEventListener("click", testarPalpite);

campoNumero.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        testarPalpite();
    }
});
