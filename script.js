// ========================================
// CONFIGURAÇÕES (seus links)
// ========================================

// O cardápio agora é uma IMAGEM (PNG) hospedada no GitHub
const CARDAPIO_URL = "cardapio/cardapio.png";

// Microsoft Forms com embed para evitar abrir aba nova
const PESQUISA_URL =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=JQuXkDx_s0i_KpnAVRB3l2Tj7QFwHDhEvtEfXQO1KuNUM1M0NUZaSFFCR1Y0Q01EWUZTOERXM1NWVi4u&embed=true";

const INACTIVITY_TIMEOUT = 30 * 1000;

// Sandbox ideal para o Forms (não para imagem PNG)
const FORMS_SANDBOX =
  "allow-scripts allow-forms allow-same-origin allow-downloads allow-top-navigation-by-user-activation";


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
  CONTENT: "content"
};

let currentState = STATES.IDLE;
let inactivityTimer = null;


// ========================================
// ELEMENTOS DOM
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
// ESTADOS
// ========================================
function setState(newState) {
  currentState = newState;

  switch (newState) {
    case STATES.IDLE:
      menuOverlay.classList.remove("hidden");
      contentOverlay.classList.add("hidden");
      contentFrame.src = "about:blank";
      break;

    case STATES.CONTENT:
      menuOverlay.classList.add("hidden");
      contentOverlay.classList.remove("hidden");
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
    videoEl.play().catch(() => {});
  }

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
  inactivityTimer = setTimeout(() => setState(STATES.IDLE), INACTIVITY_TIMEOUT);
}

function handleGlobalInteraction() {
  resetInactivityTimer();
}


// ========================================
// EVENTOS
// ========================================
function setupEventListeners() {
  ["click", "touchstart"].forEach(evt =>
    document.addEventListener(evt, handleGlobalInteraction)
  );

  // Cardápio (PNG)
  btnCardapio.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();

    // Para imagem, REMOVEMOS o sandbox
    contentFrame.removeAttribute("sandbox");

    contentFrame.src = CARDAPIO_URL;
    setState(STATES.CONTENT);
  });

  // Pesquisa (Forms)
  btnPesquisa.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();

    // Para Forms, precisamos DO sandbox
    contentFrame.setAttribute("sandbox", FORMS_SANDBOX);

    contentFrame.src = PESQUISA_URL;
    setState(STATES.CONTENT);
  });

  // Voltar ao vídeo
  btnVoltar.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    setState(STATES.IDLE);
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
