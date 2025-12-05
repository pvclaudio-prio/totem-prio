// ========================================
// CONFIGURAÇÕES DO SISTEMA (SEUS LINKS)
// ========================================

const CARDAPIO_URL =
  "https://apps.powerapps.com/play/e/default-90970b25-7f3c-48b3-bf2a-99c055107797/a/80653f2e-306c-4dad-a6c8-e8d914f8dac1?tenantId=90970b25-7f3c-48b3-bf2a-99c055107797&hint=961d2266-9a54-4902-8535-7c415cd5deba&sourcetime=1748260909347&source=portal&hidenavbar=true";

const PESQUISA_URL =
  "https://forms.office.com/Pages/DesignPageV2.aspx?prevorigin=shell&origin=NeoPortalPage&subpage=design&id=JQuXkDx_s0i_KpnAVRB3l_rsk8BvsM9AvDuc1kudjcdUQ01GM0RDRzJSQlFBWDVMUFAwRlAzU1dOSi4u";

// Tempo de inatividade (ms)
const INACTIVITY_TIMEOUT = 90 * 1000; // 90 segundos



// ========================================
// PLAYLIST DE VÍDEOS
// ========================================

const videoPlaylist = [
  "videos/video1.mp4",
  "videos/video2.mp4",
  "videos/video3.mp4"
];

let currentVideoIndex = 0;



// ========================================
// ESTADOS DA APLICAÇÃO
// ========================================

const STATES = {
  IDLE: "idle",       // Vídeo passando
  MENU: "menu",       // Menu aberto
  CONTENT: "content"  // Cardápio ou pesquisa
};

let currentState = STATES.IDLE;
let inactivityTimer = null;



// ========================================
// ELEMENTOS DA TELA
// ========================================

const videoEl = document.getElementById("background-video");
const videoSource = document.getElementById("video-source");

const menuOverlay = document.getElementById("menu-overlay");
const contentOverlay = document.getElementById("content-overlay");
const contentFrame = document.getElementById("content-frame");

const btnCardapio = document.getElementById("btn-cardapio");
const btnPesquisa = document.getElementById("btn-pesquisa");



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
// PLAYLIST AUTOMÁTICA
// ========================================

function setupVideoPlaylist() {
  videoEl.addEventListener("ended", () => {
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

function handleUserInteraction() {
  resetInactivityTimer();
  if (currentState === STATES.IDLE) {
    setState(STATES.MENU);
  }
}



// ========================================
// EVENTOS
// ========================================

function setupEventListeners() {
  ["click", "touchstart"].forEach(evt =>
    document.addEventListener(evt, handleUserInteraction)
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
}



// ========================================
// INICIALIZAÇÃO
// ========================================

function init() {
  setupVideoPlaylist();
  setupEventListeners();
  setState(STATES.IDLE);
  resetInactivityTimer();
}

window.addEventListener("load", init);
