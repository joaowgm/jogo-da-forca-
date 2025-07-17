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
    document.getElementById("message").textContent = "Parabéns! Você venceu todos os níveis!";
    document.getElementById("word-display").textContent = "";
    document.getElementById("letters").innerHTML = "";
    document.getElementById("tries-left").textContent = "";
    document.getElementById("letters-progress").textContent = "";
    document.getElementById("nivel-atual").textContent = "";
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
      // volta para o nível 1 após 3 segundos
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

window.onload = () => {
  nivelAtual = 0;
  startGame();
};
