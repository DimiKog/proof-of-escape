// leaderboard.js — plain browser script (no <script> tags inside)
(function () {
  // Read base URL from global variable set in index.html, trim trailing slash
  const API = (window.POE_API_BASE || '').replace(/\/$/, '');

  const els = {
    status: document.getElementById('leaderboardStatus'),
    refreshLeaderboardBtn: document.getElementById('refreshLeaderboardBtn'),
    refreshRegisteredBtn: document.getElementById('refreshRegisteredBtn'),
    lbTbody: document.querySelector('#leaderboardTable tbody'),
    regTbody: document.querySelector('#registeredTable tbody'),
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

  async function fetchJSON(path) {
    const url = API + path;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
    return res.json();
  }

  async function loadLeaderboard() {
    if (!els.lbTbody) return;
    setStatus('Loading leaderboard…');
    try {
      const rows = await fetchJSON('/leaderboard');
      els.lbTbody.innerHTML = '';

      if (!rows || rows.length === 0) {
        els.lbTbody.innerHTML = '<tr><td colspan="4" style="padding:8px;color:#777;">No entries yet.</td></tr>';
      } else {
        rows.forEach((r, i) => {
          const tr = document.createElement('tr');

          const tdRank = document.createElement('td');
          tdRank.textContent = String(i + 1);

          const tdAddr = document.createElement('td');
          tdAddr.textContent = r.user || '';
          tdAddr.style.fontFamily = 'monospace';

          const tdSolved = document.createElement('td');
          tdSolved.textContent = r.solved_count ?? '';
          tdSolved.style.textAlign = 'right';

          const tdLast = document.createElement('td');
          tdLast.textContent = fmtDate(r.last_solved_at);

          tr.appendChild(tdRank);
          tr.appendChild(tdAddr);
          tr.appendChild(tdSolved);
          tr.appendChild(tdLast);
          els.lbTbody.appendChild(tr);
        });
      }
      setStatus('Leaderboard updated.');
    } catch (err) {
      console.error('loadLeaderboard error', err);
      setStatus('Failed to load leaderboard.', true);
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
          const tr = document.createElement('tr');

          const tdAddr = document.createElement('td');
          tdAddr.textContent = r.user || '';
          tdAddr.style.fontFamily = 'monospace';

          const tdWhen = document.createElement('td');
          tdWhen.textContent = fmtDate(r.registered_at);

          tr.appendChild(tdAddr);
          tr.appendChild(tdWhen);
          els.regTbody.appendChild(tr);
        });
      }
      setStatus('Registered users updated.');
    } catch (err) {
      console.error('loadRegistered error', err);
      setStatus('Failed to load registered users.', true);
    }
  }

  // Button wiring
  if (els.refreshLeaderboardBtn) {
    els.refreshLeaderboardBtn.addEventListener('click', loadLeaderboard);
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