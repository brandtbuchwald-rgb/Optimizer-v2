// gearOptimizer.js
const NORMAL_POOL = [
  "ATK SPD", "Crit Chance", "Evasion", "ATK%", "Crit DMG",
  "Monster DMG", "HP%", "DEF%", "Damage Reduction"
];

const PURPLE_BY_SLOT = {
  Weapon:   ["Crit DMG +80%", "HP% +52%"],
  Helm:     ["Boss DMG +40%", "HP% +52%"],
  Belt:     ["Boss DMG +40%", "HP% +52%"],
  Ring:     ["Crit DMG +40%"],
  Necklace: ["Crit DMG +40%"],
  Chest:    ["ATK% +26%"],
  Gloves:   ["ATK% +26%"],
  Boots:    ["ATK% +26%"],
};

const CAP_STATS = ["ATK SPD","Crit Chance","Evasion"];

function buildGearSet(tier, focus){
  const slots = ["Weapon","Necklace","Helm","Chest","Ring","Belt","Gloves","Boots"];
  const result = {};

  let atkspdUsed = false; // track if we’ve already slotted ATK SPD anywhere

slots.forEach(slot=>{
  let lines = [];
  let pool = [...NORMAL_POOL];

  // Tank vs DPS priorities
  let priorities = (focus==="Tank")
    ? ["ATK SPD","Evasion","Damage Reduction","HP%","DEF%","ATK%","Crit DMG","Monster DMG"]
    : ["ATK SPD","Crit Chance","Evasion","ATK%","Crit DMG","Monster DMG","HP%","DEF%"];

  let normalCount = tier==="Primal" ? 3 : 4;

  // Purple 5th line (Abyss/Chaos only)
  if (tier==="Chaos"||tier==="Abyss") {
    let purple = PURPLE_BY_SLOT[slot] || [];
    if (purple.length) {
      lines.push(`<span style="background:#7c3aed;color:white;padding:2px 6px;border-radius:6px;font-size:12px">${purple[0]} (5th)</span>`);
    }
  }

  // Weapons cannot roll cap stats
  let banned = (slot==="Weapon") ? CAP_STATS : [];

  let capUsed = false;
  for (let stat of priorities){
    if (lines.length >= normalCount + (tier==="Chaos"||tier==="Abyss"?1:0)) break;
    if (!pool.includes(stat)) continue;
    if (banned.includes(stat)) continue;

    // global ATK SPD limit
    if (stat==="ATK SPD" && atkspdUsed) continue;
    if (stat==="ATK SPD") atkspdUsed = true;

    // one cap per piece
    if (CAP_STATS.includes(stat)){
      if (capUsed) continue;
      capUsed = true;
    }

    lines.push(stat);
    pool = pool.filter(s=>s!==stat);
  }

  result[slot] = lines;
});
// --- Render into page ---
function renderGearSet(tier, focus){
  const plan = buildGearSet(tier, focus);
  const container = document.createElement("div");
  container.className = "card gear-card"; // <-- add gear-card here
  container.innerHTML = `<div class="inner">
    <h2>Gear Layout (${tier} – ${focus})</h2>
    ${Object.entries(plan).map(([slot, lines])=>`
      <div style="margin-bottom:14px">
        <strong>${slot}</strong>
        <ul style="margin:6px 0 0 18px;padding:0">
          ${lines.map(l=>`<li>${l}</li>`).join("")}
        </ul>
      </div>
    `).join("")}
  </div>`;
  document.querySelector("main").appendChild(container);
}

// Example default call
renderGearSet("Abyss","DPS");
