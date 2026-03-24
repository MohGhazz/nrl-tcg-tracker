
const STORAGE_KEY = 'nrl-league-heroes-tracker-v3';
const ACTIVE_TAB_KEY = 'nrl-league-heroes-active-tab-v3';
const CARDS = window.NRLHEROES_DATA.cards;
const META = window.NRLHEROES_DATA.meta;

const TEAM_THEMES = {
  broncos: ['#6f1d46', '#f7c948'],
  raiders: ['#0f6b3d', '#9fe870'],
  bulldogs: ['#1f6feb', '#dbeafe'],
  sharks: ['#0d9488', '#e2e8f0'],
  dolphins: ['#bb2e7e', '#27c1c3'],
  titans: ['#1783d1', '#0f2f70'],
  'sea-eagles': ['#7c2d4f', '#f1e5ee'],
  storm: ['#5b3db4', '#b79df5'],
  knights: ['#c62828', '#1d4ed8'],
  cowboys: ['#0f2b75', '#f4c542'],
  eels: ['#1d4ed8', '#facc15'],
  panthers: ['#111827', '#ef4444'],
  rabbitohs: ['#047857', '#b91c1c'],
  dragons: ['#b91c1c', '#f5f5f5'],
  roosters: ['#c1121f', '#1d4ed8'],
  warriors: ['#111827', '#10b981'],
  tigers: ['#f97316', '#111827'],
  special: ['#334155', '#94a3b8'],
};

const SUBSET_TONES = {
  'Base NRL': '#5b8cff',
  'Base NRLW': '#f472b6',
  'Luminous NRL': '#2dd4bf',
  'Luminous NRLW': '#fb7185',
  'League Heads': '#f59e0b',
  'Game Breakers NRL': '#ef4444',
  'Game Breakers NRLW': '#fb7185',
  Bang: '#8b5cf6',
  'Colours Die Cut': '#60a5fa',
  'TRYumph Red': '#ef4444',
  Gladiators: '#f97316',
  Mercury: '#38bdf8',
  'TRYumph Gold': '#facc15',
  'Dally M Predictor Gold': '#facc15',
  'Dally M Rookie Predictor Gold': '#facc15',
  'State of Origin Predictor Gold': '#06b6d4',
  'Premiership Predictor Gold': '#facc15',
  'Clive Churchill Predictor Gold': '#facc15',
  'Golden Treasure': '#fde047',
  'Instant Win': '#e879f9',
  'League Heads Stars': '#f59e0b',
  'Game Breakers Pink': '#ec4899',
  'Bang Gold': '#f59e0b',
};

const els = {
  ownedCount: document.getElementById('ownedCount'),
  percentComplete: document.getElementById('percentComplete'),
  totalCount: document.getElementById('totalCount'),
  missingCount: document.getElementById('missingCount'),
  duplicateCount: document.getElementById('duplicateCount'),
  wantedCount: document.getElementById('wantedCount'),
  progressFill: document.getElementById('progressFill'),
  searchInput: document.getElementById('searchInput'),
  leagueFilter: document.getElementById('leagueFilter'),
  subsetFilter: document.getElementById('subsetFilter'),
  teamFilter: document.getElementById('teamFilter'),
  rarityFilter: document.getElementById('rarityFilter'),
  statusFilter: document.getElementById('statusFilter'),
  sortFilter: document.getElementById('sortFilter'),
  clearFiltersBtn: document.getElementById('clearFiltersBtn'),
  resetBtn: document.getElementById('resetBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importInput: document.getElementById('importInput'),
  pageTitle: document.getElementById('pageTitle'),
  visibleSummary: document.getElementById('visibleSummary'),
  subsetCountPill: document.getElementById('subsetCountPill'),
  teamCountPill: document.getElementById('teamCountPill'),
  setSummaryTitle: document.getElementById('setSummaryTitle'),
  setSummaryText: document.getElementById('setSummaryText'),
  overviewChecklistCount: document.getElementById('overviewChecklistCount'),
  overviewRecentCount: document.getElementById('overviewRecentCount'),
  subsetVisiblePill: document.getElementById('subsetVisiblePill'),
  subsetProgressGrid: document.getElementById('subsetProgressGrid'),
  recentActivity: document.getElementById('recentActivity'),
  checklistGrid: document.getElementById('checklistGrid'),
  binderGrid: document.getElementById('binderGrid'),
  teamsGrid: document.getElementById('teamsGrid'),
  wishlistGrid: document.getElementById('wishlistGrid'),
  tradeGrid: document.getElementById('tradeGrid'),
  wishlistPill: document.getElementById('wishlistPill'),
  tradePill: document.getElementById('tradePill'),
  checklistPrevBtn: document.getElementById('checklistPrevBtn'),
  checklistNextBtn: document.getElementById('checklistNextBtn'),
  checklistPageLabel: document.getElementById('checklistPageLabel'),
  binderPrevBtn: document.getElementById('binderPrevBtn'),
  binderNextBtn: document.getElementById('binderNextBtn'),
  binderPageLabel: document.getElementById('binderPageLabel'),
  tabs: document.getElementById('tabs'),
  cardDialog: document.getElementById('cardDialog'),
  dialogSubset: document.getElementById('dialogSubset'),
  dialogTitle: document.getElementById('dialogTitle'),
  dialogTeamLine: document.getElementById('dialogTeamLine'),
  dialogCode: document.getElementById('dialogCode'),
  dialogRarity: document.getElementById('dialogRarity'),
  dialogLeague: document.getElementById('dialogLeague'),
  dialogKind: document.getElementById('dialogKind'),
  dialogCopies: document.getElementById('dialogCopies'),
  dialogWanted: document.getElementById('dialogWanted'),
  dialogTrade: document.getElementById('dialogTrade'),
  dialogNotes: document.getElementById('dialogNotes'),
  dialogCardArt: document.getElementById('dialogCardArt'),
  closeDialogBtn: document.getElementById('closeDialogBtn'),
  quickAddBtn: document.getElementById('quickAddBtn'),
  quickRemoveBtn: document.getElementById('quickRemoveBtn'),
};

const state = {
  collection: loadCollection(),
  activeTab: localStorage.getItem(ACTIVE_TAB_KEY) || 'overview',
  checklistPage: 0,
  binderPage: 0,
  selectedCard: null,
};

function loadCollection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCollection() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.collection));
}

function getCardState(uid) {
  return state.collection[uid] || { copies: 0, wanted: false, trade: false, notes: '', updatedAt: 0 };
}

function setCardState(uid, patch) {
  const prev = getCardState(uid);
  const next = { ...prev, ...patch, updatedAt: Date.now() };
  if ((next.copies || 0) <= 0 && !next.wanted && !next.trade && !next.notes) {
    delete state.collection[uid];
  } else {
    state.collection[uid] = next;
  }
  saveCollection();
  render();
}

function clearFilters() {
  els.searchInput.value = '';
  els.leagueFilter.value = 'all';
  els.subsetFilter.value = 'all';
  els.teamFilter.value = 'all';
  els.rarityFilter.value = 'all';
  els.statusFilter.value = 'all';
  els.sortFilter.value = 'default';
  state.checklistPage = 0;
  state.binderPage = 0;
  render();
}

function populateFilters() {
  const unique = (items, field) => [...new Set(items.map(item => item[field]))].sort((a, b) => a.localeCompare(b));
  fillSelect(els.leagueFilter, ['all', ...unique(CARDS, 'league')], 'All leagues');
  fillSelect(els.subsetFilter, ['all', ...unique(CARDS, 'subset')], 'All subsets');
  fillSelect(els.teamFilter, ['all', ...unique(CARDS, 'team')], 'All teams');
  fillSelect(els.rarityFilter, ['all', ...unique(CARDS, 'rarity')], 'All rarities');
}
function fillSelect(select, values, allLabel) {
  select.innerHTML = values.map(v => {
    const label = v === 'all' ? allLabel : escapeHtml(v);
    return `<option value="${escapeAttr(v)}">${label}</option>`;
  }).join('');
}

function matchesSearch(card, query) {
  if (!query) return true;
  const hay = [card.title, card.team, card.subset, card.code, card.rarity, card.league].join(' ').toLowerCase();
  return hay.includes(query.toLowerCase());
}

function applyFilters(cards) {
  const query = els.searchInput.value.trim();
  const status = els.statusFilter.value;
  const sort = els.sortFilter.value;
  let filtered = cards.filter(card => {
    const st = getCardState(card.uid);
    const owned = (st.copies || 0) > 0;
    const dupes = (st.copies || 0) > 1;
    if (els.leagueFilter.value !== 'all' && card.league !== els.leagueFilter.value) return false;
    if (els.subsetFilter.value !== 'all' && card.subset !== els.subsetFilter.value) return false;
    if (els.teamFilter.value !== 'all' && card.team !== els.teamFilter.value) return false;
    if (els.rarityFilter.value !== 'all' && card.rarity !== els.rarityFilter.value) return false;
    if (!matchesSearch(card, query)) return false;
    if (status === 'owned' && !owned) return false;
    if (status === 'missing' && owned) return false;
    if (status === 'dupes' && !dupes) return false;
    if (status === 'wanted' && !st.wanted) return false;
    if (status === 'trade' && !st.trade) return false;
    return true;
  });

  filtered.sort((a, b) => {
    const sa = getCardState(a.uid);
    const sb = getCardState(b.uid);
    if (sort === 'code') return a.order - b.order || a.numberSort - b.numberSort;
    if (sort === 'name') return a.title.localeCompare(b.title) || a.order - b.order;
    if (sort === 'team') return a.team.localeCompare(b.team) || a.order - b.order;
    if (sort === 'updated') return (sb.updatedAt || 0) - (sa.updatedAt || 0) || a.order - b.order;
    return a.order - b.order;
  });
  return filtered;
}

function cardStatus(card) {
  const st = getCardState(card.uid);
  if ((st.copies || 0) > 1) return { label: `Dupes · ${st.copies}`, cls: 'status-dup' };
  if ((st.copies || 0) > 0) return { label: 'Owned', cls: 'status-owned' };
  return { label: 'Missing', cls: 'status-missing' };
}

function statusSummary() {
  const owned = CARDS.filter(c => (getCardState(c.uid).copies || 0) > 0).length;
  const missing = CARDS.length - owned;
  const dupes = CARDS.filter(c => (getCardState(c.uid).copies || 0) > 1).length;
  const wanted = CARDS.filter(c => getCardState(c.uid).wanted).length;
  return { owned, missing, dupes, wanted, percent: Math.round((owned / CARDS.length) * 100) || 0 };
}

function renderHeader(visibleCards) {
  const stats = statusSummary();
  const visibleTeams = new Set(visibleCards.map(c => c.team)).size;
  const visibleSubsets = new Set(visibleCards.map(c => c.subset)).size;
  els.ownedCount.textContent = stats.owned.toLocaleString();
  els.percentComplete.textContent = `${stats.percent}%`;
  els.totalCount.textContent = CARDS.length.toLocaleString();
  els.missingCount.textContent = stats.missing.toLocaleString();
  els.duplicateCount.textContent = stats.dupes.toLocaleString();
  els.wantedCount.textContent = stats.wanted.toLocaleString();
  els.progressFill.style.width = `${stats.percent}%`;
  els.visibleSummary.textContent = `${visibleCards.length.toLocaleString()} cards visible • ${visibleTeams} teams • ${visibleSubsets} subsets`;
  els.subsetCountPill.textContent = `${META.subsetCount} subsets`;
  els.teamCountPill.textContent = `${META.teamCount} teams`;
  els.setSummaryTitle.textContent = META.setName;
  els.setSummaryText.textContent = `${META.totalCards.toLocaleString()} cards loaded across ${META.subsetCount} checklist groupings.`;
  els.overviewChecklistCount.textContent = META.totalCards.toLocaleString();
}

function renderSubsetProgress(visibleCards) {
  const grouped = groupBy(visibleCards, c => c.subset);
  const entries = Object.entries(grouped).map(([subset, cards]) => {
    const owned = cards.filter(c => (getCardState(c.uid).copies || 0) > 0).length;
    const percent = Math.round((owned / cards.length) * 100) || 0;
    return { subset, cards, owned, percent };
  }).sort((a, b) => b.cards.length - a.cards.length || a.subset.localeCompare(b.subset));
  els.subsetVisiblePill.textContent = `${entries.length} visible subsets`;
  els.subsetProgressGrid.innerHTML = entries.map(entry => `
    <article class="subset-card">
      <h4>${escapeHtml(entry.subset)}</h4>
      <p class="subset-meta">${entry.owned}/${entry.cards.length} owned • ${entry.percent}% complete</p>
      <div class="inline-bar"><div style="width:${entry.percent}%; background: linear-gradient(90deg, ${subsetTone(entry.subset)}, var(--accent-2));"></div></div>
    </article>
  `).join('') || `<p class="subtle">No cards match the current filters.</p>`;
}

function renderRecentActivity() {
  const entries = CARDS
    .map(card => ({ card, state: getCardState(card.uid) }))
    .filter(entry => entry.state.updatedAt)
    .sort((a, b) => b.state.updatedAt - a.state.updatedAt)
    .slice(0, 8);

  els.overviewRecentCount.textContent = entries.length.toString();
  els.recentActivity.innerHTML = entries.map(({ card, state }) => `
    <article class="activity-item">
      <h4>${escapeHtml(card.title)}</h4>
      <p>${escapeHtml(card.code)} • ${escapeHtml(card.team)} • ${new Date(state.updatedAt).toLocaleString()}</p>
    </article>
  `).join('') || `<p class="subtle">No recent activity yet. Start tapping cards into your collection.</p>`;
}

function renderChecklist(visibleCards) {
  const pageSize = 72;
  const pages = Math.max(1, Math.ceil(visibleCards.length / pageSize));
  state.checklistPage = clamp(state.checklistPage, 0, pages - 1);
  const start = state.checklistPage * pageSize;
  const slice = visibleCards.slice(start, start + pageSize);
  els.checklistPageLabel.textContent = `Page ${state.checklistPage + 1} / ${pages}`;
  els.checklistGrid.innerHTML = slice.map(renderCardTile).join('') || emptyMessage('No cards on this page.');
  els.checklistPrevBtn.disabled = state.checklistPage === 0;
  els.checklistNextBtn.disabled = state.checklistPage === pages - 1;
}

function renderBinder(visibleCards) {
  const pageSize = 9;
  const pages = Math.max(1, Math.ceil(visibleCards.length / pageSize));
  state.binderPage = clamp(state.binderPage, 0, pages - 1);
  const start = state.binderPage * pageSize;
  const slice = visibleCards.slice(start, start + pageSize);
  els.binderPageLabel.textContent = `Binder page ${state.binderPage + 1} / ${pages}`;
  const cards = [...slice];
  while (cards.length < 9) cards.push(null);
  els.binderGrid.innerHTML = cards.map(card => {
    if (!card) return `<div class="binder-slot"><div class="binder-empty">Empty pocket</div></div>`;
    return `<div class="binder-slot">${renderCardShell(card, true)}</div>`;
  }).join('');
  els.binderPrevBtn.disabled = state.binderPage === 0;
  els.binderNextBtn.disabled = state.binderPage === pages - 1;
}

function renderTeams(visibleCards) {
  const grouped = groupBy(visibleCards, c => c.team);
  const entries = Object.entries(grouped).map(([team, cards]) => {
    const owned = cards.filter(c => (getCardState(c.uid).copies || 0) > 0).length;
    const percent = Math.round((owned / cards.length) * 100) || 0;
    return { team, badge: cards[0].badge, league: cards[0].league, total: cards.length, owned, percent };
  }).sort((a, b) => a.team.localeCompare(b.team));
  els.teamsGrid.innerHTML = entries.map(entry => `
    <article class="team-card">
      <div class="team-head">
        <img class="team-badge" src="assets/team-badges/${entry.badge}.svg" alt="${escapeAttr(entry.team)} badge" />
        <div>
          <h4>${escapeHtml(entry.team)}</h4>
          <p class="team-meta">${escapeHtml(entry.league)} • ${entry.owned}/${entry.total} owned</p>
        </div>
      </div>
      <div class="inline-bar"><div style="width:${entry.percent}%;"></div></div>
      <p class="team-meta">${entry.percent}% complete</p>
    </article>
  `).join('') || `<p class="subtle">No team data for the current filters.</p>`;
}

function renderTrades(visibleCards) {
  const wishlist = visibleCards.filter(c => getCardState(c.uid).wanted);
  const trade = visibleCards.filter(c => getCardState(c.uid).trade);
  els.wishlistPill.textContent = wishlist.length.toString();
  els.tradePill.textContent = trade.length.toString();
  els.wishlistGrid.innerHTML = wishlist.map(renderStackCard).join('') || emptyMessage('No wanted cards in the current view.');
  els.tradeGrid.innerHTML = trade.map(renderStackCard).join('') || emptyMessage('No trade cards in the current view.');
}

function renderCardShell(card, compact = false) {
  const st = getCardState(card.uid);
  const status = cardStatus(card);
  const buttonLabel = (st.copies || 0) > 0 ? `+1 copy` : 'Add owned';
  return `
    <article class="${compact ? '' : 'card-tile'}" data-uid="${escapeAttr(card.uid)}">
      ${compact ? '' : `<div class="card-topline"><span class="card-code">${escapeHtml(card.number)}</span><span class="card-status ${status.cls}">${status.label}</span></div>`}
      ${renderCardArt(card)}
      <div class="card-body">
        <h4 class="card-title">${escapeHtml(card.title)}</h4>
        <p class="card-meta-line">${escapeHtml(card.team)} • ${escapeHtml(card.subset)}</p>
        <div class="card-actions">
          <button data-action="add" data-uid="${escapeAttr(card.uid)}">${buttonLabel}</button>
          <button data-action="open" data-uid="${escapeAttr(card.uid)}">Details</button>
        </div>
      </div>
    </article>
  `;
}

function renderCardTile(card) {
  return renderCardShell(card, false);
}

function renderCardArt(card) {
  const [a, b] = teamTheme(card.badge);
  return `
    <div class="card-art" style="--team-a:${a}; --team-b:${b};">
      <span class="card-art-kicker" style="border-color:${subsetTone(card.subset)}; box-shadow: inset 0 0 0 1px ${subsetTone(card.subset)}22;">${escapeHtml(card.subset)}</span>
      <img class="card-art-badge" src="assets/team-badges/${card.badge}.svg" alt="${escapeAttr(card.team)} badge" />
      <div class="card-art-title">${escapeHtml(card.title)}</div>
      <div class="card-art-sub">${escapeHtml(card.code)} • ${escapeHtml(card.team)}</div>
    </div>
  `;
}

function renderStackCard(card) {
  const st = getCardState(card.uid);
  return `
    <article class="stack-card">
      <div class="stack-row">
        <div>
          <h4>${escapeHtml(card.title)}</h4>
          <p>${escapeHtml(card.code)} • ${escapeHtml(card.team)}</p>
        </div>
        <span class="pill">${st.copies || 0} copies</span>
      </div>
      <div class="meta-row">
        <span class="pill">${escapeHtml(card.subset)}</span>
        <span class="pill">${escapeHtml(card.rarity)}</span>
      </div>
    </article>
  `;
}

function openCard(uid) {
  const card = CARDS.find(c => c.uid === uid);
  if (!card) return;
  const st = getCardState(card.uid);
  state.selectedCard = card;
  els.dialogSubset.textContent = card.subset;
  els.dialogTitle.textContent = card.title;
  els.dialogTeamLine.textContent = `${card.team} • ${card.code}`;
  els.dialogCode.textContent = card.number;
  els.dialogRarity.textContent = card.rarity;
  els.dialogLeague.textContent = card.league;
  els.dialogKind.textContent = card.kind.toUpperCase();
  els.dialogCopies.value = st.copies || 0;
  els.dialogWanted.checked = !!st.wanted;
  els.dialogTrade.checked = !!st.trade;
  els.dialogNotes.value = st.notes || '';
  els.dialogCardArt.innerHTML = renderCardArt(card);
  els.cardDialog.showModal();
}

function updateSelectedCard() {
  if (!state.selectedCard) return;
  setCardState(state.selectedCard.uid, {
    copies: Number(els.dialogCopies.value || 0),
    wanted: els.dialogWanted.checked,
    trade: els.dialogTrade.checked,
    notes: els.dialogNotes.value.trim(),
  });
}

function render() {
  setActiveTab(state.activeTab);
  const visibleCards = applyFilters(CARDS);
  renderHeader(visibleCards);
  renderSubsetProgress(visibleCards);
  renderRecentActivity();
  renderChecklist(visibleCards);
  renderBinder(visibleCards);
  renderTeams(visibleCards);
  renderTrades(visibleCards);
}

function setActiveTab(tabName) {
  state.activeTab = tabName;
  localStorage.setItem(ACTIVE_TAB_KEY, tabName);
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === `${tabName}Tab`));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
  const titles = {
    overview: 'Collection Overview',
    checklist: 'Checklist',
    binder: 'Binder View',
    teams: 'Team Progress',
    trades: 'Trade Lists',
  };
  els.pageTitle.textContent = titles[tabName] || 'NRL League Heroes Tracker';
}

function teamTheme(badge) {
  return TEAM_THEMES[badge] || TEAM_THEMES.special;
}
function subsetTone(subset) {
  return SUBSET_TONES[subset] || '#5b8cff';
}
function groupBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function emptyMessage(msg) {
  return `<p class="subtle">${escapeHtml(msg)}</p>`;
}
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function escapeAttr(value) { return escapeHtml(value); }

function bindEvents() {
  [els.searchInput, els.leagueFilter, els.subsetFilter, els.teamFilter, els.rarityFilter, els.statusFilter, els.sortFilter].forEach(el => {
    el.addEventListener('input', () => {
      state.checklistPage = 0;
      state.binderPage = 0;
      render();
    });
    el.addEventListener('change', () => {
      state.checklistPage = 0;
      state.binderPage = 0;
      render();
    });
  });

  els.clearFiltersBtn.addEventListener('click', clearFilters);

  els.resetBtn.addEventListener('click', () => {
    if (!confirm('Reset your saved collection for version 3?')) return;
    state.collection = {};
    saveCollection();
    render();
  });

  els.exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ version: 3, exportedAt: new Date().toISOString(), collection: state.collection }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nrl-league-heroes-v3-collection.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  els.importInput.addEventListener('change', async (event) => {
    const [file] = event.target.files || [];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      state.collection = parsed.collection || parsed;
      saveCollection();
      render();
      alert('Collection imported.');
    } catch {
      alert('Could not import that JSON file.');
    } finally {
      event.target.value = '';
    }
  });

  els.tabs.addEventListener('click', (event) => {
    const btn = event.target.closest('.tab-btn');
    if (!btn) return;
    setActiveTab(btn.dataset.tab);
    render();
  });

  const grids = [els.checklistGrid, els.binderGrid];
  grids.forEach(grid => grid.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { uid, action } = button.dataset;
    const st = getCardState(uid);
    if (action === 'add') {
      setCardState(uid, { ...st, copies: (st.copies || 0) + 1 });
    }
    if (action === 'open') {
      openCard(uid);
    }
  }));

  els.checklistPrevBtn.addEventListener('click', () => { state.checklistPage -= 1; render(); });
  els.checklistNextBtn.addEventListener('click', () => { state.checklistPage += 1; render(); });
  els.binderPrevBtn.addEventListener('click', () => { state.binderPage -= 1; render(); });
  els.binderNextBtn.addEventListener('click', () => { state.binderPage += 1; render(); });

  els.closeDialogBtn.addEventListener('click', () => els.cardDialog.close());
  els.quickAddBtn.addEventListener('click', () => {
    if (!state.selectedCard) return;
    const st = getCardState(state.selectedCard.uid);
    els.dialogCopies.value = (st.copies || 0) + 1;
    updateSelectedCard();
    openCard(state.selectedCard.uid);
  });
  els.quickRemoveBtn.addEventListener('click', () => {
    if (!state.selectedCard) return;
    const st = getCardState(state.selectedCard.uid);
    els.dialogCopies.value = Math.max(0, (st.copies || 0) - 1);
    updateSelectedCard();
    openCard(state.selectedCard.uid);
  });

  [els.dialogCopies, els.dialogWanted, els.dialogTrade, els.dialogNotes].forEach(el => {
    const type = el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(type, updateSelectedCard);
  });

  els.cardDialog.addEventListener('close', () => { state.selectedCard = null; });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}

populateFilters();
bindEvents();
setActiveTab(state.activeTab);
render();
