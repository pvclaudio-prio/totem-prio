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
      // Somente o vídeo (sem blur)
      menuOverlay.classList.add("hidden");
      contentOverlay.classList.add("hidden");
      videoEl.classList.remove("video-blurred");
      // limpa o iframe
      contentFrame.src = "about:blank";
      break;

    case STATES.MENU:
      // Mostra botões sobre o vídeo (com blur)
      menuOverlay.classList.remove("hidden");
      contentOverlay.classList.add("hidden");
      videoEl.classList.add("video-blurred");
      break;

    case STATES.CONTENT:
      // Mostra conteúdo em iframe (com blur no vídeo de fundo)
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

// Só queremos abrir o menu quando clicar/toque na tela
function handleUserInteraction(event) {
  resetInactivityTimer();

  // Se estiver em modo vídeo, ao clicar/tocar abre o menu
  if (currentState === STATES.IDLE) {
    setState(STATES.MENU);
  }
}


// ================================
// EVENTOS
// ================================

function setupEventListeners() {
  // Apenas click e touchstart disparam abertura do menu
  ["click", "touchstart"].forEach(evt =>
    document.addEventListener(evt, handleUserInteraction)
  );

  // Botão: cardápio
  btnCardapio.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    contentTitle.textContent = "Cardápio";
    contentFrame.src = CARDAPIO_URL;
    setState(STATES.CONTENT);
  });

  // Botão: pesquisa
  btnPesquisa.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    contentTitle.textContent = "Pesquisa de Satisfação";
    contentFrame.src = PESQUISA_URL;
    setState(STATES.CONTENT);
  });

  // Botão: voltar
  btnVoltar.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
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
  setState(STATES.IDLE);     // começa no modo vídeo (sem blur)
  resetInactivityTimer();
}

window.addEventListener("load", init);
