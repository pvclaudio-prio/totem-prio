// ================================
// CONFIGURAÇÕES DO SISTEMA
// ================================

// TROQUE pelos links reais:
const CARDAPIO_URL = "https://example.com/cardapio";   // TROCAR
const PESQUISA_URL = "https://example.com/pesquisa";   // TROCAR

// Tempo de inatividade (ms)
const INACTIVITY_TIMEOUT = 90 * 1000; // 90 segundos


// ================================
// PLAYLIST DE VÍDEOS
// ================================

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
  CONTENT: "content"  // Cardápio ou Pesquisa (iframe)
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

const btnCardapio = document.getElementById("btn-cardapio");
const btnPesquisa = document.getElementById("btn-pesquisa");


// ================================
// FUNÇÃO: TROCA DE ESTADO
// ================================

function setState(newState) {
  currentState = newState;
  console.log("Estado →", currentState);

  switch (currentState) {
    case STATES.IDLE:
      // Somente vídeo, sem blur nem overlays
      menuOverlay.classList.add("hidden");
      contentOverlay.classList.add("hidden");
      videoEl.classList.remove("video-blurred");
      contentFrame.src = "about:blank";
      break;

    case STATES.MENU:
      // Mostra botões sobre o vídeo (com blur leve)
      menuOverlay.classList.remove("hidden");
      contentOverlay.classList.add("hidden");
      videoEl.classList.add("video-blurred");
      break;

    case STATES.CONTENT:
      // Mostra iframe (cardápio ou pesquisa) em tela cheia, com vídeo desfocado ao fundo
      menuOverlay.classList.add("hidden");
      contentOverlay.classList.remove("hidden");
      videoEl.classList.add("video-blurred");
      break;
  }
}


// ================================
// PLAYLIST DE VÍDEOS
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
// TIMER DE INATIVIDADE
// ================================

function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    // se ninguém mexer, volta pro vídeo puro
    setState(STATES.IDLE);
  }, INACTIVITY_TIMEOUT);
}

// Clique/toque na tela → abre o menu (se estiver em vídeo)
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
  // Abertura do menu só em click/touch
  ["click", "touchstart"].forEach(evt =>
    document.addEventListener(evt, handleUserInteraction)
  );

  // Botão: Cardápio
  btnCardapio.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    contentFrame.src = CARDAPIO_URL;
    setState(STATES.CONTENT);
  });

  // Botão: Pesquisa
  btnPesquisa.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    contentFrame.src = PESQUISA_URL;
    setState(STATES.CONTENT);
  });
}


// ================================
// INICIALIZAÇÃO
// ================================

function init() {
  console.log("Sistema iniciado.");
  setupVideoPlaylist();
  setupEventListeners();
  setState(STATES.IDLE);     // começa só com o vídeo
  resetInactivityTimer();
}

window.addEventListener("load", init);
