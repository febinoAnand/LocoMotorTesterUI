/* =========================================================
   TractionTherm — front-end behaviour
   Everything here is UI only. Live readings are SIMULATED;
   replace `tick()` / the DEVICES store with your API/WebSocket.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Icons (rendered into <i data-icon="name">) ---------- */
  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    motor: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/><circle cx="12" cy="12" r="7"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    thermo: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0Z"/><path d="M11.5 10v7"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    wifiOff: '<path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.1-1.6M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 10.7 5M12 20h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6A17 17 0 0 0 2 12s3.5 8 10 8a10 10 0 0 0 5.4-1.6M2 2l20 20M14.1 14.1a3 3 0 0 1-4.2-4.2"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    report: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>'
  };
  const ico = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;
  function paintIcons(root) {
    (root || document).querySelectorAll("i[data-icon]").forEach((el) => {
      el.outerHTML = ico(el.dataset.icon);
    });
  }

  /* ---------- Small helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = ico("checkCircle") + "<span>" + esc(msg) + "</span>";
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    const saved = store.get("tt-theme", null);
    if (saved) document.documentElement.dataset.theme = saved;
    $$("[data-theme-toggle]").forEach((b) => {
      const sync = () => {
        const dark = document.documentElement.dataset.theme
          ? document.documentElement.dataset.theme === "dark"
          : matchMedia("(prefers-color-scheme: dark)").matches;
        b.innerHTML = ico(dark ? "sun" : "moon");
        b.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      };
      sync();
      b.addEventListener("click", () => {
        const dark = b.getAttribute("aria-label").includes("light");
        const next = dark ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        store.set("tt-theme", next);
        sync();      });
    });
  }

  /* ---------- Shell: nav drawer + clock ---------- */
  function initShell() {
    const app = $(".app");
    if (!app) return;
    $$("[data-nav-toggle]").forEach((b) => b.addEventListener("click", () => app.classList.toggle("nav-open")));
    $(".scrim") && $(".scrim").addEventListener("click", () => app.classList.remove("nav-open"));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") app.classList.remove("nav-open"); });
    const clock = $("[data-clock]");
    if (clock) {
      const f = () => (clock.textContent = new Date().toLocaleString([], { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      f(); setInterval(f, 1000);
    }
  }

  /* =========================================================
     Access control — users, roles, permissions, signed-in session
     The signed-in user's role decides what they may do; buttons
     they may not use are hidden (body.no-perm-<key>) and every
     action is checked again before it runs.
     ========================================================= */
  const PERMISSIONS = [
    { key: "view", label: "View dashboard, monitor & readings", locked: "all" },
    { key: "trigger", label: "Start / stop motor monitoring" },
    { key: "limits", label: "Edit alarm limits" },
    { key: "reports", label: "Download & print reports" },
    { key: "motors", label: "Manage motors (add, edit, assign, delete)" },
    { key: "devices", label: "Manage devices" },
    { key: "users", label: "Manage users, roles & permissions", locked: "Administrator" }
  ];
  const ADMIN_ROLE = "Administrator";
  const DEFAULT_ROLES = [
    { name: "Administrator", desc: "Full access, including users and permissions" },
    { name: "Supervisor", desc: "Runs the shed floor: devices, motors, limits and reports" },
    { name: "Operator", desc: "Starts and stops monitoring runs and prints reports" },
    { name: "Viewer", desc: "Read-only access to live readings" }
  ];
  const DEFAULT_GRANTS = {
    Administrator: PERMISSIONS.map((p) => p.key),
    Supervisor: ["view", "trigger", "limits", "reports", "motors", "devices"],
    Operator: ["view", "trigger", "reports"],
    Viewer: ["view"]
  };
  const DEFAULT_USERS = [
    { id: 1, name: "Arun Prakash", username: "admin", email: "arun.prakash@railshed.in", role: "Administrator", password: "admin", active: true, lastLogin: null },
    { id: 2, name: "Meera Iyer", username: "meera", email: "meera.iyer@railshed.in", role: "Supervisor", password: "meera123", active: true, lastLogin: null },
    { id: 3, name: "Ravi Kumar", username: "ravi", email: "ravi.kumar@railshed.in", role: "Operator", password: "ravi1234", active: true, lastLogin: null },
    { id: 4, name: "Sunil Das", username: "sunil", email: "sunil.das@railshed.in", role: "Viewer", password: "sunil123", active: true, lastLogin: null },
    { id: 5, name: "Kavya Nair", username: "kavya", email: "kavya.nair@railshed.in", role: "Operator", password: "kavya123", active: false, lastLogin: null }
  ];
  const USERS_KEY = "tt-users-v2", GRANTS_KEY = "tt-grants-v2", ROLES_KEY = "tt-roles-v1", SESSION_KEY = "tt-session";
  let ROLES = store.get(ROLES_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_ROLES));
  if (!ROLES.some((r) => r.name === ADMIN_ROLE)) ROLES.unshift(JSON.parse(JSON.stringify(DEFAULT_ROLES[0])));
  const saveRoles = () => store.set(ROLES_KEY, ROLES);
  let USERS = store.get(USERS_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_USERS));
  let GRANTS = { ...JSON.parse(JSON.stringify(DEFAULT_GRANTS)), ...store.get(GRANTS_KEY, {}) };
  const saveUsers = () => store.set(USERS_KEY, USERS);
  const saveGrants = () => store.set(GRANTS_KEY, GRANTS);
  // locked permissions are always granted
  const grantsOf = (role) => (role === ADMIN_ROLE ? PERMISSIONS.map((p) => p.key)
    : PERMISSIONS.filter((p) => p.locked === "all" || p.locked === role || (!p.locked && (GRANTS[role] || []).includes(p.key))).map((p) => p.key));
  const currentUser = () => USERS.find((u) => u.id === store.get(SESSION_KEY, null) && u.active) || null;
  const can = (perm) => { const u = currentUser(); return !!u && grantsOf(u.role).includes(perm); };
  // guard an action: returns true when allowed, otherwise tells the user why not
  const allowed = (perm) => {
    if (can(perm)) return true;
    const p = PERMISSIONS.find((x) => x.key === perm);
    toast(`Your role does not allow: ${p ? p.label.toLowerCase() : perm}`);
    return false;
  };
  const initials = (n) => String(n).trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  // mark the page with what the user may NOT do, so CSS hides those controls everywhere
  function applyPerms() {
    PERMISSIONS.forEach((p) => document.body.classList.toggle(`no-perm-${p.key}`, !can(p.key)));
    const u = currentUser();
    $$(".user-chip").forEach((chip) => {
      if (!u) return;
      chip.innerHTML = `<span class="avatar">${esc(initials(u.name))}</span><span class="who"><b>${esc(u.name)}</b><span>${esc(u.role)}</span></span>`;
      chip.title = `Signed in as ${u.username}`;
    });
  }

  /* =========================================================
     Data model
     Device → checks motors in turns: any number can be assigned, at most
              MAX_RUN (2) are monitored at once; the others wait as "Queued".
              A finished check is switched off ("Stopped") and keeps its readings.
     Motor  → 5 probes: T1, T2, T3, T4 on the motor, plus TA (ambient)
     Readings are arrays in that order: [T1, T2, T3, T4, TA]

     A motor is judged on how far its hottest probe is above ambient,
     its absolute temperature, the spread between T1–T4, the final
     temperature predicted by the heating model, and how it compares with
     the other motor on the same device. All limits are editable.
     ========================================================= */
  const DEFAULT_LIMITS = { warn: 80, crit: 100, riseWarn: 25, riseCrit: 30, devWarn: 10, devCrit: 15, ambMax: 50, partnerWarn: 8, partnerCrit: 12 };
  const LIMITS_KEY = "tt-limits-v3"; // v3: adds motor-to-motor comparison
  const LIMITS = { ...DEFAULT_LIMITS, ...store.get(LIMITS_KEY, {}) };
  const PROBES = ["T1", "T2", "T3", "T4", "TA"]; // T1–T4 on the motor, TA = ambient
  const AMB = PROBES.length - 1;                    // index of the ambient probe (TA)
  const MS = PROBES.slice(0, AMB).map((_, j) => j); // indices of the motor probes
  const hotOf = (v) => Math.max(...v.slice(0, AMB));
  const spreadOf = (v) => hotOf(v) - Math.min(...v.slice(0, AMB));
  const HIST = 90;          // live window kept per probe (used for the rate of rise)
  const STEP_MS = 2000;     // simulated sample interval
  const TREND_EVERY_MS = 60 * 1000;    // run trend chart: one point per minute

  const DEFAULT_DEVICES = [
    { id: "TMU-01", name: "Device A", location: "Loco Shed · Bay 3", ip: "192.168.10.21", fw: "2.4.1", online: true, signal: 4, interval: 2,
      motors: [
        { id: "TM-4471", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [50, 53, 51, 52, 31], runMin: 95, tau: 12 },
        { id: "TM-4472", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [57, 59, 58, 56, 32], runMin: 95, tau: 14 },
        { id: "TM-4473", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31246", base: [52, 54, 53, 51, 31], runMin: 0.5, tau: 12, active: false, queued: true }
      ] },
    { id: "TMU-02", name: "Device B", location: "Loco Shed · Bay 5", ip: "192.168.10.22", fw: "2.4.1", online: true, signal: 3, interval: 2,
      motors: [
        { id: "TM-3810", model: "HS 15250A · 3-phase AC", loco: "WAP-7 #30412", base: [66, 69, 67, 65, 33], runMin: 62, tau: 15 },
        { id: "TM-3811", model: "HS 15250A · 3-phase AC", loco: "WAP-7 #30412", base: [57, 59, 58, 57, 33], runMin: 62, tau: 15 },
        { id: "TM-5121", model: "TAO 659 · DC series", loco: "WAG-7 #27850", base: [41, 53, 48, 50, 29], runMin: 70, tau: 10, active: false },
        { id: "TM-5120", model: "TAO 659 · DC series", loco: "WAG-7 #27850", base: [61, 63, 60, 62, 29], runMin: 0.5, tau: 30, active: false, queued: true }
      ] }
  ];

  const DEV_KEY = "tt-devices-v6"; // v6: two devices, motors checked in turns (queue)
  const MAX_RUN = 2; // motors a device can check at the same time
  const isRunning = (m) => m.active !== false;
  const runningOn = (d) => d.motors.filter(isRunning);
  let DEVICES = store.get(DEV_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_DEVICES));
  const saveDevices = () => store.set(DEV_KEY, DEVICES.map((d) => ({ ...d, motors: d.motors.map(({ live, hist, trend, runStart, _th, ...m }) => m) })));

  // simulated motor warm-up: first-order heating toward its steady value with time constant tau (min)
  const warmUp = (base, amb, minutes, tau = 12) => amb + (base - amb) * (1 - Math.exp(-minutes / tau));

  function seedMotor(m) {
    const now = Date.now();
    const amb = m.base[AMB];
    m.runStart = now - (m.runMin || 25) * 60000;
    const runMinAt = (t) => (t - m.runStart) / 60000;
    m.hist = { t: Array.from({ length: HIST }, (_, i) => now - (HIST - 1 - i) * STEP_MS) };
    m.hist.v = m.base.map((b, j) => m.hist.t.map((t) => (j === AMB
      ? +(b + (Math.random() - 0.5) * 0.4).toFixed(1)
      : +(warmUp(b, amb, runMinAt(t), m.tau) + (Math.random() - 0.5) * 0.3).toFixed(1))));
    m.live = m.hist.v.map((a) => a[a.length - 1]);
    // run trend for the charts: one point per minute since the run started
    m.trend = [];
    for (let t = m.runStart; t <= now; t += TREND_EVERY_MS) {
      m.trend.push({ t, v: m.base.map((b, j) => +(j === AMB ? b + (Math.random() - 0.5) * 0.2 : warmUp(b, amb, runMinAt(t), m.tau) + (Math.random() - 0.5) * 0.25).toFixed(1)) });
    }
  }
  // motors saved before T3 / T4 existed: [S1, S2, ambient] → [T1, T2, T3, T4, TA]
  DEVICES.forEach((d) => d.motors.forEach((m) => { if (m.base && m.base.length === 3) { const [a, b, t] = m.base; m.base = [a, b, Math.round((a + b) / 2), a + 1, t]; } }));
  DEVICES.forEach((d) => d.motors.forEach(seedMotor));

  // Simulated acquisition. Replace with real data source.
  function tick() {
    const now = Date.now();
    DEVICES.forEach((d) => {
      if (!d.online) return;
      d.motors.forEach((m) => {
        if (m.active === false) return; // monitoring switched off: readings frozen
        m.hist.t.push(now); m.hist.t.shift();
        const mins = (now - m.runStart) / 60000;
        m.live = m.live.map((v, j) => {
          const noise = j === AMB ? 0.1 : 0.25; // PT100-class sensors read to about ±0.1 °C
          const target = j === AMB ? m.base[j] : warmUp(m.base[j], m.base[AMB], mins, m.tau);
          const nv = +(v + (target - v) * 0.3 + (Math.random() - 0.5) * noise).toFixed(1);
          m.hist.v[j].push(nv); m.hist.v[j].shift();
          return nv;
        });
        const lt = m.trend[m.trend.length - 1];
        if (!lt || now - lt.t >= TREND_EVERY_MS) { m.trend.push({ t: now, v: m.live.slice() }); if (m.trend.length > 600) m.trend.shift(); }
      });
    });
  }

  const runMinutes = (m) => Math.max(0, (Date.now() - m.runStart) / 60000);

  /* ---------- Thermal analysis ----------
     How motor heating is analysed in practice:
     1. Heating model — an electrical machine heats like a first-order system:
          rise(t) = Δθ∞ − (Δθ∞ − Δθ0) · e^(−t/τ)
        Δθ∞ = final (steady-state) rise above ambient, τ = thermal time constant.
        Fitting this to the readings since monitoring started predicts the final
        temperature before it is reached, and when the alarm limit would be crossed.
     2. Thermal equilibrium (IEC 60034-1) — reached when the rise changes by less
        than 2 K per hour over two successive intervals.
     3. Same-condition comparison — two motors on one device share ambient and
        load, so one running clearly hotter than its partner points to a fault.  */
  const EQ_RATE = 2;      // K per hour (IEC 60034-1 equilibrium gradient)
  const EQ_WINDOW = 15;   // minutes per interval for the equilibrium check

  // least-squares fit of rise(t) = A − (A − r0)·e^(−t/τ); grid search on τ, closed form for A and r0
  function fitHeating(pts) {
    if (pts.length < 8 || pts[pts.length - 1].x < 5) return null;
    let best = null;
    for (let tau = 1; tau <= 600; tau += tau < 60 ? 0.5 : 2) {
      // basis g = 1 − e^(−t/τ) (weight A), h = e^(−t/τ) (weight r0)
      let gg = 0, gh = 0, hh = 0, gy = 0, hy = 0;
      for (const p of pts) { const h = Math.exp(-p.x / tau), g = 1 - h; gg += g * g; gh += g * h; hh += h * h; gy += g * p.y; hy += h * p.y; }
      const det = gg * hh - gh * gh;
      if (Math.abs(det) < 1e-9) continue;
      const A = (gy * hh - hy * gh) / det, r0 = (hy * gg - gy * gh) / det;
      let sse = 0;
      for (const p of pts) { const e = p.y - (A - (A - r0) * Math.exp(-p.x / tau)); sse += e * e; }
      if (!best || sse < best.sse) best = { A, r0, tau, sse };
    }
    if (!best) return null;
    const mean = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const sst = pts.reduce((s, p) => s + (p.y - mean) ** 2, 0) || 1;
    best.r2 = Math.max(0, 1 - best.sse / sst);
    return best;
  }
  // least-squares slope of y over x (minutes), in K per hour
  const slopePerHour = (pts) => {
    const n = pts.length; if (n < 3) return null;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    pts.forEach((p) => { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; });
    const den = n * sxx - sx * sx;
    return den ? ((n * sxy - sx * sy) / den) * 60 : null;
  };

  function thermal(m) {
    const pts = [...m.trend, { t: Date.now(), v: m.live }];
    const key = pts.length + ":" + m.live.join();
    if (m._th && m._th.key === key) return m._th.val;
    const tNow = runMinutes(m), amb = m.live[AMB];
    const sensors = MS.map((j) => {
      const rise = pts.map((p) => ({ x: (p.t - m.runStart) / 60000, y: p.v[j] - p.v[AMB] }));
      const fit = fitHeating(rise);
      const now = m.live[j] - amb;
      // measured equilibrium: two successive intervals, each changing < 2 K/h
      const w2 = rise.filter((p) => p.x > tNow - EQ_WINDOW), w1 = rise.filter((p) => p.x > tNow - 2 * EQ_WINDOW && p.x <= tNow - EQ_WINDOW);
      const g1 = tNow >= 2 * EQ_WINDOW ? slopePerHour(w1) : null, g2 = tNow >= 2 * EQ_WINDOW ? slopePerHour(w2) : null;
      const eq = g1 == null || g2 == null ? null : Math.abs(g1) < EQ_RATE && Math.abs(g2) < EQ_RATE;
      const out = { now, eq, gradient: g2 };
      if (fit && fit.A > 0 && fit.tau < 600) {
        const { A, r0, tau } = fit;
        out.final = A; out.r0 = r0; out.tau = tau; out.r2 = fit.r2;
        out.confident = fit.r2 >= 0.8 && tNow >= 0.4 * tau;
        out.pct = Math.max(0, Math.min(1, now / A));
        // model gradient falls below 2 K/h at t_eq = τ·ln(60·(A − r0) / (2·τ))
        const tEq = (A - r0) > 0 ? tau * Math.log((60 * (A - r0)) / (EQ_RATE * tau)) : 0;
        out.eqIn = Math.max(0, tEq - tNow);
        // time at which the rise would reach the alarm limit
        out.alarmIn = now >= LIMITS.riseCrit ? 0 : A > LIMITS.riseCrit && A > r0 ? Math.max(0, tau * Math.log((A - r0) / (A - LIMITS.riseCrit)) - tNow) : null;
      }
      return out;
    });
    // hottest probe: highest predicted final rise (or highest rise now while the model has no fit)
    const fitted = MS.filter((j) => sensors[j].final != null);
    const hot = fitted.length ? fitted.reduce((a, j) => (sensors[j].final > sensors[a].final ? j : a)) : MS.reduce((a, j) => (sensors[j].now > sensors[a].now ? j : a));
    const val = {
      sensors, hot,
      final: sensors[hot].final, finalTemp: sensors[hot].final != null ? amb + sensors[hot].final : null,
      tau: sensors[hot].tau, confident: sensors.every((s) => s.confident),
      eq: sensors.some((s) => s.eq == null) ? null : sensors.every((s) => s.eq),
      eqIn: Math.max(...sensors.map((s) => s.eqIn ?? 0)),
      alarmIn: sensors.map((s) => s.alarmIn).filter((v) => v != null).sort((a, b) => a - b)[0] ?? null
    };
    m._th = { key, val };
    return val;
  }
  // the other motor on the same device (monitored under the same conditions)
  function partnerOf(m) {
    const d = DEVICES.find((x) => x.motors.includes(m));
    return d && d.online ? d.motors.find((x) => x !== m && isRunning(x)) || null : null;
  }
  const fmtRun = (min) => { const t = Math.max(0, Math.floor(min)); return t >= 60 ? `${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")} min` : `${t} min`; };

  /* ---------- Evaluation (motor OK / not OK) ---------- */
  const RANK = { wait: -2, stop: -1, ok: 0, warn: 1, crit: 2 };
  const lvl = (v, warn, crit) => (crit != null && v >= crit ? "crit" : warn != null && v >= warn ? "warn" : "ok");
  // L = limits to judge against (global by default, or a test's own limits)
  function evalMotor(m, L = LIMITS) {
    const amb = m.live[AMB];
    const hot = hotOf(m.live);
    const rise = hot - amb;
    const dev = spreadOf(m.live);
    const th = m.trend ? thermal(m) : null;
    const implausible = m.live.slice(0, AMB).some((v) => v < amb - 3 || v > 200); // probe colder than ambient → probe off / open circuit
    const checks = [
      { k: "Rise above ambient", d: `Hottest of T1–T4 − TA · Warn ${L.riseWarn} K · Alarm ${L.riseCrit} K`, v: rise.toFixed(1) + " K", n: rise, warn: L.riseWarn, crit: L.riseCrit },
      { k: "Motor temperature", d: `Hottest of T1–T4 · Warn ${L.warn} °C · Alarm ${L.crit} °C`, v: hot.toFixed(1) + " °C", n: hot, warn: L.warn, crit: L.crit },
      { k: "T1–T4 spread", d: `Warn ${L.devWarn} °C · Alarm ${L.devCrit} °C`, v: "Δ " + dev.toFixed(1) + " °C", n: dev, warn: L.devWarn, crit: L.devCrit }
    ];
    // heating model: warn early if the predicted final rise will pass the alarm limit
    if (th && th.final != null && th.confident) {
      checks.push({ k: "Predicted final rise", d: `Heating model · τ ${th.tau.toFixed(0)} min · Warn if it will reach ${L.riseCrit} K`, v: th.final.toFixed(1) + " K", n: th.final, warn: L.riseCrit, crit: null });
    } else checks.push({ k: "Predicted final rise", d: "Heating model needs more readings", v: "Collecting data", s: "ok" });
    // same-condition comparison with the other motor on this device
    const p = partnerOf(m);
    if (p) {
      const delta = rise - (hotOf(p.live) - p.live[AMB]);
      checks.push({ k: `Compared with ${p.id}`, d: `Same device, same conditions · Warn ${L.partnerWarn} K · Alarm ${L.partnerCrit} K hotter`, v: (delta >= 0 ? "+" : "") + delta.toFixed(1) + " K", n: Math.max(0, delta), warn: L.partnerWarn, crit: L.partnerCrit });
    }
    checks.push(
      { k: "Ambient (TA)", d: `Valid range 0 – ${L.ambMax} °C`, v: amb.toFixed(1) + " °C", n: amb, warn: L.ambMax, crit: null },
      { k: "Probe readings plausible", d: "T1 · T2 · T3 · T4 · TA reporting", v: implausible ? "Check probe" : `${PROBES.length} / ${PROBES.length}`, s: implausible ? "warn" : "ok" }
    );
    checks.forEach((c) => { if (c.n != null) c.s = lvl(c.n, c.warn, c.crit); });
    const status = checks.reduce((w, c) => (RANK[c.s] > RANK[w] ? c.s : w), "ok");
    return { hot, amb, rise, dev, th, stable: !!(th && th.eq), checks, status: m.queued ? "wait" : m.active === false ? "stop" : status, condition: status };
  }
  const allMotors = () => DEVICES.flatMap((d) => d.motors.map((m) => ({ d, m })));
  const liveMotors = () => allMotors().filter((x) => x.d.online && x.m.active !== false);
  // registered motors not assigned to any device (no readings until assigned)
  const DEFAULT_SPARE = [{ id: "TM-6002", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31250" }];
  const SPARE_KEY = "tt-spare-v1";
  let SPARE = store.get(SPARE_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_SPARE));
  const saveSpare = () => store.set(SPARE_KEY, SPARE.map(({ id, model, loco }) => ({ id, model, loco })));
  const everyMotor = () => [...allMotors(), ...SPARE.map((m) => ({ d: null, m }))];
  const findMotor = (id) => everyMotor().find((x) => x.m.id === id) || null;
  // effective sensor limits for a given ambient (rise limit usually bites before the absolute one)
  const effLimits = (L, amb) => (amb == null ? { warn: L.warn, crit: L.crit } : { warn: Math.min(L.warn, amb + L.riseWarn), crit: Math.min(L.crit, amb + L.riseCrit) });
  const tCls = (v, j, amb) => { if (j === AMB) return ""; const e = effLimits(LIMITS, amb); return v >= e.crit ? "t-crit" : v >= e.warn ? "t-warn" : ""; };

  const STATUS = {
    ok: { label: "Within limits", icon: "checkCircle" },
    warn: { label: "Warning", icon: "alert" },
    crit: { label: "Over limit", icon: "xCircle" },
    off: { label: "Offline", icon: "wifiOff" },
    stop: { label: "Stopped", icon: "pause" },
    wait: { label: "Queued", icon: "clock" }
  };
  const badge = (s, label) => `<span class="badge ${s}">${ico(STATUS[s].icon)}${esc(label || STATUS[s].label)}</span>`;

  function updateAlertCount() {
    const n = liveMotors().filter((x) => evalMotor(x.m).status !== "ok").length;
    $$("[data-alert-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
    $$("[data-alert-dot]").forEach((el) => (el.hidden = n === 0));
  }

  /* ---------- Shared fragments: see motorPanel / deviceWidget with the pages ---------- */

  /* =========================================================
     CRUD dialogs built in JS (confirm, view, motor form,
     thresholds form) so every page shares them.
     ========================================================= */
  let rerender = () => {};
  /* ---------- Motion ----------
     Readings glide from the previous sample to the new one and flash up / down;
     on page load cards fade in, bars grow and chart lines draw themselves.
     Turned off when the system asks for reduced motion. */
  const calm = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  const SHOWN = new Map(); // last value shown per reading
  function animateValues() {
    $$("[data-anim]").forEach((el) => {
      const key = el.dataset.anim, to = +el.dataset.v, from = SHOWN.get(key);
      SHOWN.set(key, to);
      if (from == null || calm.matches || Math.abs(to - from) < 0.05) return;
      const out = el.querySelector(".nv"), t0 = performance.now(), DUR = 900;
      el.classList.add(to > from ? "flash-up" : "flash-down");
      out.textContent = from.toFixed(1);
      const step = (now) => {
        if (!out.isConnected) return;
        const k = Math.min(1, (now - t0) / DUR), ease = 1 - Math.pow(1 - k, 3);
        out.textContent = (from + (to - from) * ease).toFixed(1);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  function makeDialog(id, html, wide) {
    let d = document.getElementById(id);
    if (!d) {
      d = document.createElement("dialog");
      d.id = id;
      d.className = "modal" + (wide ? " wide" : "");
      document.body.appendChild(d);
      d.addEventListener("click", (e) => { if (e.target === d) d.close("cancel"); }); // backdrop click
    }
    d.innerHTML = html;
    paintIcons(d);
    d.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => d.close("cancel")));
    return d;
  }
  const dlgHead = (title, sub) => `
    <div class="modal-head"><div><h3>${esc(title)}</h3>${sub ? `<p>${esc(sub)}</p>` : ""}</div>
      <button type="button" class="icon-btn" data-close aria-label="Close"><i data-icon="x"></i></button></div>`;

  // Promise<boolean> replacement for window.confirm
  function confirmDialog({ title, message, confirmLabel = "Delete", danger = true }) {
    return new Promise((resolve) => {
      const d = makeDialog("confirmDialog", `
        <form method="dialog" class="confirm-box">
          <div class="confirm-ico ${danger ? "crit" : "warn"}">${ico(danger ? "trash" : "alert")}</div>
          <h3>${esc(title)}</h3>
          <p>${esc(message)}</p>
          <div class="confirm-actions">
            <button type="button" class="btn" data-close ${danger ? "autofocus" : ""}>Cancel</button>
            <button type="submit" value="ok" class="btn ${danger ? "btn-danger-solid" : "btn-primary"}" ${danger ? "" : "autofocus"}>${esc(confirmLabel)}</button>
          </div>
        </form>`);
      d.classList.add("small");
      d.addEventListener("close", () => resolve(d.returnValue === "ok"), { once: true });
      d.returnValue = "";
      d.showModal();
    });
  }

  // read-only details view: rows = [[label, html], ...]
  function viewDialog({ title, sub, hero = "", rows = [], body = "", actions = "" }) {
    const d = makeDialog("viewDialog", `
      ${dlgHead(title, sub)}
      <div class="modal-body">
        ${hero}
        ${rows.length ? `<dl class="detail-list">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("")}</dl>` : ""}
        ${body}
      </div>
      <div class="modal-foot"><button type="button" class="btn" data-close>Close</button>${actions}</div>`);
    d.showModal();
    return d;
  }

  // Create / update a motor. preset = { device, slot } for create, or { device, slot, edit: true }
  function motorDialog(preset = {}) {
    if (!allowed("motors")) return;
    const cur = preset.id ? findMotor(preset.id) : null;
    const editing = cur && cur.m;
    const devOpts = DEVICES.map((x) => {
      const busy = runningOn(x).filter((m) => !(cur && cur.m === m)).length >= MAX_RUN;
      return `<option value="${esc(x.id)}">${esc(x.name)} (${esc(x.id)})${busy ? " — will be queued" : ""}</option>`;
    }).join("");
    const d = makeDialog("motorDialog", `
      <form id="motorForm" novalidate style="display:contents">
        ${dlgHead(editing ? `Edit motor ${editing.id}` : "Add motor", editing ? "Update the motor details or assign it to another device." : "Register a traction motor. Assign it to a device to start monitoring T1, T2, T3, T4 on the motor and TA (ambient).")}
        <div class="modal-body">
          <div class="form-error" id="mfError" role="alert"></div>
          <div class="form-grid">
            <div class="field"><label for="mf-id">Motor ID</label><input class="input mono" id="mf-id" name="id" placeholder="TM-0001" required autofocus></div>
            <div class="field"><label for="mf-model">Model / type</label><input class="input" id="mf-model" name="model" placeholder="3-phase AC traction motor"></div>
            <div class="field"><label for="mf-loco">Locomotive</label><input class="input" id="mf-loco" name="loco" placeholder="WAG-9 #31245"></div>
            <div class="field"><label for="mf-dev">Monitored by</label>
              <select class="select" id="mf-dev" name="device"><option value="">Not assigned</option>${devOpts}</select>
              <span class="hint">A device checks up to ${MAX_RUN} motors at a time · others wait in its queue</span></div>
          </div>
        </div>
        <div class="modal-foot"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">${editing ? "Save changes" : "Add motor"}</button></div>
      </form>`);
    const f = d.querySelector("#motorForm"), dev = f.elements.device, err = d.querySelector("#mfError");
    const want = preset.device !== undefined ? preset.device : cur ? (cur.d ? cur.d.id : "") : (DEVICES.find((x) => runningOn(x).length < MAX_RUN) || DEVICES[0] || {}).id || "";
    if ([...dev.options].some((o) => o.value === want && !o.disabled)) dev.value = want;
    if (editing) { f.elements.id.value = editing.id; f.elements.model.value = editing.model === "—" ? "" : editing.model; f.elements.loco.value = editing.loco === "—" ? "" : editing.loco; }
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = f.elements.id.value.trim().toUpperCase();
      const target = DEVICES.find((x) => x.id === dev.value) || null;
      const fail = (msg) => { err.textContent = msg; err.classList.add("show"); };
      if (!id) return fail("Motor ID is required.");
      if (everyMotor().some(({ m }) => m.id.toUpperCase() === id && m !== editing)) return fail(`Motor ${id} already exists.`);
      const info = { id, model: f.elements.model.value.trim() || "—", loco: f.elements.loco.value.trim() || "—" };
      if (editing) {
        Object.assign(editing, info);
        if (target !== cur.d) { detachMotor(cur); attachMotor(editing, target); }
      } else attachMotor({ ...info }, target);
      saveDevices(); saveSpare();
      d.close();
      const mm = target && target.motors.find((x) => x.id === id);
      toast(editing && target === cur.d ? `${id} updated` : target ? `${id} added to ${target.name}${mm && mm.queued ? " · queued" : " · checking now"}` : `${id} registered (not assigned)`);
      rerender();
    });
    d.showModal();
  }
  // take a motor off its device (or out of the unassigned list)
  function detachMotor({ d, m }) {
    if (d) d.motors = d.motors.filter((x) => x !== m);
    else SPARE = SPARE.filter((x) => x !== m);
  }
  // put a motor on a device (checking starts now if a position is free, otherwise it is queued) or into the unassigned list
  function attachMotor(m, d) {
    if (!d) { SPARE.push({ id: m.id, model: m.model, loco: m.loco }); return; }
    const p = Math.round(44 + Math.random() * 10), free = runningOn(d).length < MAX_RUN;
    delete m.slot; delete m.stoppedAt;
    Object.assign(m, { base: [p, p + 2, p + 1, p - 1, Math.round(28 + Math.random() * 4)], runMin: 0.5, tau: 12, active: free, queued: !free });
    seedMotor(m);
    d.motors.push(m);
  }

  async function deleteMotor(id) {
    if (!allowed("motors")) return;
    const x = findMotor(id);
    if (!x) return;
    const ok = await confirmDialog({ title: `Delete motor ${x.m.id}?`, message: x.d ? `It will be removed from ${x.d.name} and will no longer be monitored. This cannot be undone.` : "It will be removed from the motor register. This cannot be undone.", confirmLabel: "Delete motor" });
    if (!ok) return;
    detachMotor(x);
    saveDevices(); saveSpare();
    toast(`${x.m.id} deleted`);
    rerender();
  }

  function viewMotor(id) {
    const x = findMotor(id);
    if (!x) return;
    const { d, m } = x;
    const e = d ? evalMotor(m) : null;
    const dlg = viewDialog({
      title: m.id, sub: d ? `${d.name} · ${d.location}` : "Not assigned to a device",
      hero: d ? readings(m, d.online) : "",
      rows: [["Condition", d ? verdictPill(d.online ? e.status : "off") : `<span class="verdict-pill off">Not monitored</span>`], ["Model / type", esc(m.model)], ["Locomotive", esc(m.loco)],
        ["Monitored by", d ? `${esc(d.name)} (${esc(d.id)})` : "—"], ...(d ? [["Monitoring for", fmtRun(runMinutes(m))], ["Predicted final", e.th && e.th.confident ? `${e.th.finalTemp.toFixed(1)} °C` : "Collecting data"]] : [])],
      actions: `<button type="button" class="btn btn-danger" data-v-del>${ico("trash")}Delete</button><button type="button" class="btn" data-v-edit>${ico("edit")}Edit</button>${d ? `<a class="btn btn-primary" href="monitor.html?motor=${encodeURIComponent(m.id)}">${ico("activity")}Monitor</a>` : ""}`
    });
    dlg.querySelector("[data-v-edit]").addEventListener("click", () => { dlg.close(); motorDialog({ id: m.id }); });
    dlg.querySelector("[data-v-del]").addEventListener("click", () => { dlg.close(); deleteMotor(m.id); });
  }

  // Update thresholds (persisted)
  function limitsDialog() {
    if (!allowed("limits")) return;
    const F = [
      ["riseWarn", "Rise above ambient — warning", "K"], ["riseCrit", "Rise above ambient — alarm", "K"],
      ["warn", "Motor temperature — warning", "°C"], ["crit", "Motor temperature — alarm", "°C"],
      ["devWarn", "T1–T4 spread — warning", "°C"], ["devCrit", "T1–T4 spread — alarm", "°C"],
      ["partnerWarn", "Hotter than other motor — warning", "K"], ["partnerCrit", "Hotter than other motor — alarm", "K"],
      ["ambMax", "Ambient (TA) — maximum valid", "°C"]
    ];
    const d = makeDialog("limitsDialog", `
      <form id="limitsForm" novalidate style="display:contents">
        ${dlgHead("Edit limits", "Applied to every motor immediately. Warning must be lower than alarm.")}
        <div class="modal-body">
          <div class="form-error" id="lfError" role="alert"></div>
          <div class="form-grid">${F.map(([k, l, u]) => `
            <div class="field"><label for="lf-${k}">${l}</label>
              <div class="input-unit"><input class="input num" id="lf-${k}" name="${k}" type="number" min="0" max="300" step="0.5" value="${LIMITS[k]}" required><span>${u}</span></div></div>`).join("")}
          </div>
        </div>
        <div class="modal-foot"><button type="button" class="btn btn-ghost" id="lfReset" style="margin-right:auto">${ico("refresh")}Reset defaults</button><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">Save thresholds</button></div>
      </form>`);
    const f = d.querySelector("#limitsForm"), err = d.querySelector("#lfError");
    d.querySelector("#lfReset").addEventListener("click", () => F.forEach(([k]) => (f.elements[k].value = DEFAULT_LIMITS[k])));
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = Object.fromEntries(F.map(([k]) => [k, parseFloat(f.elements[k].value)]));
      const fail = (m) => { err.textContent = m; err.classList.add("show"); };
      if (Object.values(v).some((x) => !isFinite(x) || x <= 0)) return fail("All thresholds must be positive numbers.");
      if (v.riseWarn >= v.riseCrit) return fail("Rise warning must be lower than the alarm limit.");
      if (v.warn >= v.crit) return fail("Temperature warning must be lower than the alarm limit.");
      if (v.devWarn >= v.devCrit) return fail("T1–T4 spread warning must be lower than the alarm limit.");
      if (v.partnerWarn >= v.partnerCrit) return fail("Motor comparison warning must be lower than the alarm limit.");
      Object.assign(LIMITS, v);
      store.set(LIMITS_KEY, v);
      d.close();
      toast("Thresholds saved");
      paintLimitText();
      rerender();
    });
    d.showModal();
  }
  const paintLimitText = () => $$("[data-limit]").forEach((el) => (el.textContent = LIMITS[el.dataset.limit]));

  // delegated CRUD buttons usable on any page
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add-motor]");
    if (add) motorDialog({ device: add.dataset.addMotor || undefined });
    const ed = e.target.closest("[data-edit-motor]");
    if (ed) motorDialog({ id: ed.dataset.editMotor });
    const del = e.target.closest("[data-del-motor]");
    if (del) deleteMotor(del.dataset.delMotor);
    const vw = e.target.closest("[data-view-motor]");
    if (vw) viewMotor(vw.dataset.viewMotor);
    if (e.target.closest("[data-edit-limits]")) limitsDialog();
    const tg = e.target.closest("[data-trigger]");
    if (tg && !tg.disabled) toggleMonitoring(tg.dataset.trigger);
  });
  /* =========================================================
     Readings, Dashboard and Motors pages
     ========================================================= */
  const VERDICT_SHORT = { ok: "Good", warn: "Monitor", crit: "Not OK", off: "Offline", stop: "Stopped", wait: "Queued" };
  // monitoring on/off switch for one motor
  const triggerBtn = (m, d) => {
    const on = m.active !== false;
    return `<button type="button" class="trigger${on ? " on" : ""}" role="switch" aria-checked="${on}" data-trigger="${esc(m.id)}" ${d && !d.online ? "disabled" : ""}
      title="${on ? "Monitoring on — click to stop" : "Monitoring off — click to start a new run"}"><i></i><span>${on ? "On" : "Off"}</span></button>`;
  };
  async function toggleMonitoring(id) {
    if (!allowed("trigger")) return;
    const x = findMotor(id); if (!x || !x.d) return;
    const { d, m } = x, on = m.active !== false;
    if (!d.online) { toast(`${d.name} is offline`); return; }
    const busy = runningOn(d).filter((x) => x !== m);
    if (!on && busy.length >= MAX_RUN) {
      await confirmDialog({ title: `${d.name} is checking ${MAX_RUN} motors`, message: `${busy.map((x) => x.id).join(" and ")} are being checked now. Stop one of them when its check is finished, then start ${m.id}.`, confirmLabel: "OK", danger: false });
      return;
    }
    const ok = await confirmDialog(on
      ? { title: `Stop monitoring ${m.id}?`, message: `Readings stop and the last values and result are kept. Alarms for this motor are paused.${d.motors.some((x) => x.queued) ? " The position is then free for the next queued motor." : ""}`, confirmLabel: "Stop monitoring" }
      : { title: `Start monitoring ${m.id}?`, message: "A new run starts now: readings, trend and heating analysis begin from zero.", confirmLabel: "Start monitoring", danger: false });
    if (!ok) return;
    if (on) { m.active = false; m.stoppedAt = Date.now(); }
    else { m.active = true; m.queued = false; delete m.stoppedAt; m.runMin = 0.05; seedMotor(m); }
    saveDevices();
    toast(on ? `${m.id} monitoring stopped` : `${m.id} monitoring started`);
    rerender();
  }
  const verdictPill = (s) => `<span class="verdict-pill ${s}">${ico(STATUS[s].icon)}${VERDICT_SHORT[s]}</span>`;
  // the reason a motor isn't OK, in one line (worst first)
  const reasonOf = (e) => e.checks.filter((c) => c.s !== "ok").sort((a, b) => RANK[b.s] - RANK[a.s]).map((c) => `${c.k} ${c.v}`).join(" · ");
  const fmtMin = (v) => (v < 1 ? "< 1 min" : fmtRun(v));
  const trendText = (e) => {
    const th = e.th;
    if (!th || th.final == null) return "Heating · collecting data";
    if (th.eq) return "Thermal equilibrium";
    return `Heating · ${Math.round(th.sensors[th.hot].pct * 100)}% of final`;
  };

  // T1–T4 / TA as large digital values; motor probes also show their rise above ambient.
  // Values glide to each new sample (see animateValues) and a dot blinks when a sample arrives.
  function readings(m, online = true, size = "") {
    const amb = m.live[AMB], live = online && m.active !== false;
    return `<div class="readings ${size}">${m.live.map((v, j) => `
      <div class="reading${j === AMB ? " amb" : ""}" style="--probe:${COLORS[j]}">
        <span class="r-label"><i class="probe-key"></i>${PROBES[j]}${live ? '<i class="sample-dot" aria-hidden="true"></i>' : ""}<small>${j === AMB ? "Ambient air" : "On motor"}</small></span>
        <b class="r-value num ${online ? tCls(v, j, amb) : "muted"}"${online ? ` data-anim="${esc(m.id)}:${size}:${j}" data-v="${v}"` : ""}><span class="nv">${online ? v.toFixed(1) : "—"}</span><small>°C</small></b>
        <span class="r-sub num">${j === AMB ? "&nbsp;" : online ? `Rise ${(v - amb).toFixed(1)} K` : ""}</span>
      </div>`).join("")}</div>`;
  }
  const signalBars = (n) => `<span class="signal" aria-label="Signal ${n} of 4">${[1, 2, 3, 4].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  /* ---------- Graphs (SVG / CSS, theme-aware) ---------- */
  const COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)", "var(--series-amb)"]; // T1, T2, T3, T4, TA
  const pct = (v, max) => (Math.max(0, Math.min(1, v / max)) * 100).toFixed(2) + "%";
  const runLabel = (t, start) => `T + ${Math.max(0, Math.round((t - start) / 60000))} min`;
  const trendPoints = (m) => [...m.trend, { t: Date.now(), v: m.live }]; // minute history + the live reading

  // Line chart since monitoring started. cfg = { series: [{ name, short, color, points: [{t, v}] }], lines: [{ v, label, cls }], start, unit, height }
  function lineChart(el, cfg) {
    el._cfg = cfg;
    if (!el._init) {
      el._init = true;
      el.innerHTML = '<svg role="img"></svg><div class="chart-tip" aria-hidden="true"></div>';
      el.addEventListener("pointermove", (e) => { if (el._geo) { el._hx = el._geo.tAt(e.clientX - el.getBoundingClientRect().left); drawLine(el); } });
      el.addEventListener("pointerleave", () => { el._hx = null; drawLine(el); });
    }
    drawLine(el);
  }
  function drawLine(el) {
    const { series, lines = [], start, unit = "°C", height = 260, title = "Run trend", now = null, xfmt = null } = el._cfg;
    const svg = el.querySelector("svg"), tip = el.querySelector(".chart-tip");
    const W = Math.max(el.clientWidth, 280), H = height, M = { t: 16, r: 74, b: 28, l: 40 };
    const all = series.flatMap((s) => s.points);
    if (all.length < 2) { svg.innerHTML = ""; return; }
    const t0 = start ?? Math.min(...all.map((p) => p.t)), t1 = Math.max(...all.map((p) => p.t), t0 + 60000);
    const vals = all.map((p) => p.v).concat(lines.map((l) => l.v));
    const vmin = Math.min(...vals), lo = vmin >= 0 ? Math.max(0, Math.floor((vmin - 2) / 10) * 10) : Math.floor((vmin - 2) / 10) * 10, hi = Math.ceil((Math.max(...vals) + 2) / 10) * 10;
    const span = W - M.l - M.r;
    const x = (t) => M.l + ((t - t0) / (t1 - t0)) * span;
    const y = (v) => M.t + ((hi - v) / (hi - lo || 1)) * (H - M.t - M.b);
    el._geo = { tAt: (px) => t0 + Math.max(0, Math.min(1, (px - M.l) / span)) * (t1 - t0) };
    let out = "";
    const step = hi - lo > 60 ? 20 : hi - lo > 30 ? 10 : 5;
    for (let v = lo; v <= hi; v += step) {
      out += `<line class="${v === lo ? "baseline" : "gridline"}" x1="${M.l}" x2="${W - M.r}" y1="${y(v)}" y2="${y(v)}"/><text class="tick-label" x="${M.l - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    }
    const nx = W < 520 ? 2 : 4;
    for (let k = 0; k <= nx; k++) {
      const t = t0 + ((t1 - t0) * k) / nx;
      out += `<text class="tick-label" x="${x(t)}" y="${H - 8}" text-anchor="${k === 0 ? "start" : k === nx ? "end" : "middle"}">${xfmt ? xfmt(t) : runLabel(t, t0)}</text>`;
    }
    lines.forEach((l) => {
      if (l.v < lo || l.v > hi) return;
      out += `<line class="${l.cls}" x1="${M.l}" x2="${W - M.r}" y1="${y(l.v)}" y2="${y(l.v)}"/><text class="limit-label ${l.cls}-t" x="${M.l + 6}" y="${y(l.v) - 5}">${esc(l.label)}</text>`;
    });
    if (now != null && now < t1) out += `<line class="now-line" x1="${x(now)}" x2="${x(now)}" y1="${M.t}" y2="${H - M.b}"/><text class="now-label" x="${x(now) + 5}" y="${M.t + 10}">Now</text><text class="now-label" x="${(x(now) + W - M.r) / 2}" y="${M.t + 10}" text-anchor="middle">Predicted</text>`;
    series.forEach((s) => {
      out += `<path class="line${s.dash ? " predicted" : ""}"${s.dash ? "" : ' pathLength="1"'} style="stroke:${s.color}" d="${s.points.map((p, i) => (i ? "L" : "M") + x(p.t).toFixed(1) + " " + y(p.v).toFixed(1)).join("")}"/>`;
    });
    // direct labels at the line ends, nudged apart
    series.filter((s) => s.label === false).forEach((s) => { const p = s.points[s.points.length - 1]; out += `<circle cx="${x(p.t)}" cy="${y(p.v)}" r="3.5" style="fill:${s.color}"/>`; });
    const ends = series.filter((s) => s.label !== false).map((s) => ({ s, p: s.points[s.points.length - 1] })).map((o) => ({ ...o, ly: y(o.p.v) })).sort((a, b) => a.ly - b.ly);
    for (let i = 1; i < ends.length; i++) if (ends[i].ly - ends[i - 1].ly < 13) ends[i].ly = ends[i - 1].ly + 13;
    ends.forEach((o) => { out += `<circle cx="${x(o.p.t)}" cy="${y(o.p.v)}" r="3.5" style="fill:${o.s.color}"/><text class="end-label" x="${W - M.r + 8}" y="${o.ly + 4}">${esc(o.s.short)} ${o.p.v.toFixed(1)}</text>`; });
    if (el._hx != null) {
      const near = (pts) => pts.reduce((b, p) => (Math.abs(p.t - el._hx) < Math.abs(b.t - el._hx) ? p : b), pts[0]);
      const hits = series.map((s) => ({ s, p: near(s.points) })).filter((h) => Math.abs(h.p.t - el._hx) <= Math.max(90000, (t1 - t0) / 60));
      if (!hits.length) { tip.classList.remove("show"); svg.innerHTML = out; return; }
      const cx = x(hits[0].p.t);
      out += `<line class="crosshair" x1="${cx}" x2="${cx}" y1="${M.t}" y2="${H - M.b}"/>`;
      hits.forEach((h) => (out += `<circle class="hover-dot" cx="${x(h.p.t)}" cy="${y(h.p.v)}" r="5" style="fill:${h.s.color}"/>`));
      tip.innerHTML = `<div class="t">${hits[0].s.dash ? "Predicted · " : ""}${new Date(hits[0].p.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${runLabel(hits[0].p.t, t0)}</div>` +
        hits.map((h) => `<div class="r"><span class="sw" style="background:${h.s.color}"></span>${esc(h.s.name)}<b>${h.p.v.toFixed(1)} ${unit}</b></div>`).join("");
      tip.style.left = (cx + 200 > W ? cx - 196 : cx + 14) + "px";
      tip.style.top = M.t + "px";
      tip.classList.add("show");
    } else tip.classList.remove("show");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("aria-label", `${title}: ` + series.filter((s) => !s.dash).map((s) => `${s.name} ${s.points[s.points.length - 1].v.toFixed(1)} ${unit}`).join(", "));
    svg.innerHTML = out;
  }
  let rzTimer;
  window.addEventListener("resize", () => { clearTimeout(rzTimer); rzTimer = setTimeout(() => $$(".chart").forEach((c) => c._cfg && drawLine(c)), 120); });

  // series for a motor's run: temperatures, or rise above ambient
  function runSeries(m, mode) {
    const pts = trendPoints(m), th = thermal(m), amb = m.live[AMB], rise = mode === "rise";
    const actual = (rise ? MS : [...MS, AMB]).map((j) => ({ name: j === AMB ? "TA · ambient" : `${PROBES[j]}${rise ? " rise" : ""}`, short: PROBES[j], color: COLORS[j],
      points: pts.map((p) => ({ t: p.t, v: +(rise ? p.v[j] - p.v[AMB] : p.v[j]).toFixed(1) })) }));
    if (!th.confident) return actual;
    // predicted continuation from the fitted heating curve, up to equilibrium (15–90 min ahead)
    const now = Date.now(), tNow = runMinutes(m), ahead = Math.min(90, Math.max(15, th.eqIn + 10));
    const pred = MS.map((j) => {
      const sn = th.sensors[j], r0 = sn.r0 ?? 0, points = [];
      for (let k = 0; k <= ahead; k++) {
        const t = tNow + k, r = sn.final - (sn.final - r0) * Math.exp(-t / sn.tau);
        points.push({ t: now + k * 60000, v: +(rise ? r : amb + r).toFixed(1) });
      }
      return { name: `${PROBES[j]} predicted`, short: `${PROBES[j]} final`, color: COLORS[j], dash: true, points };
    });
    actual.forEach((s, j) => { if (j < AMB) s.label = false; });
    return [...actual, ...pred];
  }
  function runLines(m, mode) {
    const amb = m.live[AMB];
    return mode === "rise"
      ? [{ v: LIMITS.riseWarn, label: `Warning ${LIMITS.riseWarn} K`, cls: "limit-warn" }, { v: LIMITS.riseCrit, label: `Alarm ${LIMITS.riseCrit} K`, cls: "limit" }]
      : [{ v: amb + LIMITS.riseWarn, label: `Warning: ambient + ${LIMITS.riseWarn} K`, cls: "limit-warn" }, { v: amb + LIMITS.riseCrit, label: `Alarm: ambient + ${LIMITS.riseCrit} K`, cls: "limit" }];
  }

  // small trend line of the hotter sensor, with the alarm level dashed
  function sparkRun(m, status) {
    const pts = trendPoints(m), amb = m.live[AMB];
    const v = pts.map((p) => hotOf(p.v)), fail = amb + LIMITS.riseCrit;
    const lo = Math.min(...v, amb) - 2, hi = Math.max(...v, fail) + 2;
    const X = (i) => ((i / Math.max(1, v.length - 1)) * 100).toFixed(2), Y = (val) => (30 - ((val - lo) / (hi - lo)) * 28).toFixed(2);
    return `<svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none" role="img" aria-label="Hottest probe trend, now ${v[v.length - 1].toFixed(1)} °C">
      <line x1="0" x2="100" y1="${Y(fail)}" y2="${Y(fail)}" class="spark-fail" vector-effect="non-scaling-stroke"/>
      <path d="${v.map((val, i) => (i ? "L" : "M") + X(i) + " " + Y(val)).join("")}" style="stroke:${status === "ok" ? "var(--series-1)" : status === "stop" ? "var(--muted)" : `var(--${status})`}" vector-effect="non-scaling-stroke"/>
    </svg>`;
  }

  // grouped bars: T1–T4 rise above ambient for every motor, against warning / alarm limits
  function riseBars(rows) {
    const max = Math.max(LIMITS.riseCrit * 1.35, ...rows.map((r) => Math.max(r.e.rise, r.e.th && r.e.th.confident ? r.e.th.final : 0) + 4));
    const ticks = Array.from({ length: Math.floor(max / 10) + 1 }, (_, i) => i * 10);
    const marks = `<i class="rb-mark warn" style="left:${pct(LIMITS.riseWarn, max)}"></i><i class="rb-mark fail" style="left:${pct(LIMITS.riseCrit, max)}"></i>`;
    return `<div class="rb">
      <div class="rb-row rb-head"><span></span><span class="rb-track rb-labels"><span style="left:${pct(LIMITS.riseWarn, max)}">Warn ${LIMITS.riseWarn}</span><span class="fail" style="left:${pct(LIMITS.riseCrit, max)}">Alarm ${LIMITS.riseCrit} K</span></span><span></span></div>
      ${rows.map(({ d, m, e }) => {
        const rs = MS.map((j) => m.live[j] - m.live[AMB]), conf = e.th && e.th.confident;
        const tip = MS.map((j) => `${PROBES[j]} rise: ${rs[j].toFixed(1)} K${conf ? ` → final ${e.th.sensors[j].final.toFixed(1)} K` : ""}`).join("|");
        return `<a class="rb-row" href="monitor.html?motor=${encodeURIComponent(m.id)}" data-tip="${esc(m.id)} · ${esc(d.name)}|${tip}|Alarm at ${LIMITS.riseCrit} K">
          <span class="rb-label"><b>${esc(m.id)}</b><span>${esc(d.name)}</span></span>
          <span class="rb-track">${marks}${rs.map((r, j) => {
            const fin = e.th && e.th.confident ? e.th.sensors[j].final : null;
            return `<span class="rb-lane">${fin != null ? `<span class="rb-ghost" style="width:${pct(fin, max)};border-color:${COLORS[j]}"></span>` : ""}<span class="rb-bar" style="width:${pct(r, max)};background:${COLORS[j]}"></span></span>`;
          }).join("")}</span>
          <span class="rb-val">${verdictDot(e.status)}${e.rise.toFixed(1)} K</span>
        </a>`;
      }).join("")}
      <div class="rb-row rb-axis"><span></span><span class="rb-track rb-ticks">${ticks.map((t) => `<span style="left:${pct(t, max)}">${t}</span>`).join("")}</span><span class="rb-unit">K</span></div>
    </div>`;
  }
  const verdictDot = (s) => `<span class="v-dot ${s}" aria-label="${VERDICT_SHORT[s]}">${ico(STATUS[s].icon)}</span>`;


  // floating tooltip for any [data-tip] element ("title|line|line")
  function initTips() {
    const tip = document.createElement("div");
    tip.className = "viz-tip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest && e.target.closest("[data-tip]");
      if (!el) { tip.classList.remove("show"); return; }
      const [head, ...rest] = el.getAttribute("data-tip").split("|");
      tip.innerHTML = `<b>${esc(head)}</b>` + rest.map((l) => `<div>${esc(l)}</div>`).join("");
      tip.classList.add("show");
      tip.style.left = Math.max(8, Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 8)) + "px";
      tip.style.top = (e.clientY + 16 + tip.offsetHeight > innerHeight ? e.clientY - tip.offsetHeight - 12 : e.clientY + 16) + "px";
    });
    document.addEventListener("scroll", () => tip.classList.remove("show"), { passive: true });
  }

  /* ---------- Condition graphics ---------- */
  // ring: share of the predicted final rise already reached
  function progressRing(frac, color, center, sub, size = 92) {
    const r = size / 2 - 7, c = 2 * Math.PI * r, f = Math.max(0, Math.min(1, frac ?? 0));
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(sub)}: ${esc(center)}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-track"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-arc" style="stroke:${color}" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      <text x="50%" y="${size / 2 + 2}" class="ring-val" text-anchor="middle">${esc(center)}</text>
      <text x="50%" y="${size / 2 + 17}" class="ring-sub" text-anchor="middle">${esc(sub)}</text>
    </svg>`;
  }
  // bar: rise now (solid) and predicted final rise (dashed outline) against warning / alarm marks
  function finalBar(label, color, now, fin, max) {
    return `<div class="fb-row" data-tip="${esc(label)}|Rise now: ${now.toFixed(1)} K${fin != null ? `|Predicted final: ${fin.toFixed(1)} K` : ""}|Warning ${LIMITS.riseWarn} K · Alarm ${LIMITS.riseCrit} K">
      <span class="fb-label"><i style="background:${color}"></i>${esc(label)}</span>
      <span class="fb-track">
        <i class="rb-mark warn" style="left:${pct(LIMITS.riseWarn, max)}"></i><i class="rb-mark fail" style="left:${pct(LIMITS.riseCrit, max)}"></i>
        ${fin != null ? `<span class="rb-ghost" style="width:${pct(fin, max)};border-color:${color}"></span>` : ""}
        <span class="rb-bar" style="width:${pct(now, max)};background:${color}"></span>
      </span>
      <span class="fb-val num">${now.toFixed(1)}${fin != null ? ` → <b>${fin.toFixed(1)}</b>` : ""} K</span>
    </div>`;
  }
  // columns: how fast the hotter sensor's rise changes in each 10-minute interval (K/h) vs the 2 K/h equilibrium line
  function gradientChart(m) {
    const pts = trendPoints(m), tNow = runMinutes(m), STEP = 10, CAP = 20;
    const rise = pts.map((p) => ({ x: (p.t - m.runStart) / 60000, y: hotOf(p.v) - p.v[AMB] }));
    const cols = [];
    for (let a = 0; a + STEP <= tNow + 0.01; a += STEP) {
      const g = slopePerHour(rise.filter((p) => p.x >= a && p.x <= a + STEP));
      if (g != null) cols.push({ a, g });
    }
    if (!cols.length) return `<p class="muted">Collecting data — the first interval completes after ${STEP} minutes.</p>`;
    const W = 100 / cols.length;
    const y = (v) => (1 - Math.min(Math.max(v, 0), CAP) / CAP) * 100;
    return `<div class="gc">
      <div class="gc-plot">
        <span class="gc-eq" style="top:${y(EQ_RATE)}%"><em>${EQ_RATE} K/h · equilibrium</em></span>
        ${cols.map((c) => {
          const ok = Math.abs(c.g) < EQ_RATE;
          return `<span class="gc-col${ok ? " ok" : ""}" style="left:calc(${(c.a / STEP) * W}% + 2px);width:calc(${W}% - 4px);top:${y(c.g)}%"
            data-tip="T + ${c.a}–${c.a + STEP} min|Rise changing ${c.g >= 0 ? "+" : ""}${c.g.toFixed(1)} K/h|${ok ? "Below 2 K/h" : "Still heating"}">${c.g > CAP ? `<b>${Math.round(c.g)}</b>` : ""}</span>`;
        }).join("")}
      </div>
      <div class="gc-x"><span>T + 0</span><span>T + ${Math.round(tNow)} min</span></div>
    </div>`;
  }

  // condition card on the Motors page
  function conditionCard(d, m, e) {
    const th = e.th, L = LIMITS;
    const s = th.sensors;
    const max = Math.max(L.riseCrit * 1.3, ...s.map((x) => Math.max(x.now, th.confident ? x.final : 0) + 3));
    const rings = MS.map((j) => progressRing(th.confident ? s[j].pct : null, COLORS[j], th.confident ? `${Math.round(s[j].pct * 100)}%` : "—", PROBES[j], 74)).join("");
    const eqTxt = th.eq ? "Reached" : runMinutes(m) < 2 * EQ_WINDOW ? `Needs ${2 * EQ_WINDOW} min of data` : !th.confident ? "Not yet" : th.eqIn < 1 ? "Settling — confirming" : `In about ${fmtMin(th.eqIn)}`;
    const alarmTxt = e.rise >= L.riseCrit ? "Reached" : th.confident ? (th.alarmIn != null ? `In about ${fmtMin(th.alarmIn)}` : "Not expected") : "—";
    const facts = [
      ["Predicted final temperature", th.confident ? `${th.finalTemp.toFixed(1)} °C <small>(rise ${th.final.toFixed(1)} K)</small>` : "Collecting data"],
      ["Thermal time constant τ", th.confident ? `${th.tau.toFixed(0)} min` : "—"],
      ["Thermal equilibrium <small>(IEC 60034-1, &lt; 2 K/h)</small>", eqTxt],
      [`Alarm (${L.riseCrit} K rise)`, alarmTxt],
      ["Model fit R²", th.confident ? Math.min(...s.map((x) => x.r2)).toFixed(2) : "—"]
    ];
    return `
      <div class="cond-block">
        <div class="cond-title">Heating progress <small>share of predicted final rise</small></div>
        <div class="cond-rings">${rings}</div>
        <div class="cond-title" style="margin-top:14px">Rise now → predicted final</div>
        ${MS.map((j) => finalBar(PROBES[j], COLORS[j], s[j].now, th.confident ? s[j].final : null, max)).join("")}
      </div>
      <div class="cond-block">
        <div class="cond-title">Heating analysis</div>
        <dl class="cond-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      </div>
      <div class="cond-block">
        <div class="cond-title">Condition checks</div>
        <ul class="cond-checks">${e.checks.map((c) => `
          <li class="${c.s}"><span class="v-dot ${c.s}">${ico(STATUS[c.s].icon)}</span><span class="cc-name">${esc(c.k)}<small>${esc(c.d)}</small></span><b class="num">${esc(c.v)}</b></li>`).join("")}
        </ul>
      </div>`;
  }

  const limitLine = () => `Alarm at: ${LIMITS.riseCrit} K above ambient · ${LIMITS.crit} °C · T1–T4 spread ${LIMITS.devCrit} °C`;

  function motorPanel(d, m, selected = false) {
    const e = evalMotor(m);
    return `
      <div class="motor-panel is-${e.status}${selected ? " is-selected" : ""}" data-pick-motor="${esc(m.id)}">
        <div class="motor-panel-head">
          <div><span class="slot">${esc(m.loco)}</span><b>${esc(m.id)}</b></div>
          <div class="mp-actions">${verdictPill(e.status)}${triggerBtn(m, d)}</div>
        </div>
        ${readings(m)}
        <div class="panel-trend" title="Hottest of T1–T4 since monitoring started · dashed = alarm level">
          <span>Trend</span>${sparkRun(m, e.status)}
        </div>
        ${e.status === "stop" ? `<div class="panel-heat stopped">${ico("pause")}<div class="ph-text"><span>Monitoring stopped${m.stoppedAt ? " at " + new Date(m.stoppedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span><b>Last readings shown</b><small>Switch on to start a new run</small></div><a href="monitor.html?motor=${encodeURIComponent(m.id)}">Details →</a></div>` : `<div class="panel-heat">
          ${progressRing(e.th && e.th.confident ? e.th.sensors[e.th.hot].pct : null, e.status === "ok" ? "var(--series-1)" : `var(--${e.status})`, e.th && e.th.confident ? `${Math.round(e.th.sensors[e.th.hot].pct * 100)}%` : "—", "heated", 58)}
          <div class="ph-text">
            <span>${trendText(e)}</span>
            <b class="num">${e.th && e.th.confident ? `Final ≈ ${e.th.finalTemp.toFixed(1)} °C` : "Final: collecting data"}</b>
            <small class="num">${e.th && e.th.confident ? (e.th.alarmIn != null && e.rise < LIMITS.riseCrit ? `Alarm in about ${fmtMin(e.th.alarmIn)}` : e.th.eq ? "Equilibrium reached" : e.th.eqIn < 1 ? "Settling" : `Equilibrium in about ${fmtMin(e.th.eqIn)}`) : "&nbsp;"}</small>
          </div>
          <a href="monitor.html?motor=${encodeURIComponent(m.id)}">Details →</a>
        </div>`}
      </div>`;
  }
  const emptySlot = (d) => {
    const q = d.motors.filter((m) => m.queued).length;
    return `
    <div class="empty-slot">
      <div>${ico("plus")}<div><b>Free position</b></div><div>${q ? `Switch on a queued motor below to check it${runningOn(d).length ? " alongside the other one" : ""}, or assign another` : runningOn(d).length ? "Assign a second motor to check both under the same conditions" : "Assign a motor to start checking"}</div>
      <button type="button" class="btn btn-sm" style="margin-top:10px" data-add-motor="${esc(d.id)}">Assign motor</button></div>
    </div>`;
  };
  // motors on a device that are not being checked right now: queued (next) and stopped (checked)
  function deviceQueue(d, selectedId) {
    const rest = d.motors.filter((m) => !isRunning(m));
    if (!rest.length) return "";
    const rest2 = [...rest.filter((m) => m.queued), ...rest.filter((m) => !m.queued)];
    const q = rest.filter((m) => m.queued).length, c = rest.length - q;
    return `<div class="dev-queue">
      <div class="dq-head"><b>Other motors on ${esc(d.name)}</b><span>${[q ? `${q} queued` : "", c ? `${c} checked` : ""].filter(Boolean).join(" · ")} · ${runningOn(d).length} of ${MAX_RUN} positions in use</span></div>
      <ul>${rest2.map((m) => {
        const e = evalMotor(m);
        return `<li class="dq-row${m.id === selectedId ? " is-selected" : ""}" data-pick-motor="${esc(m.id)}">
          <span class="dq-id"><b>${esc(m.id)}</b><span>${esc(m.loco)}</span></span>
          <span class="dq-state">${verdictPill(e.status)}${m.queued ? '<small>Waiting for a free position</small>' : `<small>Last result: <b class="dq-res ${e.condition}">${VERDICT_SHORT[e.condition]}</b> · rise ${e.rise.toFixed(1)} K</small>`}</span>
          ${triggerBtn(m, d)}
        </li>`;
      }).join("")}</ul>
    </div>`;
  }
  // one device: header + its motors (or offline notice)
  function deviceWidget(d, selectedId) {
    const head = `
      <div class="card-head">
        <div class="device-title"><div class="device-ico">${ico("cpu")}</div><div><h3>${esc(d.name)}</h3><div class="sub">${esc(d.id)} · ${esc(d.location)}</div></div></div>
        ${d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : badge("off")}
      </div>`;
    if (!d.online) return `<div class="card device-card">${head}<div class="offline-mask">${ico("wifiOff")}<b>Device offline</b><div>Last seen ${esc(d.lastSeen || "—")}</div></div></div>`;
    const cells = runningOn(d).map((m) => motorPanel(d, m, m.id === selectedId));
    if (cells.length < MAX_RUN) cells.push(emptySlot(d));
    return `<div class="card device-card">${head}<div class="motor-slots">${cells.join("")}</div>${deviceQueue(d, selectedId)}</div>`;
  }

  /* =========================================================
     Page: Dashboard — overview of every monitored motor
     ========================================================= */
  function pageDashboard() {
    const render = () => {
      const evals = liveMotors().map((x) => ({ ...x, e: evalMotor(x.m) }));
      const online = DEVICES.filter((d) => d.online).length;
      const c = { ok: 0, warn: 0, crit: 0 };
      evals.forEach((x) => c[x.e.status]++);
      $("#summary").innerHTML = `
        <div><span>Motors monitored</span><b class="num">${evals.length}<small> on ${online} of ${DEVICES.length} devices${allMotors().some((x) => x.m.queued) ? ` · ${allMotors().filter((x) => x.m.queued).length} queued` : ""}</small></b></div>
        <div><span style="color:var(--ok-text)">${ico("checkCircle")}Good</span><b class="num">${c.ok}</b></div>
        <div><span style="color:var(--warn-text)">${ico("alert")}Monitor</span><b class="num">${c.warn}</b></div>
        <div><span style="color:var(--crit-text)">${ico("xCircle")}Not OK</span><b class="num">${c.crit}</b></div>
        ${evals.length ? `<div class="cond-split" role="img" aria-label="${c.ok} good, ${c.warn} monitor, ${c.crit} not OK">${["ok", "warn", "crit"].filter((k) => c[k]).map((k) => `<span class="${k}" style="flex:${c[k]}" data-tip="${VERDICT_SHORT[k]}|${c[k]} of ${evals.length} motors"></span>`).join("")}</div>` : ""}`;

      // alarm banner: only motors that need action
      const bad = evals.filter((x) => x.e.status !== "ok").sort((a, b) => RANK[b.e.status] - RANK[a.e.status]);
      $("#alarmBar").hidden = !bad.length;
      $("#alarmBar").innerHTML = bad.map(({ d, m, e }) => `
        <a class="alarm-row ${e.status}" href="monitor.html?motor=${encodeURIComponent(m.id)}">
          ${ico(STATUS[e.status].icon)}<b>${esc(m.id)}</b><span class="alarm-where">${esc(d.name)}</span>
          <span class="alarm-reason">${esc(reasonOf(e))}</span><em>${VERDICT_SHORT[e.status]}</em>
        </a>`).join("");

      $("#riseChart").innerHTML = evals.length ? riseBars(evals.slice().sort((a, b) => b.e.rise - a.e.rise)) : `<p class="muted">No motors being monitored.</p>`;
      updateAlertCount();
    };
    render();
    return render;
  }

  /* =========================================================
     Page: Monitor — all device widgets + the selected motor's analysis
     ========================================================= */
  function pageMonitor() {
    const q = new URLSearchParams(location.search);
    let selected = q.get("motor"), filter = "all";
    const pickDefault = () => {
      const live = liveMotors();
      if (!allMotors().some((x) => x.m.id === selected)) selected = (live.slice().sort((a, b) => RANK[evalMotor(b.m).status] - RANK[evalMotor(a.m).status])[0] || allMotors()[0] || { m: {} }).m.id || null;
    };
    const select = (id) => {
      selected = id;
      history.replaceState(null, "", `?motor=${encodeURIComponent(id)}`);
      render();
      $("#detailTitle").scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const render = () => {
      pickDefault();
      const devs = DEVICES.filter((d) => filter === "all" || (filter === "online" ? d.online : d.online && d.motors.some((m) => ["warn", "crit"].includes(evalMotor(m).status))));
      $("#monitorGrid").innerHTML = devs.length ? devs.map((d) => deviceWidget(d, selected)).join("")
        : DEVICES.length ? `<div class="card card-body muted">No devices match this filter.</div>`
        : `<div class="card empty-state">${ico("cpu")}<h3>No devices yet</h3><p>Register a device, then assign motors to it.</p><a class="btn btn-primary" href="devices.html">${ico("plus")}Add device</a></div>`;

      const x = selected && findMotor(selected);
      const d = x && x.d, m = x && x.m;
      $$(".motor-detail").forEach((el) => (el.hidden = !d || (!!m.queued && el.id !== "detailTitle")));
      if (!d) { updateAlertCount(); return; }
      const e = evalMotor(m);
      const st = d.online ? e.status : "off";
      $("#motorHero").innerHTML = `
        <div class="mh-top">
          <div>
            <div class="crumbs">${esc(d.name)} · ${esc(d.id)} · ${esc(d.location)}</div>
            <h2>${esc(m.id)}</h2>
            <div class="muted">${esc(m.model)} · ${esc(m.loco)}</div>
          </div>
          <div class="mh-verdict">${verdictPill(st)}<span>${st === "ok" ? "All checks within limits" : st === "off" ? "Device offline" : st === "stop" ? `Check stopped — last readings shown · result ${VERDICT_SHORT[e.condition]}` : st === "wait" ? `Queued on ${esc(d.name)} — switch on when a position is free` : esc(reasonOf(e))}</span></div>
        </div>
        ${readings(m, d.online && !m.queued, "lg")}
        <div class="mh-foot">
          <span>${m.queued ? `Not started · ${runningOn(d).length} of ${MAX_RUN} positions in use on ${esc(d.name)}` : `Monitoring for <b>${fmtRun(runMinutes(m))}</b>`}</span>
          <span>T1–T4 spread <b class="num">${e.dev.toFixed(1)} °C</b></span>
          <span>Trend <b>${trendText(e)}</b></span>
          <span class="mh-limits">${limitLine()} <button type="button" class="link-btn" data-edit-limits>Edit limits</button></span>
          <span class="mh-actions">
            <span class="mh-trigger">Monitoring ${triggerBtn(m, d)}</span>
            <a class="btn btn-sm" href="reports.html?motor=${encodeURIComponent(m.id)}">${ico("report")}Report</a>
            <button type="button" class="btn btn-sm" data-edit-motor="${esc(m.id)}">${ico("edit")}Edit</button>
          </span>
        </div>`;

      if (m.queued) { updateAlertCount(); return; }
      $("#condPill").innerHTML = verdictPill(st);
      $("#condBody").innerHTML = conditionCard(d, m, e);
      $("#eqChart").innerHTML = gradientChart(m);
      $("#eqMeta").textContent = e.th.eq ? "Equilibrium reached — the last two 15-minute intervals both changed by less than 2 K/h" : "Equilibrium when two successive intervals each change by less than 2 K/h";

      const mode = ($("input[name=trendMode]:checked") || {}).value || "temp";
      const series = runSeries(m, mode);
      lineChart($("#runChart"), { series, lines: runLines(m, mode), start: m.runStart, now: e.th.confident ? Date.now() : null, unit: mode === "rise" ? "K" : "°C", title: `${m.id} temperature trend` });
      $("#runLegend").innerHTML = series.filter((s) => !s.dash).map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join("") + (series.some((s) => s.dash) ? `<span><i class="pred"></i>Predicted</span>` : "") + `<span><i class="dash"></i>Limits</span>`;

      // same device, same conditions: rise of this motor vs the other motor
      const p = partnerOf(m);
      $("#cmpCard").hidden = !p;
      if (p) {
        const hotRise = (mm) => trendPoints(mm).map((pt) => ({ t: pt.t, v: +(hotOf(pt.v) - pt.v[AMB]).toFixed(1) }));
        $("#cmpSub").textContent = `${m.id} and ${p.id} share ${d.name}, so they should heat alike · hottest probe rise above ambient`;
        lineChart($("#cmpChart"), {
          series: [{ name: m.id, short: m.id, color: "var(--primary)", points: hotRise(m) }, { name: p.id, short: p.id, color: "var(--muted)", points: hotRise(p) }],
          lines: [{ v: LIMITS.riseCrit, label: `Alarm ${LIMITS.riseCrit} K`, cls: "limit" }],
          start: Math.min(m.runStart, p.runStart), unit: "K", height: 220, title: "Motor comparison",
          xfmt: (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      }
      updateAlertCount();
    };

    // click a motor widget (or its "Details" link) to show it below
    $("#monitorGrid").addEventListener("click", (ev) => {
      const panel = ev.target.closest("[data-pick-motor]");
      if (!panel || ev.target.closest("button")) return;
      ev.preventDefault();
      select(panel.dataset.pickMotor);
    });
    $$("[name=monFilter]").forEach((r) => r.addEventListener("change", () => { filter = r.value; render(); }));
    $$("input[name=trendMode]").forEach((r) => r.addEventListener("change", () => render()));
    render();
    return render;
  }

  /* =========================================================
     Page: Devices — table of registered devices
     ========================================================= */
  function pageDevices() {
    const dlg = $("#deviceDialog"), form = $("#deviceForm");
    let filter = "all", editing = null;

    const render = () => {
      const term = ($("#devSearch").value || "").toLowerCase();
      const list = DEVICES.filter((d) =>
        (filter === "all" || (filter === "online") === d.online) &&
        [d.id, d.name, d.location, d.ip, ...d.motors.map((m) => m.id)].join(" ").toLowerCase().includes(term));
      $("#devCount").textContent = `${list.length} of ${DEVICES.length} devices`;
      $("#devRows").innerHTML = list.length ? list.map((d) => {
        const order = [...runningOn(d), ...d.motors.filter((m) => m.queued), ...d.motors.filter((m) => !isRunning(m) && !m.queued)];
        const motors = order.map((m) => `<span class="motor-chip${isRunning(m) ? "" : " idle"}" title="${esc(m.id)} · ${isRunning(m) ? "checking now" : m.queued ? "queued" : "checked"}">${verdictDot(d.online ? evalMotor(m).status : "off")}${esc(m.id)}</span>`).join("");
        const nq = d.motors.filter((m) => m.queued).length, nc = d.motors.filter((m) => !isRunning(m) && !m.queued).length;
        return `<tr>
          <td class="lead-cell" data-label="Device"><div class="cell-dev"><span class="device-ico">${ico("cpu")}</span><div><b>${esc(d.name)}</b><span class="mono">${esc(d.id)} · v${esc(d.fw || "2.4.1")}</span></div></div></td>
          <td data-label="Location">${esc(d.location)}</td>
          <td data-label="IP address" class="mono">${esc(d.ip)}</td>
          <td data-label="Motors"><div class="motor-chips">${motors}<button type="button" class="link-btn" data-add-motor="${esc(d.id)}">${ico("plus")}Assign</button></div><span class="muted chip-count">${runningOn(d).length} of ${MAX_RUN} checking${nq ? ` · ${nq} queued` : ""}${nc ? ` · ${nc} checked` : ""}</span></td>
          <td data-label="Sampling" class="num col-opt">Every ${d.interval || 2} s</td>
          <td data-label="Signal" class="col-opt">${signalBars(d.signal || 0)}</td>
          <td data-label="Status">${d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : `${badge("off")}<span class="muted last-seen">Last seen ${esc(d.lastSeen || "—")}</span>`}</td>
          <td data-label=""><div class="row-actions">
            ${d.motors.length ? `<a class="btn btn-sm" href="monitor.html?motor=${encodeURIComponent(d.motors[0].id)}" title="Monitor">${ico("activity")}<span class="hide-sm">Monitor</span></a>` : ""}
            <button class="btn btn-sm btn-ghost" data-view="${esc(d.id)}" aria-label="View ${esc(d.id)}" title="View">${ico("eye")}</button>
            <button class="btn btn-sm btn-ghost" data-edit="${esc(d.id)}" aria-label="Edit ${esc(d.id)}" title="Edit">${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-del="${esc(d.id)}" aria-label="Delete ${esc(d.id)}" title="Delete">${ico("trash")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="8" class="muted" style="text-align:center;padding:32px">${DEVICES.length ? "No devices match your filters." : "No devices yet — use “Add device”."}</td></tr>`;
      updateAlertCount();
    };

    function open(d) {
      if (!allowed("devices")) return;
      editing = d || null;
      form.reset();
      $$("input, select", form).forEach((el) => el.setCustomValidity("")); // clear errors left by a cancelled attempt
      $("#dlgTitle").textContent = d ? `Edit device ${d.id}` : "Add new device";
      $("#dlgSave").textContent = d ? "Save changes" : "Add device";
      form.elements.id.readOnly = !!d;
      if (d) {
        form.elements.id.value = d.id; form.elements.name.value = d.name; form.elements.location.value = d.location;
        form.elements.ip.value = d.ip; form.elements.interval.value = String(d.interval || 2);
        form.elements.online.checked = d.online;
      }
      dlg.showModal();
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements;
      f.id.setCustomValidity("");
      const id = f.id.value.trim().toUpperCase();
      if (!editing && DEVICES.some((d) => d.id === id)) f.id.setCustomValidity("A device with this ID already exists");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = { id, name: f.name.value.trim(), location: f.location.value.trim(), ip: f.ip.value.trim(), interval: +f.interval.value, online: f.online.checked };
      if (editing) {
        if (editing.online && !data.online) data.lastSeen = "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        data.signal = data.online ? editing.signal || 4 : 0;
        Object.assign(editing, data);
      } else DEVICES.push({ ...data, motors: [], fw: "2.4.1", signal: data.online ? 4 : 0, lastSeen: data.online ? undefined : "Never" });
      saveDevices();
      dlg.close();
      toast(editing ? `${id} updated` : `${id} added — assign motors to it from the Motors page`);
      render();
    });
    form.addEventListener("input", (e) => e.target.setCustomValidity && e.target.setCustomValidity(""));

    function viewDevice(d) {
      const rows = d.motors.map((m) => {
        const e = evalMotor(m);
        return `<li><span class="muted">${ico("motor")}</span><b>${esc(m.id)}</b><span class="num">${d.online && !m.queued ? m.live.map((v) => v.toFixed(1)).join(" / ") + " °C" : "—"}</span>${verdictPill(d.online ? e.status : "off")}</li>`;
      }).join("") + `<li><span class="muted">${ico("plus")}</span><span class="muted">${runningOn(d).length < MAX_RUN ? "Free position" : "Add to the queue"}</span><span></span><button type="button" class="btn btn-sm" data-add-motor="${esc(d.id)}" data-close>Assign motor</button></li>`;
      const dlg = viewDialog({
        title: d.name, sub: `${d.id} · ${d.location}`,
        rows: [["Status", d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : `${badge("off")} <span class="muted">Last seen ${esc(d.lastSeen || "—")}</span>`],
          ["IP address", `<span class="mono">${esc(d.ip)}</span>`], ["Firmware", `v${esc(d.fw || "2.4.1")}`], ["Sampling", `Every ${d.interval || 2} s`], ["Signal", signalBars(d.signal || 0)], ["Motors", `${d.motors.length} assigned · ${runningOn(d).length} of ${MAX_RUN} checking now`]],
        body: `<div><div class="detail-title">Motors monitored <span class="muted">(T1 / T2 / T3 / T4 / TA °C)</span></div><ul class="detail-slots">${rows}</ul></div>`,
        actions: `<button type="button" class="btn btn-danger" data-v-del>${ico("trash")}Delete</button><button type="button" class="btn btn-primary" data-v-edit>${ico("edit")}Edit</button>`
      });
      dlg.querySelector("[data-v-edit]").addEventListener("click", () => { dlg.close(); open(d); });
      dlg.querySelector("[data-v-del]").addEventListener("click", () => { dlg.close(); removeDevice(d.id); });
    }

    async function removeDevice(id) {
      if (!allowed("devices")) return;
      const d = DEVICES.find((x) => x.id === id);
      if (!d) return;
      const ok = await confirmDialog({
        title: `Delete device ${d.id}?`,
        message: d.motors.length ? `${d.name} will be removed. Its motors (${d.motors.map((m) => m.id).join(", ")}) stay in the motor register as not assigned. This cannot be undone.` : `${d.name} will be removed. This cannot be undone.`,
        confirmLabel: "Delete device"
      });
      if (!ok) return;
      d.motors.forEach((m) => SPARE.push({ id: m.id, model: m.model, loco: m.loco }));
      DEVICES = DEVICES.filter((x) => x !== d);
      saveDevices(); saveSpare();
      toast(`${d.id} deleted`);
      render();
    }

    $("#addDevice").addEventListener("click", () => open());
    $("#devRows").addEventListener("click", (e) => {
      const ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]"), vw = e.target.closest("[data-view]");
      if (ed) open(DEVICES.find((d) => d.id === ed.dataset.edit));
      if (vw) viewDevice(DEVICES.find((d) => d.id === vw.dataset.view));
      if (del) removeDevice(del.dataset.del);
    });
    $("#devSearch").addEventListener("input", render);
    $$("[name=devFilter]").forEach((r) => r.addEventListener("change", () => { filter = r.value; render(); }));
    $("#resetDemo") && $("#resetDemo").addEventListener("click", async () => {
      if (!allowed("devices")) return;
      if (!(await confirmDialog({ title: "Reset demo data?", message: "All devices and motors go back to the original demo set. Your changes will be lost.", confirmLabel: "Reset", danger: false }))) return;
      DEVICES = JSON.parse(JSON.stringify(DEFAULT_DEVICES)); DEVICES.forEach((d) => d.motors.forEach(seedMotor));
      SPARE = JSON.parse(JSON.stringify(DEFAULT_SPARE));
      saveDevices(); saveSpare(); toast("Demo data restored"); render();
    });
    render();
    const q = new URLSearchParams(location.search);
    const qd = DEVICES.find((x) => x.id === (q.get("edit") || q.get("view")));
    if (qd) q.get("edit") ? open(qd) : viewDevice(qd);
    return render;
  }

  /* =========================================================
     Page: Motors — motor management (register, assign, edit, delete)
     ========================================================= */
  function pageMotorMgmt() {
    const devSel = $("#motorDevFilter"), condSel = $("#motorCondFilter");
    const fillDev = () => {
      const keep = devSel.value || "all";
      devSel.innerHTML = `<option value="all">All devices</option>${DEVICES.map((d) => `<option value="${esc(d.id)}">${esc(d.name)}</option>`).join("")}<option value="none">Not assigned</option>`;
      devSel.value = [...devSel.options].some((o) => o.value === keep) ? keep : "all";
    };
    const condOf = ({ d, m }) => (!d ? "none" : d.online ? evalMotor(m).status : "off");
    const render = () => {
      if (devSel.options.length !== DEVICES.length + 2) fillDev();
      const all = everyMotor(), term = ($("#motorSearch").value || "").toLowerCase();
      const counts = { mon: all.filter((x) => x.d).length, none: all.filter((x) => !x.d).length, bad: all.filter((x) => ["warn", "crit"].includes(condOf(x))).length };
      $("#motorSummary").innerHTML = `
        <div><span>Registered motors</span><b class="num">${all.length}</b></div>
        <div><span>${ico("activity")}Assigned to a device</span><b class="num">${counts.mon}</b></div>
        <div><span>${ico("motor")}Not assigned</span><b class="num">${counts.none}</b></div>
        <div><span style="color:var(--warn-text)">${ico("alert")}Need attention</span><b class="num">${counts.bad}</b></div>`;
      const rows = all.filter((x) =>
        (devSel.value === "all" || (devSel.value === "none" ? !x.d : x.d && x.d.id === devSel.value)) &&
        (condSel.value === "all" || condOf(x) === condSel.value) &&
        [x.m.id, x.m.model, x.m.loco, x.d ? x.d.name : "not assigned"].join(" ").toLowerCase().includes(term));
      $("#motorCount").textContent = `${rows.length} of ${all.length} motors`;
      $("#motorRows").innerHTML = rows.length ? rows.map((x) => {
        const { d, m } = x, cond = condOf(x), live = d && d.online, e = d ? evalMotor(m) : null;
        const id = esc(m.id);
        return `<tr>
          <td class="lead-cell" data-label="Motor"><b class="mono">${id}</b><span class="muted" style="display:block;font-size:12px">${esc(m.loco)}</span></td>
          <td data-label="Model / type">${esc(m.model)}</td>
          <td data-label="Device">${d ? esc(d.name) : `<span><span class="muted">Not assigned</span> <button type="button" class="link-btn" data-edit-motor="${id}">Assign</button></span>`}</td>
          ${PROBES.map((p, j) => `<td data-label="${p} °C" class="num${j === AMB ? " col-opt" : ""} ${live ? tCls(m.live[j], j, m.live[AMB]) : "muted"}">${live ? m.live[j].toFixed(1) : "—"}</td>`).join("")}
          <td data-label="Predicted final" class="num col-opt">${live && e.th && e.th.confident ? e.th.finalTemp.toFixed(1) + " °C" : "—"}</td>
          <td data-label="Condition">${cond === "none" ? `<span class="verdict-pill off">Not monitored</span>` : verdictPill(cond)}</td>
          <td data-label="Monitoring">${d ? triggerBtn(m, d) : '<span class="muted">—</span>'}</td>
          <td data-label=""><div class="row-actions">
            ${d ? `<a class="btn btn-sm" href="monitor.html?motor=${encodeURIComponent(m.id)}" title="Monitor">${ico("activity")}<span class="hide-sm">Monitor</span></a>` : ""}
            <button class="btn btn-sm btn-ghost" data-view-motor="${id}" aria-label="View ${id}" title="View">${ico("eye")}</button>
            <button class="btn btn-sm btn-ghost" data-edit-motor="${id}" aria-label="Edit ${id}" title="Edit">${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-del-motor="${id}" aria-label="Delete ${id}" title="Delete">${ico("trash")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="12" class="muted" style="text-align:center;padding:32px">${all.length ? "No motors match your filters." : "No motors yet — use “Add motor”."}</td></tr>`;
      updateAlertCount();
    };
    $("#motorSearch").addEventListener("input", render);
    devSel.addEventListener("change", render);
    condSel.addEventListener("change", render);
    fillDev();
    const q = new URLSearchParams(location.search);
    if (q.get("device")) devSel.value = q.get("device");
    render();
    if (q.get("add") != null) motorDialog({ device: q.get("add") || undefined });
    return render;
  }

  /* =========================================================
     Page: Reports — filtered condition summary / readings log, CSV + print
     ========================================================= */
  function pageReports() {
    const f = $("#repForm").elements, q = new URLSearchParams(location.search);
    const stamp = (t) => new Date(t).toLocaleString([], { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const fillMotors = () => {
      const keep = f.motor.value;
      const list = allMotors().filter(({ d, m }) => !m.queued && (f.device.value === "all" || d.id === f.device.value));
      f.motor.innerHTML = `<option value="all">All motors</option>` + list.map(({ m }) => `<option value="${esc(m.id)}">${esc(m.id)}</option>`).join("");
      f.motor.value = list.some(({ m }) => m.id === keep) ? keep : "all";
    };
    const defaults = () => {
      f.type.value = "summary"; f.cond.value = "all"; f.range.value = "60"; f.interval.value = "5";
      f.device.innerHTML = `<option value="all">All devices</option>` + DEVICES.map((d) => `<option value="${esc(d.id)}">${esc(d.name)} (${esc(d.id)})</option>`).join("");
      f.device.value = "all"; fillMotors(); f.motor.value = "all";
    };
    defaults();
    if (q.get("motor")) { const x = findMotor(q.get("motor")); if (x && x.d) { f.device.value = x.d.id; fillMotors(); f.motor.value = x.m.id; } }

    // build the report rows for the current filters
    function build() {
      const motors = allMotors().filter(({ d, m }) => !m.queued && (f.device.value === "all" || d.id === f.device.value) && (f.motor.value === "all" || m.id === f.motor.value));
      const statusOf = ({ d, m }) => (d.online ? evalMotor(m).status : "off");
      if (f.type.value === "summary") {
        const rows = motors.filter((x) => f.cond.value === "all" || statusOf(x) === f.cond.value).map((x) => {
          const { d, m } = x, e = evalMotor(m), th = e.th, ok = th && th.confident;
          return { status: statusOf(x), cells: [m.id, m.model, m.loco, d.name, d.location, ...m.live.map((v) => v.toFixed(1)), e.rise.toFixed(1), e.dev.toFixed(1),
            ok ? th.finalTemp.toFixed(1) : "", ok ? th.tau.toFixed(0) : "", th && th.eq ? "Reached" : "Not yet", VERDICT_SHORT[statusOf(x)], statusOf(x) === "ok" ? "" : reasonOf(e), fmtRun(runMinutes(m))] };
        });
        return { title: "Condition summary", cols: ["Motor", "Model / type", "Locomotive", "Device", "Location", ...PROBES.map((p) => `${p} °C`), "Rise K", "T1–T4 spread °C", "Predicted final °C", "τ min", "Equilibrium", "Condition", "Reason", "Monitoring for"], num: [5, 6, 7, 8, 9, 10, 11, 12, 13], statusCol: 15, rows };
      }
      // readings log: trend points sampled at the chosen interval inside the time range
      const now = Date.now(), from = f.range.value === "all" ? 0 : now - +f.range.value * 60000, step = +f.interval.value * 60000;
      const rows = [];
      motors.forEach(({ d, m }) => {
        let last = -Infinity;
        trendPoints(m).forEach((p) => {
          if (p.t < from || p.t - last < step - 1000) return;
          last = p.t;
          const hot = hotOf(p.v), rise = hot - p.v[AMB], spread = spreadOf(p.v);
          const s = [lvl(rise, LIMITS.riseWarn, LIMITS.riseCrit), lvl(hot, LIMITS.warn, LIMITS.crit), lvl(spread, LIMITS.devWarn, LIMITS.devCrit)].reduce((w, c) => (RANK[c] > RANK[w] ? c : w), "ok");
          if (f.cond.value !== "all" && s !== f.cond.value) return;
          rows.push({ t: p.t, status: s, cells: [stamp(p.t), m.id, d.name, ...p.v.map((v) => v.toFixed(1)), rise.toFixed(1), spread.toFixed(1), VERDICT_SHORT[s]] });
        });
      });
      rows.sort((a, b) => a.t - b.t || a.cells[1].localeCompare(b.cells[1]));
      return { title: "Temperature readings", cols: ["Time", "Motor", "Device", ...PROBES.map((p) => `${p} °C`), "Max rise K", "T1–T4 spread °C", "Status"], num: [3, 4, 5, 6, 7, 8, 9], statusCol: 10, rows };
    }
    const filterText = () => [
      `Device: ${f.device.selectedOptions[0].text}`, `Motor: ${f.motor.selectedOptions[0].text}`, `Condition: ${f.cond.selectedOptions[0].text}`,
      ...(f.type.value === "readings" ? [`Range: ${f.range.selectedOptions[0].text}`, `Every ${f.interval.selectedOptions[0].text}`] : [])
    ];

    let report = null;
    const render = () => {
      $$(".rep-readings").forEach((el) => (el.hidden = f.type.value !== "readings"));
      report = build();
      const c = { ok: 0, warn: 0, crit: 0, off: 0, stop: 0 };
      report.rows.forEach((r) => c[r.status]++);
      const motorsIn = new Set(report.rows.map((r) => r.cells[report.title === "Condition summary" ? 0 : 1])).size;
      $("#repSummary").innerHTML = `
        <div><span>${report.title === "Condition summary" ? "Motors in report" : "Readings in report"}</span><b class="num">${report.rows.length}${report.title === "Condition summary" ? "" : `<small> from ${motorsIn} motor${motorsIn === 1 ? "" : "s"}</small>`}</b></div>
        <div><span style="color:var(--ok-text)">${ico("checkCircle")}Good</span><b class="num">${c.ok}</b></div>
        <div><span style="color:var(--warn-text)">${ico("alert")}Monitor</span><b class="num">${c.warn}</b></div>
        <div><span style="color:var(--crit-text)">${ico("xCircle")}Not OK</span><b class="num">${c.crit + c.off}</b></div>
        ${report.rows.length ? `<div class="cond-split" role="img" aria-label="${c.ok} good, ${c.warn} monitor, ${c.crit} not OK">${["ok", "warn", "crit"].filter((k) => c[k]).map((k) => `<span class="${k}" style="flex:${c[k]}" data-tip="${VERDICT_SHORT[k]}|${c[k]} of ${report.rows.length} rows"></span>`).join("")}</div>` : ""}`;
      $("#repTitle").textContent = report.title;
      $("#repMeta").textContent = `${filterText().join(" · ")} · data as of ${new Date().toLocaleTimeString()}`;
      $("#repPrintHead").innerHTML = `<h2>TractionTherm · ${esc(report.title)}</h2><p>Generated ${esc(stamp(Date.now()))} · ${esc(filterText().join(" · "))}</p><p>Limits: warning ${LIMITS.riseWarn} K / alarm ${LIMITS.riseCrit} K rise above ambient · alarm ${LIMITS.crit} °C · T1–T4 spread ${LIMITS.devCrit} °C · equilibrium &lt; ${EQ_RATE} K/h (IEC 60034-1)</p>`;
      $("#repHead").innerHTML = `<tr>${report.cols.map((h, i) => `<th${report.num.includes(i) ? ' class="num"' : ""}>${esc(h)}</th>`).join("")}</tr>`;
      $("#repRows").innerHTML = report.rows.length ? report.rows.map((r) => `<tr>${r.cells.map((v, i) => `<td data-label="${esc(report.cols[i])}"${i === 0 ? ' class="lead-cell"' : report.num.includes(i) ? ' class="num"' : ""}>${i === report.statusCol ? verdictPill(r.status) : esc(v || "—")}</td>`).join("")}</tr>`).join("")
        : `<tr><td colspan="${report.cols.length}" class="muted" style="text-align:center;padding:28px">No data matches these filters.</td></tr>`;
      $("#repFoot").textContent = `${report.rows.length} row${report.rows.length === 1 ? "" : "s"} · the download contains exactly the rows shown above`;
      updateAlertCount();
    };

    $("#repCsv").addEventListener("click", () => {
      if (!allowed("reports")) return;
      if (!report || !report.rows.length) { toast("Nothing to download — change the filters"); return; }
      const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
      const lines = [["Report", report.title], ["Generated", stamp(Date.now())], ...filterText().map((t) => t.split(": ")), [], report.cols, ...report.rows.map((r) => r.cells)];
      const blob = new Blob(["﻿" + lines.map((l) => l.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      const d = new Date(), pad = (n) => String(n).padStart(2, "0");
      a.href = URL.createObjectURL(blob);
      a.download = `tractiontherm-${f.type.value}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast(`Downloaded ${report.rows.length} rows`);
    });
    $("#repPrint").addEventListener("click", () => { if (!allowed("reports")) return; render(); window.print(); });
    $("#repReset").addEventListener("click", () => { defaults(); render(); });
    $("#repForm").addEventListener("change", (e) => { if (e.target === f.device) fillMotors(); render(); });
    render();
    return null; // reports are a snapshot: they refresh when the filters change, not every 2 s
  }

  /* =========================================================
     Page: Users
     ========================================================= */
  const roleBadge = (r) => `<span class="role-badge role-${esc(r.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}">${esc(r)}</span>`;
  const fmtLogin = (t) => (t ? new Date(t).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Never");
  const activeAdmins = () => USERS.filter((u) => u.active && u.role === "Administrator");

  function pageUsers() {
    const dlg = $("#userDialog"), form = $("#userForm"), err = $("#ufError");
    let editing = null;
    $("#roleFilter").innerHTML = `<option value="">All roles</option>` + ROLES.map((r) => `<option>${esc(r.name)}</option>`).join("");
    form.elements.role.innerHTML = ROLES.map((r) => `<option>${esc(r.name)}</option>`).join("");

    const render = () => {
      const me = currentUser(), term = ($("#userSearch").value || "").toLowerCase(), rf = $("#roleFilter").value;
      $("#userSummary").innerHTML = `
        <div><span>Users</span><b class="num">${USERS.length}</b></div>
        <div><span style="color:var(--ok-text)">${ico("checkCircle")}Active</span><b class="num">${USERS.filter((u) => u.active).length}</b></div>
        <div><span>${ico("key")}Administrators</span><b class="num">${activeAdmins().length}</b></div>
        <div><span class="muted">${ico("lock")}Disabled</span><b class="num">${USERS.filter((u) => !u.active).length}</b></div>`;
      const rows = USERS.filter((u) => (!rf || u.role === rf) && [u.name, u.username, u.email].join(" ").toLowerCase().includes(term));
      $("#userCount").textContent = `${rows.length} of ${USERS.length} users`;
      $("#userRows").innerHTML = rows.length ? rows.map((u) => {
        const self = me && me.id === u.id;
        const lastAdmin = u.role === "Administrator" && u.active && activeAdmins().length === 1;
        const block = self ? "You can't delete your own account" : lastAdmin ? "At least one active Administrator is required" : "";
        return `<tr>
          <td class="lead-cell" data-label="User"><div class="cell-dev"><span class="avatar">${esc(initials(u.name))}</span><div><b>${esc(u.name)}${self ? ' <span class="you-tag">You</span>' : ""}</b><span>${esc(u.email)}</span></div></div></td>
          <td data-label="Username" class="mono">${esc(u.username)}</td>
          <td data-label="Role">${roleBadge(u.role)}</td>
          <td data-label="Status">${u.active ? `<span class="badge ok">${ico("checkCircle")}Active</span>` : `<span class="badge off">${ico("lock")}Disabled</span>`}</td>
          <td data-label="Last sign-in" class="num">${esc(fmtLogin(u.lastLogin))}</td>
          <td data-label=""><div class="row-actions">
            <button class="btn btn-sm btn-ghost" data-uview="${u.id}" aria-label="View ${esc(u.name)}" title="View">${ico("eye")}</button>
            <button class="btn btn-sm btn-ghost" data-uedit="${u.id}" aria-label="Edit ${esc(u.name)}" title="Edit">${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-udel="${u.id}" aria-label="Delete ${esc(u.name)}" title="${block || "Delete"}" ${block ? "disabled" : ""}>${ico("trash")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="6" class="muted" style="text-align:center;padding:28px">No users match your filters.</td></tr>`;
    };

    function open(u) {
      editing = u || null;
      form.reset(); err.classList.remove("show");
      $$("input, select", form).forEach((el) => el.setCustomValidity(""));
      $("#uTitle").textContent = u ? `Edit ${u.name}` : "Add user";
      $("#uSave").textContent = u ? "Save changes" : "Add user";
      form.elements.password.required = !u;
      $("#pwHint").textContent = u ? "Leave blank to keep the current password." : "At least 6 characters.";
      if (u) {
        ["name", "username", "email", "role"].forEach((k) => (form.elements[k].value = u[k]));
        form.elements.active.checked = u.active;
      } else form.elements.role.value = "Operator";
      dlg.showModal();
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements, fail = (m) => { err.textContent = m; err.classList.add("show"); };
      const data = { name: f.name.value.trim(), username: f.username.value.trim().toLowerCase(), email: f.email.value.trim().toLowerCase(), role: f.role.value, active: f.active.checked };
      if (!data.name || !data.username || !data.email) return fail("Name, username and email are required.");
      if (!/^[a-z0-9._-]{3,20}$/.test(data.username)) return fail("Username: 3–20 letters, numbers, dots or dashes.");
      if (!/^\S+@\S+\.\S+$/.test(data.email)) return fail("Enter a valid email address.");
      if (USERS.some((u) => u !== editing && u.username === data.username)) return fail(`Username ${data.username} is already taken.`);
      if (USERS.some((u) => u !== editing && u.email === data.email)) return fail(`${data.email} already has an account.`);
      const pw = f.password.value;
      if ((!editing || pw) && pw.length < 6) return fail("Password must be at least 6 characters.");
      const me = currentUser();
      if (editing && me && editing.id === me.id && (!data.active || data.role !== editing.role) && editing.role === "Administrator" && activeAdmins().length === 1) return fail("You are the only active Administrator — keep your role and account active.");
      if (editing && editing.role === "Administrator" && editing.active && (data.role !== "Administrator" || !data.active) && activeAdmins().length === 1) return fail("At least one active Administrator is required.");
      if (editing) { Object.assign(editing, data); if (pw) editing.password = pw; }
      else USERS.push({ id: Math.max(0, ...USERS.map((u) => u.id)) + 1, ...data, password: pw, lastLogin: null });
      saveUsers(); dlg.close(); applyPerms();
      toast(editing ? `${data.name} updated` : `${data.name} added`);
      render();
    });

    function viewUser(u) {
      const perms = grantsOf(u.role).map((k) => PERMISSIONS.find((p) => p.key === k).label);
      const d = viewDialog({
        title: u.name, sub: `${u.username} · ${u.email}`,
        rows: [["Role", roleBadge(u.role)], ["Status", u.active ? "Active" : "Disabled"], ["Last sign-in", esc(fmtLogin(u.lastLogin))]],
        body: `<div><div class="detail-title">What this role can do <a class="link-btn" href="roles.html" style="margin-left:6px">Edit permissions</a></div><ul class="perm-list">${perms.map((p) => `<li>${ico("checkCircle")}${esc(p)}</li>`).join("")}</ul></div>`,
        actions: `<button type="button" class="btn btn-primary" data-v-edit>${ico("edit")}Edit</button>`
      });
      d.querySelector("[data-v-edit]").addEventListener("click", () => { d.close(); open(u); });
    }
    async function removeUser(u) {
      if (!(await confirmDialog({ title: `Delete ${u.name}?`, message: `${u.username} will no longer be able to sign in. This cannot be undone.`, confirmLabel: "Delete user" }))) return;
      USERS = USERS.filter((x) => x !== u); saveUsers(); toast(`${u.name} deleted`); render();
    }

    $("#addUser").addEventListener("click", () => open());
    $("#userRows").addEventListener("click", (e) => {
      const b = e.target.closest("[data-uview],[data-uedit],[data-udel]"); if (!b || b.disabled) return;
      const u = USERS.find((x) => x.id === +(b.dataset.uview || b.dataset.uedit || b.dataset.udel));
      if (b.dataset.uview) viewUser(u); else if (b.dataset.uedit) open(u); else removeUser(u);
    });
    $("#userSearch").addEventListener("input", render);
    $("#roleFilter").addEventListener("change", render);
    const qr = new URLSearchParams(location.search).get("role");
    if (qr && ROLES.some((r) => r.name === qr)) $("#roleFilter").value = qr;
    render();
    return null;
  }

  /* =========================================================
     Page: Roles & Permissions — add / edit / delete roles, tick permissions
     Administrator is a system role: always full access, can't be renamed or deleted.
     ========================================================= */
  function pageRoles() {
    const dlg = $("#roleDialog"), form = $("#roleForm"), err = $("#rfError");
    let editing = null;
    const snapshot = () => JSON.parse(JSON.stringify(Object.fromEntries(ROLES.map((r) => [r.name, grantsOf(r.name)]))));
    let draft = snapshot();
    const dirty = () => ROLES.some((r) => [...(draft[r.name] || [])].sort().join() !== grantsOf(r.name).sort().join());
    const isLocked = (p, role) => role === ADMIN_ROLE || p.locked === "all" || p.locked === role;
    const lockNote = (p) => (p.locked === "all" ? "Always on" : p.locked ? `Always on for ${p.locked}` : "");

    const render = () => {
      $("#roleCount").textContent = `${ROLES.length} role${ROLES.length === 1 ? "" : "s"}`;
      $("#roleCards").innerHTML = ROLES.map((r) => {
        const n = USERS.filter((u) => u.role === r.name).length, g = (draft[r.name] || []).length, sys = r.name === ADMIN_ROLE;
        return `<div class="card role-card">
          <div class="role-top">${roleBadge(r.name)}<span class="muted">${n} user${n === 1 ? "" : "s"}</span></div>
          <p>${esc(r.desc || "—")}</p>
          <div class="role-meter"><span class="bar"><i style="width:${((g / PERMISSIONS.length) * 100).toFixed(0)}%"></i></span><span class="num">${g} / ${PERMISSIONS.length}</span></div>
          <div class="role-actions">
            <a class="btn btn-sm" href="users.html?role=${encodeURIComponent(r.name)}">${ico("users")}Users</a>
            ${sys ? `<span class="role-sys" title="The Administrator role always has full access">${ico("lock")}System role</span>` : `
            <button type="button" class="btn btn-sm btn-ghost" data-redit="${esc(r.name)}" aria-label="Edit ${esc(r.name)}" title="Edit">${ico("edit")}</button>
            <button type="button" class="btn btn-sm btn-ghost btn-danger" data-rdel="${esc(r.name)}" aria-label="Delete ${esc(r.name)}" title="Delete">${ico("trash")}</button>`}
          </div>
        </div>`;
      }).join("");
      $("#permHead").innerHTML = `<th>Permission</th>` + ROLES.map((r) => `<th class="perm-col">${esc(r.name)}</th>`).join("");
      $("#permRows").innerHTML = PERMISSIONS.map((p) => `<tr>
        <td data-label="Permission">${esc(p.label)}${lockNote(p) ? `<small class="perm-note">${esc(lockNote(p))}</small>` : ""}</td>
        ${ROLES.map((r) => {
          const locked = isLocked(p, r.name), on = (draft[r.name] || []).includes(p.key);
          return `<td data-label="${esc(r.name)}" class="perm-cell"><label class="perm-check${locked ? " locked" : ""}" title="${esc(r.name)} · ${esc(p.label)}">
            <input type="checkbox" data-role="${esc(r.name)}" data-perm="${p.key}" ${on ? "checked" : ""} ${locked ? "disabled" : ""}><span>${ico("check")}</span></label></td>`;
        }).join("")}</tr>`).join("");
      const d = dirty();
      $("#permDirty").hidden = !d; $("#permSave").disabled = !d;
    };

    // ----- add / edit role (name, description, permissions) -----
    function open(role) {
      editing = role || null;
      form.reset(); err.classList.remove("show");
      $("#rTitle").textContent = role ? `Edit role · ${role.name}` : "Add role";
      $("#rSave").textContent = role ? "Save role" : "Add role";
      form.elements.name.value = role ? role.name : "";
      form.elements.desc.value = role ? role.desc || "" : "";
      const have = role ? draft[role.name] || [] : ["view"];
      $("#rPerms").innerHTML = PERMISSIONS.map((p) => {
        const locked = p.locked === "all" || (role && p.locked === role.name);
        const forAdminOnly = p.locked && p.locked !== "all"; // e.g. user administration stays with Administrator
        return `<label class="check perm-row${locked || forAdminOnly ? " locked" : ""}">
          <input type="checkbox" name="perm" value="${p.key}" ${have.includes(p.key) || locked ? "checked" : ""} ${locked || forAdminOnly ? "disabled" : ""}>
          <span>${esc(p.label)}${locked ? ` <small class="perm-note">${esc(lockNote(p))}</small>` : forAdminOnly ? ` <small class="perm-note">Administrator only</small>` : ""}</span></label>`;
      }).join("");
      dlg.showModal();
    }
    $("#rAll").addEventListener("click", () => $$("#rPerms input:not(:disabled)").forEach((c) => (c.checked = true)));
    $("#rNone").addEventListener("click", () => $$("#rPerms input:not(:disabled)").forEach((c) => (c.checked = false)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fail = (m) => { err.textContent = m; err.classList.add("show"); };
      const name = form.elements.name.value.trim().replace(/\s+/g, " "), desc = form.elements.desc.value.trim();
      if (name.length < 2 || name.length > 30) return fail("Role name: 2–30 characters.");
      if (!/^[A-Za-z0-9 &/_-]+$/.test(name)) return fail("Role name: letters, numbers, spaces, & / _ - only.");
      if (ROLES.some((r) => r !== editing && r.name.toLowerCase() === name.toLowerCase())) return fail(`A role called ${name} already exists.`);
      const perms = [...new Set(["view", ...$$("#rPerms input:checked").map((c) => c.value)])];
      if (editing) {
        const old = editing.name;
        if (old !== name) {
          USERS.forEach((u) => { if (u.role === old) u.role = name; });
          delete GRANTS[old]; delete draft[old];
          saveUsers();
        }
        editing.name = name; editing.desc = desc;
      } else ROLES.push({ name, desc });
      GRANTS[name] = perms; draft[name] = perms.slice();
      saveRoles(); saveGrants(); applyPerms();
      dlg.close(); toast(editing ? `Role ${name} saved` : `Role ${name} added`);
      render();
    });
    async function removeRole(role) {
      const n = USERS.filter((u) => u.role === role.name).length;
      if (n) {
        await confirmDialog({ title: `${role.name} is in use`, message: `${n} user${n === 1 ? " has" : "s have"} this role. Move ${n === 1 ? "them" : "them"} to another role on the Users page, then delete it.`, confirmLabel: "OK", danger: false });
        return;
      }
      if (!(await confirmDialog({ title: `Delete role ${role.name}?`, message: "The role and its permissions are removed. This cannot be undone.", confirmLabel: "Delete role" }))) return;
      ROLES = ROLES.filter((r) => r !== role);
      delete GRANTS[role.name]; delete draft[role.name];
      saveRoles(); saveGrants(); toast(`Role ${role.name} deleted`); render();
    }

    $("#addRole").addEventListener("click", () => open());
    $("#roleCards").addEventListener("click", (e) => {
      const b = e.target.closest("[data-redit],[data-rdel]"); if (!b) return;
      const role = ROLES.find((r) => r.name === (b.dataset.redit || b.dataset.rdel));
      if (role) (b.dataset.redit ? open(role) : removeRole(role));
    });
    // ----- permission matrix (tick, then Save) -----
    $("#permRows").addEventListener("change", (e) => {
      const cb = e.target.closest("input[data-perm]"); if (!cb) return;
      const list = draft[cb.dataset.role] || [];
      draft[cb.dataset.role] = cb.checked ? [...new Set([...list, cb.dataset.perm])] : list.filter((k) => k !== cb.dataset.perm);
      render();
    });
    $("#permSave").addEventListener("click", () => {
      ROLES.forEach((r) => (GRANTS[r.name] = (draft[r.name] || []).slice()));
      saveGrants(); applyPerms(); render(); toast("Permissions saved");
    });
    $("#permReset").addEventListener("click", async () => {
      if (!(await confirmDialog({ title: "Reset permissions?", message: "Built-in roles go back to their default permissions. Roles you added are not changed.", confirmLabel: "Reset", danger: false }))) return;
      Object.keys(DEFAULT_GRANTS).forEach((k) => { if (ROLES.some((r) => r.name === k)) GRANTS[k] = DEFAULT_GRANTS[k].slice(); });
      saveGrants(); draft = snapshot();
      applyPerms(); render(); toast("Default permissions restored");
    });
    render();
    return null;
  }

  /* =========================================================
     Page: Login
     ========================================================= */
  function pageLogin() {
    const form = $("#loginForm"), err = $("#loginError"), pw = $("#password");
    $("#togglePw").addEventListener("click", (e) => {
      const show = pw.type === "password";
      pw.type = show ? "text" : "password";
      e.currentTarget.innerHTML = ico(show ? "eyeOff" : "eye");
      e.currentTarget.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Demo accounts are stored in the browser — replace with a call to your login API.
      const name = form.elements.username.value.trim().toLowerCase();
      const fail = (m) => { err.textContent = m; err.classList.add("show"); };
      if (!name || !pw.value) return fail("Enter your username and password.");
      const u = USERS.find((x) => x.username === name || x.email === name);
      if (!u || u.password !== pw.value) return fail("Incorrect username or password.");
      if (!u.active) return fail("This account is disabled. Ask an administrator to enable it.");
      err.classList.remove("show");
      u.lastLogin = Date.now(); saveUsers();
      store.set(SESSION_KEY, u.id);
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true; btn.textContent = "Signing in…";
      setTimeout(() => (location.href = "dashboard.html"), 600);
    });
    // animate preview tiles
    const tiles = $$(".auth-preview .pv b");
    if (tiles.length) setInterval(() => tiles.forEach((t) => {
      const b = +t.dataset.base; t.textContent = (b + (Math.random() - 0.5) * 1.6).toFixed(1) + "°";
    }), 1800);
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    paintIcons();
    initTips();
    initTheme();
    const page = document.body.dataset.page;
    if (page !== "login" && !currentUser()) { location.replace("index.html"); return; }
    if ((page === "users" || page === "roles") && !can("users")) { location.replace("dashboard.html"); return; }
    if (page === "login") store.set(SESSION_KEY, null);
    initShell();
    applyPerms();
    $$('.nav a[href="index.html"]').forEach((a) => a.addEventListener("click", () => store.set(SESSION_KEY, null)));
    const pages = { dashboard: pageDashboard, monitor: pageMonitor, reports: pageReports, devices: pageDevices, motors: pageMotorMgmt, users: pageUsers, roles: pageRoles, login: pageLogin };
    const render = pages[page] ? pages[page]() : null;
    if (render) rerender = render;
    animateValues();
    if (!calm.matches) { document.body.classList.add("anim-in"); setTimeout(() => document.body.classList.remove("anim-in"), 1600); }
    paintLimitText();
    if (page !== "login") updateAlertCount();
    if (render) setInterval(() => { tick(); render(); animateValues(); }, STEP_MS);
    else if (page !== "login") setInterval(tick, STEP_MS);
  });
})();
