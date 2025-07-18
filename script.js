const niveis = [
  "forca", "programa", "computador", "javascript", "teclado",
  "monitor", "mouse", "internet", "pagina", "codigo",
  "software", "hardware", "rede", "banco", "dados",
  "login", "senha", "perfil", "usuario", "navegador"
];

let nivelAtual = 0;
let palavraSelecionada = "";
let letrasCorretas = [];
let erros = 0;
const maxErros = 6;

function startGame() {
  if (nivelAtual >= niveis.length) {
    document.getElementById("jogo").style.display = "none";
    document.getElementById("parabens").style.display = "flex";
    iniciarFogos();
    return;
  }

  palavraSelecionada = niveis[nivelAtual];
  letrasCorretas = [];
  erros = 0;
  updateWordDisplay();
  updateHangmanImage();
  document.getElementById("message").textContent = "";
  createLetterButtons();
  document.getElementById("nivel-atual").textContent = `Nível: ${nivelAtual + 1} de ${niveis.length}`;
}

function updateWordDisplay() {
  const display = palavraSelecionada
    .split("")
    .map(letra => (letrasCorretas.includes(letra) ? letra : "_"))
    .join(" ");
  document.getElementById("word-display").textContent = display;

  if (!display.includes("_")) {
    nivelAtual++;
    document.getElementById("message").textContent = `Você venceu o nível ${nivelAtual}! Avançando...`;
    disableAllButtons();

    setTimeout(() => {
      startGame();
      document.getElementById("message").textContent = "";
    }, 2000);
  }
}

function createLetterButtons() {
  const lettersDiv = document.getElementById("letters");
  lettersDiv.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letra = String.fromCharCode(i).toLowerCase();
    const btn = document.createElement("button");
    btn.textContent = letra;
    btn.onclick = () => guessLetter(letra, btn);
    lettersDiv.appendChild(btn);
  }
}

function guessLetter(letra, btn) {
  btn.disabled = true;
  if (palavraSelecionada.includes(letra)) {
    if (!letrasCorretas.includes(letra)) {
      letrasCorretas.push(letra);
    }
    updateWordDisplay();
  } else {
    erros++;
    updateHangmanImage();
    if (erros >= maxErros) {
      document.getElementById("message").textContent = `Você perdeu! A palavra era: ${palavraSelecionada}. Voltando ao nível 1.`;
      disableAllButtons();
      setTimeout(() => {
        nivelAtual = 0;
        startGame();
        document.getElementById("message").textContent = "";
      }, 3000);
    }
  }
}

function updateHangmanImage() {
  document.getElementById("hangman-img").className = "forca" + erros;
}

function disableAllButtons() {
  const buttons = document.querySelectorAll("#letters button");
  buttons.forEach(btn => btn.disabled = true);
}

function reiniciarJogo() {
  nivelAtual = 0;
  document.getElementById("parabens").style.display = "none";
  document.getElementById("jogo").style.display = "block";
  startGame();
}

function iniciarFogos() {
  const canvas = document.getElementById("fogos");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let fogos = [];

  function Firework() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height / 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.radius = 2;
    this.speed = 4;
    this.exploded = false;
    this.particles = [];
  }

  Firework.prototype.update = function () {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.exploded = true;
        for (let i = 0; i < 30; i++) {
          this.particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }
    this.particles.forEach(p => p.update());
  };

  Firework.prototype.draw = function () {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    this.particles.forEach(p => p.draw());
  };

  function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.color = color;
    this.speed = Math.random() * 5 + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.alpha = 1;
  }

  Particle.prototype.update = function () {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= 0.02;
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  };

  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
      fogos.push(new Firework());
    }

    fogos.forEach(f => f.update());
    fogos.forEach(f => f.draw());

    fogos = fogos.filter(f => f.particles.some(p => p.alpha > 0) || !f.exploded);

    requestAnimationFrame(animate);
  }

  animate();
}

window.onload = () => {
  nivelAtual = 0;
  startGame();
};
