// js/game-engine.js  → LE FICHIER QUI GÈRE TOUT
const DIFFICULTY = document.body.dataset.difficulty || "normal"; // easy | normal | difficult

let players = [
  { name: "Toi", money: 1500, position: 0, pion: localStorage.getItem('pionChoisi'), color: "#FF0000", properties: [], inJail: false },
  { name: "IA",   money: 1500, position: 0, pion: "chat",                     color: "#00FF00", properties: [], inJail: false }
];

let currentPlayer = 0;
let board = []; // On remplira les 40 cases plus tard

// ====================================
// CONFIG PAR DIFFICULTÉ
// ====================================
const IA_CONFIG = {
  easy:      { aggressiveness: 0.3,  maxBuyPrice: 200,  cheatDoubleChance: 0 },
  normal:    { aggressiveness: 0.6,  maxBuyPrice: 350,  cheatDoubleChance: 0.05 },
  difficult: { aggressiveness: 0.95, maxBuyPrice: 2000, cheatDoubleChance: 0.25 }
};

const config = IA_CONFIG[DIFFICULTY];

// ====================================
// LANCER LES DÉS (avec triche possible en difficult)
// ====================================
function rollDice() {
  let d1 = Math.floor(Math.random() * 6) + 1;
  let d2 = Math.floor(Math.random() * 6) + 1;

  // En difficult, l'IA a 25% de chance de faire un double quand elle veut
  if (currentPlayer === 1 && Math.random() < config.cheatDoubleChance) {
    d1 = d2 = Math.floor(Math.random() * 6) + 1;
  }

  const total = d1 + d2;
  const isDouble = d1 === d2;

  document.getElementById('dice-result').textContent = `${d1} + ${d2} = ${total}${isDouble ? " → DOUBLE !" : ""}`;
  movePlayer(total, isDouble);
}

// ====================================
// DÉPLACEMENT + LOGIQUE DE BASE
// ====================================
function movePlayer(steps, isDouble) {
  const player = players[currentPlayer];
  player.position = (player.position + steps) % 40;

  if (player.position + steps >= 40) {
    player.money += 200;
    alert(`${player.name} passe par Départ → +200 € !`);
  }

  updatePionPosition();
  updateUI();

  // Petite pause puis action sur la case
  setTimeout(() => {
    handleLanding();
    if (!isDouble || player.inJail) endTurn();
  }, 800);
}

function updatePionPosition() {
  players.forEach((p, i) => {
    const img = document.getElementById(`pion-${i}`);
    const pos = calculatePixelPosition(p.position);
    img.style.left = pos.x + "px";
    img.style.bottom = pos.y + "px";
  });
}

function calculatePixelPosition(pos) {
  const size = 900;
  const cell = size / 11;
  if (pos === 0) return { x: size - cell * 1.5, y: size - cell * 1.5 };
  if (pos < 10)  return { x: size - cell * (pos + 1.5), y: size - cell * 1.5 };
  if (pos < 20)  return { x: cell * 0.5, y: size - cell * (pos - 8.5) };
  if (pos < 30)  return { x: cell * (pos - 19.5), y: cell * 0.5 };
  return { x: size - cell * (pos - 28.5), y: cell * 1.5 };
}

function handleLanding() {
  const pos = players[currentPlayer].position;
  // Plus tard : on ajoutera les vraies cases ici
  alert(`${players[currentPlayer].name} arrive case ${pos} ! (bientôt achat/loyer)`);
}

function endTurn() {
  currentPlayer = 1 - currentPlayer;
  document.getElementById('current-player').textContent = players[currentPlayer].name;
  document.getElementById('roll-dice').disabled = false;
}

function updateUI() {
  document.getElementById('money-player0').textContent = players[0].money + " €";
  document.getElementById('money-player1').textContent = players[1].money + " €";
}

// Lancement
document.getElementById('roll-dice').addEventListener('click', () => {
  document.getElementById('roll-dice').disabled = true;
  rollDice();
});

// Init au chargement
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pion-0').src = `../asset/img/pion/${players[0].pion}.jpg`;
  document.getElementById('pion-1').src = `../asset/img/pion/chat.jpg`;
  updateUI();
  document.getElementById('difficulty-title').textContent = DIFFICULTY.toUpperCase();
});