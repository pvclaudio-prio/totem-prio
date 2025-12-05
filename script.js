// ========================================
// CONFIGURAÇÕES (seus links)
// ========================================
const CARDAPIO_URL =
  "https://stgpriobi.blob.core.windows.net/cardapio-prio/cardapio.pdf#zoom=134";

const PESQUISA_URL =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=JQuXkDx_s0i_KpnAVRB3l2Tj7QFwHDhEvtEfXQO1KuNUM1M0NUZaSFFCR1Y0Q01EWUZTOERXM1NWVi4u";

const INACTIVITY_TIMEOUT = 30 * 1000; // 30 segundos



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
// ESTADOS — SEM MENU!
const STATES = {
  IDLE: "idle",       // Vídeo + botões sempre visíveis
  CONTENT: "content"  // Visualizando cardápio/formulário
};

let currentState = STATES.IDLE;
let inactivityTimer = null;



// ========================================
// ELEMENTOS DOM
// ========================================
const videoEl = document.getElementById("background-video");
const videoSource = document.getElementById("video-source");

const menuOverlay = document.getElementById("menu-overlay"); // sempre visível no IDLE
const contentOverlay = document.getElementById("content-overlay");
const contentFrame = document.getElementById("content-frame");

const btnCardapio = document.getElementById("btn-cardapio");
const btnPesquisa = document.getElementById("btn-pesquisa");
const btnVoltar = document.getElementById("btn-voltar");



// ========================================
// TROCA DE ESTADO FINAL
// ========================================
function setState(newState) {
  currentState = newState;
  console.log("Estado:", currentState);

  switch (newState) {
    case STATES.IDLE:
      // Mostrar botões, esconder conteúdo
      menuOverlay.classList.remove("hidden");
      contentOverlay.classList.add("hidden");
      videoEl.classList.remove("video-blurred");
      contentFrame.src = "about:blank";
      break;

    case STATES.CONTENT:
      // Esconder botões e mostrar conteúdo + botão voltar
      menuOverlay.classList.add("hidden");
      contentOverlay.classList.remove("hidden");
      videoEl.classList.remove("video-blurred");
      break;
  }
}



// ========================================
// PLAYLIST DE VÍDEOS
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
// INATIVIDADE — SEM MENU
// ========================================
function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    // Em qualquer estado retorna aos botões + vídeo
    setState(STATES.IDLE);
  }, INACTIVITY_TIMEOUT);
}

// Clique global apenas reseta o timer
function handleGlobalInteraction() {
  resetInactivityTimer();
}



// ========================================
// EVENTOS
// ========================================
function setupEventListeners() {
  // Reset de inatividade ao clicar em qualquer lugar
  ["click", "touchstart"].forEach(evt =>
    document.addEventListener(evt, handleGlobalInteraction)
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

  // Botão: Voltar
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
  setState(STATES.IDLE); // vídeo + botões
  resetInactivityTimer();
}

window.addEventListener("load", init);
