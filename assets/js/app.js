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
    health: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    thermo: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0Z"/><path d="M11.5 10v7"/>',
    train: '<rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16M12 3v8M8 21l-2-4M16 21l2-4"/><circle cx="8.5" cy="14" r=".6" fill="currentColor"/><circle cx="15.5" cy="14" r=".6" fill="currentColor"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    wifiOff: '<path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2.1-1.6M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 10.7 5M12 20h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6A17 17 0 0 0 2 12s3.5 8 10 8a10 10 0 0 0 5.4-1.6M2 2l20 20M14.1 14.1a3 3 0 0 1-4.2-4.2"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
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
  const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const initials = (n) => String(n).trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

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
     Data model
     Loco-shed bench run of a traction motor after overhaul/maintenance.
     Device → test bench with up to 2 motor slots
     Motor  → 3 probes: Sensor 1 on the DE (drive / pinion-end) bearing,
              Sensor 2 on the NDE (non-drive / commutator-end) bearing,
              Ambient = shed air temperature at the bench
     Readings are arrays in that order: [sensor1, sensor2, ambient]

     Acceptance follows shed practice: the main criterion is bearing
     temperature RISE ABOVE AMBIENT (e.g. RailCorp ESR 0601: ≤ 30 °C above
     ambient), with absolute bearing temperature, DE/NDE difference and
     rate of rise as supporting checks. All values are editable.
     ========================================================= */
  const DEFAULT_LIMITS = { warn: 80, crit: 100, riseWarn: 25, riseCrit: 30, devWarn: 10, devCrit: 15, ambMax: 50, rateWarn: 2 };
  const LIMITS_KEY = "tt-limits-v2"; // v2: shed bearing-run criteria
  const LIMITS = { ...DEFAULT_LIMITS, ...store.get(LIMITS_KEY, {}) };
  const LIMITS_REF = LIMITS; // lets functions take a `limits` option that shadows LIMITS
  const tempMax = (L = LIMITS) => Math.max(120, Math.ceil((L.crit + 15) / 20) * 20); // gauge / spread scale
  const PROBES = [
    { name: "Sensor 1 · DE bearing", mini: "S1 · DE", short: "DE", color: "var(--series-1)" },
    { name: "Sensor 2 · NDE bearing", mini: "S2 · NDE", short: "NDE", color: "var(--series-2)" },
    { name: "Shed ambient", mini: "Ambient", short: "Amb", color: "var(--series-3)" }
  ];
  const AMB = 2;            // index of the ambient probe
  const HIST = 90;          // points kept per probe
  const STEP_MS = 2000;     // simulated sample interval
  const LOG_EVERY_MS = 10 * 60 * 1000; // shed log sheet: one reading every 10 minutes
  const TREND_EVERY_MS = 60 * 1000;    // run trend chart: one point per minute

  const DEFAULT_DEVICES = [
    { id: "TMU-01", name: "Test Bench A", location: "Loco Shed · Bay 3", ip: "192.168.10.21", fw: "2.4.1", online: true, signal: 4, interval: 2,
      motors: [
        { slot: 1, id: "TM-4471", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [50, 53, 31], runMin: 48 },
        { slot: 2, id: "TM-4472", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [57, 59, 32], runMin: 48 }
      ] },
    { id: "TMU-02", name: "Test Bench B", location: "Loco Shed · Bay 5", ip: "192.168.10.22", fw: "2.4.1", online: true, signal: 3, interval: 2,
      motors: [
        { slot: 1, id: "TM-3810", model: "HS 15250A · 3-phase AC", loco: "WAP-7 #30412", base: [66, 69, 33], runMin: 62 }
      ] },
    { id: "TMU-03", name: "Test Bench C", location: "Loco Shed · Bay 6", ip: "192.168.10.31", fw: "2.3.8", online: true, signal: 4, interval: 2,
      motors: [
        { slot: 1, id: "TM-5120", model: "TAO 659 · DC series", loco: "WAG-7 #27850", base: [47, 49, 29], runMin: 34 },
        { slot: 2, id: "TM-5121", model: "TAO 659 · DC series", loco: "WAG-7 #27850", base: [41, 53, 29], runMin: 34 }
      ] },
    { id: "TMU-04", name: "Mobile Kit D", location: "Loco Shed · Pit line 2", ip: "192.168.10.40", fw: "2.4.0", online: false, signal: 0, interval: 5, lastSeen: "Today, 06:12", motors: [] }
  ];

  const DEV_KEY = "tt-devices-v3"; // v3: shed bench-run sample data
  let DEVICES = store.get(DEV_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_DEVICES));
  const saveDevices = () => store.set(DEV_KEY, DEVICES.map((d) => ({ ...d, motors: d.motors.map(({ live, hist, min, max, log, trend, runStart, ...m }) => m) })));

  // bearing warm-up after the bench run starts: rises toward its steady value
  const warmUp = (base, amb, minutes) => amb + (base - amb) * (1 - Math.exp(-minutes / 9));

  function seedMotor(m) {
    const now = Date.now();
    const amb = m.base[AMB];
    m.runStart = now - (m.runMin || 25) * 60000;
    const runMinAt = (t) => (t - m.runStart) / 60000;
    m.hist = { t: Array.from({ length: HIST }, (_, i) => now - (HIST - 1 - i) * STEP_MS) };
    m.hist.v = m.base.map((b, j) => m.hist.t.map((t) => (j === AMB
      ? +(b + (Math.random() - 0.5) * 0.4).toFixed(1)
      : +(warmUp(b, amb, runMinAt(t)) + (Math.random() - 0.5) * 1.2).toFixed(1))));
    m.live = m.hist.v.map((a) => a[a.length - 1]);
    m.min = m.hist.v.map((a) => Math.min(...a));
    m.max = m.hist.v.map((a) => Math.max(...a));
    // run trend for the charts: one point per minute since the run started
    m.trend = [];
    for (let t = m.runStart; t <= now; t += TREND_EVERY_MS) {
      m.trend.push({ t, v: m.base.map((b, j) => +(j === AMB ? b + (Math.random() - 0.5) * 0.5 : warmUp(b, amb, runMinAt(t)) + (Math.random() - 0.5) * 0.7).toFixed(1)) });
    }
    // log sheet: start-of-run reading, then every 10 minutes
    m.log = [];
    for (let t = m.runStart; t <= now; t += LOG_EVERY_MS) {
      m.log.push({ t, v: m.base.map((b, j) => +(j === AMB ? b + (Math.random() - 0.5) * 0.6 : warmUp(b, amb, runMinAt(t)) + (Math.random() - 0.5) * 0.8).toFixed(1)) });
    }
  }
  DEVICES.forEach((d) => d.motors.forEach(seedMotor));

  // Simulated acquisition. Replace with real data source.
  function tick() {
    const now = Date.now();
    DEVICES.forEach((d) => {
      if (!d.online) return;
      d.motors.forEach((m) => {
        m.hist.t.push(now); m.hist.t.shift();
        m.live = m.live.map((v, j) => {
          const noise = j === AMB ? 0.25 : 0.9;
          const nv = +(v + (m.base[j] - v) * 0.12 + (Math.random() - 0.5) * noise).toFixed(1);
          m.hist.v[j].push(nv); m.hist.v[j].shift();
          m.min[j] = Math.min(m.min[j], nv);
          m.max[j] = Math.max(m.max[j], nv);
          return nv;
        });
        const last = m.log[m.log.length - 1];
        if (!last || now - last.t >= LOG_EVERY_MS) m.log.push({ t: now, v: m.live.slice() });
        const lt = m.trend[m.trend.length - 1];
        if (!lt || now - lt.t >= TREND_EVERY_MS) { m.trend.push({ t: now, v: m.live.slice() }); if (m.trend.length > 600) m.trend.shift(); }
      });
    });
  }

  // bearing temperature trend in °C per minute (least-squares slope over the live window, both bearings averaged)
  function rateOfRise(m) {
    const t = m.hist.t, n = t.length;
    if (n < 10) return 0;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (let i = 0; i < n; i++) {
      const x = (t[i] - t[0]) / 60000, y = (m.hist.v[0][i] + m.hist.v[1][i]) / 2;
      sx += x; sy += y; sxx += x * x; sxy += x * y;
    }
    const den = n * sxx - sx * sx;
    return den ? (n * sxy - sx * sy) / den : 0;
  }
  const runMinutes = (m) => Math.max(0, (Date.now() - m.runStart) / 60000);
  const fmtRun = (min) => { const t = Math.max(0, Math.floor(min)); return t >= 60 ? `${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")} min` : `${t} min`; };

  /* ---------- Evaluation (motor OK / not OK) ---------- */
  const RANK = { ok: 0, warn: 1, crit: 2 };
  const lvl = (v, warn, crit) => (crit != null && v >= crit ? "crit" : warn != null && v >= warn ? "warn" : "ok");
  // L = limits to judge against (global by default, or a test's own limits)
  function evalMotor(m, L = LIMITS) {
    const [s1, s2, amb] = m.live;
    const hot = Math.max(s1, s2);
    const rise = hot - amb;
    const dev = Math.abs(s1 - s2);
    // n/max/warn/crit drive the bullet graphics
    const rate = m.hist ? rateOfRise(m) : 0;
    const implausible = m.live.slice(0, 2).some((v) => v < amb - 3 || v > 200); // bearing colder than shed air → probe off / open circuit
    const checks = [
      { k: "Bearing rise above ambient", d: `Hotter bearing − ambient · Warn ${L.riseWarn} K · Fail ${L.riseCrit} K`, v: rise.toFixed(1) + " K", n: rise, max: Math.max(45, L.riseCrit + 15), warn: L.riseWarn, crit: L.riseCrit },
      { k: "Bearing temperature", d: `DE / NDE absolute · Warn ${L.warn} °C · Stop ${L.crit} °C`, v: hot.toFixed(1) + " °C", n: hot, max: tempMax(L), warn: L.warn, crit: L.crit },
      { k: "DE / NDE difference", d: `Warn ${L.devWarn} °C · Fail ${L.devCrit} °C`, v: "Δ " + dev.toFixed(1) + " °C", n: dev, max: Math.max(20, L.devCrit + 5), warn: L.devWarn, crit: L.devCrit },
      { k: "Rate of rise", d: `${Math.abs(rate) < 0.3 ? "Stabilised" : rate > 0 ? "Still rising" : "Cooling"} · Warn above ${L.rateWarn} °C/min`, v: (rate >= 0 ? "+" : "") + rate.toFixed(1) + " °C/min", n: Math.max(0, rate), max: L.rateWarn * 2.5, warn: L.rateWarn, crit: null },
      { k: "Shed ambient", d: `Valid range 0 – ${L.ambMax} °C`, v: amb.toFixed(1) + " °C", n: amb, max: Math.max(60, L.ambMax + 15), warn: L.ambMax, crit: null },
      { k: "Probe readings plausible", d: "Sensor 1 · Sensor 2 · Ambient reporting", v: implausible ? "Check probe" : "3 / 3", s: implausible ? "warn" : "ok" }
    ];
    checks.forEach((c) => { if (c.n != null) c.s = lvl(c.n, c.warn, c.crit); });
    const status = checks.reduce((w, c) => (RANK[c.s] > RANK[w] ? c.s : w), "ok");
    const score = Math.max(0, 100 - checks.reduce((p, c) => p + (c.s === "crit" ? 40 : c.s === "warn" ? 15 : 0), 0));
    return { hot, amb, rise, dev, rate, stable: Math.abs(rate) < 0.3, checks, status, score };
  }
  const allMotors = () => DEVICES.flatMap((d) => d.motors.map((m) => ({ d, m })));
  const liveMotors = () => allMotors().filter((x) => x.d.online);
  // effective bearing limits for a given shed ambient (rise limit usually bites before the absolute one)
  const effLimits = (L, amb) => (amb == null ? { warn: L.warn, crit: L.crit } : { warn: Math.min(L.warn, amb + L.riseWarn), crit: Math.min(L.crit, amb + L.riseCrit) });
  const tCls = (v, j, amb) => { if (j === AMB) return ""; const e = effLimits(LIMITS, amb); return v >= e.crit ? "t-crit" : v >= e.warn ? "t-warn" : ""; };

  const STATUS = {
    ok: { label: "Within limits", icon: "checkCircle" },
    warn: { label: "Warning", icon: "alert" },
    crit: { label: "Over limit", icon: "xCircle" },
    off: { label: "Offline", icon: "wifiOff" }
  };
  const badge = (s, label) => `<span class="badge ${s}">${ico(STATUS[s].icon)}${esc(label || STATUS[s].label)}</span>`;

  function updateAlertCount() {
    const n = liveMotors().filter((x) => evalMotor(x.m).status !== "ok").length;
    $$("[data-alert-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
    $$("[data-alert-dot]").forEach((el) => (el.hidden = n === 0));
  }

  /* ---------- Shared fragments ---------- */
  function motorPanel(d, m) {
    const e = evalMotor(m);
    return `
      <div class="motor-panel is-${e.status}">
        <div class="motor-panel-head">
          <div><span class="slot">Slot ${m.slot} · ${esc(m.loco)}</span><b>${esc(m.id)}</b></div>
          ${verdictPill(e.status)}
        </div>
        ${readings(m)}
        <div class="panel-trend" title="Hotter bearing since the run started · dashed = fail level">
          <span>Run trend</span>${sparkRun(m, e.status)}
        </div>
        <div class="motor-panel-foot">
          <span class="num">Run ${fmtRun(runMinutes(m))} · ${trendText(e)}</span>
          <a href="motors.html?device=${encodeURIComponent(d.id)}&motor=${m.slot}">Log sheet →</a>
        </div>
      </div>`;
  }
  const emptySlot = (slot, d) => `
    <div class="empty-slot">
      <div>${ico("plus")}<div><b>Slot ${slot} available</b></div><div>${d.motors.length ? "Assign a second motor to test both together" : "Assign a motor to start testing"}</div>
      <button type="button" class="btn btn-sm" style="margin-top:10px" data-add-motor="${esc(d.id)}|${slot}">Assign motor</button></div>
    </div>`;

  /* =========================================================
     CRUD dialogs built in JS (confirm, view, motor form,
     thresholds form) so every page shares them.
     ========================================================= */
  let rerender = () => {};
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
    if (!DEVICES.length) { toast("Add a device first — motors are assigned to device slots"); return; }
    const editDev = preset.edit && DEVICES.find((d) => d.id === preset.device);
    const editing = editDev && editDev.motors.find((m) => m.slot === +preset.slot);
    const d = makeDialog("motorDialog", `
      <form id="motorForm" novalidate style="display:contents">
        ${dlgHead(editing ? `Edit motor ${editing.id}` : "Add motor", editing ? "Update details or move it to another device / slot." : "Assign a motor to a free device slot. It is monitored by Sensor 1, Sensor 2 and Ambient.")}
        <div class="modal-body">
          <div class="form-error" id="mfError" role="alert"></div>
          <div class="form-grid">
            <div class="field"><label for="mf-dev">Device</label><select class="select" id="mf-dev" name="device">${DEVICES.map((x) => `<option value="${esc(x.id)}">${esc(x.id)} — ${esc(x.name)}</option>`).join("")}</select></div>
            <div class="field"><label for="mf-slot">Slot</label><select class="select" id="mf-slot" name="slot"></select></div>
            <div class="field"><label for="mf-id">Motor ID</label><input class="input mono" id="mf-id" name="id" placeholder="TM-0001" required autofocus></div>
            <div class="field"><label for="mf-model">Model / type</label><input class="input" id="mf-model" name="model" placeholder="3-phase AC traction motor"></div>
            <div class="field full"><label for="mf-loco">Locomotive / coach</label><input class="input" id="mf-loco" name="loco" placeholder="WAG-9 #31245"></div>
          </div>
        </div>
        <div class="modal-foot"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">${editing ? "Save changes" : "Add motor"}</button></div>
      </form>`);
    const f = d.querySelector("#motorForm"), dev = f.elements.device, slot = f.elements.slot, err = d.querySelector("#mfError");
    const fillSlots = () => {
      const target = DEVICES.find((x) => x.id === dev.value);
      slot.innerHTML = [1, 2].map((s) => {
        const occ = target.motors.find((m) => m.slot === s);
        const mine = editing && occ === editing;
        return `<option value="${s}" ${occ && !mine ? "disabled" : ""}>Slot ${s}${occ && !mine ? ` — in use (${esc(occ.id)})` : ""}</option>`;
      }).join("");
      const free = [...slot.options].find((o) => !o.disabled);
      if (free) slot.value = free.value;
    };
    dev.value = preset.device || (DEVICES.find((x) => x.motors.length < 2) || DEVICES[0]).id;
    fillSlots();
    if (preset.slot && !slot.querySelector(`option[value="${preset.slot}"]`).disabled) slot.value = String(preset.slot);
    if (editing) { f.elements.id.value = editing.id; f.elements.model.value = editing.model === "—" ? "" : editing.model; f.elements.loco.value = editing.loco === "—" ? "" : editing.loco; }
    dev.addEventListener("change", fillSlots);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = f.elements.id.value.trim().toUpperCase();
      const target = DEVICES.find((x) => x.id === dev.value);
      const s = +slot.value;
      const fail = (msg) => { err.textContent = msg; err.classList.add("show"); };
      if (!id) return fail("Motor ID is required.");
      if (allMotors().some(({ m }) => m.id.toUpperCase() === id && m !== editing)) return fail(`Motor ${id} already exists.`);
      if (!s || slot.selectedOptions[0].disabled) return fail(`${target.id} has no free slot. Remove or move a motor first.`);
      const data = { id, model: f.elements.model.value.trim() || "—", loco: f.elements.loco.value.trim() || "—", slot: s };
      if (editing) {
        editDev.motors = editDev.motors.filter((m) => m !== editing);
        Object.assign(editing, data);
        target.motors.push(editing);
      } else {
        const p = Math.round(44 + Math.random() * 10);
        const m = { ...data, base: [p, p + 2, Math.round(28 + Math.random() * 4)], runMin: 0.5 }; // bench run just started
        seedMotor(m);
        target.motors.push(m);
      }
      target.motors.sort((a, b) => a.slot - b.slot);
      saveDevices();
      d.close();
      toast(editing ? `${id} updated` : `${id} added to ${target.id} slot ${s}`);
      rerender();
    });
    d.showModal();
  }

  async function deleteMotor(devId, slot) {
    const d = DEVICES.find((x) => x.id === devId), m = d && d.motors.find((x) => x.slot === +slot);
    if (!m) return;
    const ok = await confirmDialog({ title: `Delete motor ${m.id}?`, message: `It will be removed from ${d.id} slot ${m.slot} and its readings will no longer be monitored. This cannot be undone.`, confirmLabel: "Delete motor" });
    if (!ok) return;
    d.motors = d.motors.filter((x) => x !== m);
    saveDevices();
    toast(`${m.id} deleted`);
    rerender();
  }

  function viewMotor(devId, slot) {
    const d = DEVICES.find((x) => x.id === devId), m = d && d.motors.find((x) => x.slot === +slot);
    if (!m) return;
    const e = evalMotor(m);
    const dlg = viewDialog({
      title: m.id, sub: `${d.name} · ${d.id} · Slot ${m.slot}`,
      hero: readings(m, d.online),
      rows: [["Result", verdictPill(d.online ? e.status : "off")], ["Bench run time", fmtRun(runMinutes(m))], ["Model / type", esc(m.model)], ["Locomotive", esc(m.loco)],
        ["Test bench", `${esc(d.name)} · slot ${m.slot}`], ["DE / NDE Δ", `${e.dev.toFixed(1)} °C`]],
      actions: `<button type="button" class="btn btn-danger" data-v-del>${ico("trash")}Delete</button><button type="button" class="btn" data-v-edit>${ico("edit")}Edit</button><a class="btn btn-primary" href="motors.html?device=${encodeURIComponent(d.id)}&motor=${m.slot}">Log sheet</a>`
    });
    dlg.querySelector("[data-v-edit]").addEventListener("click", () => { dlg.close(); motorDialog({ device: d.id, slot: m.slot, edit: true }); });
    dlg.querySelector("[data-v-del]").addEventListener("click", () => { dlg.close(); deleteMotor(d.id, m.slot); });
  }

  // Update thresholds (persisted)
  function limitsDialog() {
    const F = [
      ["riseWarn", "Bearing rise above ambient — warning", "K"], ["riseCrit", "Bearing rise above ambient — fail", "K"],
      ["warn", "Bearing temperature — warning", "°C"], ["crit", "Bearing temperature — stop run", "°C"],
      ["devWarn", "DE / NDE difference — warning", "°C"], ["devCrit", "DE / NDE difference — fail", "°C"],
      ["rateWarn", "Rate of rise — warning", "°C/min"], ["ambMax", "Shed ambient — maximum valid", "°C"]
    ];
    const d = makeDialog("limitsDialog", `
      <form id="limitsForm" novalidate style="display:contents">
        ${dlgHead("Edit acceptance limits", "Use the limits from your shed's maintenance instructions / OEM manual. Applied to every motor immediately.")}
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
      if (v.riseWarn >= v.riseCrit) return fail("Rise warning must be lower than the fail limit.");
      if (v.warn >= v.crit) return fail("Bearing temperature warning must be lower than the stop limit.");
      if (v.devWarn >= v.devCrit) return fail("DE / NDE difference warning must be lower than the fail limit.");
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
  const limitRows = () => [
    ["Bearing rise above ambient", "Hotter of DE / NDE bearing minus shed ambient — main acceptance criterion", `&lt; ${LIMITS.riseWarn} K`, `${LIMITS.riseWarn} – ${LIMITS.riseCrit} K`, `≥ ${LIMITS.riseCrit} K`],
    ["Bearing temperature", "Absolute DE / NDE bearing temperature (safety stop)", `&lt; ${LIMITS.warn} °C`, `${LIMITS.warn} – ${LIMITS.crit} °C`, `≥ ${LIMITS.crit} °C — stop run`],
    ["DE / NDE difference", "Sensor 1 (DE) vs Sensor 2 (NDE) — one bearing heating more than the other", `&lt; ${LIMITS.devWarn} °C`, `${LIMITS.devWarn} – ${LIMITS.devCrit} °C`, `≥ ${LIMITS.devCrit} °C`],
    ["Rate of rise", "Bearings should level off; a fast climb means abnormal heating", `≤ ${LIMITS.rateWarn} °C/min`, `&gt; ${LIMITS.rateWarn} °C/min`, "—"],
    ["Shed ambient", "Ambient probe at the test bench", `0 – ${LIMITS.ambMax} °C`, `&gt; ${LIMITS.ambMax} °C`, "—"],
    ["Probe readings plausible", "A bearing reading below shed ambient means a loose / open probe", "3 / 3 valid", "Check probe", "—"]
  ];

  // delegated CRUD buttons usable on any page
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add-motor]");
    if (add) { const [dv, s] = add.dataset.addMotor.split("|"); motorDialog({ device: dv || undefined, slot: s || undefined }); }
    const ed = e.target.closest("[data-edit-motor]");
    if (ed) { const [dv, s] = ed.dataset.editMotor.split("|"); motorDialog({ device: dv, slot: s, edit: true }); }
    const del = e.target.closest("[data-del-motor]");
    if (del) { const [dv, s] = del.dataset.delMotor.split("|"); deleteMotor(dv, s); }
    const vw = e.target.closest("[data-view-motor]");
    if (vw) { const [dv, s] = vw.dataset.viewMotor.split("|"); viewMotor(dv, s); }
    if (e.target.closest("[data-edit-limits]")) limitsDialog();
  });
  /* =========================================================
     Readings, Dashboard and Motors pages
     ========================================================= */
  const VERDICT_SHORT = { ok: "OK", warn: "Recheck", crit: "Not OK", off: "Offline" };
  const verdictPill = (s) => `<span class="verdict-pill ${s}">${ico(STATUS[s].icon)}${VERDICT_SHORT[s]}</span>`;
  // the reason a motor isn't OK, in one line (worst first)
  const reasonOf = (e) => e.checks.filter((c) => c.s !== "ok").sort((a, b) => RANK[b.s] - RANK[a.s]).map((c) => `${c.k} ${c.v}`).join(" · ");
  const trendText = (e) => (e.stable ? "Stabilised" : e.rate > 0 ? `Rising ${e.rate.toFixed(1)} °C/min` : "Cooling");

  // DE / NDE / ambient as large digital values; bearings also show their rise above ambient
  function readings(m, online = true, size = "") {
    const amb = m.live[AMB];
    return `<div class="readings ${size}">${m.live.map((v, j) => `
      <div class="reading${j === AMB ? " amb" : ""}">
        <span class="r-label">${j === AMB ? "Shed ambient" : j ? "NDE bearing" : "DE bearing"}<small>${j === AMB ? "Ambient probe" : j ? "Sensor 2 · commutator end" : "Sensor 1 · pinion end"}</small></span>
        <b class="r-value num ${online ? tCls(v, j, amb) : "muted"}">${online ? v.toFixed(1) : "—"}<small>°C</small></b>
        <span class="r-sub num">${j === AMB ? "&nbsp;" : online ? `Rise ${(v - amb).toFixed(1)} K` : ""}</span>
      </div>`).join("")}</div>`;
  }
  const signalBars = (n) => `<span class="signal" aria-label="Signal ${n} of 4">${[1, 2, 3, 4].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  /* ---------- Graphs (SVG / CSS, theme-aware) ---------- */
  const COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)"]; // DE, NDE, ambient
  const pct = (v, max) => (Math.max(0, Math.min(1, v / max)) * 100).toFixed(2) + "%";
  const runLabel = (t, start) => `T + ${Math.max(0, Math.round((t - start) / 60000))} min`;
  const trendPoints = (m) => [...m.trend, { t: Date.now(), v: m.live }]; // minute history + the live reading

  // Line chart over the bench run. cfg = { series: [{ name, short, color, points: [{t, v}] }], lines: [{ v, label, cls }], start, unit, height }
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
    const { series, lines = [], start, unit = "°C", height = 260, title = "Run trend" } = el._cfg;
    const svg = el.querySelector("svg"), tip = el.querySelector(".chart-tip");
    const W = Math.max(el.clientWidth, 280), H = height, M = { t: 16, r: 74, b: 28, l: 40 };
    const all = series.flatMap((s) => s.points);
    if (all.length < 2) { svg.innerHTML = ""; return; }
    const t0 = start ?? Math.min(...all.map((p) => p.t)), t1 = Math.max(...all.map((p) => p.t), t0 + 60000);
    const vals = all.map((p) => p.v).concat(lines.map((l) => l.v));
    const lo = Math.floor((Math.min(...vals) - 2) / 10) * 10, hi = Math.ceil((Math.max(...vals) + 2) / 10) * 10;
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
      out += `<text class="tick-label" x="${x(t)}" y="${H - 8}" text-anchor="${k === 0 ? "start" : k === nx ? "end" : "middle"}">${runLabel(t, t0)}</text>`;
    }
    lines.forEach((l) => {
      if (l.v < lo || l.v > hi) return;
      out += `<line class="${l.cls}" x1="${M.l}" x2="${W - M.r}" y1="${y(l.v)}" y2="${y(l.v)}"/><text class="limit-label ${l.cls}-t" x="${M.l + 6}" y="${y(l.v) - 5}">${esc(l.label)}</text>`;
    });
    series.forEach((s) => {
      out += `<path class="line" style="stroke:${s.color}" d="${s.points.map((p, i) => (i ? "L" : "M") + x(p.t).toFixed(1) + " " + y(p.v).toFixed(1)).join("")}"/>`;
    });
    // direct labels at the line ends, nudged apart
    const ends = series.map((s) => ({ s, p: s.points[s.points.length - 1] })).map((o) => ({ ...o, ly: y(o.p.v) })).sort((a, b) => a.ly - b.ly);
    for (let i = 1; i < ends.length; i++) if (ends[i].ly - ends[i - 1].ly < 13) ends[i].ly = ends[i - 1].ly + 13;
    ends.forEach((o) => { out += `<circle cx="${x(o.p.t)}" cy="${y(o.p.v)}" r="3.5" style="fill:${o.s.color}"/><text class="end-label" x="${W - M.r + 8}" y="${o.ly + 4}">${esc(o.s.short)} ${o.p.v.toFixed(1)}</text>`; });
    if (el._hx != null) {
      const near = (pts) => pts.reduce((b, p) => (Math.abs(p.t - el._hx) < Math.abs(b.t - el._hx) ? p : b), pts[0]);
      const hits = series.map((s) => ({ s, p: near(s.points) }));
      const cx = x(hits[0].p.t);
      out += `<line class="crosshair" x1="${cx}" x2="${cx}" y1="${M.t}" y2="${H - M.b}"/>`;
      hits.forEach((h) => (out += `<circle class="hover-dot" cx="${x(h.p.t)}" cy="${y(h.p.v)}" r="5" style="fill:${h.s.color}"/>`));
      tip.innerHTML = `<div class="t">${new Date(hits[0].p.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${runLabel(hits[0].p.t, t0)}</div>` +
        hits.map((h) => `<div class="r"><span class="sw" style="background:${h.s.color}"></span>${esc(h.s.name)}<b>${h.p.v.toFixed(1)} ${unit}</b></div>`).join("");
      tip.style.left = (cx + 200 > W ? cx - 196 : cx + 14) + "px";
      tip.style.top = M.t + "px";
      tip.classList.add("show");
    } else tip.classList.remove("show");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("aria-label", `${title}: ` + series.map((s) => `${s.name} ${s.points[s.points.length - 1].v.toFixed(1)} ${unit}`).join(", "));
    svg.innerHTML = out;
  }
  let rzTimer;
  window.addEventListener("resize", () => { clearTimeout(rzTimer); rzTimer = setTimeout(() => $$(".chart").forEach((c) => c._cfg && drawLine(c)), 120); });

  // series for a motor's run: temperatures, or rise above ambient
  function runSeries(m, mode) {
    const pts = trendPoints(m);
    if (mode === "rise") return [0, 1].map((j) => ({ name: (j ? "NDE" : "DE") + " rise", short: j ? "NDE" : "DE", color: COLORS[j], points: pts.map((p) => ({ t: p.t, v: +(p.v[j] - p.v[AMB]).toFixed(1) })) }));
    return [0, 1, 2].map((j) => ({ name: j === AMB ? "Shed ambient" : (j ? "NDE" : "DE") + " bearing", short: j === AMB ? "Amb" : j ? "NDE" : "DE", color: COLORS[j], points: pts.map((p) => ({ t: p.t, v: p.v[j] })) }));
  }
  function runLines(m, mode) {
    const amb = m.live[AMB];
    return mode === "rise"
      ? [{ v: LIMITS.riseWarn, label: `Warning ${LIMITS.riseWarn} K`, cls: "limit-warn" }, { v: LIMITS.riseCrit, label: `Fail ${LIMITS.riseCrit} K`, cls: "limit" }]
      : [{ v: amb + LIMITS.riseWarn, label: `Warning: ambient + ${LIMITS.riseWarn} K`, cls: "limit-warn" }, { v: amb + LIMITS.riseCrit, label: `Fail: ambient + ${LIMITS.riseCrit} K`, cls: "limit" }];
  }

  // small run-trend line of the hotter bearing, with the fail level dashed
  function sparkRun(m, status) {
    const pts = trendPoints(m), amb = m.live[AMB];
    const v = pts.map((p) => Math.max(p.v[0], p.v[1])), fail = amb + LIMITS.riseCrit;
    const lo = Math.min(...v, amb) - 2, hi = Math.max(...v, fail) + 2;
    const X = (i) => ((i / Math.max(1, v.length - 1)) * 100).toFixed(2), Y = (val) => (30 - ((val - lo) / (hi - lo)) * 28).toFixed(2);
    return `<svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none" role="img" aria-label="Hotter bearing over the run, now ${v[v.length - 1].toFixed(1)} °C">
      <line x1="0" x2="100" y1="${Y(fail)}" y2="${Y(fail)}" class="spark-fail" vector-effect="non-scaling-stroke"/>
      <path d="${v.map((val, i) => (i ? "L" : "M") + X(i) + " " + Y(val)).join("")}" style="stroke:var(--${status === "ok" ? "series-1" : status})" vector-effect="non-scaling-stroke"/>
    </svg>`;
  }

  // grouped bars: DE and NDE rise above ambient for every motor, against warning / fail limits
  function riseBars(rows) {
    const max = Math.max(LIMITS.riseCrit * 1.35, ...rows.map((r) => r.e.rise + 4));
    const ticks = Array.from({ length: Math.floor(max / 10) + 1 }, (_, i) => i * 10);
    const marks = `<i class="rb-mark warn" style="left:${pct(LIMITS.riseWarn, max)}"></i><i class="rb-mark fail" style="left:${pct(LIMITS.riseCrit, max)}"></i>`;
    return `<div class="rb">
      <div class="rb-row rb-head"><span></span><span class="rb-track rb-labels"><span style="left:${pct(LIMITS.riseWarn, max)}">Warn ${LIMITS.riseWarn}</span><span class="fail" style="left:${pct(LIMITS.riseCrit, max)}">Fail ${LIMITS.riseCrit} K</span></span><span></span></div>
      ${rows.map(({ d, m, e }) => {
        const rDe = m.live[0] - m.live[AMB], rNde = m.live[1] - m.live[AMB];
        return `<a class="rb-row" href="motors.html?device=${encodeURIComponent(d.id)}&motor=${m.slot}" data-tip="${esc(m.id)} · ${esc(d.name)} slot ${m.slot}|DE rise: ${rDe.toFixed(1)} K|NDE rise: ${rNde.toFixed(1)} K|Fail at ${LIMITS.riseCrit} K">
          <span class="rb-label"><b>${esc(m.id)}</b><span>${esc(d.name)} · ${m.slot}</span></span>
          <span class="rb-track">${marks}<span class="rb-bar" style="width:${pct(rDe, max)};background:${COLORS[0]}"></span><span class="rb-bar" style="width:${pct(rNde, max)};background:${COLORS[1]}"></span></span>
          <span class="rb-val">${verdictDot(e.status)}${e.rise.toFixed(1)} K</span>
        </a>`;
      }).join("")}
      <div class="rb-row rb-axis"><span></span><span class="rb-track rb-ticks">${ticks.map((t) => `<span style="left:${pct(t, max)}">${t}</span>`).join("")}</span><span class="rb-unit">K</span></div>
    </div>`;
  }
  const verdictDot = (s) => `<span class="v-dot ${s}" aria-label="${VERDICT_SHORT[s]}">${ico(STATUS[s].icon)}</span>`;

  // mini bar for a table cell: value against the fail limit
  const miniBar = (v, warn, fail, s) => `<span class="mini-bar" aria-hidden="true"><i class="${s}" style="width:${pct(v, fail * 1.3)}"></i><b style="left:${pct(fail, fail * 1.3)}"></b></span>`;

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

  const limitLine = () => `Pass: rise &lt; ${LIMITS.riseCrit} K above ambient · bearing &lt; ${LIMITS.crit} °C · DE / NDE Δ &lt; ${LIMITS.devCrit} °C`;

  /* =========================================================
     Page: Dashboard — every bench and motor at a glance
     ========================================================= */
  function pageDashboard() {
    const render = () => {
      const evals = liveMotors().map((x) => ({ ...x, e: evalMotor(x.m) }));
      const online = DEVICES.filter((d) => d.online).length;
      const c = { ok: 0, warn: 0, crit: 0 };
      evals.forEach((x) => c[x.e.status]++);
      $("#summary").innerHTML = `
        <div><span>Test benches online</span><b class="num">${online}<small> / ${DEVICES.length}</small></b></div>
        <div><span>Motors on bench run</span><b class="num">${evals.length}</b></div>
        <div><span style="color:var(--ok-text)">${ico("checkCircle")}OK</span><b class="num">${c.ok}</b></div>
        <div><span style="color:${c.crit ? "var(--crit-text)" : "var(--warn-text)"}">${ico("alert")}Recheck / Not OK</span><b class="num">${c.warn + c.crit}</b></div>`;

      // alarm banner: only motors that need action
      const bad = evals.filter((x) => x.e.status !== "ok").sort((a, b) => RANK[b.e.status] - RANK[a.e.status]);
      $("#alarmBar").hidden = !bad.length;
      $("#alarmBar").innerHTML = bad.map(({ d, m, e }) => `
        <a class="alarm-row ${e.status}" href="motors.html?device=${encodeURIComponent(d.id)}&motor=${m.slot}">
          ${ico(STATUS[e.status].icon)}<b>${esc(m.id)}</b><span class="alarm-where">${esc(d.name)} · slot ${m.slot}</span>
          <span class="alarm-reason">${esc(reasonOf(e))}</span><em>${VERDICT_SHORT[e.status]}</em>
        </a>`).join("");

      $("#riseChart").innerHTML = evals.length ? riseBars(evals.slice().sort((a, b) => b.e.rise - a.e.rise)) : `<p class="muted">No motors on bench run.</p>`;

      $("#deviceGrid").innerHTML = DEVICES.map((d) => {
        const head = `
          <div class="card-head">
            <div class="device-title"><div class="device-ico">${ico("cpu")}</div><div><h3>${esc(d.name)}</h3><div class="sub">${esc(d.id)} · ${esc(d.location)}</div></div></div>
            ${d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : badge("off")}
          </div>`;
        if (!d.online) return `<div class="card device-card">${head}<div class="offline-mask">${ico("wifiOff")}<b>Bench offline</b><div>Last seen ${esc(d.lastSeen || "—")}</div></div></div>`;
        const slots = [1, 2].map((s) => { const m = d.motors.find((x) => x.slot === s); return m ? motorPanel(d, m) : emptySlot(s, d); }).join("");
        return `<div class="card device-card">${head}<div class="motor-slots">${slots}</div></div>`;
      }).join("");
      updateAlertCount();
    };
    render();
    return render;
  }

  /* =========================================================
     Page: Motors — one motor's readings, log sheet and register
     ========================================================= */
  function pageMotors() {
    const q = new URLSearchParams(location.search);
    const dSel = $("#devSel"), mSel = $("#motorSel");
    const withMotors = () => DEVICES.filter((d) => d.motors.length);
    // (re)build both selects, keeping the current choice when it still exists
    const fillSelects = (wantDev, wantSlot) => {
      const devs = withMotors();
      // only rebuild when the device/motor set changed, so an open dropdown isn't closed by the live refresh
      const keys = devs.map((d) => d.id + d.online + ":" + d.motors.map((m) => m.slot + m.id).join()).join("|") + "@" + wantDev + "/" + wantSlot;
      if (keys === dSel.dataset.keys) return;
      dSel.dataset.keys = keys;
      dSel.innerHTML = devs.map((d) => `<option value="${esc(d.id)}">${esc(d.name)} (${esc(d.id)})${d.online ? "" : " — offline"}</option>`).join("");
      if (wantDev && devs.some((d) => d.id === wantDev)) dSel.value = wantDev;
      const d = DEVICES.find((x) => x.id === dSel.value);
      mSel.innerHTML = d ? d.motors.map((m) => `<option value="${m.slot}">Slot ${m.slot} · ${esc(m.id)}</option>`).join("") : "";
      if (wantSlot && d && d.motors.some((m) => String(m.slot) === String(wantSlot))) mSel.value = String(wantSlot);
      dSel.disabled = mSel.disabled = !devs.length;
    };
    fillSelects(q.get("device"), q.get("motor"));

    const renderTable = (d, m) => {
      const term = ($("#motorSearch").value || "").toLowerCase();
      const rows = allMotors().filter(({ d: dd, m: mm }) => [mm.id, mm.model, mm.loco, dd.id, dd.name].join(" ").toLowerCase().includes(term));
      $("#motorCount").textContent = `${rows.length} of ${allMotors().length} motors`;
      $("#motorTable").innerHTML = rows.length ? rows.map(({ d: dd, m: mm }) => {
        const ee = evalMotor(mm);
        const active = d && m && dd.id === d.id && mm.slot === m.slot;
        const key = `${esc(dd.id)}|${mm.slot}`;
        return `<tr${active ? ' class="is-active"' : ""}>
          <td class="lead-cell" data-label="Motor"><b>${esc(mm.id)}</b><span class="muted" style="display:block;font-size:12px">${esc(mm.loco)}<span class="col-alt"> · ${esc(dd.name)} slot ${mm.slot}</span></span></td>
          <td data-label="Test bench" class="col-opt">${esc(dd.name)} · slot ${mm.slot}</td>
          ${mm.live.map((v, j) => `<td data-label="${j === AMB ? "Ambient" : j ? "NDE" : "DE"}" class="num${j === AMB ? " col-opt" : ""} ${dd.online ? tCls(v, j, mm.live[AMB]) : "muted"}">${dd.online ? v.toFixed(1) : "—"}</td>`).join("")}
          <td data-label="Rise" class="num col-opt">${dd.online ? ee.rise.toFixed(1) + " K" : "—"}</td>
          <td data-label="Result">${verdictPill(dd.online ? ee.status : "off")}</td>
          <td data-label=""><div class="row-actions">
            <button class="btn btn-sm" data-pick="${key}" ${active ? "disabled" : ""}>${active ? "Showing" : "Open"}</button>
            <button class="btn btn-sm btn-ghost" data-edit-motor="${key}" aria-label="Edit ${esc(mm.id)}" title="Edit">${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-del-motor="${key}" aria-label="Delete ${esc(mm.id)}" title="Delete">${ico("trash")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="9" class="muted" style="text-align:center;padding:32px">${allMotors().length ? "No motors match your search." : "No motors yet — use “Add motor” to put one on a test bench."}</td></tr>`;
    };

    const render = () => {
      fillSelects(dSel.value, mSel.value);
      const d = DEVICES.find((x) => x.id === dSel.value);
      const m = d && d.motors.find((x) => String(x.slot) === mSel.value);
      renderTable(d, m);
      $$(".motor-detail").forEach((el) => (el.hidden = !m));
      if (!m) {
        $("#motorHero").innerHTML = `<div class="empty-state">${ico("motor")}<h3>No motor on a test bench</h3><p>Add a motor to a test bench to start recording DE, NDE and ambient temperatures.</p><button type="button" class="btn btn-primary" data-add-motor="">${ico("plus")}Add motor</button></div>`;
        updateAlertCount();
        return;
      }
      const e = evalMotor(m);
      const st = d.online ? e.status : "off";
      $("#motorHero").innerHTML = `
        <div class="mh-top">
          <div>
            <div class="crumbs">${esc(d.name)} · ${esc(d.id)} · Slot ${m.slot}</div>
            <h2>${esc(m.id)}</h2>
            <div class="muted">${esc(m.model)} · ${esc(m.loco)}</div>
          </div>
          <div class="mh-verdict">${verdictPill(st)}<span>${st === "ok" ? "All checks within limits" : st === "off" ? "Test bench offline" : esc(reasonOf(e))}</span></div>
        </div>
        ${readings(m, d.online, "lg")}
        <div class="mh-foot">
          <span>Run time <b>${fmtRun(runMinutes(m))}</b></span>
          <span>DE / NDE Δ <b class="num">${e.dev.toFixed(1)} °C</b></span>
          <span>Trend <b>${trendText(e)}</b></span>
          <span class="mh-limits">${limitLine()} <button type="button" class="link-btn" data-edit-limits>Edit limits</button></span>
          <span class="mh-actions">
            <button type="button" class="btn btn-sm" data-edit-motor="${esc(d.id)}|${m.slot}">${ico("edit")}Edit</button>
            <button type="button" class="btn btn-sm btn-danger" data-del-motor="${esc(d.id)}|${m.slot}">${ico("trash")}Delete</button>
          </span>
        </div>`;

      const mode = ($("input[name=trendMode]:checked") || {}).value || "temp";
      const series = runSeries(m, mode);
      lineChart($("#runChart"), { series, lines: runLines(m, mode), start: m.runStart, unit: mode === "rise" ? "K" : "°C", title: `${m.id} run trend` });
      $("#runLegend").innerHTML = series.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join("") + `<span><i class="dash"></i>Limits</span>`;

      // shed log sheet: one row per 10 minutes of the bench run, plus the live reading
      const logRows = [...m.log.map((r) => ({ ...r, now: false })), { t: Date.now(), v: m.live, now: true }];
      $("#logSheet").innerHTML = logRows.map((r) => {
        const [de, nde, a] = r.v, rDe = de - a, rNde = nde - a;
        const s = lvl(Math.max(rDe, rNde), LIMITS.riseWarn, LIMITS.riseCrit);
        return `<tr${r.now ? ' class="is-active"' : ""}>
          <td class="lead-cell" data-label="Time"><b>${r.now ? "Now" : new Date(r.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</b><span class="muted" style="display:block;font-size:12px">T + ${fmtRun((r.t - m.runStart) / 60000)}</span></td>
          <td data-label="DE bearing" class="num ${tCls(de, 0, a)}">${de.toFixed(1)}</td>
          <td data-label="NDE bearing" class="num ${tCls(nde, 1, a)}">${nde.toFixed(1)}</td>
          <td data-label="Shed ambient" class="num">${a.toFixed(1)}</td>
          <td data-label="DE rise (K)" class="num">${rDe.toFixed(1)}</td>
          <td data-label="NDE rise (K)" class="num">${rNde.toFixed(1)}</td>
          <td data-label="Result">${verdictPill(s)}</td>
        </tr>`;
      }).join("");
      const next = Math.max(0, Math.ceil((m.log[m.log.length - 1].t + LOG_EVERY_MS - Date.now()) / 60000));
      $("#logMeta").textContent = `Run started ${new Date(m.runStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · reading every 10 min · next in ${next} min`;
      updateAlertCount();
    };
    const syncUrl = () => history.replaceState(null, "", `?device=${encodeURIComponent(dSel.value)}&motor=${mSel.value}`);
    dSel.addEventListener("change", () => { fillSelects(dSel.value); syncUrl(); render(); });
    mSel.addEventListener("change", () => { syncUrl(); render(); });
    $("#motorTable").addEventListener("click", (e) => {
      const b = e.target.closest("[data-pick]"); if (!b) return;
      const [id, slot] = b.dataset.pick.split("|");
      fillSelects(id, slot); syncUrl(); render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    $("#motorSearch").addEventListener("input", () => render());
    $$("input[name=trendMode]").forEach((r) => r.addEventListener("change", () => render()));
    if (q.get("add") != null) motorDialog({ device: q.get("add") || undefined });
    render();
    return render;
  }
  /* =========================================================
     Page: Devices
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
      $("#devGrid").innerHTML = list.length ? list.map((d) => {
        const slots = [1, 2].map((s) => {
          const m = d.motors.find((x) => x.slot === s);
          if (!m) return `<li><span class="device-ico" style="width:32px;height:32px;background:var(--surface-3);color:var(--muted)">${ico("plus")}</span><div><b class="muted">Slot ${s} · empty</b><span>${d.motors.length ? "Available for a second motor" : "Available for a motor"}</span></div>
            <button type="button" class="btn btn-sm" data-add-motor="${esc(d.id)}|${s}">${ico("plus")}Assign</button></li>`;
          const e = evalMotor(m);
          return `<li><span class="device-ico" style="width:32px;height:32px">${ico("motor")}</span>
            <button type="button" class="slot-link" data-view-motor="${esc(d.id)}|${s}" title="View motor"><b>Slot ${s} · ${esc(m.id)}</b><span>${esc(m.model)}</span></button>
            ${verdictPill(d.online ? e.status : "off")}</li>`;
        }).join("");
        return `
        <div class="card device-card">
          <div class="card-head">
            <div class="device-title"><div class="device-ico">${ico("cpu")}</div><div><h3>${esc(d.name)}</h3><div class="sub mono">${esc(d.id)}</div></div></div>
            ${d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : badge("off")}
          </div>
          <dl class="meta-list">
            <div><dt>Location</dt><dd title="${esc(d.location)}">${esc(d.location)}</dd></div>
            <div><dt>IP address</dt><dd class="mono">${esc(d.ip)}</dd></div>
            <div><dt>Motors</dt><dd>${d.motors.length} of 2 slots</dd></div>
            <div><dt>Sampling</dt><dd>Every ${d.interval || 2} s</dd></div>
            <div><dt>Firmware</dt><dd>v${esc(d.fw || "2.4.1")}</dd></div>
            <div><dt>Signal</dt><dd>${signalBars(d.signal || 0)}</dd></div>
          </dl>
          <ul class="slot-list">${slots}</ul>
          <div class="card-foot">
            <button class="btn btn-sm btn-ghost btn-danger" data-del="${esc(d.id)}">${ico("trash")}Delete</button>
            <button class="btn btn-sm" data-edit="${esc(d.id)}">${ico("edit")}Edit</button>
            <button class="btn btn-sm" data-view="${esc(d.id)}">${ico("eye")}View</button>
            ${d.motors.length ? `<a class="btn btn-sm btn-primary" href="motors.html?device=${encodeURIComponent(d.id)}">${ico("activity")}Monitor</a>` : ""}
          </div>
        </div>`;
      }).join("") : `<div class="card card-body muted">No devices match your filters.</div>`;
      updateAlertCount();
    };

    // motors are only set up here for a brand-new device; afterwards they use the motor dialogs
    const motorsCount = () => +form.querySelector("[name=motorCount]:checked").value;
    const syncSlots = () => { $("#slot1").disabled = motorsCount() < 1; $("#slot2").disabled = motorsCount() < 2; };
    form.querySelectorAll("[name=motorCount]").forEach((r) => r.addEventListener("change", syncSlots));

    function open(d) {
      editing = d || null;
      form.reset();
      $$("input, select", form).forEach((el) => el.setCustomValidity("")); // clear errors left by a cancelled attempt
      $("#dlgTitle").textContent = d ? `Edit device ${d.id}` : "Add new device";
      $("#dlgSub").textContent = d ? "Update the device details. Motors are managed from the device's slots." : "Register a monitoring unit and assign the motor(s) under test.";
      $("#dlgSave").textContent = d ? "Save changes" : "Add device";
      form.elements.id.readOnly = !!d;
      $$(".new-only", form).forEach((el) => (el.hidden = !!d));
      if (d) {
        form.elements.id.value = d.id; form.elements.name.value = d.name; form.elements.location.value = d.location;
        form.elements.ip.value = d.ip; form.elements.interval.value = String(d.interval || 2);
        form.elements.online.checked = d.online;
        $("#slot1").disabled = $("#slot2").disabled = true;
      } else syncSlots();
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
      } else {
        const motors = [];
        const ids = allMotors().map(({ m }) => m.id.toUpperCase());
        for (let s = 1; s <= motorsCount(); s++) {
          const mid = f["m" + s + "id"].value.trim().toUpperCase();
          if (ids.includes(mid) || motors.some((m) => m.id === mid)) { f["m" + s + "id"].setCustomValidity(`Motor ${mid} already exists`); f["m" + s + "id"].reportValidity(); return; }
          const p = Math.round(44 + Math.random() * 10);
          const m = { slot: s, id: mid, model: f["m" + s + "model"].value.trim() || "—", loco: f["m" + s + "loco"].value.trim() || "—", base: [p, p + 2, Math.round(28 + Math.random() * 4)], runMin: 0.5 };
          seedMotor(m);
          motors.push(m);
        }
        DEVICES.push({ ...data, motors, fw: "2.4.1", signal: data.online ? 4 : 0, lastSeen: data.online ? undefined : "Never" });
      }
      saveDevices();
      dlg.close();
      toast(editing ? `${id} updated` : `${id} added`);
      render();
    });
    form.addEventListener("input", (e) => e.target.setCustomValidity && e.target.setCustomValidity(""));

    function viewDevice(d) {
      const slotRows = [1, 2].map((s) => {
        const m = d.motors.find((x) => x.slot === s);
        if (!m) return `<li><span class="muted">Slot ${s}</span><span class="muted">Empty</span><button type="button" class="btn btn-sm" data-add-motor="${esc(d.id)}|${s}" data-close>${ico("plus")}Assign</button></li>`;
        const e = evalMotor(m);
        return `<li><span class="muted">Slot ${s}</span><b>${esc(m.id)}</b><span class="num">${d.online ? m.live.map((v) => v.toFixed(1)).join(" / ") + " °C" : "—"}</span>${badge(d.online ? e.status : "off")}</li>`;
      }).join("");
      const dlg = viewDialog({
        title: d.name, sub: `${d.id} · ${d.location}`,
        rows: [["Status", d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : `${badge("off")} <span class="muted">Last seen ${esc(d.lastSeen || "—")}</span>`],
          ["IP address", `<span class="mono">${esc(d.ip)}</span>`], ["Firmware", `v${esc(d.fw || "2.4.1")}`], ["Sampling", `Every ${d.interval || 2} s`], ["Signal", signalBars(d.signal || 0)], ["Motors", `${d.motors.length} of 2 slots`]],
        body: `<div><div class="detail-title">Motor slots <span class="muted">(Sensor 1 / Sensor 2 / Ambient)</span></div><ul class="detail-slots">${slotRows}</ul></div>`,
        actions: `<button type="button" class="btn btn-danger" data-v-del>${ico("trash")}Delete</button><button type="button" class="btn btn-primary" data-v-edit>${ico("edit")}Edit</button>`
      });
      dlg.querySelector("[data-v-edit]").addEventListener("click", () => { dlg.close(); open(d); });
      dlg.querySelector("[data-v-del]").addEventListener("click", () => { dlg.close(); removeDevice(d.id); });
    }

    async function removeDevice(id) {
      const d = DEVICES.find((x) => x.id === id);
      if (!d) return;
      const ok = await confirmDialog({
        title: `Delete device ${d.id}?`,
        message: d.motors.length ? `${d.name} and its ${d.motors.length} motor${d.motors.length > 1 ? "s" : ""} (${d.motors.map((m) => m.id).join(", ")}) will stop being monitored. This cannot be undone.` : `${d.name} will be removed. This cannot be undone.`,
        confirmLabel: "Delete device"
      });
      if (!ok) return;
      DEVICES = DEVICES.filter((x) => x !== d);
      saveDevices();
      toast(`${d.id} deleted`);
      render();
    }

    $("#addDevice").addEventListener("click", () => open());
    $("#devGrid").addEventListener("click", (e) => {
      const ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]"), vw = e.target.closest("[data-view]");
      if (ed) open(DEVICES.find((d) => d.id === ed.dataset.edit));
      if (vw) viewDevice(DEVICES.find((d) => d.id === vw.dataset.view));
      if (del) removeDevice(del.dataset.del);
    });
    $("#devSearch").addEventListener("input", render);
    $$("[name=devFilter]").forEach((r) => r.addEventListener("change", () => { filter = r.value; render(); }));
    $("#resetDemo") && $("#resetDemo").addEventListener("click", async () => {
      if (!(await confirmDialog({ title: "Reset demo data?", message: "All devices and motors go back to the original demo set. Your changes will be lost.", confirmLabel: "Reset", danger: false }))) return;
      DEVICES = JSON.parse(JSON.stringify(DEFAULT_DEVICES)); DEVICES.forEach((d) => d.motors.forEach(seedMotor)); saveDevices(); toast("Demo devices restored"); render();
    });
    render();
    const q = new URLSearchParams(location.search);
    const qd = DEVICES.find((x) => x.id === (q.get("edit") || q.get("view")));
    if (qd) q.get("edit") ? open(qd) : viewDevice(qd);
    return render;
  }

  /* =========================================================
     Page: Motor Health (OK / Not OK)
     ========================================================= */
  function pageHealth() {
    let tab = "all";
    // what the shed does next, per result
    const ACTION = {
      ok: "Record readings on the job card and release the motor.",
      warn: "Continue the run until stable, check probe contact, recheck before release.",
      crit: "Stop the run. Inspect the hotter bearing (grease quantity, clearance, mounting, seals) and re-test."
    };
    const render = () => {
      const rows = liveMotors().map((x) => ({ ...x, e: evalMotor(x.m) }));
      const c = { ok: 0, warn: 0, crit: 0 };
      rows.forEach((r) => c[r.e.status]++);
      $("#healthSummary").innerHTML = `
        <div><span>Motors on bench run</span><b>${rows.length}</b></div>
        <div><span style="color:var(--ok-text)">${ico("checkCircle")}OK — release</span><b>${c.ok}</b></div>
        <div><span style="color:var(--warn-text)">${ico("alert")}Recheck</span><b>${c.warn}</b></div>
        <div><span style="color:var(--crit-text)">${ico("xCircle")}Not OK — do not release</span><b>${c.crit}</b></div>`;
      const n = rows.length || 1;
      $("#healthProp").innerHTML = rows.length ? `<div class="prop-bar" role="img" aria-label="${c.ok} OK, ${c.warn} recheck, ${c.crit} not OK">${[["ok", "OK — release"], ["warn", "Recheck"], ["crit", "Not OK"]]
        .filter(([s]) => c[s]).map(([s, l]) => `<span class="${s}" style="flex:${c[s]}" data-tip="${l}|${c[s]} of ${rows.length} motors">${c[s]} ${VERDICT_SHORT[s]} · ${Math.round((c[s] / n) * 100)}%</span>`).join("")}</div>` : "";
      $$("#healthTabs [data-tab]").forEach((b) => {
        const k = b.dataset.tab;
        b.querySelector(".n").textContent = k === "all" ? rows.length : c[k];
        b.setAttribute("aria-selected", String(k === tab));
      });
      const list = rows.filter((r) => tab === "all" || r.e.status === tab).sort((a, b) => RANK[b.e.status] - RANK[a.e.status]);
      $("#healthRows").innerHTML = list.length ? list.map(({ d, m, e }) => {
        const [de, nde, amb] = m.live;
        return `<tr>
          <td class="lead-cell" data-label="Motor"><a href="motors.html?device=${encodeURIComponent(d.id)}&motor=${m.slot}"><b>${esc(m.id)}</b></a><span class="muted" style="display:block;font-size:12px">${esc(m.loco)} · ${esc(d.name)} slot ${m.slot}</span></td>
          <td data-label="DE" class="num ${tCls(de, 0, amb)}">${de.toFixed(1)}</td>
          <td data-label="NDE" class="num ${tCls(nde, 1, amb)}">${nde.toFixed(1)}</td>
          <td data-label="Ambient" class="num">${amb.toFixed(1)}</td>
          <td data-label="Rise" class="num rise-cell">${e.rise.toFixed(1)} K${miniBar(e.rise, LIMITS.riseWarn, LIMITS.riseCrit, lvl(e.rise, LIMITS.riseWarn, LIMITS.riseCrit))}</td>
          <td data-label="Run time" class="num">${fmtRun(runMinutes(m))}</td>
          <td data-label="Result">${verdictPill(e.status)}</td>
          <td data-label="Reason / action" class="reason-cell">${e.status === "ok" ? "" : `<b>${esc(reasonOf(e))}</b><br>`}<span class="muted">${ACTION[e.status]}</span></td>
        </tr>`;
      }).join("") : `<tr><td colspan="8" class="muted" style="text-align:center;padding:28px">No motors in this category.</td></tr>`;
      $("#ruleTable").innerHTML = limitRows().map((r) => `<tr><td class="lead-cell" data-label="Check"><b>${r[0]}</b></td><td data-label="Measures">${r[1]}</td><td data-label="OK">${r[2]}</td><td data-label="Recheck">${r[3]}</td><td data-label="Not OK">${r[4]}</td></tr>`).join("");
      $("#healthTime").textContent = "Evaluated " + fmtTime(Date.now());
      updateAlertCount();
    };
    $("#healthTabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) { tab = b.dataset.tab; render(); } });
    $("#printReport").addEventListener("click", () => window.print());
    render();
    return render;
  }

  /* =========================================================
     Page: Users
     ========================================================= */
  const DEFAULT_USERS = [
    { name: "Arun Prakash", email: "arun.prakash@railworks.in", phone: "+91 98400 11223", role: "Administrator", devices: "All devices", active: true, last: "Online now" },
    { name: "Meera Iyer", email: "meera.iyer@railworks.in", phone: "+91 98400 22334", role: "Test Engineer", devices: "TMU-01, TMU-02", active: true, last: "12 min ago" },
    { name: "Rahul Verma", email: "rahul.verma@railworks.in", phone: "+91 98400 33445", role: "Operator", devices: "TMU-01", active: true, last: "Today, 08:40" },
    { name: "Sana Khan", email: "sana.khan@railworks.in", phone: "+91 98400 44556", role: "Operator", devices: "TMU-03", active: true, last: "Yesterday" },
    { name: "David Thomas", email: "david.thomas@railworks.in", phone: "+91 98400 55667", role: "Viewer", devices: "All devices", active: false, last: "14 Oct 2026" }
  ];
  /* ---------- Roles & permissions (shared by Users and Roles pages) ---------- */
  const ROLES = [
    { name: "Administrator", icon: "key", tone: "info", desc: "Full control of devices, motors, thresholds, users and roles." },
    { name: "Test Engineer", icon: "sliders", tone: "ok", desc: "Evaluates motor temperatures and tunes the thresholds." },
    { name: "Operator", icon: "activity", tone: "warn", desc: "Monitors live temperatures and handles alerts on the shop floor." },
    { name: "Viewer", icon: "eye", tone: "off", desc: "Read-only access to live readings and motor health." }
  ];
  const PERMISSIONS = [
    { key: "view", label: "View live temperatures & health", locked: true },
    { key: "test", label: "Start / stop motor tests" },
    { key: "ack", label: "Acknowledge alerts" },
    { key: "limits", label: "Edit thresholds" },
    { key: "devices", label: "Add / edit / delete devices & motors" },
    { key: "users", label: "Manage users, roles & permissions" }
  ];
  const ALL_PERMS = PERMISSIONS.map((p) => p.key);
  const DEFAULT_GRANTS = { Administrator: ALL_PERMS, "Test Engineer": ["view", "test", "ack", "limits"], Operator: ["view", "test", "ack"], Viewer: ["view"] };
  // Administrator always has everything; "view" is always on for every role
  const loadGrants = () => {
    const g = { ...DEFAULT_GRANTS, ...store.get("tt-grants", {}) };
    g.Administrator = ALL_PERMS.slice();
    Object.keys(g).forEach((r) => { if (!g[r].includes("view")) g[r] = ["view", ...g[r]]; });
    return g;
  };

  /* =========================================================
     Page: Roles & Permissions
     ========================================================= */
  function pageRoles() {
    let grants = loadGrants();
    let saved = JSON.stringify(grants);
    const users = store.get("tt-users", null) || DEFAULT_USERS;
    const dirty = () => JSON.stringify(grants) !== saved;

    const renderCards = () => {
      $("#roleCards").innerHTML = ROLES.map((r) => {
        const n = users.filter((u) => u.role === r.name).length, g = grants[r.name].length;
        return `
        <article class="card role-card">
          <div class="role-top"><div class="kpi-icon ${r.tone === "info" ? "" : r.tone}">${ico(r.icon)}</div><span class="badge ${r.tone}">${n} user${n === 1 ? "" : "s"}</span></div>
          <h3>${esc(r.name)}</h3>
          <p>${esc(r.desc)}</p>
          <div class="role-meter"><div class="bar"><span style="width:${((g / PERMISSIONS.length) * 100).toFixed(0)}%"></span></div><span class="num">${g} of ${PERMISSIONS.length} permissions</span></div>
          <a class="btn btn-sm" href="users.html?role=${encodeURIComponent(r.name)}">${ico("users")}View users</a>
        </article>`;
      }).join("");
      $("#permSave").disabled = !dirty();
      $("#permDirty").hidden = !dirty();
    };
    // the matrix is built once (and on reset) so keyboard focus stays on the checkbox being toggled
    const renderMatrix = () => {
      $("#permRows").innerHTML = PERMISSIONS.map((p) => `
        <tr><td>${esc(p.label)}${p.locked ? '<small class="muted perm-note">Always on</small>' : ""}</td>${ROLES.map((r) => {
          const locked = p.locked || r.name === "Administrator";
          return `<td><label class="perm-check${locked ? " locked" : ""}" title="${locked ? (p.locked ? "Every role can view readings" : "Administrators always have every permission") : ""}">
            <input type="checkbox" data-role="${esc(r.name)}" data-perm="${p.key}" ${grants[r.name].includes(p.key) ? "checked" : ""} ${locked ? "disabled" : ""} aria-label="${esc(r.name)}: ${esc(p.label)}"><span>${ico("check")}</span></label></td>`;
        }).join("")}</tr>`).join("");
    };

    $("#permRows").addEventListener("change", (e) => {
      const c = e.target.closest("input[data-perm]");
      if (!c) return;
      const set = new Set(grants[c.dataset.role]);
      c.checked ? set.add(c.dataset.perm) : set.delete(c.dataset.perm);
      grants[c.dataset.role] = ALL_PERMS.filter((k) => set.has(k));
      renderCards();
    });
    $("#permSave").addEventListener("click", () => {
      store.set("tt-grants", grants);
      saved = JSON.stringify(grants);
      toast("Permissions saved");
      renderCards();
    });
    $("#permReset").addEventListener("click", async () => {
      if (!(await confirmDialog({ title: "Reset to default permissions?", message: "Every role goes back to its default permissions. Unsaved changes are lost.", confirmLabel: "Reset", danger: false }))) return;
      grants = JSON.parse(JSON.stringify(DEFAULT_GRANTS));
      store.set("tt-grants", grants);
      saved = JSON.stringify(grants);
      renderMatrix(); renderCards();
      toast("Default permissions restored");
    });
    window.addEventListener("beforeunload", (e) => { if (dirty()) { e.preventDefault(); e.returnValue = ""; } });
    renderMatrix(); renderCards();
    return null; // nothing live on this page
  }

  function pageUsers() {
    let USERS = store.get("tt-users", null) || DEFAULT_USERS.slice();
    const save = () => store.set("tt-users", USERS);
    const dlg = $("#userDialog"), form = $("#userForm");
    let editing = -1;
    const roleBadge = { Administrator: "info", "Test Engineer": "ok", Operator: "warn", Viewer: "off" };
    const ME = "arun.prakash@railworks.in"; // signed-in user (demo)
    const grants = loadGrants();
    const permLabels = (role) => PERMISSIONS.filter((p) => (grants[role] || []).includes(p.key)).map((p) => p.label);
    const admins = () => USERS.filter((u) => u.role === "Administrator" && u.active).length;
    // why a user can't be deleted, or "" if they can
    const delBlock = (u) => u.email === ME ? "You can't delete your own account." : u.role === "Administrator" && u.active && admins() < 2 ? "At least one active administrator is required." : "";

    const box = $("#userDevices");
    box.innerHTML = DEVICES.map((d) => `<label class="check"><input type="checkbox" value="${esc(d.id)}"> ${esc(d.id)} · ${esc(d.name)}</label>`).join("");

    const render = () => {
      const term = ($("#userSearch").value || "").toLowerCase();
      const role = $("#roleFilter").value;
      const list = USERS.map((u, i) => ({ u, i })).filter(({ u }) => (!role || u.role === role) && (u.name + " " + u.email).toLowerCase().includes(term));
      $("#userStats").innerHTML = `
        <div class="card kpi"><div class="kpi-icon">${ico("users")}</div><div><div class="kpi-label">Total users</div><div class="kpi-value num">${USERS.length}</div></div></div>
        <div class="card kpi"><div class="kpi-icon ok">${ico("checkCircle")}</div><div><div class="kpi-label">Active</div><div class="kpi-value num">${USERS.filter((u) => u.active).length}</div></div></div>
        <div class="card kpi"><div class="kpi-icon">${ico("key")}</div><div><div class="kpi-label">Administrators</div><div class="kpi-value num">${USERS.filter((u) => u.role === "Administrator").length}</div></div></div>
        <div class="card kpi"><div class="kpi-icon warn">${ico("activity")}</div><div><div class="kpi-label">Operators &amp; engineers</div><div class="kpi-value num">${USERS.filter((u) => u.role === "Operator" || u.role === "Test Engineer").length}</div></div></div>`;
      $("#userRows").innerHTML = list.length ? list.map(({ u, i }) => `
        <tr>
          <td class="lead-cell" data-label="User"><div class="cell-user"><div class="avatar">${esc(initials(u.name))}</div><div><div class="name-line"><button type="button" class="link-btn" data-uview="${i}">${esc(u.name)}</button>${u.email === ME ? '<em class="you-tag">You</em>' : ""}</div><span>${esc(u.email)}</span></div></div></td>
          <td data-label="Role"><span class="badge ${roleBadge[u.role] || ""}">${esc(u.role)}</span></td>
          <td data-label="Device access">${esc(u.devices)}</td>
          <td data-label="Status">${u.active ? `<span class="badge ok"><span class="pulse"></span>Active</span>` : `<span class="badge off">Disabled</span>`}</td>
          <td data-label="Last login" class="muted">${esc(u.last)}</td>
          <td data-label=""><div class="row-actions">
            <button class="btn btn-sm btn-ghost" data-uview="${i}" aria-label="View ${esc(u.name)}" title="View">${ico("eye")}</button>
            <button class="btn btn-sm btn-ghost" data-uedit="${i}" aria-label="Edit ${esc(u.name)}" title="Edit">${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-udel="${i}" aria-label="Delete ${esc(u.name)}" title="${esc(delBlock(u) || "Delete")}" ${delBlock(u) ? "disabled" : ""}>${ico("trash")}</button>
          </div></td>
        </tr>`).join("") : `<tr><td colspan="6" class="muted" style="text-align:center;padding:32px">No users match your search.</td></tr>`;
      updateAlertCount();
    };

    function open(i) {
      editing = i;
      form.reset();
      $$("input, select", form).forEach((el) => el.setCustomValidity("")); // clear errors left by a cancelled attempt
      const u = USERS[i];
      $("#uTitle").textContent = u ? "Edit user" : "Invite new user";
      $("#uSave").textContent = u ? "Save changes" : "Send invite";
      $("#pwField").hidden = !!u;
      form.elements.password.required = !u;
      if (u) {
        form.elements.name.value = u.name; form.elements.email.value = u.email; form.elements.phone.value = u.phone || "";
        form.elements.role.value = u.role; form.elements.active.checked = u.active;
        const all = u.devices === "All devices";
        form.elements.allDevices.checked = all;
        $$("input", box).forEach((c) => (c.checked = all || u.devices.split(/,\s*/).includes(c.value)));
      } else form.elements.allDevices.checked = true;
      syncAll();
      dlg.showModal();
    }
    const syncAll = () => $$("input", box).forEach((c) => { c.disabled = form.elements.allDevices.checked; if (c.disabled) c.checked = true; });
    form.elements.allDevices.addEventListener("change", syncAll);

    form.addEventListener("input", (e) => e.target.setCustomValidity && e.target.setCustomValidity(""));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements;
      const prev = USERS[editing];
      const email = f.email.value.trim().toLowerCase();
      f.email.setCustomValidity(USERS.some((x, i) => i !== editing && x.email.toLowerCase() === email) ? "A user with this email already exists" : "");
      // keep at least one active administrator
      const losesAdmin = prev && prev.role === "Administrator" && prev.active && (f.role.value !== "Administrator" || !f.active.checked) && admins() < 2;
      f.role.setCustomValidity(losesAdmin ? "At least one active administrator is required" : "");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const picked = $$("input:checked", box).map((c) => c.value);
      const u = {
        name: f.name.value.trim(), email, phone: f.phone.value.trim(), role: f.role.value,
        devices: f.allDevices.checked ? "All devices" : (picked.join(", ") || "None"), active: f.active.checked,
        last: prev ? prev.last : "Invited"
      };
      if (prev) USERS[editing] = u; else USERS.unshift(u);
      save(); dlg.close(); toast(prev ? `${u.name} updated` : `Invitation sent to ${u.email}`); render();
    });

    function viewUser(i) {
      const u = USERS[i];
      const d = viewDialog({
        title: u.name, sub: u.email,
        hero: `<div class="profile-hero"><div class="avatar lg">${esc(initials(u.name))}</div><div><b>${esc(u.name)}</b><span class="badge ${roleBadge[u.role] || ""}">${esc(u.role)}</span></div></div>`,
        rows: [["Email", esc(u.email)], ["Phone", esc(u.phone || "—")], ["Status", u.active ? `<span class="badge ok"><span class="pulse"></span>Active</span>` : `<span class="badge off">Disabled</span>`], ["Last login", esc(u.last)], ["Device access", esc(u.devices)]],
        body: `<div><div class="detail-title">Permissions <a href="roles.html" style="text-transform:none;letter-spacing:0;font-weight:600;margin-left:6px">Manage roles</a></div><ul class="perm-list">${permLabels(u.role).map((p) => `<li>${ico("check")}${esc(p)}</li>`).join("")}</ul></div>`,
        actions: `<button type="button" class="btn btn-danger" data-v-del ${delBlock(u) ? `disabled title="${esc(delBlock(u))}"` : ""}>${ico("trash")}Delete</button><button type="button" class="btn btn-primary" data-v-edit>${ico("edit")}Edit</button>`
      });
      d.querySelector("[data-v-edit]").addEventListener("click", () => { d.close(); open(i); });
      d.querySelector("[data-v-del]").addEventListener("click", () => { d.close(); removeUser(i); });
    }

    async function removeUser(i) {
      const u = USERS[i];
      if (!u || delBlock(u)) return;
      if (!(await confirmDialog({ title: `Delete ${u.name}?`, message: `${u.email} will lose access immediately. This cannot be undone.`, confirmLabel: "Delete user" }))) return;
      USERS = USERS.filter((x) => x !== u);
      save(); toast(`${u.name} deleted`); render();
    }

    $("#addUser").addEventListener("click", () => open(-1));
    $("#userRows").addEventListener("click", (e) => {
      const ed = e.target.closest("[data-uedit]"), del = e.target.closest("[data-udel]"), vw = e.target.closest("[data-uview]");
      if (vw) viewUser(+vw.dataset.uview);
      if (ed) open(+ed.dataset.uedit);
      if (del) removeUser(+del.dataset.udel);
    });
    $("#userSearch").addEventListener("input", render);
    $("#roleFilter").addEventListener("change", render);
    const qRole = new URLSearchParams(location.search).get("role"); // from "View users" on the Roles page
    if (qRole && ROLES.some((r) => r.name === qRole)) $("#roleFilter").value = qRole;
    render();
    return null; // no live data on this page
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
      // Demo credentials — replace with a call to your login API.
      const user = form.elements.username.value.trim();
      if (user !== "admin" || pw.value !== "admin") {
        err.textContent = "Incorrect username or password.";
        err.classList.add("show");
        return;
      }
      err.classList.remove("show");
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
    initShell();
    const page = document.body.dataset.page;
    const pages = { roles: pageRoles, dashboard: pageDashboard, motors: pageMotors, devices: pageDevices, health: pageHealth, users: pageUsers, login: pageLogin };
    const render = pages[page] ? pages[page]() : null;
    if (render) rerender = render;
    paintLimitText();
    if (page !== "login") updateAlertCount();
    if (render) setInterval(() => { tick(); render(); }, STEP_MS);
    else if (page !== "login") setInterval(tick, STEP_MS);
  });
})();
