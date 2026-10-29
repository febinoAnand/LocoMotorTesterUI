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
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
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
    { key: "activity", label: "View activity log" },
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
    Supervisor: ["view", "trigger", "limits", "reports", "motors", "devices", "activity"],
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
    logActivity("access", `Tried to ${p ? p.label.toLowerCase() : perm} — not allowed for this role`);
    return false;
  };
  const initials = (n) => String(n).trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  // mark the page with what the user may NOT do, so CSS hides those controls everywhere
  /* ---------- Activity log ----------
     Every action is recorded with who did it and when (kept in this browser, newest
     2000 entries). The log is read-only: nothing in the app edits or clears it. */
  const ACT_KEY = "tt-activity-v1", ACT_MAX = 2000;
  const ACT_CATS = { auth: "Sign-in", device: "Devices", motor: "Motors", test: "Tests & monitoring", limits: "Limits & settings", user: "Users", role: "Roles & permissions", report: "Reports", access: "Access denied" };
  function logActivity(cat, text, who) {
    const u = who === undefined ? currentUser() : who;
    const log = store.get(ACT_KEY, []);
    log.push({ t: Date.now(), cat, text, user: u ? u.name : "Unknown", username: u ? u.username : "", role: u ? u.role : "" });
    if (log.length > ACT_MAX) log.splice(0, log.length - ACT_MAX);
    store.set(ACT_KEY, log);
  }
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
     Device → 2 channels; each channel checks one motor with 2 temperature
              sensors on it (DE drive end, NDE non-drive end) + 1 ambient (TA)
     Readings are arrays in that order: [DE, NDE, TA]

     A motor is judged on how far its hottest probe is above ambient,
     its absolute temperature, the DE / NDE difference, the final
     temperature predicted by the heating model, and how it compares with
     the other motor on the same device. All limits are editable.
     ========================================================= */
  const DEFAULT_LIMITS = { warn: 80, crit: 100, riseWarn: 25, riseCrit: 30, devWarn: 10, devCrit: 15, ambMax: 50, partnerWarn: 8, partnerCrit: 12 };
  const LIMITS_KEY = "tt-limits-v3"; // v3: adds motor-to-motor comparison
  const LIMITS = { ...DEFAULT_LIMITS, ...store.get(LIMITS_KEY, {}) };
  const PROBES = ["DE", "NDE", "TA"]; // drive end, non-drive end, ambient
  const PROBE_NAME = { DE: "Drive end", NDE: "Non-drive end", TA: "Ambient air" };
  const AMB = PROBES.length - 1;                    // index of the ambient probe (TA)
  const MS = PROBES.slice(0, AMB).map((_, j) => j); // indices of the motor probes
  const hotOf = (v) => Math.max(...v.slice(0, AMB));
  const spreadOf = (v) => hotOf(v) - Math.min(...v.slice(0, AMB));
  // min / max limit per terminal (Settings page): a reading outside its range is an alarm
  const DEFAULT_TERM = { DE: { min: 0, max: 120 }, NDE: { min: 0, max: 120 }, TA: { min: 0, max: 50 } };
  const TERM_KEY = "tt-terminals-v1";
  const TERM = JSON.parse(JSON.stringify(DEFAULT_TERM));
  const OLD_TERM = { T1: "DE", T2: "NDE" }; // limits saved when the sensors were called T1 / T2
  Object.entries(store.get(TERM_KEY, {})).map(([p, r]) => [OLD_TERM[p] || p, r]).forEach(([p, r]) => { if (TERM[p] && isFinite(r.min) && isFinite(r.max)) TERM[p] = { min: +r.min, max: +r.max }; });
  const outOfRange = (v, j) => v < TERM[PROBES[j]].min || v > TERM[PROBES[j]].max;
  const termBreaches = (vals) => vals.map((v, j) => ({ p: PROBES[j], v, r: TERM[PROBES[j]] })).filter((o, j) => outOfRange(o.v, j));
  const HIST = 150;         // live window kept per probe: 5 min at 2 s (real-time graph, rate of rise)
  const STEP_MS = 2000;     // simulated sample interval
  const TREND_EVERY_MS = 60 * 1000;    // run trend chart: one point per minute

  const DEFAULT_DEVICES = [
    { id: "TMU-01", name: "Device A", location: "Loco Shed · Bay 3", ip: "192.168.10.21", fw: "2.4.1", online: true, signal: 4, interval: 2,
      motors: [
        { id: "TM-4471", testId: "TEST-0001", stator: "ST-60681", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [50, 53, 31], runMin: 95, tau: 12, channel: 1 },
        { id: "TM-4472", testId: "TEST-0002", stator: "ST-60682", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [57, 59, 32], runMin: 95, tau: 14, channel: 2 },
        { id: "TM-4473", testId: "TEST-0007", stator: "ST-60683", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31246", base: [52, 54, 31], runMin: 0.5, tau: 12, active: false, queued: true }
      ] },
    { id: "TMU-02", name: "Device B", location: "Loco Shed · Bay 5", ip: "192.168.10.22", fw: "2.4.1", online: true, signal: 3, interval: 2,
      motors: [
        { id: "TM-3810", testId: "TEST-0003", stator: "ST-15251", model: "HS 15250A · 3-phase AC", loco: "WAP-7 #30412", base: [66, 69, 33], runMin: 62, tau: 15, channel: 1 },
        { id: "TM-3811", testId: "TEST-0004", stator: "ST-15252", model: "HS 15250A · 3-phase AC", loco: "WAP-7 #30412", base: [57, 59, 33], runMin: 62, tau: 15, channel: 2 },
        { id: "TM-5121", testId: "TEST-0005", stator: "ST-65912", model: "TAO 659 · DC series", loco: "WAG-7 #27850", base: [41, 53, 29], runMin: 70, tau: 10, active: false, channel: 1 },
        { id: "TM-5120", testId: "TEST-0006", stator: "ST-65911", model: "TAO 659 · DC series", loco: "WAG-7 #27850", base: [61, 63, 29], runMin: 0.5, tau: 30, active: false, queued: true }
      ] }
  ];

  const DEV_KEY = "tt-devices-v6"; // v6: two devices, motors checked in turns (queue)
  const MAX_RUN = 2; // channels per device = motors a device can check at the same time
  const CHANNELS = [1, 2];
  const isRunning = (m) => m.active !== false;
  const runningOn = (d) => d.motors.filter(isRunning).sort((a, b) => (a.channel || 9) - (b.channel || 9));
  const freeChannel = (d, except) => CHANNELS.find((c) => !d.motors.some((m) => m !== except && isRunning(m) && m.channel === c));
  const chLabel = (m) => (m.channel ? `CH ${m.channel}` : "");
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
  // motors saved with T1–T4 + TA: keep T1 → DE, T2 → NDE and the ambient; give running motors a channel
  DEVICES.forEach((d) => {
    d.motors.forEach((m) => { if (m.base && m.base.length === 5) m.base = [m.base[0], m.base[1], m.base[4]]; });
    d.motors.filter(isRunning).forEach((m) => { if (!m.channel || d.motors.some((x) => x !== m && isRunning(x) && x.channel === m.channel)) m.channel = freeChannel(d, m); });
  });
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
  // the partner, only when a comparison is fair: both heated for a similar time (a just-started motor is still cold)
  const COMPARE_MIN = 15;
  function comparablePartner(m) {
    const p = partnerOf(m);
    return p && m.runStart && p.runStart && runMinutes(m) >= COMPARE_MIN && runMinutes(p) >= COMPARE_MIN && Math.abs(m.runStart - p.runStart) <= COMPARE_MIN * 60000 ? p : null;
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
      { k: "Rise above ambient", d: `Hotter of DE / NDE − TA · Warn ${L.riseWarn} K · Alarm ${L.riseCrit} K`, v: rise.toFixed(1) + " K", n: rise, warn: L.riseWarn, crit: L.riseCrit },
      { k: "Motor temperature", d: `Hotter of DE / NDE · Warn ${L.warn} °C · Alarm ${L.crit} °C`, v: hot.toFixed(1) + " °C", n: hot, warn: L.warn, crit: L.crit },
      { k: "DE / NDE difference", d: `Warn ${L.devWarn} °C · Alarm ${L.devCrit} °C`, v: "Δ " + dev.toFixed(1) + " °C", n: dev, warn: L.devWarn, crit: L.devCrit }
    ];
    // heating model: warn early if the predicted final rise will pass the alarm limit
    if (th && th.final != null && th.confident) {
      checks.push({ k: "Predicted final rise", d: `Heating model · τ ${th.tau.toFixed(0)} min · Warn if it will reach ${L.riseCrit} K`, v: th.final.toFixed(1) + " K", n: th.final, warn: L.riseCrit, crit: null });
    } else checks.push({ k: "Predicted final rise", d: "Heating model needs more readings", v: "Collecting data", s: "ok" });
    // same-condition comparison with the other motor on this device
    // only fair when both have heated for a similar time (a just-started motor is still cold)
    const p = comparablePartner(m);
    if (p) {
      const delta = rise - (hotOf(p.live) - p.live[AMB]);
      checks.push({ k: `Compared with ${p.id}`, d: `Same device, same conditions · Warn ${L.partnerWarn} K · Alarm ${L.partnerCrit} K hotter`, v: (delta >= 0 ? "+" : "") + delta.toFixed(1) + " K", n: Math.max(0, delta), warn: L.partnerWarn, crit: L.partnerCrit });
    }
    const out = termBreaches(m.live);
    checks.push(
      { k: "Terminal limits", d: PROBES.map((p) => `${p} ${TERM[p].min}–${TERM[p].max}`).join(" · ") + " °C",
        v: out.length ? out.map((o) => `${o.p} ${o.v.toFixed(1)} °C ${o.v > o.r.max ? `> max ${o.r.max}` : `< min ${o.r.min}`} °C`).join(", ") : `${PROBES.length} / ${PROBES.length} in range`, s: out.length ? "crit" : "ok" },
      { k: "Probe readings plausible", d: `${PROBES.join(" · ")} reporting`, v: implausible ? "Check probe" : `${PROBES.length} / ${PROBES.length}`, s: implausible ? "warn" : "ok" }
    );
    checks.forEach((c) => { if (c.n != null) c.s = lvl(c.n, c.warn, c.crit); });
    const status = checks.reduce((w, c) => (RANK[c.s] > RANK[w] ? c.s : w), "ok");
    return { hot, amb, rise, dev, th, stable: !!(th && th.eq), checks, status: m.queued ? "wait" : m.active === false ? "stop" : status, condition: status };
  }
  const allMotors = () => DEVICES.flatMap((d) => d.motors.map((m) => ({ d, m })));
  const liveMotors = () => allMotors().filter((x) => x.d.online && x.m.active !== false);
  // registered motors not assigned to any device (no readings until assigned)
  const DEFAULT_SPARE = [{ id: "TM-6002", stator: "ST-60690", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31250" }];
  const SPARE_KEY = "tt-spare-v1";
  let SPARE = store.get(SPARE_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_SPARE));
  const saveSpare = () => store.set(SPARE_KEY, SPARE.map(({ id, stator, model, loco }) => ({ id, stator, model, loco })));
  // motors saved before the stator number existed: take it from the sample data when the ID matches
  const DEFAULT_STATOR = Object.fromEntries([...DEFAULT_DEVICES.flatMap((d) => d.motors), ...DEFAULT_SPARE].map((m) => [m.id, m.stator]));
  [...DEVICES.flatMap((d) => d.motors), ...SPARE].forEach((m) => { if (!m.stator && DEFAULT_STATOR[m.id]) m.stator = DEFAULT_STATOR[m.id]; });
  const everyMotor = () => [...allMotors(), ...SPARE.map((m) => ({ d: null, m }))];
  /* Test ID: one per test run (a motor checked on a device). Given when the motor is
     assigned for test; a stopped test keeps its ID; restarting starts a new test. */
  const TEST_SEQ_KEY = "tt-test-seq";
  const DEFAULT_TEST = Object.fromEntries(DEFAULT_DEVICES.flatMap((d) => d.motors).map((m) => [m.id, m.testId]));
  const testNo = (t) => { const r = /^TEST-(\d+)$/i.exec(t || ""); return r ? +r[1] : 0; }; // only the app's own numbering counts; your own IDs don't move it
  const nextTestId = () => "TEST-" + String(Math.max(store.get(TEST_SEQ_KEY, 0), ...allMotors().map(({ m }) => testNo(m.testId))) + 1).padStart(4, "0");
  const useTestId = (t) => { store.set(TEST_SEQ_KEY, Math.max(store.get(TEST_SEQ_KEY, 0), testNo(t))); return t; };
  // a free, well-formed Test ID, or an error message
  const checkTestId = (raw, self) => {
    const t = String(raw || "").trim().toUpperCase();
    if (!t) return { err: "Test ID is required." };
    if (!/^[A-Z0-9][A-Z0-9-]{2,23}$/.test(t)) return { err: "Test ID: 3–24 letters, numbers or dashes." };
    const other = allMotors().find(({ m }) => m !== self && (m.testId || "").toUpperCase() === t);
    return other ? { err: `Test ID ${t} is already used by ${other.m.id}.` } : { t };
  };
  // motors saved before test IDs existed
  let filledTests = false;
  allMotors().forEach(({ m }) => {
    if (m.testId) return;
    const def = DEFAULT_TEST[m.id];
    m.testId = def && !allMotors().some((x) => x.m.testId === def) ? def : useTestId(nextTestId());
    filledTests = true;
  });
  if (filledTests) saveDevices(); // saved once, so the IDs stay the same on every page
  const testIdField = (id, value) => `<div class="field"><label for="${id}">Test ID</label><input class="input mono" id="${id}" name="testId" value="${esc(value)}" maxlength="24" autocomplete="off" required><span class="hint">Pre-filled with the next free number · change it if your test has its own ID</span></div>`;
  const findMotor = (id) => everyMotor().find((x) => x.m.id === id) || null;
  // effective sensor limits for a given ambient (rise limit usually bites before the absolute one)
  const effLimits = (L, amb) => (amb == null ? { warn: L.warn, crit: L.crit } : { warn: Math.min(L.warn, amb + L.riseWarn), crit: Math.min(L.crit, amb + L.riseCrit) });
  const tCls = (v, j, amb) => { if (outOfRange(v, j)) return "t-crit"; if (j === AMB) return ""; const e = effLimits(LIMITS, amb); return v >= e.crit ? "t-crit" : v >= e.warn ? "t-warn" : ""; };

  const STATUS = {
    ok: { label: "Within limits", icon: "checkCircle" },
    warn: { label: "Warning", icon: "alert" },
    crit: { label: "Over limit", icon: "xCircle" },
    off: { label: "Offline", icon: "wifiOff" },
    stop: { label: "Stopped", icon: "pause" },
    wait: { label: "Queued", icon: "clock" }
  };
  const badge = (s, label) => `<span class="badge ${s}">${ico(STATUS[s].icon)}${esc(label || STATUS[s].label)}</span>`;
  // device connection status, as shown in the Devices table and the device form
  const statusCell = (d) => (d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : `${badge("off")}<span class="muted last-seen">Last seen ${esc(d.lastSeen || "—")}</span>`);

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

  // Register / edit a motor's details. preset = { id } to edit, { device } when opened from a device's "Assign motor"
  function motorDialog(preset = {}) {
    if (!allowed("motors")) return;
    const cur = preset.id ? findMotor(preset.id) : null;
    const editing = cur && cur.m;
    const target = !editing && preset.device ? DEVICES.find((x) => x.id === preset.device) || null : null;
    const d = makeDialog("motorDialog", `
      <form id="motorForm" novalidate style="display:contents">
        ${dlgHead(editing ? `Edit motor ${editing.id}` : "Add motor", editing ? "Update the motor details." : "Register a traction motor with its stator number.")}
        <div class="modal-body">
          <div class="form-error" id="mfError" role="alert"></div>
          <div class="form-grid">
            <div class="field"><label for="mf-id">Motor ID</label><input class="input mono" id="mf-id" name="id" placeholder="TM-0001" required autofocus></div>
            <div class="field"><label for="mf-stator">Stator No.</label><input class="input mono" id="mf-stator" name="stator" placeholder="ST-00001" required autocomplete="off"></div>
            <div class="field"><label for="mf-model">Model / type</label><input class="input" id="mf-model" name="model" placeholder="3-phase AC traction motor"></div>
            <div class="field"><label for="mf-loco">Locomotive</label><input class="input" id="mf-loco" name="loco" placeholder="WAG-9 #31245"></div>
          </div>
          ${target ? `<div class="form-grid" style="margin-top:14px">${testIdField("mf-test", nextTestId())}</div>` : ""}
          ${target ? `<p class="form-note">${ico("cpu")}Will be assigned to <b>${esc(target.name)}</b>${runningOn(target).length >= MAX_RUN ? " and queued (2 motors are being checked)" : " and checked straight away"}.</p>` : ""}
        </div>
        <div class="modal-foot"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">${editing ? "Save changes" : "Add motor"}</button></div>
      </form>`);
    const f = d.querySelector("#motorForm"), err = d.querySelector("#mfError");
    const clean = (v) => (v === "—" ? "" : v || "");
    if (editing) { f.elements.id.value = editing.id; f.elements.stator.value = clean(editing.stator); f.elements.model.value = clean(editing.model); f.elements.loco.value = clean(editing.loco); }
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = f.elements.id.value.trim().toUpperCase(), stator = f.elements.stator.value.trim().toUpperCase();
      const fail = (msg) => { err.textContent = msg; err.classList.add("show"); };
      if (!id) return fail("Motor ID is required.");
      if (!stator) return fail("Stator No. is required.");
      if (everyMotor().some(({ m }) => m.id.toUpperCase() === id && m !== editing)) return fail(`Motor ${id} already exists.`);
      const other = everyMotor().find(({ m }) => (m.stator || "").toUpperCase() === stator && m !== editing);
      if (other) return fail(`Stator No. ${stator} is already registered to ${other.m.id}.`);
      const tid = target ? checkTestId(f.elements.testId.value, null) : {};
      if (tid.err) return fail(tid.err);
      const info = { id, stator, model: f.elements.model.value.trim() || "—", loco: f.elements.loco.value.trim() || "—" };
      const LBL = { id: "ID", stator: "stator no.", model: "model", loco: "locomotive" };
      const changes = editing ? Object.keys(LBL).filter((k) => (editing[k] || "—") !== info[k]).map((k) => `${LBL[k]} ${editing[k] || "—"} → ${info[k]}`) : [];
      if (editing) Object.assign(editing, info);
      else attachMotor({ ...info }, target, tid.t);
      saveDevices(); saveSpare();
      d.close();
      const mm = target && target.motors.find((x) => x.id === id);
      logActivity(target ? "test" : "motor", editing ? `Edited motor ${id}${changes.length ? ` — ${changes.join(", ")}` : " — no changes"}`
        : target ? `Registered motor ${id} (stator ${stator}) and assigned it to ${target.name} for test ${tid.t}${mm && mm.queued ? " · queued" : ` · checking started on ${chLabel(mm)}`}` : `Registered motor ${id} (stator ${stator}) · not assigned`);
      toast(editing ? `${id} updated` : target ? `${id} added to ${target.name} · ${tid.t}${mm && mm.queued ? " · queued" : " · checking now"}` : `${id} registered — assign it to a device to start checking`);
      rerender();
    });
    d.showModal();
  }
  // Assign a motor to a device, move it to another one, or take it off
  // "Assign motor" on a device: search the registered motors and put one on test there
  function pickMotorDialog(deviceId) {
    if (!allowed("motors")) return;
    const target = DEVICES.find((x) => x.id === deviceId);
    if (!target) return motorDialog({});
    const busy = runningOn(target).length >= MAX_RUN;
    const where = ({ d, m }) => !d ? "Not assigned" : `On ${d.name} · ${isRunning(m) ? `${chLabel(m)} · checking now` : m.queued ? "queued" : "stopped"}`;
    const order = ({ d, m }) => (!d ? 0 : !isRunning(m) && !m.queued ? 1 : m.queued ? 2 : 3); // free motors first
    const pool = () => everyMotor().filter(({ d }) => d !== target).sort((a, b) => order(a) - order(b) || a.m.id.localeCompare(b.m.id));
    const dlg = makeDialog("pickDialog", `
      <form id="pickForm" novalidate style="display:contents">
        ${dlgHead(`Assign a motor to ${target.name}`, busy ? `Both channels on ${target.name} are in use — the motor you pick will be queued.` : `Pick the motor to test · checking starts straight away on CH ${freeChannel(target)}.`)}
        <div class="modal-body">
          <div class="form-error" id="pkError" role="alert"></div>
          <div class="pick-test">${testIdField("pk-test", nextTestId())}</div>
          <label class="pick-label" for="pk-search">Motor to test</label>
          <div class="input-icon"><i data-icon="search"></i>
            <input class="input" id="pk-search" type="search" autocomplete="off" placeholder="Search motor ID, stator no., model or locomotive" aria-label="Search motors"></div>
          <div class="pick-count muted" id="pkCount"></div>
          <ul class="pick-list" id="pkList" role="listbox" aria-label="Motors"></ul>
        </div>
        <div class="modal-foot"><button type="button" class="btn btn-ghost" id="pkNew" style="margin-right:auto">${ico("plus")}Register new motor</button><button type="button" class="btn" data-close>Cancel</button></div>
      </form>`);
    const list = dlg.querySelector("#pkList"), search = dlg.querySelector("#pk-search");
    const draw = () => {
      const term = search.value.trim().toLowerCase(), all = pool();
      const rows = all.filter(({ d, m }) => [m.id, m.stator, m.model, m.loco, m.testId, d ? d.name : "not assigned"].join(" ").toLowerCase().includes(term));
      dlg.querySelector("#pkCount").textContent = all.length ? `${rows.length} of ${all.length} registered motors` : "";
      list.innerHTML = rows.length ? rows.map((x) => `
        <li><button type="button" class="pick-row" data-pick="${esc(x.m.id)}" role="option">
          <span class="pick-id"><b>${esc(x.m.id)}</b><span>Stator No. <span class="mono">${esc(x.m.stator || "—")}</span></span></span>
          <span class="pick-info"><span>${esc(x.m.model)}</span><span class="muted">${esc(x.m.loco)}</span></span>
          <span class="pick-where${x.d ? (isRunning(x.m) ? " busy" : "") : " free"}">${esc(where(x))}${x.d && x.m.testId ? ` · ${esc(x.m.testId)}` : ""}</span>
          <span class="pick-go">Assign ${ico("chevronRight")}</span>
        </button></li>`).join("")
        : `<li class="pick-empty">${all.length ? `No motors match “${esc(search.value.trim())}”.` : "No other motors are registered yet."} <button type="button" class="link-btn" data-new>Register a new motor</button></li>`;
    };
    const assign = async (id) => {
      const cur = findMotor(id); if (!cur) return;
      const err = dlg.querySelector("#pkError"), tid = checkTestId(dlg.querySelector("#pk-test").value, cur.m);
      if (tid.err) { err.textContent = tid.err; err.classList.add("show"); dlg.querySelector("#pk-test").focus(); return; }
      if (cur.d && isRunning(cur.m) && !(await confirmDialog({ title: `Move ${id} to ${target.name}?`, message: `${id} is being checked on ${cur.d.name}. Its check there stops and a new run starts on ${target.name}.`, confirmLabel: "Move motor", danger: false }))) return;
      dlg.close();
      detachMotor(cur); attachMotor(cur.m, target, tid.t);
      saveDevices(); saveSpare();
      const mm = target.motors.find((x) => x.id === id);
      logActivity("test", `Assigned ${id} to ${target.name} for test ${tid.t}${cur.d ? ` (moved from ${cur.d.name})` : ""}${mm && mm.queued ? " · queued" : ` · checking started on ${chLabel(mm)}`}`);
      toast(`${id} assigned to ${target.name} · ${tid.t}${mm && mm.queued ? " · queued" : " · checking now"}`);
      rerender();
    };
    list.addEventListener("click", (ev) => {
      if (ev.target.closest("[data-new]")) { dlg.close(); motorDialog({ device: target.id }); return; }
      const b = ev.target.closest("[data-pick]"); if (b) assign(b.dataset.pick);
    });
    dlg.querySelector("#pkNew").addEventListener("click", () => { dlg.close(); motorDialog({ device: target.id }); });
    search.addEventListener("input", draw);
    dlg.querySelector("#pickForm").addEventListener("submit", (ev) => { ev.preventDefault(); const first = list.querySelector("[data-pick]"); if (first) assign(first.dataset.pick); }); // Enter picks the top match
    dlg.querySelector("#pk-test").addEventListener("input", () => dlg.querySelector("#pkError").classList.remove("show"));
    draw();
    dlg.showModal();
    search.focus();
  }

  function assignDialog(id) {
    if (!allowed("motors")) return;
    const cur = findMotor(id);
    if (!cur) return;
    const opts = DEVICES.map((x) => {
      const busy = runningOn(x).filter((m) => m !== cur.m).length >= MAX_RUN;
      return `<option value="${esc(x.id)}">${esc(x.name)} (${esc(x.id)})${busy && x !== cur.d ? " — will be queued" : ""}</option>`;
    }).join("");
    const d = makeDialog("assignDialog", `
      <form id="assignForm" novalidate style="display:contents">
        ${dlgHead(`Assign ${cur.m.id}`, `Stator No. ${cur.m.stator || "—"} · choose the device that checks this motor.`)}
        <div class="modal-body">
          <div class="field"><label for="as-dev">Device</label>
            <select class="select" id="as-dev" name="device"><option value="">Not assigned</option>${opts}</select>
            <span class="hint">A device checks up to ${MAX_RUN} motors at a time · others wait in its queue</span></div>
          <div class="form-error" id="asError" role="alert" style="margin-top:12px"></div>
          <div id="asTest" style="margin-top:12px">${testIdField("as-test", nextTestId())}</div>
        </div>
        <div class="modal-foot"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
      </form>`);
    const f = d.querySelector("#assignForm"), dev = f.elements.device;
    dev.value = cur.d ? cur.d.id : (DEVICES.find((x) => runningOn(x).length < MAX_RUN) || DEVICES[0] || {}).id || "";
    // a Test ID is only needed when the motor goes onto a (different) device
    const syncTest = () => { d.querySelector("#asTest").hidden = !dev.value || (cur.d && dev.value === cur.d.id); };
    dev.addEventListener("change", syncTest); syncTest();
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = DEVICES.find((x) => x.id === dev.value) || null;
      if (target === cur.d) { d.close(); return; }
      const tid = target ? checkTestId(f.elements.testId.value, cur.m) : {};
      if (tid.err) { const er = d.querySelector("#asError"); er.textContent = tid.err; er.classList.add("show"); return; }
      d.close();
      const oldTest = cur.m.testId;
      detachMotor(cur); attachMotor(cur.m, target, tid.t);
      if (!target) delete cur.m.testId;
      const qd = target && target.motors.find((x) => x.id === cur.m.id);
      logActivity("test", target ? `Assigned ${cur.m.id} to ${target.name} for test ${tid.t}${cur.d ? ` (moved from ${cur.d.name})` : ""}${qd && qd.queued ? " · queued" : ` · checking started on ${chLabel(qd)}`}` : `Unassigned ${cur.m.id} from ${cur.d.name}${oldTest ? ` (test ${oldTest} ended)` : ""}`);
      saveDevices(); saveSpare();
      const mm = target && target.motors.find((x) => x.id === cur.m.id);
      toast(target ? `${cur.m.id} assigned to ${target.name} · ${tid.t}${mm && mm.queued ? " · queued" : " · checking now"}` : `${cur.m.id} is no longer assigned`);
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
  function attachMotor(m, d, testId) {
    if (!d) { SPARE.push({ id: m.id, stator: m.stator, model: m.model, loco: m.loco }); return; }
    m.testId = useTestId(testId || nextTestId());
    const p = Math.round(44 + Math.random() * 10), ch = freeChannel(d);
    delete m.slot; delete m.stoppedAt; delete m.channel; // a new test on this device
    Object.assign(m, { base: [p, p + 2, Math.round(28 + Math.random() * 4)], runMin: 0.5, tau: 12, active: !!ch, queued: !ch });
    if (ch) m.channel = ch;
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
    logActivity("motor", `Deleted motor ${x.m.id}${x.d ? ` (was on ${x.d.name}, test ${x.m.testId || "—"})` : ""}`);
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
      rows: [["Condition", d ? verdictPill(d.online ? e.status : "off") : `<span class="verdict-pill off">Not monitored</span>`], ["Stator No.", `<span class="mono">${esc(m.stator || "—")}</span>`], ["Model / type", esc(m.model)], ["Locomotive", esc(m.loco)],
        ["Device", d ? `${esc(d.name)} (${esc(d.id)})` : "Not assigned"], ...(d ? [["Monitoring for", fmtRun(runMinutes(m))], ["Predicted final", e.th && e.th.confident ? `${e.th.finalTemp.toFixed(1)} °C` : "Collecting data"]] : [])],
      actions: `<button type="button" class="btn btn-danger" data-v-del>${ico("trash")}Delete</button><button type="button" class="btn" data-v-edit>${ico("edit")}Edit</button>${d ? `<a class="btn btn-primary" href="motor.html?motor=${encodeURIComponent(m.id)}">${ico("activity")}Monitor</a>` : ""}`
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
      ["devWarn", "DE / NDE difference — warning", "°C"], ["devCrit", "DE / NDE difference — alarm", "°C"],
      ["partnerWarn", "Hotter than other motor — warning", "K"], ["partnerCrit", "Hotter than other motor — alarm", "K"]
    ]; // min / max per terminal (incl. ambient TA) is on the Settings page
    const d = makeDialog("limitsDialog", `
      <form id="limitsForm" novalidate style="display:contents">
        ${dlgHead("Edit limits", "Applied to every motor immediately. Warning must be lower than alarm · terminal min / max limits are on the Settings page.")}
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
      if (v.devWarn >= v.devCrit) return fail("DE / NDE difference warning must be lower than the alarm limit.");
      if (v.partnerWarn >= v.partnerCrit) return fail("Motor comparison warning must be lower than the alarm limit.");
      const changes = F.filter(([k]) => LIMITS[k] !== v[k]).map(([k, l, u]) => `${l} ${LIMITS[k]} → ${v[k]} ${u}`);
      Object.assign(LIMITS, v);
      store.set(LIMITS_KEY, v);
      d.close();
      logActivity("limits", `Saved alarm limits${changes.length ? ` — ${changes.join("; ")}` : " — no changes"}`);
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
    if (add) { if (add.dataset.addMotor) pickMotorDialog(add.dataset.addMotor); else motorDialog({}); } // on a device: pick a registered motor; otherwise register one
    const ed = e.target.closest("[data-edit-motor]");
    if (ed) motorDialog({ id: ed.dataset.editMotor });
    if (e.target.closest("a.is-disabled")) { e.preventDefault(); return; } // also blocks keyboard activation
    const asg = e.target.closest("[data-assign-motor]");
    if (asg) assignDialog(asg.dataset.assignMotor);
    const del = e.target.closest("[data-del-motor]");
    if (del) deleteMotor(del.dataset.delMotor);
    const vw = e.target.closest("[data-view-motor]");
    if (vw) viewMotor(vw.dataset.viewMotor);
    if (e.target.closest("[data-dl-all-motors]")) downloadAllMotorReports();
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
      await confirmDialog({ title: `Both channels on ${d.name} are in use`, message: `${busy.map((x) => `${x.id} (${chLabel(x)})`).join(" and ")} are being checked now. Stop one of them when its check is finished, then start ${m.id}.`, confirmLabel: "OK", danger: false });
      return;
    }
    const ok = await confirmDialog(on
      ? { title: `Stop monitoring ${m.id}?`, message: `Readings stop and the last values and result are kept. Alarms for this motor are paused.${d.motors.some((x) => x.queued) ? " The position is then free for the next queued motor." : ""}`, confirmLabel: "Stop monitoring" }
      : { title: `Start monitoring ${m.id}?`, message: `${m.queued ? `Test ${m.testId} starts now` : `A new test ${nextTestId()} starts now (${m.testId} stays with its last results)`}: readings, trend and heating analysis begin from zero.`, confirmLabel: "Start monitoring", danger: false });
    if (!ok) return;
    if (on) { m.active = false; m.stoppedAt = Date.now(); }
    else { if (!m.queued || !m.testId) m.testId = useTestId(nextTestId()); m.channel = freeChannel(d, m); m.active = true; m.queued = false; delete m.stoppedAt; m.runMin = 0.05; seedMotor(m); }
    saveDevices();
    logActivity("test", on ? `Stopped monitoring ${m.id} on ${d.name} ${chLabel(m)} · test ${m.testId} · last result ${VERDICT_SHORT[evalMotor(m).condition]}` : `Started monitoring ${m.id} on ${d.name} ${chLabel(m)} · test ${m.testId}`);
    toast(on ? `${m.id} monitoring stopped · ${m.testId}` : `${m.id} monitoring started · ${m.testId}`);
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

  // DE / NDE / TA as large digital values; motor probes also show their rise above ambient.
  // Values glide to each new sample (see animateValues) and a dot blinks when a sample arrives.
  function readings(m, online = true, size = "") {
    const amb = m.live[AMB], live = online && m.active !== false;
    return `<div class="readings ${size}">${m.live.map((v, j) => `
      <div class="reading${j === AMB ? " amb" : ""}" style="--probe:${COLORS[j]}">
        <span class="r-label"><i class="probe-key"></i>${PROBES[j]}${live ? '<i class="sample-dot" aria-hidden="true"></i>' : ""}<small>${PROBE_NAME[PROBES[j]]}</small></span>
        <b class="r-value num ${online ? tCls(v, j, amb) : "muted"}"${online ? ` data-anim="${esc(m.id)}:${size}:${j}" data-v="${v}"` : ""}><span class="nv">${online ? v.toFixed(1) : "—"}</span><small>°C</small></b>
        <span class="r-sub num">${j === AMB ? "&nbsp;" : online ? `Rise ${(v - amb).toFixed(1)} K` : ""}</span>
      </div>`).join("")}</div>`;
  }
  const signalBars = (n) => `<span class="signal" aria-label="Signal ${n} of 4">${[1, 2, 3, 4].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  /* ---------- Graphs (SVG / CSS, theme-aware) ---------- */
  const COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-amb)"]; // DE, NDE, TA
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
    // as many time labels as fit: each needs ~1.5 label widths of room (the end labels are anchored at the edges)
    const lw = String(xfmt ? xfmt(t1) : runLabel(t1, t0)).length * 5.6 + 6;
    let nx = 4;
    while (nx > 1 && span / nx < lw * 1.5) nx--;
    for (let k = 0; k <= nx; k++) {
      const t = t0 + ((t1 - t0) * k) / nx;
      out += `<text class="tick-label" x="${x(t)}" y="${H - 8}" text-anchor="${k === 0 ? "start" : k === nx ? "end" : "middle"}">${xfmt ? xfmt(t) : runLabel(t, t0)}</text>`;
    }
    let limitText = ""; // drawn after the data lines so the lines don't run through the words
    lines.forEach((l) => {
      if (l.v < lo || l.v > hi) return;
      out += `<line class="${l.cls}" x1="${M.l}" x2="${W - M.r}" y1="${y(l.v)}" y2="${y(l.v)}"/>`;
      limitText += `<text class="limit-label ${l.cls}-t" x="${M.l + 6}" y="${y(l.v) - 5}">${esc(l.label)}</text>`;
    });
    // "Now" sits left of the line; "Predicted" only when the predicted part is wide enough to hold it
    if (now != null && now < t1) out += `<line class="now-line" x1="${x(now)}" x2="${x(now)}" y1="${M.t}" y2="${H - M.b}"/><text class="now-label" x="${x(now) - 5}" y="${M.t + 10}" text-anchor="end">Now</text>${W - M.r - x(now) > 64 ? `<text class="now-label" x="${(x(now) + W - M.r) / 2}" y="${M.t + 10}" text-anchor="middle">Predicted</text>` : ""}`;
    series.forEach((s) => {
      out += `<path class="line${s.dash ? " predicted" : ""}"${s.dash ? "" : ' pathLength="1"'} style="stroke:${s.color}" d="${s.points.map((p, i) => (i ? "L" : "M") + x(p.t).toFixed(1) + " " + y(p.v).toFixed(1)).join("")}"/>`;
    });
    out += limitText;
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

  // grouped bars: DE / NDE rise above ambient for every motor, against warning / alarm limits
  function riseBars(rows) {
    const max = Math.max(LIMITS.riseCrit * 1.35, ...rows.map((r) => Math.max(r.e.rise, r.e.th && r.e.th.confident ? r.e.th.final : 0) + 4));
    const ticks = Array.from({ length: Math.floor(max / 10) + 1 }, (_, i) => i * 10);
    const marks = `<i class="rb-mark warn" style="left:${pct(LIMITS.riseWarn, max)}"></i><i class="rb-mark fail" style="left:${pct(LIMITS.riseCrit, max)}"></i>`;
    return `<div class="rb">
      <div class="rb-row rb-head"><span></span><span class="rb-track rb-labels"><span style="left:${pct(LIMITS.riseWarn, max)}">Warn ${LIMITS.riseWarn}</span><span class="fail" style="left:${pct(LIMITS.riseCrit, max)}">Alarm ${LIMITS.riseCrit} K</span></span><span></span></div>
      ${rows.map(({ d, m, e }) => {
        const rs = MS.map((j) => m.live[j] - m.live[AMB]), conf = e.th && e.th.confident;
        const tip = MS.map((j) => `${PROBES[j]} rise: ${rs[j].toFixed(1)} K${conf ? ` → final ${e.th.sensors[j].final.toFixed(1)} K` : ""}`).join("|");
        return `<a class="rb-row" href="motor.html?motor=${encodeURIComponent(m.id)}" data-tip="${esc(m.id)} · ${esc(d.name)}|${tip}|Alarm at ${LIMITS.riseCrit} K">
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

  const limitLine = () => `Alarm at: ${LIMITS.riseCrit} K above ambient · ${LIMITS.crit} °C · DE / NDE Δ ${LIMITS.devCrit} °C`;

  function motorPanel(d, m, selected = false) {
    const e = evalMotor(m);
    return `
      <div class="motor-panel is-${e.status}${selected ? " is-selected" : ""}" data-pick-motor="${esc(m.id)}">
        <div class="motor-panel-head">
          <div><span class="slot"><b class="ch-tag">${chLabel(m)}</b> ${esc(m.loco)}</span><b>${esc(m.id)}</b><span class="test-tag" title="Test ID">${esc(m.testId || "—")}</span></div>
          <div class="mp-actions">${verdictPill(e.status)}${triggerBtn(m, d)}</div>
        </div>
        ${readings(m)}
        <div class="panel-trend" title="Hotter of DE / NDE since monitoring started · dashed = alarm level">
          <span>Trend</span>${sparkRun(m, e.status)}
        </div>
        ${e.status === "stop" ? `<div class="panel-heat stopped">${ico("pause")}<div class="ph-text"><span>Monitoring stopped${m.stoppedAt ? " at " + new Date(m.stoppedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span><b>Last readings shown</b><small>Switch on to start a new run</small></div><a href="motor.html?motor=${encodeURIComponent(m.id)}">Details →</a></div>` : `<div class="panel-heat">
          ${progressRing(e.th && e.th.confident ? e.th.sensors[e.th.hot].pct : null, e.status === "ok" ? "var(--series-1)" : `var(--${e.status})`, e.th && e.th.confident ? `${Math.round(e.th.sensors[e.th.hot].pct * 100)}%` : "—", "heated", 58)}
          <div class="ph-text">
            <span>${trendText(e)}</span>
            <b class="num">${e.th && e.th.confident ? `Final ≈ ${e.th.finalTemp.toFixed(1)} °C` : "Final: collecting data"}</b>
            <small class="num">${e.th && e.th.confident ? (e.th.alarmIn != null && e.rise < LIMITS.riseCrit ? `Alarm in about ${fmtMin(e.th.alarmIn)}` : e.th.eq ? "Equilibrium reached" : e.th.eqIn < 1 ? "Settling" : `Equilibrium in about ${fmtMin(e.th.eqIn)}`) : "&nbsp;"}</small>
          </div>
          <a href="motor.html?motor=${encodeURIComponent(m.id)}">Details →</a>
        </div>`}
      </div>`;
  }
  const emptySlot = (d) => {
    const q = d.motors.filter((m) => m.queued).length;
    return `
    <div class="empty-slot">
      <div>${ico("plus")}<div><b>Channel ${freeChannel(d)} is free</b></div><div>${q ? `Start a waiting motor from the <a href="motors.html?device=${encodeURIComponent(d.id)}">Motors</a> page, or assign another` : runningOn(d).length ? "Assign a second motor to check both under the same conditions" : "Assign a motor to start checking"}</div>
      <button type="button" class="btn btn-sm" style="margin-top:10px" data-add-motor="${esc(d.id)}">Assign motor</button></div>
    </div>`;
  };
  // motors on a device whose check was stopped: last readings / result kept, can be switched on again
  function deviceStopped(d, selectedId) {
    const done = d.motors.filter((m) => !isRunning(m) && !m.queued);
    if (!done.length) return "";
    return `<div class="dev-queue">
      <div class="dq-head"><b>Stopped motors on ${esc(d.name)}</b><span>${done.length} stopped · ${runningOn(d).length} of ${MAX_RUN} channels in use</span></div>
      <ul>${done.map((m) => {
        const e = evalMotor(m);
        return `<li class="dq-row${m.id === selectedId ? " is-selected" : ""}" data-pick-motor="${esc(m.id)}">
          <span class="dq-id"><b>${esc(m.id)}</b><span>${esc(m.testId || "—")}${m.channel ? ` · was ${chLabel(m)}` : ""} · ${esc(m.loco)}</span></span>
          <span class="dq-state">${verdictPill(e.status)}<small>Last result: <b class="dq-res ${e.condition}">${VERDICT_SHORT[e.condition]}</b> · rise ${e.rise.toFixed(1)} K</small></span>
          ${triggerBtn(m, d)}
        </li>`;
      }).join("")}</ul>
    </div>`;
  }
  // one device: header + its motors (or offline notice)
  function deviceWidget(d, selectedId, target = false) {
    const cls = `card device-card${target ? " is-target" : ""}" id="dev-${esc(d.id)}`;
    const head = `
      <div class="card-head">
        <div class="device-title"><div class="device-ico">${ico("cpu")}</div><div><h3>${esc(d.name)}</h3><div class="sub">${esc(d.id)} · ${esc(d.location)}</div></div></div>
        ${d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : badge("off")}
      </div>`;
    if (!d.online) return `<div class="${cls}">${head}<div class="offline-mask">${ico("wifiOff")}<b>Device offline</b><div>Last seen ${esc(d.lastSeen || "—")}</div></div></div>`;
    const cells = runningOn(d).map((m) => motorPanel(d, m, m.id === selectedId));
    if (cells.length < MAX_RUN) cells.push(emptySlot(d));
    return `<div class="${cls}">${head}<div class="motor-slots">${cells.join("")}</div>${deviceStopped(d, selectedId)}</div>`;
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
        <a class="alarm-row ${e.status}" href="motor.html?motor=${encodeURIComponent(m.id)}">
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
     Page: Monitor — live widgets for every device; a motor opens its own page
     ========================================================= */
  function pageMonitor() {
    const q = new URLSearchParams(location.search);
    if (q.get("motor")) { location.replace(`motor.html?motor=${encodeURIComponent(q.get("motor"))}`); return null; } // old links
    let filter = "all";
    // arriving from Devices (monitor.html?device=ID): bring that device into view and outline it for a moment
    let target = DEVICES.some((d) => d.id === q.get("device")) ? q.get("device") : null;
    const render = () => {
      const devs = DEVICES.filter((d) => filter === "all" || (filter === "online" ? d.online : d.online && d.motors.some((m) => ["warn", "crit"].includes(evalMotor(m).status))));
      $("#monitorGrid").innerHTML = devs.length ? devs.map((d) => deviceWidget(d, null, d.id === target)).join("")
        : DEVICES.length ? `<div class="card card-body muted">No devices match this filter.</div>`
        : `<div class="card empty-state">${ico("cpu")}<h3>No devices yet</h3><p>Register a device, then assign motors to it.</p><a class="btn btn-primary" href="devices.html">${ico("plus")}Add device</a></div>`;
      updateAlertCount();
    };
    // click a motor widget (anywhere but its switch) to open the motor's own page
    $("#monitorGrid").addEventListener("click", (ev) => {
      const panel = ev.target.closest("[data-pick-motor]");
      if (!panel || ev.target.closest("button")) return;
      ev.preventDefault();
      location.href = `motor.html?motor=${encodeURIComponent(panel.dataset.pickMotor)}`;
    });
    $$("[name=monFilter]").forEach((r) => r.addEventListener("change", () => { filter = r.value; render(); }));
    render();
    if (target) {
      const card = $(`#dev-${CSS.escape(target)}`);
      if (card) requestAnimationFrame(() => card.scrollIntoView({ block: "start", behavior: calm.matches ? "auto" : "smooth" }));
      setTimeout(() => { target = null; render(); }, 2600);
    }
    return render;
  }

  /* ---------- Motor animation (motor page) ----------
     Side view of the motor with its end face: the rotor spins while the motor is
     checked, the housing shifts from cool to hot with the rise above ambient, heat
     shimmer rises when warm, and DE / NDE / TA show their live values where they sit. */
  const PROBE_AT = [[290, 192], [128, 120]]; // DE near the drive end (shaft side), NDE at the far end
  function motorSvg() {
    const fins = Array.from({ length: 11 }, (_, i) => `<rect x="${130 + i * 27}" y="80" width="9" height="152" rx="2" class="ma-fin"/>`).join("");
    const spokes = Array.from({ length: 8 }, (_, i) => `<path d="M0 -12 L-7 -54 Q0 -60 7 -54 Z" transform="rotate(${i * 45})" class="ma-blade"/>`).join("");
    const probes = PROBE_AT.map(([x, y], j) => `
      <g class="ma-probe" id="maP${j}" style="--probe:${COLORS[j]}">
        <circle cx="${x}" cy="${y}" r="13" class="ma-ping"/>
        <circle cx="${x}" cy="${y}" r="7" class="ma-dot"/>
        <g transform="translate(${x + 14} ${y - 15})"><rect width="124" height="30" rx="8" class="ma-tag"/>
          <text x="10" y="20" class="ma-tag-k">${PROBES[j]}</text><text x="115" y="20" text-anchor="end" class="ma-tag-v" id="maV${j}">—</text></g>
      </g>`).join("");
    return `<svg viewBox="0 0 640 300" role="img" aria-labelledby="maTitle" class="ma-svg">
      <title id="maTitle">Motor live view</title>
      <defs>
        <linearGradient id="maShell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ma-s1"/><stop offset=".5" class="ma-s2"/><stop offset="1" class="ma-s3"/></linearGradient>
        <clipPath id="maClip"><rect x="110" y="80" width="320" height="152" rx="30"/></clipPath>
      </defs>
      <ellipse cx="340" cy="272" rx="250" ry="12" class="ma-shadow"/>
      <g class="ma-shimmer" id="maShimmer">
        <path d="M185 70 q10 -14 0 -28 t0 -28"/><path d="M275 70 q10 -14 0 -28 t0 -28"/><path d="M365 70 q10 -14 0 -28 t0 -28"/>
      </g>
      <rect x="150" y="228" width="60" height="34" rx="4" class="ma-foot"/><rect x="330" y="228" width="60" height="34" rx="4" class="ma-foot"/>
      <rect x="200" y="46" width="96" height="38" rx="6" class="ma-box"/><text x="248" y="70" text-anchor="middle" class="ma-box-t">TERMINAL BOX</text>
      <rect x="110" y="80" width="320" height="152" rx="30" fill="url(#maShell)" class="ma-shell"/>
      <g clip-path="url(#maClip)">${fins}<rect x="110" y="80" width="320" height="152" id="maHeat" class="ma-heat"/></g>
      <rect x="570" y="146" width="62" height="20" rx="4" class="ma-shaft"/>
      <g class="ma-flow" id="maFlow"><path d="M578 106 H618"/><path d="M584 206 H624"/><path d="M572 126 H608"/></g>
      <circle cx="500" cy="156" r="76" class="ma-end"/>
      <circle cx="500" cy="156" r="61" class="ma-end-in"/>
      <g transform="translate(500 156)"><g class="ma-rotor" id="maRotor">${spokes}<circle r="14" class="ma-hub"/><circle r="4" class="ma-axle"/></g></g>
      ${probes}
      <g class="ma-amb" id="maAmb" transform="translate(28 30)">
        <path d="M14 46V10a8 8 0 0 1 16 0v36a14 14 0 1 1-16 0Z" class="ma-thermo"/><circle cx="22" cy="57" r="8" class="ma-thermo-b"/>
        <text x="46" y="30" class="ma-amb-k">TA · ambient air</text><text x="46" y="56" class="ma-amb-v" id="maTA">—</text>
      </g>
      <text x="500" y="290" text-anchor="middle" class="ma-state" id="maState"></text>
    </svg>`;
  }
  function paintMotor(d, m, e) {
    const wrap = $("#motorAnim"); if (!wrap) return;
    const live = d.online && !m.queued, running = live && isRunning(m);
    const frac = Math.max(0, Math.min(1, e.rise / LIMITS.riseCrit));
    const hue = Math.round(210 - 210 * frac); // blue (cool) → red (at the alarm rise)
    wrap.classList.toggle("is-running", running);
    wrap.classList.toggle("is-hot", running && frac >= 0.6);
    const heat = $("#maHeat");
    heat.style.fill = live ? `hsl(${hue} 85% 52%)` : "var(--muted)";
    heat.style.opacity = live ? (0.12 + 0.5 * frac).toFixed(2) : 0.08;
    $("#maShimmer").style.opacity = running ? Math.max(0, (frac - 0.35) * 1.5).toFixed(2) : 0;
    MS.forEach((j) => {
      const g = $(`#maP${j}`), v = m.live[j];
      $(`#maV${j}`).textContent = live ? `${v.toFixed(1)} °C` : "—";
      g.classList.toggle("out", live && (outOfRange(v, j) || tCls(v, j, m.live[AMB]) === "t-crit"));
      g.classList.toggle("warn", live && tCls(v, j, m.live[AMB]) === "t-warn");
      if (running) { g.classList.remove("ping"); void g.getBBox(); g.classList.add("ping"); } // a ripple per new sample
    });
    $("#maTA").textContent = live ? `${m.live[AMB].toFixed(1)} °C` : "—";
    $("#maAmb").classList.toggle("out", live && outOfRange(m.live[AMB], AMB));
    $("#maState").textContent = !d.online ? "Device offline" : m.queued ? "Queued · not started" : running ? `Checking · rise ${e.rise.toFixed(1)} K above ambient` : "Stopped · last readings";
    $("#animSub").textContent = `${d.name} · ${chLabel(m) || "no channel"} · DE drive end and NDE non-drive end on the motor, TA in the surrounding air · housing colour = rise above ambient (blue cool → red at ${LIMITS.riseCrit} K)`;
  }

  /* ---------- Aggregation graph ----------
     Readings since the test started grouped into intervals; for each interval and
     sensor a bar spans min → max with the average marked. Hover for the numbers. */
  function aggBuckets(m, stepMin) {
    const out = [];
    trendPoints(m).forEach((p) => {
      const k = Math.floor(Math.max(0, p.t - m.runStart) / (stepMin * 60000));
      const b = out[k] || (out[k] = { k, from: k * stepMin, to: (k + 1) * stepMin, s: PROBES.map(() => ({ min: Infinity, max: -Infinity, sum: 0, n: 0 })) });
      p.v.forEach((v, j) => { const a = b.s[j]; a.min = Math.min(a.min, v); a.max = Math.max(a.max, v); a.sum += v; a.n++; });
    });
    return out.filter(Boolean).map((b) => ({ ...b, s: b.s.map((a) => ({ min: a.min, max: a.max, avg: a.sum / a.n, n: a.n })) }));
  }
  function aggChart(el, m, stepMin) {
    const B = aggBuckets(m, stepMin);
    if (!B.length) { el.innerHTML = '<p class="muted">Collecting data.</p>'; return; }
    const W = Math.max(el.clientWidth, 300), H = 250, M = { t: 14, r: 12, b: 30, l: 40 };
    const vals = B.flatMap((b) => b.s.flatMap((a) => [a.min, a.max]));
    const lo = Math.floor((Math.min(...vals) - 2) / 10) * 10, hi = Math.ceil((Math.max(...vals) + 2) / 10) * 10;
    const y = (v) => M.t + ((hi - v) / (hi - lo || 1)) * (H - M.t - M.b);
    const gw = (W - M.l - M.r) / B.length, bw = Math.max(4, Math.min(16, (gw * 0.72) / PROBES.length - 2));
    let svg = "";
    for (let v = lo; v <= hi; v += hi - lo > 60 ? 20 : 10) svg += `<line class="${v === lo ? "baseline" : "gridline"}" x1="${M.l}" x2="${W - M.r}" y1="${y(v)}" y2="${y(v)}"/><text class="tick-label" x="${M.l - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    const every = Math.max(1, Math.ceil(B.length / (W < 520 ? 4 : 8)));
    B.forEach((b, i) => {
      const gx = M.l + i * gw + gw / 2, x0 = gx - (PROBES.length * (bw + 2)) / 2;
      b.s.forEach((a, j) => {
        const x = x0 + j * (bw + 2), top = y(a.max), h = Math.max(2, y(a.min) - top);
        const tip = `${PROBES[j]} · T + ${b.from}–${b.to} min|Min ${a.min.toFixed(1)} °C · Avg ${a.avg.toFixed(1)} °C · Max ${a.max.toFixed(1)} °C|${a.n} reading${a.n === 1 ? "" : "s"}`;
        svg += `<g class="agg-bar" data-tip="${esc(tip)}"><rect x="${x - 3}" y="${M.t}" width="${bw + 6}" height="${H - M.t - M.b}" class="agg-hit"/>
          <rect x="${x}" y="${top}" width="${bw}" height="${h}" rx="3" style="fill:${COLORS[j]}" class="agg-range"/>
          <line x1="${x - 2}" x2="${x + bw + 2}" y1="${y(a.avg)}" y2="${y(a.avg)}" style="stroke:${COLORS[j]}" class="agg-avg"/></g>`;
      });
      if (i % every === 0) svg += `<text class="tick-label" x="${gx}" y="${H - 9}" text-anchor="middle">T + ${b.from}</text>`;
    });
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="agg-svg" role="img" aria-label="Min, average and max per ${stepMin}-minute interval">${svg}</svg>`;
    // overall since the test started, per sensor
    const all = PROBES.map((p, j) => { const pts = trendPoints(m).map((q) => q.v[j]); return { p, j, min: Math.min(...pts), max: Math.max(...pts), avg: pts.reduce((a, v) => a + v, 0) / pts.length }; });
    $("#aggStats").innerHTML = all.map((a) => `<div><span><i style="background:${COLORS[a.j]}"></i>${a.p}</span><b class="num">${a.avg.toFixed(1)} °C</b><small class="num">min ${a.min.toFixed(1)} · max ${a.max.toFixed(1)}</small></div>`).join("") +
      `<div><span>Intervals</span><b class="num">${B.length}</b><small>${stepMin} min each · since test start</small></div>`;
  }

  /* ---------- Motor reports (CSV): one motor, or every motor in one file ---------- */
  const repStamp = (t) => new Date(t).toLocaleString([], { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const fileStamp = () => { const t = new Date(), pad = (n) => String(n).padStart(2, "0"); return `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}-${pad(t.getHours())}${pad(t.getMinutes())}`; };
  function saveCsv(lines, name) {
    const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
    const blob = new Blob(["﻿" + lines.map((l) => l.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  // motors that have readings to report (on a device and not waiting in its queue)
  const reportableMotors = () => allMotors().filter(({ m }) => !m.queued);

  // one motor's section: details, summary, aggregation and every logged reading
  function motorReportLines(d, m, stepMin) {
    const e = evalMotor(m), th = e.th, st = d.online ? e.status : "off", stamp = repStamp;
    const pts = trendPoints(m);
    const stats = PROBES.map((_, j) => { const v = pts.map((p) => p.v[j]); return { min: Math.min(...v), max: Math.max(...v), avg: v.reduce((a, b) => a + b, 0) / v.length }; });
    const f1 = (v) => v.toFixed(1);
    return [
      ["Motor", m.id], ["Test ID", m.testId || ""], ["Stator No.", m.stator || ""], ["Model / type", m.model], ["Locomotive", m.loco],
      ["Device", `${d.name} (${d.id})`], ["Channel", isRunning(m) ? chLabel(m) : m.channel ? `${chLabel(m)} (stopped)` : ""], ["Location", d.location],
      ["Test started", stamp(m.runStart)], ["Monitoring for", fmtRun(runMinutes(m))], ["State", !d.online ? "Device offline" : isRunning(m) ? "Checking" : "Stopped"],
      ["Condition", VERDICT_SHORT[st === "stop" ? e.condition : st]], ["Reason", (st === "stop" ? e.condition : st) === "ok" ? "All checks within limits" : reasonOf(e)],
      ["Predicted final °C", th && th.confident ? f1(th.finalTemp) : "Collecting data"], ["Thermal time constant τ min", th && th.confident ? th.tau.toFixed(0) : ""],
      ["Limits", limitLine()], [],
      ["Summary since test start", ...PROBES.map((p) => `${p} °C`)],
      ["Now", ...m.live.map(f1)], ["Min", ...stats.map((s) => f1(s.min))], ["Average", ...stats.map((s) => f1(s.avg))], ["Max", ...stats.map((s) => f1(s.max))],
      ["Rise now K", ...MS.map((j) => f1(m.live[j] - m.live[AMB])), ""], ["Terminal limits °C", ...PROBES.map((p) => `${TERM[p].min}–${TERM[p].max}`)], [],
      [`Aggregation · ${stepMin} min intervals`, ...PROBES.flatMap((p) => [`${p} min °C`, `${p} avg °C`, `${p} max °C`]), "Readings"],
      ...aggBuckets(m, stepMin).map((b) => [`T + ${b.from}–${b.to} min`, ...b.s.flatMap((a) => [f1(a.min), f1(a.avg), f1(a.max)]), b.s[0].n]), [],
      ["Readings · one per minute", ...PROBES.map((p) => `${p} °C`), "Max rise K", "DE / NDE Δ °C", "Status"],
      ...pts.map((p) => {
        const hot = hotOf(p.v), rise = hot - p.v[AMB], spread = spreadOf(p.v);
        const s = [lvl(rise, LIMITS.riseWarn, LIMITS.riseCrit), lvl(hot, LIMITS.warn, LIMITS.crit), lvl(spread, LIMITS.devWarn, LIMITS.devCrit), termBreaches(p.v).length ? "crit" : "ok"].reduce((w, c) => (RANK[c] > RANK[w] ? c : w), "ok");
        return [stamp(p.t), ...p.v.map(f1), f1(rise), f1(spread), VERDICT_SHORT[s]];
      })
    ];
  }
  const reportHead = (title) => [["Report", title], ["Generated", repStamp(Date.now())], ["Generated by", (currentUser() || {}).name || ""], []];

  // used by the motor page and the download button on each row of the Motors page
  function downloadMotorReport(id, stepMin = 10) {
    if (!allowed("reports")) return;
    const x = id && findMotor(id);
    if (!x) return;
    const { d, m } = x;
    if (!d) { toast(`${m.id} is not assigned to a device — no readings to report`); return; }
    if (m.queued) { toast(`${m.id} has no readings yet — start the check first`); return; }
    const n = trendPoints(m).length;
    saveCsv([...reportHead("Motor test report"), ...motorReportLines(d, m, stepMin)], `tractiontherm-${m.id}-${(m.testId || "test").toLowerCase()}-${fileStamp()}.csv`);
    logActivity("report", `Downloaded the motor report for ${m.id} · test ${m.testId || "—"} · ${n} readings`);
    toast(`Downloaded ${m.id} report · ${n} readings`);
  }

  // whole report: an overview row per motor, then each motor's full report one after another
  function downloadAllMotorReports(stepMin = 10) {
    if (!allowed("reports")) return;
    const list = reportableMotors();
    if (!list.length) { toast("No motors with readings to report yet"); return; }
    const condOf = ({ d, m }) => { const e = evalMotor(m), st = d.online ? e.status : "off"; return st === "stop" ? e.condition : st; };
    const lines = [
      ...reportHead("Motor test report · all motors"), ["Motors", list.length], ["Limits", limitLine()], [],
      ["Overview", "Test ID", "Stator No.", "Device", "Channel", ...PROBES.map((p) => `${p} °C now`), "Condition", "Reason", "Monitoring for"],
      ...list.map((x) => { const { d, m } = x, c = condOf(x); return [m.id, m.testId || "", m.stator || "", d.name, chLabel(m), ...m.live.map((v) => v.toFixed(1)), VERDICT_SHORT[c], c === "ok" ? "" : reasonOf(evalMotor(m)), fmtRun(runMinutes(m))]; }),
      ...list.flatMap(({ d, m }) => [[], [], [`===== ${m.id} =====`], ...motorReportLines(d, m, stepMin)])
    ];
    saveCsv(lines, `tractiontherm-all-motors-${fileStamp()}.csv`);
    logActivity("report", `Downloaded the full motor report — ${list.length} motors (${list.map(({ m }) => m.id).join(", ")})`);
    toast(`Downloaded full report · ${list.length} motors`);
  }

  /* =========================================================
     Page: Motor — one motor: animation, live readings and full analysis
     ========================================================= */
  function pageMotor() {
    const q = new URLSearchParams(location.search);
    let selected = q.get("motor");
    if (!allMotors().some((x) => x.m.id === selected)) {
      const live = liveMotors();
      selected = (live.slice().sort((a, b) => RANK[evalMotor(b.m).status] - RANK[evalMotor(a.m).status])[0] || allMotors()[0] || { m: {} }).m.id || null;
    }
    // back link + highlighted menu item follow the page you came from (kept for this tab while you switch motors).
    // A Reports page opened from this motor's own "Report" button doesn't count, so the two can't bounce back and forth.
    const ORIGINS = { dashboard: "Dashboard", monitor: "All devices", motors: "Motors", devices: "Devices", reports: "Reports" };
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      const from = ref && ref.origin === location.origin ? ref.pathname.split("/").pop().replace(/\.html$/, "") : "";
      const ownReport = from === "reports" && ref.searchParams.get("motor");
      if (ORIGINS[from] && !ownReport) sessionStorage.setItem("tt-motor-back", JSON.stringify({ page: from, href: ref.pathname.split("/").pop() + ref.search }));
    } catch (e) { /* no referrer / storage */ }
    let back = null;
    try { back = JSON.parse(sessionStorage.getItem("tt-motor-back") || "null"); } catch (e) { /* storage unavailable */ }
    if (!back || !ORIGINS[back.page]) back = { page: "monitor", href: "monitor.html" };
    const bl = $(".back-link");
    bl.href = back.href; bl.innerHTML = `&larr; ${back.page === "monitor" ? "All devices" : `Back to ${ORIGINS[back.page]}`}`;
    $$(".nav a").forEach((a) => (a.getAttribute("href") === `${back.page}.html` ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    $(".topbar .crumbs").textContent = back.page === "monitor" ? "Monitor" : ORIGINS[back.page];

    $("#motorAnim").innerHTML = motorSvg();
    // jump to another motor
    $("#mpSwitch").innerHTML = DEVICES.map((d) => `<optgroup label="${esc(d.name)}">${d.motors.map((m) =>
      `<option value="${esc(m.id)}">${esc(m.id)} · ${VERDICT_SHORT[d.online ? evalMotor(m).status : "off"]}</option>`).join("")}</optgroup>`).join("");
    $("#mpSwitch").value = selected || "";
    $("#mpSwitch").addEventListener("change", (ev) => (location.href = `motor.html?motor=${encodeURIComponent(ev.target.value)}`));

    // this motor's own report, aggregated at the interval chosen on the page
    $("#mpDownload").addEventListener("click", () => downloadMotorReport(selected, +(($("input[name=aggStep]:checked") || {}).value || 10)));
    // arriving from a "report" link (Motors page): point at the download once the page has rendered
    if (location.hash === "#report") requestAnimationFrame(() => {
      const dl = $("#mpDownload");
      if (dl.disabled) return;
      dl.scrollIntoView({ block: "center" }); dl.focus();
      dl.classList.add("is-flash"); setTimeout(() => dl.classList.remove("is-flash"), 2400);
    });

    const render = () => {
      const x = selected && findMotor(selected);
      const d = x && x.d, m = x && x.m;
      $$(".motor-detail").forEach((el) => (el.hidden = !d || !!m.queued));
      $("#motorLive").hidden = !d; $("#motorHero").hidden = !d; $("#mpEmpty").hidden = !!d;
      if (!d) { updateAlertCount(); return; }
      document.title = `${m.id} · TractionTherm`;
      $("#mpTitle").textContent = m.id;
      // header shortcut to this motor's report (no readings yet while queued)
      const rep = $("#mpReport");
      rep.href = `reports.html?motor=${encodeURIComponent(m.id)}`;
      rep.classList.toggle("is-disabled", !!m.queued);
      rep.setAttribute("aria-disabled", m.queued ? "true" : "false");
      rep.title = m.queued ? "No readings yet — start the check to get a report" : `Open ${m.id} in Reports`;
      const dl = $("#mpDownload");
      dl.disabled = !!m.queued;
      dl.title = m.queued ? "No readings yet — start the check to download its report" : `Download ${m.id}'s report (CSV)`;
      const e = evalMotor(m);
      const st = d.online ? e.status : "off";
      $("#motorHero").innerHTML = `
        <div class="mh-top">
          <div>
            <div class="crumbs">${esc(d.name)} · ${esc(d.id)}${m.channel && !m.queued ? ` · ${isRunning(m) ? "Channel" : "was channel"} ${m.channel}` : ""} · ${esc(d.location)}</div>
            <h2>${esc(m.id)}</h2>
            <div class="muted">Test ID <b class="mono test-id">${esc(m.testId || "—")}</b> · ${esc(m.model)} · ${esc(m.loco)} · Stator No. <span class="mono">${esc(m.stator || "—")}</span></div>
          </div>
          <div class="mh-verdict">${verdictPill(st)}<span>${st === "ok" ? "All checks within limits" : st === "off" ? "Device offline" : st === "stop" ? `Check stopped — last readings shown · result ${VERDICT_SHORT[e.condition]}` : st === "wait" ? `Queued on ${esc(d.name)} — switch on when a position is free` : esc(reasonOf(e))}</span></div>
        </div>
        ${readings(m, d.online && !m.queued, "lg")}
        <div class="mh-foot">
          <span>${m.queued ? `Not started · ${runningOn(d).length} of ${MAX_RUN} channels in use on ${esc(d.name)}` : `Monitoring for <b>${fmtRun(runMinutes(m))}</b>`}</span>
          <span>DE / NDE Δ <b class="num">${e.dev.toFixed(1)} °C</b></span>
          <span>Trend <b>${trendText(e)}</b></span>
          <span class="mh-limits">${limitLine()} <button type="button" class="link-btn" data-edit-limits>Edit limits</button></span>
          <span class="mh-actions">
            <span class="mh-trigger">Monitoring ${triggerBtn(m, d)}</span>
            <a class="btn btn-sm${m.queued ? " is-disabled" : ""}" href="reports.html?motor=${encodeURIComponent(m.id)}"${m.queued ? ' aria-disabled="true" title="No readings yet — start the check to get a report"' : ""}>${ico("report")}Report</a>
            <button type="button" class="btn btn-sm" data-edit-motor="${esc(m.id)}">${ico("edit")}Edit</button>
          </span>
        </div>`;

      $("#animPill").innerHTML = verdictPill(st);
      paintMotor(d, m, e);
      if (m.queued) { updateAlertCount(); return; }

      const mode = ($("input[name=trendMode]:checked") || {}).value || "temp";
      const series = runSeries(m, mode);
      lineChart($("#runChart"), { series, lines: runLines(m, mode), start: m.runStart, now: e.th.confident ? Date.now() : null, unit: mode === "rise" ? "K" : "°C", title: `${m.id} temperature trend` });
      $("#runLegend").innerHTML = series.filter((s) => !s.dash).map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join("") + (series.some((s) => s.dash) ? `<span><i class="pred"></i>Predicted</span>` : "") + `<span><i class="dash"></i>Limits</span>`;

      // real-time: every sample of the last 5 minutes
      const rt = m.hist.t.map((t, i) => ({ t, i }));
      lineChart($("#rtChart"), {
        series: PROBES.map((p, j) => ({ name: `${p} · ${PROBE_NAME[p]}`, short: p, color: COLORS[j], points: rt.map(({ t, i }) => ({ t, v: m.hist.v[j][i] })) })),
        lines: runLines(m, "temp"), unit: "°C", height: 240, title: `${m.id} real-time`,
        xfmt: (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      });
      $("#rtLegend").innerHTML = PROBES.map((p, j) => `<span><i style="background:${COLORS[j]}"></i>${p}</span>`).join("") + `<span><i class="dash"></i>Limits</span>`;
      // rate of change over the last minute, per motor sensor
      const back = Math.min(30, m.hist.t.length - 1), span = (m.hist.t[m.hist.t.length - 1] - m.hist.t[m.hist.t.length - 1 - back]) / 60000 || 1;
      $("#rtStats").innerHTML = (isRunning(m) && d.online ? `<span class="rt-live"><i></i>Live · every ${STEP_MS / 1000} s</span>` : `<span class="muted">Not live · last readings</span>`) +
        MS.map((j) => { const a = m.hist.v[j], r = (a[a.length - 1] - a[a.length - 1 - back]) / span; return `<span>${PROBES[j]} <b class="num">${a[a.length - 1].toFixed(1)} °C</b> <small class="num">${r >= 0 ? "+" : ""}${r.toFixed(2)} K/min</small></span>`; }).join("") +
        `<span>TA <b class="num">${m.live[AMB].toFixed(1)} °C</b></span>`;
      // aggregation: min / average / max per interval since the test started
      const step = +(($("input[name=aggStep]:checked") || {}).value || 10);
      aggChart($("#aggChart"), m, step);

      // same device, same conditions: rise of this motor vs the other motor
      const p = comparablePartner(m);
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
    $$("input[name=trendMode], input[name=aggStep]").forEach((r) => r.addEventListener("change", () => render()));
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
        const motors = order.map((m) => `<a class="motor-chip${isRunning(m) ? "" : " idle"}" href="motor.html?motor=${encodeURIComponent(m.id)}" title="${esc(m.id)} · ${isRunning(m) ? "checking now" : m.queued ? "queued" : "checked"} · open">${verdictDot(d.online ? evalMotor(m).status : "off")}${esc(m.id)}</a>`).join("");
        const nq = d.motors.filter((m) => m.queued).length, nc = d.motors.filter((m) => !isRunning(m) && !m.queued).length;
        return `<tr>
          <td class="lead-cell" data-label="Device"><div class="cell-dev"><span class="device-ico">${ico("cpu")}</span><div><b>${esc(d.name)}</b><span class="mono">${esc(d.id)} · v${esc(d.fw || "2.4.1")}</span></div></div></td>
          <td data-label="Location">${esc(d.location)}</td>
          <td data-label="IP address" class="mono">${esc(d.ip)}</td>
          <td data-label="Motors"><div class="cell-stack"><div class="motor-chips">${motors}<button type="button" class="link-btn" data-add-motor="${esc(d.id)}">${ico("plus")}Assign</button></div><span class="muted chip-count">${runningOn(d).map((m) => `${chLabel(m)} ${m.id}`).join(" · ") || "No channel in use"} · ${runningOn(d).length} of ${MAX_RUN} channels${nq ? ` · ${nq} queued` : ""}${nc ? ` · ${nc} checked` : ""}</span></div></td>
          <td data-label="Signal" class="col-opt">${signalBars(d.signal || 0)}</td>
          <td data-label="Status">${statusCell(d)}</td>
          <td data-label=""><div class="row-actions">
            ${d.motors.length ? `<a class="btn btn-sm" href="monitor.html?device=${encodeURIComponent(d.id)}" title="Monitor ${esc(d.name)}">${ico("activity")}<span class="hide-sm">Monitor</span></a>` : ""}
            <button class="btn btn-sm btn-ghost" data-view="${esc(d.id)}" aria-label="View ${esc(d.id)}" title="View">${ico("eye")}</button>
            <button class="btn btn-sm btn-ghost" data-edit="${esc(d.id)}" aria-label="Edit ${esc(d.id)}" title="Edit">${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-del="${esc(d.id)}" aria-label="Delete ${esc(d.id)}" title="Delete">${ico("trash")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="7" class="muted" style="text-align:center;padding:32px">${DEVICES.length ? "No devices match your filters." : "No devices yet — use “Add device”."}</td></tr>`;
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
        form.elements.ip.value = d.ip;
      }
      // status is reported by the device, shown the same way as in the table
      $("#d-status").innerHTML = statusCell(d || { online: true });
      dlg.showModal();
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements;
      f.id.setCustomValidity("");
      const id = f.id.value.trim().toUpperCase();
      if (!editing && DEVICES.some((d) => d.id === id)) f.id.setCustomValidity("A device with this ID already exists");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = { id, name: f.name.value.trim(), location: f.location.value.trim(), ip: f.ip.value.trim() };
      const changes = editing ? ["name", "location", "ip"].filter((k) => editing[k] !== data[k]).map((k) => `${k === "ip" ? "IP" : k} ${editing[k]} → ${data[k]}`) : [];
      if (editing) Object.assign(editing, data); // status stays as the device reports it
      else DEVICES.push({ ...data, online: true, motors: [], fw: "2.4.1", signal: 4 }); // demo: a new device connects straight away
      saveDevices();
      dlg.close();
      logActivity("device", editing ? `Edited device ${id}${changes.length ? ` — ${changes.join(", ")}` : " — no changes"}` : `Registered device ${id} (${data.name}, ${data.location}, ${data.ip})`);
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
          ["IP address", `<span class="mono">${esc(d.ip)}</span>`], ["Firmware", `v${esc(d.fw || "2.4.1")}`], ["Signal", signalBars(d.signal || 0)], ["Channels", CHANNELS.map((c) => { const m = runningOn(d).find((x) => x.channel === c); return `CH ${c}: ${m ? m.id : "free"}`; }).join(" · ")], ["Motors", `${d.motors.length} assigned`]],
        body: `<div><div class="detail-title">Motors monitored <span class="muted">(${PROBES.join(" / ")} °C)</span></div><ul class="detail-slots">${rows}</ul></div>`,
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
      d.motors.forEach((m) => SPARE.push({ id: m.id, stator: m.stator, model: m.model, loco: m.loco }));
      DEVICES = DEVICES.filter((x) => x !== d);
      saveDevices(); saveSpare();
      logActivity("device", `Deleted device ${d.id} (${d.name})${d.motors.length ? ` — motors ${d.motors.map((m) => m.id).join(", ")} now not assigned` : ""}`);
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
      saveDevices(); saveSpare(); logActivity("device", "Reset the demo devices and motors to the sample data"); toast("Demo data restored"); render();
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
        [x.m.id, x.m.stator, x.m.testId, x.m.model, x.m.loco, x.d ? x.d.name : "not assigned"].join(" ").toLowerCase().includes(term));
      $("#motorCount").textContent = `${rows.length} of ${all.length} motors`;
      $("#motorRows").innerHTML = rows.length ? rows.map((x) => {
        const { d, m } = x, cond = condOf(x), live = d && d.online && !m.queued, e = d ? evalMotor(m) : null;
        const id = esc(m.id);
        return `<tr>
          <td class="lead-cell" data-label="Motor"><b class="mono">${id}</b><span class="muted stator-no">Stator No. <span class="mono">${esc(m.stator || "—")}</span></span></td>
          <td data-label="Model / type" class="col-mid"><div class="cell-stack">${esc(m.model)}<span class="muted cell-sub">${esc(m.loco)}</span></div></td>
          <td data-label="Device"><span>${d ? `${esc(d.name)}${isRunning(m) && m.channel ? ` · ${chLabel(m)}` : ""}<span class="muted cell-sub mono">${esc(m.testId || "")}</span>` : `<span class="muted">Not assigned</span>`} <button type="button" class="link-btn" data-assign-motor="${id}">${d ? "Change" : "Assign"}</button></span></td>
          ${PROBES.map((p, j) => `<td data-label="${p} °C" class="num${j === AMB ? " col-opt" : ""} ${live ? tCls(m.live[j], j, m.live[AMB]) : "muted"}">${live ? m.live[j].toFixed(1) : "—"}</td>`).join("")}
          <td data-label="Predicted final" class="num col-opt">${live && e.th && e.th.confident ? e.th.finalTemp.toFixed(1) + " °C" : "—"}</td>
          <td data-label="Condition">${cond === "none" ? `<span class="verdict-pill off">Not monitored</span>` : verdictPill(cond)}</td>
          <td data-label="Monitoring">${d ? triggerBtn(m, d) : '<span class="muted">—</span>'}</td>
          <td data-label=""><div class="row-actions">
            ${d ? `<a class="btn btn-sm" href="motor.html?motor=${encodeURIComponent(m.id)}" title="Monitor">${ico("activity")}<span class="hide-sm">Monitor</span></a>` : ""}
            ${d && can("reports") ? `<a class="btn btn-sm btn-ghost${m.queued ? " is-disabled" : ""}" href="motor.html?motor=${encodeURIComponent(m.id)}#report" aria-label="${id} report"${m.queued ? ' aria-disabled="true"' : ""} title="${m.queued ? "No readings yet — start the check to get its report" : `Open ${id} to view and download its report`}">${ico("report")}</a>` : ""}
            <button class="btn btn-sm btn-ghost" data-view-motor="${id}" aria-label="View ${id}" title="View">${ico("eye")}</button>
            <button class="btn btn-sm btn-ghost" data-edit-motor="${id}" aria-label="Edit ${id}" title="Edit">${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-del-motor="${id}" aria-label="Delete ${id}" title="Delete">${ico("trash")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="${7 + PROBES.length}" class="muted" style="text-align:center;padding:32px">${all.length ? "No motors match your filters." : "No motors yet — use “Add motor”."}</td></tr>`;
      updateAlertCount();
    };
    $("#motorSearch").addEventListener("input", render);
    devSel.addEventListener("change", render);
    condSel.addEventListener("change", render);
    fillDev();
    const q = new URLSearchParams(location.search);
    if (q.get("device")) devSel.value = q.get("device");
    render();
    if (q.get("add") != null) { if (q.get("add")) pickMotorDialog(q.get("add")); else motorDialog({}); }
    return render;
  }

  /* =========================================================
     Page: Reports — filtered condition summary / readings log, CSV + print
     ========================================================= */
  /* =========================================================
     Page: Settings — min / max limit for each terminal (DE, NDE, TA)
     ========================================================= */
  function pageSettings() {
    const editable = can("limits"), SCALE = { lo: -20, hi: 160 }; // °C shown on the range bars
    const pos = (v) => (((Math.max(SCALE.lo, Math.min(SCALE.hi, v)) - SCALE.lo) / (SCALE.hi - SCALE.lo)) * 100).toFixed(2) + "%";
    const field = (p, k) => $(`#term-${p}-${k}`);
    $("#termRows").innerHTML = PROBES.map((p, j) => `<tr>
      <td class="lead-cell" data-label="Terminal"><span class="term-name" style="--probe:${COLORS[j]}"><i class="probe-key"></i><b>${p}</b></span></td>
      <td data-label="Measures">${PROBE_NAME[p]}</td>
      <td data-label="Min °C" class="num"><div class="input-unit"><input class="input num" id="term-${p}-min" type="number" step="1" min="-40" max="250" value="${TERM[p].min}" aria-label="${p} minimum" ${editable ? "" : "disabled"}><span>°C</span></div></td>
      <td data-label="Max °C" class="num"><div class="input-unit"><input class="input num" id="term-${p}-max" type="number" step="1" min="-40" max="250" value="${TERM[p].max}" aria-label="${p} maximum" ${editable ? "" : "disabled"}><span>°C</span></div></td>
      <td data-label="Range" class="term-range-cell"><div class="term-range" id="term-${p}-bar"></div></td>
      <td data-label="Live now" class="num" id="term-${p}-live"></td>
    </tr>`).join("");
    const read = () => Object.fromEntries(PROBES.map((p) => [p, { min: parseFloat(field(p, "min").value), max: parseFloat(field(p, "max").value) }]));
    const dirty = () => PROBES.some((p) => { const r = read()[p]; return r.min !== TERM[p].min || r.max !== TERM[p].max; });
    const err = $("#termError"), fail = (m) => { err.textContent = m; err.classList.add("show"); };
    // live values: refreshed every sample; the inputs are left alone so typing isn't interrupted
    const render = () => {
      const draft = read(), live = liveMotors();
      PROBES.forEach((p, j) => {
        const r = isFinite(draft[p].min) && isFinite(draft[p].max) && draft[p].min < draft[p].max ? draft[p] : TERM[p];
        const vals = live.map(({ m }) => ({ id: m.id, v: m.live[j] }));
        const out = vals.filter((x) => x.v < r.min || x.v > r.max);
        $(`#term-${p}-bar`).innerHTML = `<span class="tr-band" style="left:${pos(r.min)};width:calc(${pos(r.max)} - ${pos(r.min)})"></span>` +
          vals.map((x) => `<i class="tr-dot${x.v < r.min || x.v > r.max ? " out" : ""}" style="left:${pos(x.v)}" data-tip="${esc(x.id)}|${p} ${x.v.toFixed(1)} °C"></i>`).join("");
        $(`#term-${p}-live`).innerHTML = !vals.length ? '<span class="muted">—</span>'
          : `<span class="num">${Math.min(...vals.map((x) => x.v)).toFixed(1)} – ${Math.max(...vals.map((x) => x.v)).toFixed(1)} °C</span>` +
            (out.length ? `<span class="term-out">${ico("xCircle")}${out.map((x) => esc(x.id)).join(", ")} outside</span>` : `<span class="term-in">${ico("checkCircle")}All in range</span>`);
      });
      const d = dirty();
      $("#termDirty").hidden = !d; $("#termSave").disabled = !d;
      $("#termFoot").textContent = `Readings outside a terminal's range make the motor Not OK · scale ${SCALE.lo} to ${SCALE.hi} °C · ${live.length} motor${live.length === 1 ? "" : "s"} running`;
      updateAlertCount();
    };
    $("#termRows").addEventListener("input", () => { err.classList.remove("show"); render(); });
    $("#termSave").addEventListener("click", () => {
      if (!allowed("limits")) return;
      const v = read();
      for (const p of PROBES) {
        const { min, max } = v[p];
        if (!isFinite(min) || !isFinite(max)) return fail(`${p}: enter both a minimum and a maximum.`);
        if (min < -40 || max > 250) return fail(`${p}: limits must be between -40 and 250 °C.`);
        if (min >= max) return fail(`${p}: the minimum must be lower than the maximum.`);
      }
      const changes = PROBES.filter((p) => TERM[p].min !== v[p].min || TERM[p].max !== v[p].max).map((p) => `${p} ${TERM[p].min}–${TERM[p].max} → ${v[p].min}–${v[p].max} °C`);
      PROBES.forEach((p) => (TERM[p] = v[p]));
      store.set(TERM_KEY, TERM);
      logActivity("limits", `Saved terminal limits — ${changes.join("; ")}`);
      err.classList.remove("show");
      toast("Terminal limits saved");
      render();
    });
    $("#termReset").addEventListener("click", async () => {
      if (!allowed("limits")) return;
      if (!(await confirmDialog({ title: "Reset terminal limits?", message: "Every terminal goes back to its default range (DE / NDE 0–120 °C, TA 0–50 °C).", confirmLabel: "Reset", danger: false }))) return;
      PROBES.forEach((p) => { TERM[p] = { ...DEFAULT_TERM[p] }; field(p, "min").value = TERM[p].min; field(p, "max").value = TERM[p].max; });
      store.set(TERM_KEY, TERM);
      logActivity("limits", "Reset terminal limits to defaults (DE / NDE 0–120 °C, TA 0–50 °C)");
      toast("Default terminal limits restored");
      render();
    });
    if (!editable) $("#termNote").hidden = false;
    render();
    return render;
  }

  function pageReports() {
    const f = $("#repForm").elements, q = new URLSearchParams(location.search);
    const stamp = (t) => new Date(t).toLocaleString([], { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const fillMotors = () => {
      const keep = f.motor.value;
      const list = allMotors().filter(({ d, m }) => !m.queued && (f.device.value === "all" || d.id === f.device.value));
      f.motor.innerHTML = `<option value="all">All motors</option>` + list.map(({ m }) => `<option value="${esc(m.id)}">${esc(m.id)}</option>`).join("");
      f.motor.value = list.some(({ m }) => m.id === keep) ? keep : "all";
    };
    // condition type = which check is out of limits; matched against evalMotor's check names
    const CTYPE_CHECK = { rise: "Rise above ambient", temp: "Motor temperature", spread: "DE / NDE difference", pred: "Predicted final rise", partner: "Compared with", term: "Terminal limits", probe: "Probe readings plausible" };
    // short names for the condition-type rule; pred / partner / probe only exist in the summary
    const CTYPE_NAME = { rise: "Rise above ambient", temp: "Motor temperature", spread: "DE / NDE difference", pred: "Predicted final rise", partner: "Hotter than other motor", term: "Terminal min / max", probe: "Probe reading fault" };
    const failing = (e, type) => e.checks.some((c) => c.k.startsWith(CTYPE_CHECK[type]) && c.s !== "ok");
    const term = () => f.search.value.trim().toLowerCase();
    // search in one chosen field ("Search in") or across all of them
    const matches = (fields) => !term() || (f.sin.value === "all" ? Object.values(fields) : [fields[f.sin.value]]).join(" ").toLowerCase().includes(term());
    const SEARCH_PH = { all: null, test: "e.g. TEST-0003", motor: "e.g. TM-4471", stator: "e.g. ST-60681", model: "e.g. 6FRA 6068", loco: "e.g. WAG-9", device: "Device name or ID, e.g. Device A", location: "e.g. Bay 3", reason: "e.g. rise, DE / NDE, terminal", time: "e.g. 29 Oct or 14:30" };
    const syncSearch = () => {
      const log = f.type.value === "readings";
      $$("option[data-summary-only]", f.sin).forEach((o) => (o.disabled = log));
      $$("option[data-readings-only]", f.sin).forEach((o) => (o.disabled = !log));
      if (f.sin.selectedOptions[0].disabled) f.sin.value = "all";
      f.search.placeholder = SEARCH_PH[f.sin.value] || (log ? "Search motor, test ID, device or reading time" : "Search test ID, motor, stator no., model, locomotive, device, location or reason");
    };
    // predicted rise, motor comparison and probe faults only exist for the summary
    const syncCtype = () => {
      const log = f.type.value === "readings";
      $$("option[data-summary-only]", f.ctype).forEach((o) => (o.disabled = log));
      if (f.ctype.selectedOptions[0].disabled) f.ctype.value = "all";
    };
    const defaults = () => {
      f.type.value = "summary"; f.cond.value = "all"; f.ctype.value = "all"; f.search.value = ""; f.sin.value = "all"; f.range.value = "60"; f.interval.value = "5";
      f.device.innerHTML = `<option value="all">All devices</option>` + DEVICES.map((d) => `<option value="${esc(d.id)}">${esc(d.name)} (${esc(d.id)})</option>`).join("");
      f.device.value = "all"; fillMotors(); f.motor.value = "all";
    };
    defaults();
    // arriving from a motor page: filter to that motor and offer a way back
    if (q.get("motor")) {
      const x = findMotor(q.get("motor"));
      if (x && x.d) {
        f.device.value = x.d.id; fillMotors();
        if ([...f.motor.options].some((o) => o.value === x.m.id)) f.motor.value = x.m.id;
        else toast(`${x.m.id} has no readings yet (queued) — showing all motors on ${x.d.name}`);
        const back = $("#repBack");
        if (back) { back.href = `motor.html?motor=${encodeURIComponent(x.m.id)}`; back.textContent = `← Back to ${x.m.id}`; back.hidden = false; }
      }
    }

    /* Custom rules: narrow the report by what matters in a motor test — temperatures (in their units),
       condition, equilibrium, monitoring time or the motor's details. Quick rules come from the alarm limits.
       Rows must match all rules or any rule; a rule still missing its value is ignored. */
    const TEMP_OPS = { gt: "is above", ge: "is at least", lt: "is below", le: "is at most", between: "is between" };
    const PICK_OPS = { is: "is", not: "is not" };
    const TEXT_OPS = { has: "contains", is: "is", starts: "starts with" };
    const runMin = (s) => { const h = /(\d+)\s*h/.exec(s || ""), mm = /(\d+)\s*min/.exec(s || ""); return h || mm ? (h ? +h[1] * 60 : 0) + (mm ? +mm[1] : 0) : NaN; };
    // col: the report column a field reads — one name for both reports, or { summary, readings } where they differ / it exists in one only
    const RULE_GROUPS = [["temp", "Temperatures", "thermo"], ["status", "Status", "activity"], ["motor", "Motor & test", "motor"]];
    const RULE_FIELDS = [
      { k: "rise", g: "temp", label: "Rise above ambient", unit: "K", col: { summary: "Rise K", readings: "Max rise K" } },
      { k: "hot", g: "temp", label: "Hottest probe (DE or NDE)", unit: "°C", get: (v) => Math.max(parseFloat(v("DE °C")), parseFloat(v("NDE °C"))) },
      { k: "de", g: "temp", label: "DE · drive end", unit: "°C", col: "DE °C" },
      { k: "nde", g: "temp", label: "NDE · non-drive end", unit: "°C", col: "NDE °C" },
      { k: "ta", g: "temp", label: "TA · ambient air", unit: "°C", col: "TA °C" },
      { k: "spread", g: "temp", label: "DE / NDE difference", unit: "°C", col: "DE / NDE Δ °C" },
      { k: "pred", g: "temp", label: "Predicted final temperature", unit: "°C", col: { summary: "Predicted final °C" } },
      { k: "cond", g: "status", label: "Condition", pick: ["Good", "Monitor", "Not OK", "Stopped", "Offline"], col: { summary: "Condition", readings: "Status" } },
      { k: "ctype", g: "status", label: "Condition type", pick: Object.values(CTYPE_NAME), types: true },
      { k: "eq", g: "status", label: "Thermal equilibrium", pick: ["Reached", "Not yet"], col: { summary: "Equilibrium" } },
      { k: "run", g: "status", label: "Monitoring time", unit: "min", col: { summary: "Monitoring for" }, parse: runMin },
      { k: "motor", g: "motor", label: "Motor ID", col: "Motor", ph: "e.g. TM-4471" },
      { k: "test", g: "motor", label: "Test ID", col: "Test ID", ph: "e.g. TEST-0003" },
      { k: "stator", g: "motor", label: "Stator No.", col: { summary: "Stator No." }, ph: "e.g. ST-60681" },
      { k: "model", g: "motor", label: "Model / type", col: { summary: "Model / type" }, ph: "e.g. 6FRA 6068" },
      { k: "loco", g: "motor", label: "Locomotive", col: { summary: "Locomotive" }, ph: "e.g. WAG-9" },
      { k: "device", g: "motor", label: "Device", col: "Device", ph: "e.g. Device A" },
      { k: "location", g: "motor", label: "Location", col: { summary: "Location" }, ph: "e.g. Bay 3" }
    ];
    const fieldOf = (k) => RULE_FIELDS.find((x) => x.k === k);
    const colOf = (fd) => (typeof fd.col === "string" ? fd.col : fd.col && fd.col[f.type.value]);
    const available = (fd) => (fd.get || fd.types ? true : !!colOf(fd));
    const opsOf = (fd) => (fd.unit ? TEMP_OPS : fd.pick ? PICK_OPS : TEXT_OPS);
    const newRule = (k, extra = {}) => { const fd = fieldOf(k); return { k, op: fd.unit ? "ge" : fd.pick ? "is" : "has", val: fd.pick ? fd.pick[0] : "", val2: "", ...extra }; };
    const QUICK = () => [
      { label: `Rise ≥ ${LIMITS.riseWarn} K`, tag: "warning", r: newRule("rise", { val: String(LIMITS.riseWarn) }) },
      { label: `Rise ≥ ${LIMITS.riseCrit} K`, tag: "alarm", r: newRule("rise", { val: String(LIMITS.riseCrit) }) },
      { label: `Hottest probe ≥ ${LIMITS.crit} °C`, tag: "alarm", r: newRule("hot", { val: String(LIMITS.crit) }) },
      { label: `DE / NDE difference ≥ ${LIMITS.devWarn} °C`, tag: "warning", r: newRule("spread", { val: String(LIMITS.devWarn) }) },
      { label: "Not OK only", tag: "crit", r: newRule("cond", { val: "Not OK" }) },
      { label: "Terminal min / max exceeded", tag: "crit", r: newRule("ctype", { val: CTYPE_NAME.term }) },
      { label: "Equilibrium not reached", r: newRule("eq", { val: "Not yet" }) },
      { label: "Monitored over 1 h", r: newRule("run", { val: "60" }) }
    ];
    const sameRule = (a, b) => a.k === b.k && a.op === b.op && String(a.val) === String(b.val) && String(a.val2 || "") === String(b.val2 || "");
    let report = null, rules = [], rulesSig = "";
    const matchAny = () => f.ruleMode.value === "any";
    const ruleActive = (r) => {
      const fd = fieldOf(r.k);
      if (!available(fd)) return false;
      if (fd.pick) return true;
      if (fd.unit) return isFinite(parseFloat(r.val)) && (r.op !== "between" || isFinite(parseFloat(r.val2)));
      return r.val.trim() !== "";
    };
    function ruleTest(r, cells, types) {
      const fd = fieldOf(r.k), v = (name) => cells[report.cols.indexOf(name)];
      // condition type: is that check out of limits on this row
      if (fd.types) return types.some((t) => CTYPE_NAME[t] === r.val) === (r.op === "is");
      const raw = fd.get ? fd.get(v) : v(colOf(fd));
      if (fd.unit) {
        const x = fd.get ? raw : fd.parse ? fd.parse(raw) : parseFloat(raw), a = parseFloat(r.val), b = parseFloat(r.val2);
        if (!isFinite(x)) return false; // no reading yet (e.g. no prediction) never matches a temperature rule
        return { gt: x > a, ge: x >= a, lt: x < a, le: x <= a, between: x >= Math.min(a, b) && x <= Math.max(a, b) }[r.op];
      }
      const x = String(raw ?? "").trim().toLowerCase(), t = String(r.val).trim().toLowerCase();
      if (fd.pick) return (x === t) === (r.op === "is");
      return { has: x.includes(t), is: x === t, starts: x.startsWith(t) }[r.op];
    }
    const ruleMatch = ({ cells, types }) => { const act = rules.filter(ruleActive), t = (r) => ruleTest(r, cells, types); return !act.length || (matchAny() ? act.some(t) : act.every(t)); };
    const ruleLabel = (r) => { const fd = fieldOf(r.k), u = fd.unit ? ` ${fd.unit}` : ""; return `${fd.label} ${opsOf(fd)[r.op]} ${r.op === "between" ? `${r.val}–${r.val2}${u}` : `${fd.pick ? r.val : fd.unit ? r.val : `"${r.val.trim()}"`}${u}`}`; };
    const condText = () => rules.filter(ruleActive).map(ruleLabel).join(matchAny() ? " or " : " and ");
    // (re)draw the rules only when they change, so typing in a value keeps its focus
    function drawChips() {
      const quick = QUICK().filter((q) => available(fieldOf(q.r.k)));
      $("#ruleChips").innerHTML = `<span class="rule-chips-label">${ico("bolt")}Quick rules</span>` + quick.map((q, i) => {
        const on = rules.some((r) => sameRule(r, q.r));
        return `<button type="button" class="rule-chip${on ? " on" : ""}${q.tag ? ` tag-${q.tag === "crit" || q.tag === "alarm" ? "crit" : "warn"}` : ""}" data-quick="${i}" aria-pressed="${on}">${on ? ico("check") : ico("plus")}${esc(q.label)}${q.tag && q.tag !== "crit" ? `<small>${q.tag}</small>` : ""}</button>`;
      }).join("");
      $("#ruleChips")._quick = quick;
    }
    function drawConds(force) {
      const sig = f.type.value;
      if (!force && sig === rulesSig) return;
      rulesSig = sig;
      drawChips();
      const groupIco = Object.fromEntries(RULE_GROUPS.map(([g, , i]) => [g, i]));
      $("#ruleRows").innerHTML = rules.length ? rules.map((r, i) => {
        const fd = fieldOf(r.k), ok = available(fd), ops = opsOf(fd);
        const valIn = (key, val, label) => fd.unit
          ? `<div class="input-unit"><input class="input num rule-v" data-key="${key}" type="number" step="any" inputmode="decimal" value="${esc(val)}" placeholder="0" aria-label="${label}"><span>${fd.unit}</span></div>`
          : `<input class="input rule-v" data-key="${key}" type="text" value="${esc(val)}" placeholder="${esc(fd.ph || "Value")}" aria-label="${label}" autocomplete="off">`;
        const value = fd.pick
          ? `<select class="select rule-v" data-key="val" aria-label="${esc(fd.label)}">${fd.pick.map((p) => `<option${p === r.val ? " selected" : ""}${fd.types && f.type.value === "readings" && [CTYPE_NAME.pred, CTYPE_NAME.partner, CTYPE_NAME.probe].includes(p) ? " disabled" : ""}>${p}</option>`).join("")}</select>`
          : r.op === "between" ? `<div class="rule-between">${valIn("val", r.val, "From")}<span>and</span>${valIn("val2", r.val2, "To")}</div>` : valIn("val", r.val, "Value");
        return `<div class="rule-row${ok ? "" : " is-na"}" data-i="${i}">
          <span class="rule-ico rule-${fd.g}" aria-hidden="true">${ico(groupIco[fd.g])}</span>
          <select class="select rule-field" aria-label="Rule ${i + 1}: what to check">${RULE_GROUPS.map(([g, gl]) => `<optgroup label="${gl}">${RULE_FIELDS.filter((x) => x.g === g).map((x) => `<option value="${x.k}"${x.k === r.k ? " selected" : ""}${available(x) ? "" : " disabled"}>${esc(x.label)}</option>`).join("")}</optgroup>`).join("")}</select>
          <select class="select rule-op" aria-label="Comparison">${Object.entries(ops).map(([k, t]) => `<option value="${k}"${k === r.op ? " selected" : ""}>${t}</option>`).join("")}</select>
          <div class="rule-val">${value}</div>
          <button type="button" class="btn btn-ghost" data-rule-del aria-label="Remove rule ${i + 1}" title="Remove rule">${ico("x")}</button>
          ${ok ? "" : `<p class="rule-na">Not part of the ${f.type.selectedOptions[0].text.split(" (")[0].toLowerCase()} — ignored here.</p>`}
        </div>`;
      }).join("") : `<p class="rule-empty">No custom rules — every row that passes the filters above is shown. Tap a quick rule or add your own.</p>`;
      $("#ruleModeBox").hidden = rules.length < 2; // all / any only matters with two or more rules
      $("#ruleClear").hidden = !rules.length;
    }

    // build the report rows for the current filters
    function build() {
      const motors = allMotors().filter(({ d, m }) => !m.queued && (f.device.value === "all" || d.id === f.device.value) && (f.motor.value === "all" || m.id === f.motor.value));
      const statusOf = ({ d, m }) => (d.online ? evalMotor(m).status : "off");
      if (f.type.value === "summary") {
        const rows = motors.filter((x) => {
          if (f.cond.value !== "all" && statusOf(x) !== f.cond.value) return false;
          const e = evalMotor(x.m);
          if (f.ctype.value !== "all" && !failing(e, f.ctype.value)) return false;
          return matches({ motor: x.m.id, test: x.m.testId, stator: x.m.stator, model: x.m.model, loco: x.m.loco, device: `${x.d.name} ${x.d.id}`, location: x.d.location, reason: statusOf(x) === "ok" ? "" : reasonOf(e) });
        }).map((x) => {
          const { d, m } = x, e = evalMotor(m), th = e.th, ok = th && th.confident;
          return { status: statusOf(x), types: Object.keys(CTYPE_CHECK).filter((t) => failing(e, t)), cells: [m.id, m.testId || "", m.stator || "", m.model, m.loco, d.name, chLabel(m), d.location, ...m.live.map((v) => v.toFixed(1)), e.rise.toFixed(1), e.dev.toFixed(1),
            ok ? th.finalTemp.toFixed(1) : "", ok ? th.tau.toFixed(0) : "", th && th.eq ? "Reached" : "Not yet", VERDICT_SHORT[statusOf(x)], statusOf(x) === "ok" ? "" : reasonOf(e), fmtRun(runMinutes(m))] };
        });
        return { title: "Condition summary", cols: ["Motor", "Test ID", "Stator No.", "Model / type", "Locomotive", "Device", "Channel", "Location", ...PROBES.map((p) => `${p} °C`), "Rise K", "DE / NDE Δ °C", "Predicted final °C", "τ min", "Equilibrium", "Condition", "Reason", "Monitoring for"], num: Array.from({ length: PROBES.length + 4 }, (_, i) => 8 + i), statusCol: 8 + PROBES.length + 5, motorCol: 0, rows };
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
          const lv = { rise: lvl(rise, LIMITS.riseWarn, LIMITS.riseCrit), temp: lvl(hot, LIMITS.warn, LIMITS.crit), spread: lvl(spread, LIMITS.devWarn, LIMITS.devCrit), term: termBreaches(p.v).length ? "crit" : "ok" };
          const s = [lv.rise, lv.temp, lv.spread, lv.term].reduce((w, c) => (RANK[c] > RANK[w] ? c : w), "ok");
          if (f.cond.value !== "all" && s !== f.cond.value) return;
          if (f.ctype.value !== "all" && (lv[f.ctype.value] || "ok") === "ok") return;
          if (!matches({ motor: m.id, test: m.testId, device: `${d.name} ${d.id}`, time: stamp(p.t) })) return;
          rows.push({ t: p.t, status: s, types: Object.keys(lv).filter((t) => lv[t] !== "ok"), cells: [stamp(p.t), m.id, m.testId || "", d.name, chLabel(m), ...p.v.map((v) => v.toFixed(1)), rise.toFixed(1), spread.toFixed(1), VERDICT_SHORT[s]] });
        });
      });
      rows.sort((a, b) => a.t - b.t || a.cells[1].localeCompare(b.cells[1]));
      return { title: "Temperature readings", cols: ["Time", "Motor", "Test ID", "Device", "Channel", ...PROBES.map((p) => `${p} °C`), "Max rise K", "DE / NDE Δ °C", "Status"], num: Array.from({ length: PROBES.length + 2 }, (_, i) => 5 + i), statusCol: 5 + PROBES.length + 2, motorCol: 1, rows };
    }
    const filterText = () => [
      `Device: ${f.device.selectedOptions[0].text}`, `Motor: ${f.motor.selectedOptions[0].text}`, `Condition: ${f.cond.selectedOptions[0].text}`,
      ...(f.ctype.value !== "all" ? [`Condition type: ${f.ctype.selectedOptions[0].text}`] : []),
      ...(term() ? [`Search${f.sin.value === "all" ? "" : ` in ${f.sin.selectedOptions[0].text}`}: "${f.search.value.trim()}"`] : []),
      ...(report && condText() ? [`Rules: ${condText()}`] : []),
      ...(f.type.value === "readings" ? [`Range: ${f.range.selectedOptions[0].text}`, `Every ${f.interval.selectedOptions[0].text}`] : [])
    ];

    const render = () => {
      $$(".rep-readings").forEach((el) => (el.hidden = f.type.value !== "readings"));
      report = build();
      drawConds();
      report.rows = report.rows.filter(ruleMatch);
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
      $("#repPrintHead").innerHTML = `<h2>TractionTherm · ${esc(report.title)}</h2><p>Generated ${esc(stamp(Date.now()))} · ${esc(filterText().join(" · "))}</p><p>Limits: warning ${LIMITS.riseWarn} K / alarm ${LIMITS.riseCrit} K rise above ambient · alarm ${LIMITS.crit} °C · DE / NDE Δ ${LIMITS.devCrit} °C · terminals ${PROBES.map((p) => `${p} ${TERM[p].min}–${TERM[p].max}`).join(", ")} °C · equilibrium &lt; ${EQ_RATE} K/h (IEC 60034-1)</p>`;
      $("#repHead").innerHTML = `<tr>${report.cols.map((h, i) => `<th${report.num.includes(i) ? ' class="num"' : ""}>${esc(h)}</th>`).join("")}</tr>`;
      $("#repRows").innerHTML = report.rows.length ? report.rows.map((r) => `<tr>${r.cells.map((v, i) => `<td data-label="${esc(report.cols[i])}"${i === 0 ? ' class="lead-cell"' : report.num.includes(i) ? ' class="num"' : ""}>${i === report.statusCol ? verdictPill(r.status) : i === report.motorCol ? `<a class="rep-motor" href="motor.html?motor=${encodeURIComponent(v)}" title="Open ${esc(v)} — live view, graphs and its own report">${esc(v)}</a>` : esc(v || "—")}</td>`).join("")}</tr>`).join("")
        : `<tr><td colspan="${report.cols.length}" class="muted" style="text-align:center;padding:28px">No data matches these filters.</td></tr>`;
      $("#repFoot").textContent = `${report.rows.length} row${report.rows.length === 1 ? "" : "s"} · the download contains exactly the rows shown above`;
      updateAlertCount();
    };

    $("#repCsv").addEventListener("click", () => {
      if (!allowed("reports")) return;
      if (!report || !report.rows.length) { toast("Nothing to download — change the filters"); return; }
      const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
      // "Label: value" → two cells (split at the first ": " only, a search term may contain one)
      const meta = filterText().map((t) => { const i = t.indexOf(": "); return i < 0 ? [t] : [t.slice(0, i), t.slice(i + 2)]; });
      const lines = [["Report", report.title], ["Generated", stamp(Date.now())], ...meta, [], report.cols, ...report.rows.map((r) => r.cells)];
      const blob = new Blob(["﻿" + lines.map((l) => l.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      const d = new Date(), pad = (n) => String(n).padStart(2, "0");
      a.href = URL.createObjectURL(blob);
      a.download = `tractiontherm-${f.type.value}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      logActivity("report", `Downloaded ${report.title} CSV — ${report.rows.length} rows · ${filterText().join(" · ")}`);
      toast(`Downloaded ${report.rows.length} rows`);
    });
    $("#repPrint").addEventListener("click", () => { if (!allowed("reports")) return; render(); logActivity("report", `Printed ${report.title} — ${report.rows.length} rows · ${filterText().join(" · ")}`); window.print(); });
    const resetRules = () => { rules = []; f.ruleMode.value = "all"; rulesSig = ""; };
    $("#repReset").addEventListener("click", () => { defaults(); syncCtype(); syncSearch(); resetRules(); render(); });
    // custom rules: the rule controls have no name, so they don't clash with the form's filters
    const ruleAt = (el) => rules[+el.closest(".rule-row").dataset.i];
    let ruleTimer;
    $("#ruleRows").addEventListener("input", (e) => {
      if (!e.target.classList.contains("rule-v") || e.target.tagName === "SELECT") return;
      ruleAt(e.target)[e.target.dataset.key] = e.target.value;
      clearTimeout(ruleTimer); ruleTimer = setTimeout(() => { render(); drawChips(); }, 250); // filter as you type
    });
    $("#ruleRows").addEventListener("change", (e) => {
      const r = ruleAt(e.target), t = e.target.classList;
      if (t.contains("rule-field")) Object.assign(r, newRule(e.target.value)); // a different kind of value: start fresh
      else if (t.contains("rule-op")) r.op = e.target.value;
      else if (t.contains("rule-v") && e.target.tagName === "SELECT") r[e.target.dataset.key] = e.target.value;
      else return; // typed values are already kept by the input listener; redrawing here would steal focus
      clearTimeout(ruleTimer);
      drawConds(true); // the form's own change listener then renders the report
      if (t.contains("rule-field") || (t.contains("rule-op") && r.op === "between")) { const v = $(`#ruleRows .rule-row[data-i="${rules.indexOf(r)}"] input.rule-v`); if (v) v.focus(); }
    });
    $("#ruleRows").addEventListener("click", (e) => {
      if (!e.target.closest("[data-rule-del]")) return;
      rules.splice(+e.target.closest(".rule-row").dataset.i, 1);
      drawConds(true); render();
    });
    // quick rules toggle: on adds the rule, on again takes it off
    $("#ruleChips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-quick]"); if (!b) return;
      const q = $("#ruleChips")._quick[+b.dataset.quick], at = rules.findIndex((r) => sameRule(r, q.r));
      if (at >= 0) rules.splice(at, 1); else rules.push({ ...q.r });
      drawConds(true); render();
    });
    $("#ruleAdd").addEventListener("click", () => {
      rules.push(newRule(available(fieldOf("rise")) ? "rise" : "motor"));
      drawConds(true);
      $$("#ruleRows .rule-row").pop().querySelector(".rule-field").focus();
    });
    $("#ruleClear").addEventListener("click", () => { resetRules(); render(); });
    $("#repForm").addEventListener("change", (e) => { if (e.target === f.device) fillMotors(); if (e.target === f.type) syncCtype(); if (e.target === f.type || e.target === f.sin) syncSearch(); render(); });
    let searchTimer;
    f.search.addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(render, 150); }); // filter as you type
    syncCtype(); syncSearch();
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
    const NEW_ROLE = "__new";
    // role list + "Enter a new role…" (typed roles are created with view-only access)
    const fillRoles = () => {
      const keep = $("#roleFilter").value;
      $("#roleFilter").innerHTML = `<option value="">All roles</option>` + ROLES.map((r) => `<option>${esc(r.name)}</option>`).join("");
      $("#roleFilter").value = ROLES.some((r) => r.name === keep) ? keep : "";
      form.elements.role.innerHTML = ROLES.map((r) => `<option>${esc(r.name)}</option>`).join("") + `<option value="${NEW_ROLE}">+ Enter a new role…</option>`;
    };
    const syncRoleNew = () => {
      const typed = form.elements.role.value === NEW_ROLE, box = form.elements.roleNew;
      box.hidden = !typed;
      $("#roleHint").textContent = typed ? "A new role starts with view-only access · set its permissions on Roles & Permissions" : "Pick a role, or choose “Enter a new role…” to type one";
      if (typed) box.focus();
    };
    fillRoles();
    form.elements.role.addEventListener("change", () => { err.classList.remove("show"); syncRoleNew(); });

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
      form.elements.roleNew.value = "";
      syncRoleNew();
      dlg.showModal();
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements, fail = (m) => { err.textContent = m; err.classList.add("show"); };
      const data = { name: f.name.value.trim(), username: f.username.value.trim().toLowerCase(), email: f.email.value.trim().toLowerCase(), role: f.role.value, active: f.active.checked };
      // a typed role: use the existing one if the name matches, otherwise it is created below (after all checks pass)
      let newRole = null;
      if (data.role === NEW_ROLE) {
        const typed = f.roleNew.value.trim().replace(/\s+/g, " ");
        if (typed.length < 2 || typed.length > 30) { f.roleNew.focus(); return fail("Role name: 2–30 characters."); }
        if (!/^[A-Za-z0-9 &/_-]+$/.test(typed)) { f.roleNew.focus(); return fail("Role name: letters, numbers, spaces, & / _ - only."); }
        const existing = ROLES.find((r) => r.name.toLowerCase() === typed.toLowerCase());
        if (existing) data.role = existing.name;
        else { data.role = typed; newRole = typed; }
      }
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
      const changes = editing ? [editing.name !== data.name && `name ${editing.name} → ${data.name}`, editing.username !== data.username && `username ${editing.username} → ${data.username}`,
        editing.email !== data.email && "email changed", editing.role !== data.role && `role ${editing.role} → ${data.role}`,
        editing.active !== data.active && (data.active ? "account enabled" : "account disabled"), pw && "password changed"].filter(Boolean) : [];
      if (newRole) {
        ROLES.push({ name: newRole, desc: "Added from the Users page" });
        GRANTS[newRole] = ["view"]; // view-only until permissions are given on Roles & Permissions
        saveRoles(); saveGrants();
        logActivity("role", `Added role ${newRole} (typed on the Users page) with view-only access`);
      }
      if (editing) { Object.assign(editing, data); if (pw) editing.password = pw; }
      else USERS.push({ id: Math.max(0, ...USERS.map((u) => u.id)) + 1, ...data, password: pw, lastLogin: null });
      saveUsers(); dlg.close(); applyPerms();
      logActivity("user", editing ? `Edited user ${data.username}${changes.length ? ` — ${changes.join(", ")}` : " — no changes"}` : `Added user ${data.username} (${data.name}, ${data.role}${data.active ? "" : ", disabled"})`);
      toast(`${data.name} ${editing ? "updated" : "added"}${newRole ? ` · new role ${newRole} has view-only access — set its permissions on Roles & Permissions` : ""}`);
      if (newRole) fillRoles();
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
      USERS = USERS.filter((x) => x !== u); saveUsers(); logActivity("user", `Deleted user ${u.username} (${u.name}, ${u.role})`); toast(`${u.name} deleted`); render();
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
      $("#permHead").innerHTML = `<th>Permission</th>` + ROLES.map((r) => `<th class="perm-col"><span>${esc(r.name)}</span></th>`).join("");
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
      const oldName = editing ? editing.name : null, oldPerms = editing ? grantsOf(editing.name) : [];
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
      const added = perms.filter((k) => !oldPerms.includes(k)).map((k) => PERMISSIONS.find((p) => p.key === k)?.label || k), removed = oldPerms.filter((k) => !grantsOf(name).includes(k)).map((k) => PERMISSIONS.find((p) => p.key === k)?.label || k);
      logActivity("role", editing ? `Edited role ${name}${oldName !== name ? ` (renamed from ${oldName})` : ""}${added.length ? ` — granted: ${added.join(", ")}` : ""}${removed.length ? ` — removed: ${removed.join(", ")}` : ""}${oldName === name && !added.length && !removed.length ? " — no permission changes" : ""}`
        : `Added role ${name} with ${grantsOf(name).length} permission${grantsOf(name).length === 1 ? "" : "s"}: ${grantsOf(name).map((k) => PERMISSIONS.find((p) => p.key === k)?.label || k).join(", ")}`);
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
      saveRoles(); saveGrants(); logActivity("role", `Deleted role ${role.name}`); toast(`Role ${role.name} deleted`); render();
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
      const diff = ROLES.map((r) => {
        const was = grantsOf(r.name), now = draft[r.name] || [];
        const add = now.filter((k) => !was.includes(k)).map((k) => PERMISSIONS.find((p) => p.key === k)?.label || k), rem = was.filter((k) => !now.includes(k)).map((k) => PERMISSIONS.find((p) => p.key === k)?.label || k);
        return add.length || rem.length ? `${r.name}: ${[add.length ? `+ ${add.join(", ")}` : "", rem.length ? `− ${rem.join(", ")}` : ""].filter(Boolean).join(" ")}` : "";
      }).filter(Boolean);
      logActivity("role", `Saved permissions — ${diff.join("; ")}`);
      ROLES.forEach((r) => (GRANTS[r.name] = (draft[r.name] || []).slice()));
      saveGrants(); applyPerms(); render(); toast("Permissions saved");
    });
    $("#permReset").addEventListener("click", async () => {
      if (!(await confirmDialog({ title: "Reset permissions?", message: "Built-in roles go back to their default permissions. Roles you added are not changed.", confirmLabel: "Reset", danger: false }))) return;
      Object.keys(DEFAULT_GRANTS).forEach((k) => { if (ROLES.some((r) => r.name === k)) GRANTS[k] = DEFAULT_GRANTS[k].slice(); });
      saveGrants(); draft = snapshot();
      logActivity("role", "Reset built-in roles to their default permissions");
      applyPerms(); render(); toast("Default permissions restored");
    });
    render();
    return null;
  }

  /* =========================================================
     Page: Activity log — read-only list of everything that was done
     ========================================================= */
  function pageActivity() {
    const PAGE = 100, DAY = 86400000;
    let shown = PAGE;
    const when = (t) => new Date(t).toLocaleString([], { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const all = () => store.get(ACT_KEY, []).slice().reverse(); // newest first
    const users = [...new Set(all().map((e) => e.username ? `${e.username}|${e.user}` : ""))].filter(Boolean);
    $("#actCat").innerHTML = `<option value="">All categories</option>` + Object.entries(ACT_CATS).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join("");
    $("#actUser").innerHTML = `<option value="">All users</option>` + users.map((u) => { const [n, full] = u.split("|"); return `<option value="${esc(n)}">${esc(full)} (${esc(n)})</option>`; }).join("");
    const filtered = () => {
      const term = $("#actSearch").value.trim().toLowerCase(), cat = $("#actCat").value, user = $("#actUser").value, period = $("#actPeriod").value;
      const from = period === "all" ? 0 : period === "today" ? new Date().setHours(0, 0, 0, 0) : Date.now() - +period * DAY;
      return all().filter((e) => e.t >= from && (!cat || e.cat === cat) && (!user || e.username === user) && (!term || [e.text, e.user, e.username, e.role, ACT_CATS[e.cat]].join(" ").toLowerCase().includes(term)));
    };
    const render = () => {
      const list = filtered(), everything = all(), today = new Date().setHours(0, 0, 0, 0);
      const todays = everything.filter((e) => e.t >= today);
      $("#actSummary").innerHTML = `
        <div><span>Entries</span><b class="num">${everything.length}</b></div>
        <div><span>${ico("clock")}Today</span><b class="num">${todays.length}</b></div>
        <div><span>${ico("users")}People active today</span><b class="num">${new Set(todays.filter((e) => e.username).map((e) => e.username)).size}</b></div>
        <div><span style="color:var(--crit-text)">${ico("lock")}Failed sign-ins / denied</span><b class="num">${everything.filter((e) => e.cat === "access" || /^Failed sign-in|^Sign-in refused/.test(e.text)).length}</b></div>`;
      $("#actCount").textContent = `${list.length} of ${everything.length} entries`;
      $("#actRows").innerHTML = list.length ? list.slice(0, shown).map((e) => `<tr>
          <td data-label="Time" class="num act-time">${esc(when(e.t))}</td>
          <td data-label="User" class="lead-cell"><div class="cell-stack"><b>${esc(e.user)}</b><span class="muted cell-sub">${esc([e.username, e.role].filter(Boolean).join(" · ") || "not signed in")}</span></div></td>
          <td data-label="Category"><span class="act-cat act-${e.cat}">${esc(ACT_CATS[e.cat] || e.cat)}</span></td>
          <td data-label="Activity" class="act-text">${esc(e.text)}</td>
        </tr>`).join("")
        : `<tr><td colspan="4" class="muted" style="text-align:center;padding:32px">${everything.length ? "No activity matches these filters." : "No activity recorded yet."}</td></tr>`;
      $("#actMore").hidden = list.length <= shown;
      $("#actMore").textContent = `Show ${Math.min(PAGE, list.length - shown)} more`;
    };
    ["#actSearch", "#actCat", "#actUser", "#actPeriod"].forEach((sel) => $(sel).addEventListener(sel === "#actSearch" ? "input" : "change", () => { shown = PAGE; render(); }));
    $("#actMore").addEventListener("click", () => { shown += PAGE; render(); });
    $("#actReset").addEventListener("click", () => { $("#actSearch").value = ""; $("#actCat").value = ""; $("#actUser").value = ""; $("#actPeriod").value = "all"; shown = PAGE; render(); });
    $("#actCsv").addEventListener("click", () => {
      const list = filtered();
      if (!list.length) { toast("Nothing to download — change the filters"); return; }
      const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
      const lines = [["Time", "User", "Username", "Role", "Category", "Activity"], ...list.map((e) => [when(e.t), e.user, e.username, e.role, ACT_CATS[e.cat] || e.cat, e.text])];
      const blob = new Blob(["\ufeff" + lines.map((l) => l.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a"), d = new Date(), pad = (n) => String(n).padStart(2, "0");
      a.href = URL.createObjectURL(blob);
      a.download = `tractiontherm-activity-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      logActivity("report", `Downloaded the activity log CSV — ${list.length} entries`);
      toast(`Downloaded ${list.length} entries`);
      render();
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
      if (!u || u.password !== pw.value) { logActivity("auth", `Failed sign-in for "${name}" — incorrect username or password`, u || null); return fail("Incorrect username or password."); }
      if (!u.active) { logActivity("auth", `Sign-in refused for ${u.username} — account is disabled`, u); return fail("This account is disabled. Ask an administrator to enable it."); }
      err.classList.remove("show");
      u.lastLogin = Date.now(); saveUsers();
      store.set(SESSION_KEY, u.id);
      logActivity("auth", "Signed in", u);
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
    if (page === "activity" && !can("activity")) { location.replace("dashboard.html"); return; }
    if (page === "login") store.set(SESSION_KEY, null);
    initShell();
    applyPerms();
    $$('.nav a[href="index.html"]').forEach((a) => a.addEventListener("click", () => { logActivity("auth", "Signed out"); store.set(SESSION_KEY, null); }));
    const pages = { dashboard: pageDashboard, monitor: pageMonitor, motor: pageMotor, reports: pageReports, devices: pageDevices, motors: pageMotorMgmt, settings: pageSettings, users: pageUsers, roles: pageRoles, activity: pageActivity, login: pageLogin };
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
