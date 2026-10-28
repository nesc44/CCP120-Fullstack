let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")

class Rect{
    constructor(x,y,l,a,cor1,cor2){
        this.x = x;
        this.y=y;
        this.l=l;
        this.a=a;
        this.cor1=cor1;
        this.cor2=cor2;
    }

desenha(){
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.fillStyle = this.cor1;
    ctx.strokeStyle = this.cor2;
    ctx.strokeRect(this.x, this.y, this.l, this.a);
    ctx.fillRect(this.x, this.y, this.l, this.a);
    ctx.closePath();
    }
}

let r1 = new Rect(10,10,50,10,"Blue", "blue");
let r2 = new Rect(10,10,50,10,"Red", "red");

function animacao(){
    //apagar canvas
    ctx.clearRect(0,0,400,400);
    //mover retangulo
    //desenhar retangulo
    r1.desenha();
    r2.desenha();

    requestAnimationFrame(animacao);
}

animacao();


let vel= 40;
document.addEventListener("keydown", function(evento){
    console.log(evento);
    if (evento.key == "ArrowUp"){r1.y -= 1}
    if (evento.key == "ArrowDown"){r1.y += 1}
    if (evento.key == "ArrowLeft"){r1.x -= 1}
    if (evento.key == "ArrowRight"){r1.x += 1}
})

document.addEventListener("mousemove", function(evento){
    console.log(evento)
    let rect = canvas.getBoundingClientRect();
    let x_mouse= evento.clientX - rect.left;
    let y_mouse= evento.clientY - rect.top;
    console.log(x_mouse, y_mouse);

    r2.x = x_mouse;
    r2.y = y_mouse;
})