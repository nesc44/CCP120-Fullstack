let idades = [18, 19];
console.log(idades);

idades.push(20);
console.log(idades);

idades.pop();
console.log;




class retangulo {
    constructor (x, y, largura, altura, cor1, cor2){
        this.x = x;
        this.y = y;
        this.altura = altura;
        this.largura = largura;
        this.cor1 = cor1;
        this.cor2 = cor2
    }
}
desenhar()
{
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.fillStyle = this.cor1;
    ctx.strokeStyle = this.cor2;
    ctx.strokeRect(this.x, this.y, this.largura, this.altura);
    ctx.fillRect(this.x, this.y, this.largura, this.altura);
    ctx.closePath();
}

let canvas = document.getElementById ("canvas")
let ctx =  canvas.getContext("2d")