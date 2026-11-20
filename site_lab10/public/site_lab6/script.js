
const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');


const imagem = new Image();
imagem.src = 'corinthians.png';


const larguraImg = 60;
const alturaImg = 60;


let x = (canvas.width - larguraImg) / 2;
let y = (canvas.height - alturaImg) / 2;


window.addEventListener('mousemove', function(event) {
    
    const rect = canvas.getBoundingClientRect();

    
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    
    x = mouseX - (larguraImg / 2);
    y = mouseY - (alturaImg / 2);

    
    if (x < 0) {
        x = 0;
    }
    if (x > canvas.width - larguraImg) {
        x = canvas.width - larguraImg;
    }
    if (y < 0) {
        y = 0;
    }
    if (y > canvas.height - alturaImg) {
        y = canvas.height - alturaImg;
    }
});


function animar() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.drawImage(imagem, x, y, larguraImg, alturaImg);

    
    requestAnimationFrame(animar);
}


imagem.onload = function() {
    animar();
};
