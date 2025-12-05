// ========================================
// CONFIGURAÇÕES (seus links)
// ========================================

const CARDAPIO_URL =
  "https://apps.powerapps.com/play/e/default-90970b25-7f3c-48b3-bf2a-99c055107797/a/80653f2e-306c-4dad-a6c8-e8d914f8dac1?tenantId=90970b25-7f3c-48b3-bf2a-99c055107797&hint=961d2266-9a54-4902-8535-7c415cd5deba&sourcetime=1748260909347&source=portal&hidenavbar=true";

const PESQUISA_URL = "https://forms.office.com/r/ir14RyyP54";

const INACTIVITY_TIMEOUT = 90 * 1000;



// ========================================
// PLAYLIST DE VÍDEOS
// ========================================

const videoPlaylist = [
  "videos/eat_pray_love_prio_c2_1080p_vert.mp4",
  "videos/prio_reforco_cultura_peca_2_tablet.mp4",
  "videos/prio_reforco_cultura_peca_3_tablet.mp4",
  "videos/prio_reforco_cultura_peca_4_tablet.mp4",
  "videos/prio_reforco_cultura_peca_5_tablet.mp4",
  "videos/prio_reforco_cultura_peca_7_tablet.mp4",
  "videos/prio_reforco_cultura_peca_9_tablet.mp4"
];

let currentVideoIndex = 0;



// ========================================
// ESTADOS
// ========================================

const STATES = {
  IDLE: "idle",
  MENU: "menu",
  CONTENT: "content"
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



// ========================================
// TROCA DE ESTADO
// ========================================

function setState(newState) {
  currentState = newState;

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
// PLAYLIST
// ========================================

function setupVideoPlaylist() {
  if (videoPlaylist.length > 0) {
    currentVideoIndex = 0;
    videoSource.src = videoPlaylist[currentVideoIndex];
    videoEl.load();
    videoEl.play();
  }

  videoEl.addEventListener("ended", () => {
    currentVideoIndex = (currentVideoIndex + 1) % videoPlaylist.length;
    videoSource.src = videoPlaylist[currentVideoIndex];
    videoEl.load();
    videoEl.play();
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

function handleGlobalInteraction() {
  resetInactivityTimer();

  if (currentState === STATES.IDLE) {
    setState(STATES.MENU);
  } else if (currentState === STATES.MENU) {
    setState(STATES.IDLE);
  }
}



// ========================================
// EVENTOS
// ========================================

function setupEventListeners() {
  ["click", "touchstart"].forEach(evt =>
    document.addEventListener(evt, handleGlobalInteraction)
  );

  btnCardapio.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    contentFrame.src = CARDAPIO_URL;
    setState(STATES.CONTENT);
  });

  btnPesquisa.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    contentFrame.src = PESQUISA_URL;
    setState(STATES.CONTENT);
  });

  btnVoltar.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    setState(STATES.IDLE);
  });

  // Fechar menu ao clicar fora dos botões
  menuOverlay.addEventListener("click", e => {
    if (e.target === menuOverlay && currentState === STATES.MENU) {
      setState(STATES.IDLE);
    }
  });
}



// ========================================
// INIT
// ========================================

function init() {
  setupVideoPlaylist();
  setupEventListeners();
  setState(STATES.IDLE);
  resetInactivityTimer();
}

window.addEventListener("load", init);
