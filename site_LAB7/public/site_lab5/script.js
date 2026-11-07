const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

function graus_para_radianos(graus) {
  return (graus * Math.PI) / 180;
}

function limpar_canvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function desenhar_quadrado(x, y, tamanho, corPreenchimento, corBorda = null, larguraBorda = 1) {
  desenhar_retangulo(x, y, tamanho, tamanho, corPreenchimento, corBorda, larguraBorda);
}

function desenhar_retangulo(x, y, largura, altura, corPreenchimento, corBorda = null, larguraBorda = 1) {
  ctx.beginPath();
  ctx.rect(x, y, largura, altura);

  if (corPreenchimento) {
    ctx.fillStyle = corPreenchimento;
    ctx.fill();
  }

  if (corBorda) {
    ctx.strokeStyle = corBorda;
    ctx.lineWidth = larguraBorda;
    ctx.stroke();
  }
}

function desenhar_linha(xInicio, yInicio, xFim, yFim, cor, largura = 1.5) {
  ctx.beginPath();
  ctx.moveTo(xInicio, yInicio);
  ctx.lineTo(xFim, yFim);
  ctx.strokeStyle = cor;
  ctx.lineWidth = largura;
  ctx.stroke();
}

function desenhar_arco(xCentro, yCentro, raio, anguloInicioGraus, anguloFimGraus, cor, largura = 1.5, sentidoAntiHorario = false) {
  const radInicio = graus_para_radianos(anguloInicioGraus);
  const radFim = graus_para_radianos(anguloFimGraus);

  ctx.beginPath();
  ctx.arc(xCentro, yCentro, raio, radInicio, radFim, sentidoAntiHorario);
  ctx.strokeStyle = cor;
  ctx.lineWidth = largura;
  ctx.stroke();
}

function desenhar_circulo(xCentro, yCentro, raio, corPreenchimento, corBorda = null, larguraBorda = 1.5) {
  ctx.beginPath();
  ctx.arc(xCentro, yCentro, raio, 0, Math.PI * 2);

  if (corPreenchimento) {
    ctx.fillStyle = corPreenchimento;
    ctx.fill();
  }

  if (corBorda) {
    ctx.strokeStyle = corBorda;
    ctx.lineWidth = larguraBorda;
    ctx.stroke();
  }
}

function desenhar_semicirculo(xCentro, yCentro, raio, anguloInicioGraus, anguloFimGraus, corPreenchimento, corBorda = null, larguraBorda = 1.5) {
  const radInicio = graus_para_radianos(anguloInicioGraus);
  const radFim = graus_para_radianos(anguloFimGraus);

  ctx.beginPath();
  ctx.arc(xCentro, yCentro, raio, radInicio, radFim, false);
  ctx.closePath();

  if (corPreenchimento) {
    ctx.fillStyle = corPreenchimento;
    ctx.fill();
  }

  if (corBorda) {
    ctx.strokeStyle = corBorda;
    ctx.lineWidth = larguraBorda;
    ctx.stroke();
  }
}

function desenhar_texto(texto, x, y, fonte = '18px Arial, sans-serif', cor = '#222222', alinhamento = 'center') {
  ctx.font = fonte;
  ctx.fillStyle = cor;
  ctx.textAlign = alinhamento;
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, x, y);
}

function desenhar_triangulo(x1, y1, x2, y2, x3, y3, corPreenchimento, corBorda = null, larguraBorda = 1.5) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();

  if (corPreenchimento) {
    ctx.fillStyle = corPreenchimento;
    ctx.fill();
  }

  if (corBorda) {
    ctx.strokeStyle = corBorda;
    ctx.lineWidth = larguraBorda;
    ctx.stroke();
  }
}

function desenhar_composicao_geometrica() {
  limpar_canvas();

  desenhar_quadrado(0, 0, 50, '#0000FF');
  desenhar_quadrado(250, 0, 50, '#FF0000');
  desenhar_retangulo(0, 120, 30, 60, '#00FFFF');
  desenhar_quadrado(270, 135, 30, '#00FFFF');
  desenhar_quadrado(110, 150, 40, '#FF0000');

  desenhar_retangulo(0, 240, 30, 60, '#FFFF00');
  desenhar_quadrado(30, 270, 30, '#FFFF00');

  desenhar_retangulo(270, 240, 30, 60, '#000000');
  desenhar_quadrado(240, 270, 30, '#000000');

  desenhar_semicirculo(150, 300, 40, 180, 360, '#00FFFF', '#2e7d32', 1.5);

  desenhar_linha(50, 50, 150, 150, '#0000FF', 1.5);
  desenhar_linha(250, 50, 150, 150, '#FF0000', 1.5);
  desenhar_linha(0, 150, 300, 150, '#2e7d32', 1.5);
  desenhar_linha(150, 150, 150, 300, '#808080', 1.5);

  desenhar_arco(150, 150, 60, 180, 360, '#2e7d32', 1.5);
  desenhar_arco(150, 150, 80, 180, 225, '#2e7d32', 1.5);
  desenhar_arco(150, 150, 80, 315, 360, '#2e7d32', 1.5);
  desenhar_arco(150, 300, 80, 180, 270, '#2e7d32', 1.5);
  desenhar_arco(150, 300, 60, 270, 360, '#2e7d32', 1.5);

  desenhar_circulo(150, 115, 15, '#00FFFF', '#0000FF', 1.5);
  desenhar_circulo(70, 220, 15, '#FFFF00', '#2e7d32', 1.5);
  desenhar_circulo(220, 220, 15, '#FFFF00', '#2e7d32', 1.5);

  desenhar_texto('Canvas', 150, 48, '18px Arial, sans-serif', '#222222', 'center');
}

function desenhar_paisagem_casa() {
  limpar_canvas();

  desenhar_retangulo(0, 0, 300, 225, '#8CECD2');
  desenhar_retangulo(0, 225, 300, 75, '#737373');
  desenhar_circulo(225, 75, 36, '#FFFF33');

  desenhar_retangulo(0, 185, 38, 115, '#3D7EFF');
  desenhar_retangulo(38, 260, 110, 40, '#3D7EFF');
  desenhar_arco(148, 300, 40, 180, 270, '#3D7EFF', 40, false);

  desenhar_retangulo(40, 190, 15, 35, '#6D3B14');
  desenhar_circulo(47, 175, 22, '#2E7D32');

  desenhar_retangulo(260, 230, 15, 35, '#6D3B14');
  desenhar_circulo(267, 210, 22, '#2E7D32');

  desenhar_retangulo(113, 150, 74, 75, '#79441F');
  desenhar_triangulo(113, 150, 150, 112, 187, 150, '#EB5E45');
  desenhar_quadrado(120, 165, 22, '#4BB5F6');
  desenhar_quadrado(158, 165, 22, '#4BB5F6');
  desenhar_retangulo(143, 188, 15, 37, '#5C3214');
}

document.addEventListener('DOMContentLoaded', () => {
  desenhar_composicao_geometrica();

  const btnPrincipal = document.getElementById('btnDesenhoPrincipal');
  const btnPaisagem = document.getElementById('btnDesenhoPaisagem');

  if (btnPrincipal && btnPaisagem) {
    btnPrincipal.addEventListener('click', () => {
      btnPrincipal.classList.add('btn-ativo');
      btnPaisagem.classList.remove('btn-ativo');
      desenhar_composicao_geometrica();
    });

    btnPaisagem.addEventListener('click', () => {
      btnPaisagem.classList.add('btn-ativo');
      btnPrincipal.classList.remove('btn-ativo');
      desenhar_paisagem_casa();
    });
  }
});