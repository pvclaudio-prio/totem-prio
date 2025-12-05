// ========================================
// CONFIGURAÇÕES (seus links)
// ========================================

const CARDAPIO_URL =
  "https://stgpriobi.blob.core.windows.net/cardapio-prio/cardapio.pdf";

const PESQUISA_URL = "https://forms.office.com/Pages/ResponsePage.aspx?id=JQuXkDx_s0i_KpnAVRB3l2Tj7QFwHDhEvtEfXQO1KuNUM1M0NUZaSFFCR1Y0Q01EWUZTOERXM1NWVi4u";

const INACTIVITY_TIMEOUT = 30 * 1000; // 30 segundos



// ========================================
// PLAYLIST DE VÍDEOS
// (se tiver só 1 vídeo, mantém o mesmo)
// ========================================

const videoPlaylist = [
  "videos/Eat pray love PRIO_C2_1080p_VERT.mp4",
  "videos/PRIO_Reforço Cultura PRIO_Peça 2_Tablet.mp4",
  "videos/PRIO_Reforço Cultura PRIO_Peça 3_Tablet.mp4",
  "videos/PRIO_Reforço Cultura PRIO_Peça 4_Tablet.mp4",
  "videos/PRIO_Reforço Cultura PRIO_Peça 5_Tablet.mp4",
  "videos/PRIO_Reforço Cultura PRIO_Peça 7_Tablet.mp4",
  "videos/PRIO_Reforço Cultura PRIO_Peça 9_Tablet.mp4"
];

let currentVideoIndex = 0;



// ========================================
// ESTADOS DA APLICAÇÃO
// ========================================

const STATES = {
  IDLE: "idle",       // Vídeo passando
  MENU: "menu",       // Menu aberto
  CONTENT: "content"  // Cardápio ou Pesquisa
};

let currentState = STATES.IDLE;
let inactivityTimer = null;



// ========================================
// ELEMENTOS DA PÁGINA
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
// PLAYLIST DE VÍDEOS
// ========================================

function setupVideoPlaylist() {
  // Começa no primeiro vídeo definido na playlist
  if (videoPlaylist.length > 0) {
    currentVideoIndex = 0;
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
 * - Se estiver em IDLE -> abre o menu
 * - Se estiver em MENU -> fecha o menu
 * - Se estiver em CONTENT -> ignora (usuário usa o botão Voltar)
 */
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
  // Clique/toque em qualquer lugar da tela
  ["click", "touchstart"].forEach(evt =>
    document.addEventListener(evt, handleGlobalInteraction)
  );

  // Botão: Cardápio
  btnCardapio.addEventListener("click", e => {
    e.stopPropagation(); // evita que o clique "conte" como clique global
    resetInactivityTimer();
    contentTitle.textContent = "Cardápio";
    contentFrame.src = CARDAPIO_URL;
    setState(STATES.CONTENT);
  });

  // Botão: Pesquisa
  btnPesquisa.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    contentTitle.textContent = "Pesquisa";
    contentFrame.src = PESQUISA_URL;
    setState(STATES.CONTENT);
  });

  // Botão: Voltar no head
  btnVoltar.addEventListener("click", e => {
    e.stopPropagation();
    resetInactivityTimer();
    setState(STATES.IDLE);
  });

  // Clique no fundo do menu (overlay) também fecha o menu
  menuOverlay.addEventListener("click", e => {
    // só fecha se clicou no overlay, não nos botões
    if (e.target === menuOverlay && currentState === STATES.MENU) {
      resetInactivityTimer();
      setState(STATES.IDLE);
    }
  });
}



// ========================================
// INICIALIZAÇÃO
// ========================================

function init() {
  setupVideoPlaylist();   // mantém seu comportamento atual dos vídeos
  setupEventListeners();
  setState(STATES.IDLE);
  resetInactivityTimer();
}

window.addEventListener("load", init);
