// ================================
// CONFIGURAÇÕES DO SISTEMA
// ================================

// URLs que você deve substituir pelos links reais
const CARDAPIO_URL = "https://example.com/cardapio";     // TROCAR
const PESQUISA_URL = "https://example.com/pesquisa";     // TROCAR

// Tempo de inatividade (ms)
const INACTIVITY_TIMEOUT = 90 * 1000; // 90 segundos


// ================================
// PLAYLIST DE VÍDEOS
// ================================

// Adicione quantos vídeos quiser nesta lista
const videoPlaylist = [
  "videos/video1.mp4",
  "videos/video2.mp4",
  "videos/video3.mp4"
];

let currentVideoIndex = 0;


// ================================
// ESTADOS
// ================================

const STATES = {
  IDLE: "idle",       // Apenas vídeo
  MENU: "menu",       // Menu com botões
  CONTENT: "content"  // Cardápio ou Pesquisa
};

let currentState = STATES.IDLE;
let inactivityTimer = null;


// ================================
// ELEMENTOS
// ================================

const videoEl = document.getElementById("background-video");
const videoSource = document.getElementById("video-source");

const menuOverlay = document.getElementById("menu-overlay");
const contentOverlay = document.getElementById("content-overlay");

const contentFrame = document.getElementById("content-frame");
const contentTitle = document.getElementById("content-title");

const btnCardapio = document.getElementById("btn-cardapio");
const btnPesquisa = document.getElementById("btn-pesquisa");
const btnVoltar = document.getElementById("btn-voltar");


// ================================
// FUNÇÃO: TROCA DE ESTADO
// ================================

function setState(newState) {
  currentState = newState;
  console.log("Estado →", currentState);

  switch (currentState) {
    case STATES.IDLE:
      menuOverlay.classList.add("hidden");
      contentOverlay.classList.add("hidden");
      videoEl.classList.remove("video-blurred");

      // limpa o iframe
      contentFrame.src = "about:blank";
      break;

    case STATES.MENU:
      menuOverlay.classList.remove("hidden");
      contentOverlay.classList.add("hidden");
      videoEl.classList.add("video-blurred");
      break;

    case STATES.CONTENT:
      menuOverlay.classList.add("hidden");
      contentOverlay.classList.remove("hidden");
      videoEl.classList.add("video-blurred");
      break;
  }
}


// ================================
// FUNÇÃO: PLAYLIST DE VÍDEOS
// ================================

function setupVideoPlaylist() {
  videoEl.addEventListener("ended", () => {
    currentVideoIndex = (currentVideoIndex + 1) % videoPlaylist.length;

    videoSource.src = videoPlaylist[currentVideoIndex];
    videoEl.load();
    videoEl.play().catch(() => {});
  });
}


// ================================
// FUNÇÃO: TIMER DE INATIVIDADE
// ================================

function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    setState(STATES.IDLE);
  }, INACTIVITY_TIMEOUT);
}

function handleUserInteraction() {
  resetInactivityTimer();

  if (currentState === STATES.IDLE) {
    setState(STATES.MENU);
  }
}


// ================================
// EVENTOS
// ================================

function setupEventListeners() {
  // qualquer interação do usuário
  ["click", "touchstart", "mousemove", "keydown"].forEach(evt =>
    document.addEventListener(evt, handleUserInteraction)
  );

  // botão: cardápio
  btnCardapio.addEventListener("click", e => {
    e.stopPropagation();
    contentTitle.textContent = "Cardápio";
    contentFrame.src = CARDAPIO_URL;
    setState(STATES.CONTENT);
  });

  // botão: pesquisa
  btnPesquisa.addEventListener("click", e => {
    e.stopPropagation();
    contentTitle.textContent = "Pesquisa de Satisfação";
    contentFrame.src = PESQUISA_URL;
    setState(STATES.CONTENT);
  });

  // botão: voltar
  btnVoltar.addEventListener("click", e => {
    e.stopPropagation();
    setState(STATES.IDLE);
  });
}


// ================================
// INICIALIZAÇÃO
// ================================

function init() {
  console.log("Sistema iniciado.");
  setupVideoPlaylist();
  setupEventListeners();
  setState(STATES.IDLE);     // começa no modo vídeo
  resetInactivityTimer();
}

window.addEventListener("load", init);
