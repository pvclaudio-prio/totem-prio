// ========================================
// CONFIGURAÇÕES (seus links)
// ========================================

const CARDAPIO_URL =
  "https://apps.powerapps.com/play/e/default-90970b25-7f3c-48b3-bf2a-99c055107797/a/80653f2e-306c-4dad-a6c8-e8d914f8dac1?tenantId=90970b25-7f3c-48b3-bf2a-99c055107797&hint=961d2266-9a54-4902-8535-7c415cd5deba&sourcetime=1748260909347&source=portal&hidenavbar=true";

const PESQUISA_URL =
  "https://forms.office.com/r/ir14RyyP54";

const INACTIVITY_TIMEOUT = 90 * 1000; // 90s



// ========================================
// PLAYLIST DE VÍDEOS (se quiser, ajuste os nomes)
// ========================================

const videoPlaylist = [
  "videos/video1.mp4",
  "videos/video2.mp4",
  "videos/video3.mp4"
];

let currentVideoIndex = 0;


// ========================================
// ESTADOS
// ========================================

const STATES = {
  IDLE: "idle",       // vídeo passando
  MENU: "menu",       // menu com botões
  CONTENT: "content"  // cardápio / pesquisa
};

let currentState = STATES.IDLE;
let inactivityTimer = null;


// ========================================
// ELEMENTOS
// ========================================

const videoEl = document.getElementById("background-video");
const videoSource = document.getElementById("video-source");

const menuOverlay = document.getElementById("menu-overlay");
const contentOverlay = document.getElementById("content-overlay");
const contentFrame = document.getElementById("content-frame");

const btnCardapio = document.getElementById("btn-cardapio");
const btnPesquisa = document.getElementById("btn-pesquisa");
const btnVoltar = document.getElementById("btn-voltar");
const contentTitle = document.getElementById("content-title");


// ========================================
// TROCA DE ESTADO
// ========================================

function setState(newState) {
  currentState = newState;
  console.log("Estado:", currentState);

  switch (currentState) {
    case STATES.IDLE:
      menuOverlay.classList.add("hidden");
      contentOverlay.classList.add("hidden");
      videoEl.classList.remove("video-blurred");
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


// ========================================
// PLAYLIST (não mexe no que já está funcionando aí)
// ========================================

function setupVideoPlaylist() {
  // Garante que começa no vídeo 0
  currentVideoIndex = 0;
  if (videoPlaylist.length > 0) {
    videoSource.src = videoPlaylist[currentVideoIndex];
    videoEl.load();
    videoEl.play().catch(() => {});
  }

  videoEl.addEventListener("ended", () => {
    if (videoPlaylist.length === 0) return;
    currentVideoIndex = (currentVideoIndex + 1) % videoPlaylist.length;
    videoSource.src = videoPlaylist[currentVideoIndex];
    videoEl.load();
    videoEl.play().catch(() => {});
  });
}


// ========================================
// INATIVIDADE
// ========================================

function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    setState(STATES.IDLE);
  }, INACTIVITY_TIMEOUT);
}

/**
 * Clique / toque global:
 * - Quando está em IDLE -> abre o menu
 * - Em outros estados -> só reseta o timer
 */
function handleGlobalInteraction() {
  resetInactivityTimer();

  if (currentState === STATES.IDLE) {
    setState(STATES.MENU);
  }
}


// ========================================
// EVENTOS
// ========================================

function setupEventListeners() {
  // Clique/toque em qualquer lugar da tela
  ["click", "touchstart"].forEach(evt =>
    document.addEventListener(evt, handleGlobalInteraction)
  );

  // Clique nos botões do menu (impede propagação pra não reabrir/fechar indevido)
  btnCardapio.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    contentTitle.textContent = "Cardápio";
    contentFrame.src = CARDAPIO_URL;
    setState(STATES.CONTENT);
  });

  btnPesquisa.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    contentTitle.textContent = "Pesquisa";
    contentFrame.src = PESQUISA_URL;
    setState(STATES.CONTENT);
  });

  // Botão VOLTAR no head
  btnVoltar.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    setState(STATES.IDLE);
  });

  // 🔹 Clique fora dos botões fecha o menu
  menuOverlay.addEventListener("click", e => {
    // se clicou diretamente no overlay (fundo), e não no container/botão
    if (e.target === menuOverlay) {
      resetInactivityTimer();
      setState(STATES.IDLE);
    }
  });
}


// ========================================
// INICIALIZAÇÃO
// ========================================

function init() {
  setupVideoPlaylist();   // respeita o que você já tem de vídeos
  setupEventListeners();
  setState(STATES.IDLE);
  resetInactivityTimer();
}

window.addEventListener("load", init);
