// leaderboard.js — plain browser script (no <script> tags inside)
(function () {
  // Read base URL from global variable set in index.html, trim trailing slash
  const API = (window.POE_API_BASE || '').replace(/\/$/, '');

  let lbOffset = 0;
  const lbLimit = 20;

  const els = {
    status: document.getElementById('leaderboardStatus'),
    refreshLeaderboardBtn: document.getElementById('refreshLeaderboardBtn'),
    refreshRegisteredBtn: document.getElementById('refreshRegisteredBtn'),
    lbTbody: document.querySelector('#leaderboardTable tbody'),
    regTbody: document.querySelector('#registeredTable tbody'),
    lbPagination: null, // Will be created dynamically
  };

  function fmtDate(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return String(iso);
    }
  }

  function setStatus(msg, isError = false) {
    if (!els.status) return;
    els.status.textContent = msg || '';
    els.status.style.color = isError ? '#b00020' : '#666';
  }

  // Enhanced fetch function with better error handling
  async function fetchJSON(path) {
    const url = API + path;
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText} on ${path}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error(`JSON parsing failed for ${path}: ${err.message}`);
      }
      throw new Error(`Network or Fetch Error on ${path}: ${err.message}`);
    }
  }

  // Helper function to create a table row for a user
  function createTableRow(data, isLeaderboard = false, index = 0) {
    const tr = document.createElement('tr');
    const fullAddr = data.user || data.address || '';
    tr.setAttribute('data-user', fullAddr);

    if (isLeaderboard) {
      const tdRank = document.createElement('td');
      tdRank.textContent = String(lbOffset + index + 1);
      tr.appendChild(tdRank);
    }

    const tdAddr = document.createElement('td');
    tdAddr.textContent = fullAddr.replace(/^(.{6}).+(.{4})$/, '$1…$2');
    tdAddr.title = fullAddr;
    tdAddr.style.fontFamily = 'monospace';
    tr.appendChild(tdAddr);

    if (isLeaderboard) {
      const tdSolved = document.createElement('td');
      tdSolved.textContent = data.solved_count ?? data.solved ?? '';
      tdSolved.style.textAlign = 'right';
      tdSolved.style.fontFamily = 'monospace';
      tr.appendChild(tdSolved);

      const tdLast = document.createElement('td');
      tdLast.textContent = fmtDate(data.last_solved_at);
      tr.appendChild(tdLast);

      const tdTokens = document.createElement('td');
      tdTokens.textContent = data.poe_tokens ?? '0';
      tdTokens.style.textAlign = 'right';
      tdTokens.style.fontFamily = 'monospace';
      tr.appendChild(tdTokens);

      const tdRate = document.createElement('td');
      const completions = Number(data.solved_count ?? data.solved ?? 0);
      const tokens = Number(data.poe_tokens ?? 0);
      tdRate.textContent = tokens > 0 ? `${(completions / tokens).toFixed(2)}` : '–';
      tdRate.style.textAlign = 'right';
      tdRate.style.fontFamily = 'monospace';
      tdRate.title = "Solved quizzes per PoE token";
      tr.appendChild(tdRate);
    } else {
      const tdWhen = document.createElement('td');
      tdWhen.textContent = fmtDate(data.registered_at);
      tr.appendChild(tdWhen);
    }

    return tr;
  }

  async function loadLeaderboard() {
    if (!els.lbTbody) return;
    setStatus('Loading leaderboard…');
    try {
      const rows = await fetchJSON(`/leaderboard?limit=${lbLimit}&offset=${lbOffset}`);
      els.lbTbody.innerHTML = '';

      if (!rows || rows.length === 0) {
        els.lbTbody.innerHTML = '<tr><td colspan="6" style="padding:8px;color:#777;">No entries yet.</td></tr>';
      } else {
        rows.forEach((r, i) => {
          els.lbTbody.appendChild(createTableRow(r, true, i));
        });
      }
      setStatus('Leaderboard updated.');
      updatePaginationButtons(rows.length);

      const infoDiv = document.getElementById('leaderboardPaginationInfo');
      if (infoDiv) {
        const start = lbOffset + 1;
        const end = lbOffset + rows.length;
        infoDiv.textContent = rows.length > 0
          ? `Showing ${start}-${end}`
          : 'No entries to display';
      }

    } catch (err) {
      console.error('loadLeaderboard error', err);
      setStatus(`Failed to load leaderboard: ${err.message}`, true);
    }
  }

  async function loadRegistered() {
    if (!els.regTbody) return;
    setStatus('Loading registered users…');
    try {
      const rows = await fetchJSON('/registered');
      els.regTbody.innerHTML = '';

      if (!rows || rows.length === 0) {
        els.regTbody.innerHTML = '<tr><td colspan="2" style="padding:8px;color:#777;">No registered users yet.</td></tr>';
      } else {
        rows.forEach((r) => {
          els.regTbody.appendChild(createTableRow(r, false));
        });
      }
      setStatus('Registered users updated.');
    } catch (err) {
      console.error('loadRegistered error', err);
      setStatus(`Failed to load registered users: ${err.message}`, true);
    }
  }

  function updatePaginationButtons(rowCount) {
    // If pagination buttons don't exist, create them once.
    if (!els.lbPagination) {
      const paginationDivId = 'leaderboardPagination';
      const paginationInfoId = 'leaderboardPaginationInfo';
      const paginationInfoHTML = `<div id="${paginationInfoId}" style="margin-top:5px;text-align:center;font-size:0.9em;color:#555;"></div>`;
      els.lbTbody.parentElement.insertAdjacentHTML('afterend', paginationInfoHTML);
      els.lbTbody.parentElement.insertAdjacentHTML('afterend', `
          <div id="${paginationDivId}" style="margin-top:10px; text-align:center;">
            <button id="prevLeaderboardPage" style="margin-right:5px; font-family: monospace;">Previous</button>
            <button id="nextLeaderboardPage" style="font-family: monospace;">Next</button>
          </div>
      `);
      els.lbPagination = document.getElementById(paginationDivId);

      // Wire up event listeners once.
      const prevBtn = document.getElementById('prevLeaderboardPage');
      const nextBtn = document.getElementById('nextLeaderboardPage');

      prevBtn.addEventListener('click', () => {
        if (lbOffset >= lbLimit) {
          lbOffset -= lbLimit;
          loadLeaderboard();
        }
      });
      nextBtn.addEventListener('click', () => {
        if (rowCount === lbLimit) {
          lbOffset += lbLimit;
          loadLeaderboard();
        }
      });

      const infoDiv = document.getElementById(paginationInfoId);
      if (infoDiv) {
        const start = lbOffset + 1;
        const end = lbOffset + rowCount;
        infoDiv.textContent = rowCount > 0
          ? `Showing ${start}-${end}`
          : 'No entries to display';
      }
    }

    // Now, just update the disabled state.
    const prevBtn = document.getElementById('prevLeaderboardPage');
    const nextBtn = document.getElementById('nextLeaderboardPage');
    if (prevBtn) prevBtn.disabled = lbOffset === 0;
    if (nextBtn) nextBtn.disabled = rowCount < lbLimit;
  }

  // Button wiring
  if (els.refreshLeaderboardBtn) {
    els.refreshLeaderboardBtn.addEventListener('click', () => {
      lbOffset = 0; // Reset offset on manual refresh
      loadLeaderboard();
    });
  }
  if (els.refreshRegisteredBtn) {
    els.refreshRegisteredBtn.addEventListener('click', loadRegistered);
  }

  function init() {
    if (!API) setStatus('API base URL not set (POE_API_BASE).', true);
    loadLeaderboard();
    loadRegistered();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();