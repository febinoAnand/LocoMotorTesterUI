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
     Data model
     Device → monitors 1 or 2 motors (slots 1 / 2)
     Motor  → 3 probes: Sensor 1 and Sensor 2 on the motor, plus Ambient
     Readings are arrays in that order: [sensor1, sensor2, ambient]

     A motor is judged on how far its hotter sensor is above ambient,
     its absolute temperature, Sensor 1 / Sensor 2 agreement, the final
     temperature predicted by the heating model, and how it compares with
     the other motor on the same device. All limits are editable.
     ========================================================= */
  const DEFAULT_LIMITS = { warn: 80, crit: 100, riseWarn: 25, riseCrit: 30, devWarn: 10, devCrit: 15, ambMax: 50, partnerWarn: 8, partnerCrit: 12 };
  const LIMITS_KEY = "tt-limits-v3"; // v3: adds motor-to-motor comparison
  const LIMITS = { ...DEFAULT_LIMITS, ...store.get(LIMITS_KEY, {}) };
  const AMB = 2;            // index of the ambient probe
  const HIST = 90;          // live window kept per probe (used for the rate of rise)
  const STEP_MS = 2000;     // simulated sample interval
  const TREND_EVERY_MS = 60 * 1000;    // run trend chart: one point per minute

  const DEFAULT_DEVICES = [
    { id: "TMU-01", name: "Device A", location: "Loco Shed · Bay 3", ip: "192.168.10.21", fw: "2.4.1", online: true, signal: 4, interval: 2,
      motors: [
        { slot: 1, id: "TM-4471", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [50, 53, 31], runMin: 95, tau: 12 },
        { slot: 2, id: "TM-4472", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [57, 59, 32], runMin: 95, tau: 14 }
      ] },
    { id: "TMU-02", name: "Device B", location: "Loco Shed · Bay 5", ip: "192.168.10.22", fw: "2.4.1", online: true, signal: 3, interval: 2,
      motors: [
        { slot: 1, id: "TM-3810", model: "HS 15250A · 3-phase AC", loco: "WAP-7 #30412", base: [66, 69, 33], runMin: 62, tau: 15 }
      ] },
    { id: "TMU-03", name: "Device C", location: "Loco Shed · Bay 6", ip: "192.168.10.31", fw: "2.3.8", online: true, signal: 4, interval: 2,
      motors: [
        { slot: 1, id: "TM-5120", model: "TAO 659 · DC series", loco: "WAG-7 #27850", base: [61, 63, 29], runMin: 34, tau: 30 },
        { slot: 2, id: "TM-5121", model: "TAO 659 · DC series", loco: "WAG-7 #27850", base: [41, 53, 29], runMin: 34, tau: 10 }
      ] },
    { id: "TMU-04", name: "Device D", location: "Loco Shed · Pit line 2", ip: "192.168.10.40", fw: "2.4.0", online: false, signal: 0, interval: 5, lastSeen: "Today, 06:12", motors: [] }
  ];

  const DEV_KEY = "tt-devices-v5"; // v5: per-motor thermal time constant in the sample data
  let DEVICES = store.get(DEV_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_DEVICES));
  const saveDevices = () => store.set(DEV_KEY, DEVICES.map((d) => ({ ...d, motors: d.motors.map(({ live, hist, trend, runStart, ...m }) => m) })));

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
  DEVICES.forEach((d) => d.motors.forEach(seedMotor));

  // Simulated acquisition. Replace with real data source.
  function tick() {
    const now = Date.now();
    DEVICES.forEach((d) => {
      if (!d.online) return;
      d.motors.forEach((m) => {
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
    const sensors = [0, 1].map((j) => {
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
    const hot = sensors[0].final == null ? 1 : sensors[1].final == null ? 0 : sensors[0].final >= sensors[1].final ? 0 : 1;
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
    return d && d.online ? d.motors.find((x) => x !== m) || null : null;
  }
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
    const th = m.trend ? thermal(m) : null;
    const implausible = m.live.slice(0, 2).some((v) => v < amb - 3 || v > 200); // sensor colder than ambient → probe off / open circuit
    const checks = [
      { k: "Rise above ambient", d: `Hotter sensor − ambient · Warn ${L.riseWarn} K · Alarm ${L.riseCrit} K`, v: rise.toFixed(1) + " K", n: rise, warn: L.riseWarn, crit: L.riseCrit },
      { k: "Motor temperature", d: `Hotter sensor · Warn ${L.warn} °C · Alarm ${L.crit} °C`, v: hot.toFixed(1) + " °C", n: hot, warn: L.warn, crit: L.crit },
      { k: "Sensor 1 / Sensor 2 difference", d: `Warn ${L.devWarn} °C · Alarm ${L.devCrit} °C`, v: "Δ " + dev.toFixed(1) + " °C", n: dev, warn: L.devWarn, crit: L.devCrit }
    ];
    // heating model: warn early if the predicted final rise will pass the alarm limit
    if (th && th.final != null && th.confident) {
      checks.push({ k: "Predicted final rise", d: `Heating model · τ ${th.tau.toFixed(0)} min · Warn if it will reach ${L.riseCrit} K`, v: th.final.toFixed(1) + " K", n: th.final, warn: L.riseCrit, crit: null });
    } else checks.push({ k: "Predicted final rise", d: "Heating model needs more readings", v: "Collecting data", s: "ok" });
    // same-condition comparison with the other motor on this device
    const p = partnerOf(m);
    if (p) {
      const delta = rise - (Math.max(p.live[0], p.live[1]) - p.live[AMB]);
      checks.push({ k: `Compared with ${p.id}`, d: `Same device, same conditions · Warn ${L.partnerWarn} K · Alarm ${L.partnerCrit} K hotter`, v: (delta >= 0 ? "+" : "") + delta.toFixed(1) + " K", n: Math.max(0, delta), warn: L.partnerWarn, crit: L.partnerCrit });
    }
    checks.push(
      { k: "Ambient", d: `Valid range 0 – ${L.ambMax} °C`, v: amb.toFixed(1) + " °C", n: amb, warn: L.ambMax, crit: null },
      { k: "Probe readings plausible", d: "Sensor 1 · Sensor 2 · Ambient reporting", v: implausible ? "Check probe" : "3 / 3", s: implausible ? "warn" : "ok" }
    );
    checks.forEach((c) => { if (c.n != null) c.s = lvl(c.n, c.warn, c.crit); });
    const status = checks.reduce((w, c) => (RANK[c.s] > RANK[w] ? c.s : w), "ok");
    return { hot, amb, rise, dev, th, stable: !!(th && th.eq), checks, status };
  }
  const allMotors = () => DEVICES.flatMap((d) => d.motors.map((m) => ({ d, m })));
  const liveMotors = () => allMotors().filter((x) => x.d.online);
  // effective sensor limits for a given ambient (rise limit usually bites before the absolute one)
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
        <div class="panel-trend" title="Hotter sensor since monitoring started · dashed = alarm level">
          <span>Trend</span>${sparkRun(m, e.status)}
        </div>
        <div class="panel-heat">
          ${progressRing(e.th && e.th.confident ? e.th.sensors[e.th.hot].pct : null, e.status === "ok" ? "var(--series-1)" : `var(--${e.status})`, e.th && e.th.confident ? `${Math.round(e.th.sensors[e.th.hot].pct * 100)}%` : "—", "heated", 58)}
          <div class="ph-text">
            <span>${trendText(e)}</span>
            <b class="num">${e.th && e.th.confident ? `Final ≈ ${e.th.finalTemp.toFixed(1)} °C` : "Final: collecting data"}</b>
            <small class="num">${e.th && e.th.confident ? (e.th.alarmIn != null && e.rise < LIMITS.riseCrit ? `Alarm in about ${fmtMin(e.th.alarmIn)}` : e.th.eq ? "Equilibrium reached" : e.th.eqIn < 1 ? "Settling" : `Equilibrium in about ${fmtMin(e.th.eqIn)}`) : "&nbsp;"}</small>
          </div>
          <a href="motors.html?device=${encodeURIComponent(d.id)}&motor=${m.slot}">Details →</a>
        </div>
      </div>`;
  }
  const emptySlot = (slot, d) => `
    <div class="empty-slot">
      <div>${ico("plus")}<div><b>Slot ${slot} available</b></div><div>${d.motors.length ? "Assign a second motor to monitor both together" : "Assign a motor to start monitoring"}</div>
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
        const m = { ...data, base: [p, p + 2, Math.round(28 + Math.random() * 4)], runMin: 0.5 }; // monitoring just started
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
      rows: [["Result", verdictPill(d.online ? e.status : "off")], ["Monitoring for", fmtRun(runMinutes(m))], ["Model / type", esc(m.model)], ["Locomotive", esc(m.loco)],
        ["Device", `${esc(d.name)} · slot ${m.slot}`], ["Sensor 1 / 2 Δ", `${e.dev.toFixed(1)} °C`]],
      actions: `<button type="button" class="btn btn-danger" data-v-del>${ico("trash")}Delete</button><button type="button" class="btn" data-v-edit>${ico("edit")}Edit</button><a class="btn btn-primary" href="motors.html?device=${encodeURIComponent(d.id)}&motor=${m.slot}">Log sheet</a>`
    });
    dlg.querySelector("[data-v-edit]").addEventListener("click", () => { dlg.close(); motorDialog({ device: d.id, slot: m.slot, edit: true }); });
    dlg.querySelector("[data-v-del]").addEventListener("click", () => { dlg.close(); deleteMotor(d.id, m.slot); });
  }

  // Update thresholds (persisted)
  function limitsDialog() {
    const F = [
      ["riseWarn", "Rise above ambient — warning", "K"], ["riseCrit", "Rise above ambient — alarm", "K"],
      ["warn", "Motor temperature — warning", "°C"], ["crit", "Motor temperature — alarm", "°C"],
      ["devWarn", "Sensor 1 / 2 difference — warning", "°C"], ["devCrit", "Sensor 1 / 2 difference — alarm", "°C"],
      ["partnerWarn", "Hotter than other motor — warning", "K"], ["partnerCrit", "Hotter than other motor — alarm", "K"],
      ["ambMax", "Ambient — maximum valid", "°C"]
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
      if (v.devWarn >= v.devCrit) return fail("Sensor 1 / 2 difference warning must be lower than the alarm limit.");
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
  const VERDICT_SHORT = { ok: "Good", warn: "Monitor", crit: "Not OK", off: "Offline" };
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

  // Sensor 1 / Sensor 2 / Ambient as large digital values; sensors also show their rise above ambient
  function readings(m, online = true, size = "") {
    const amb = m.live[AMB];
    return `<div class="readings ${size}">${m.live.map((v, j) => `
      <div class="reading${j === AMB ? " amb" : ""}">
        <span class="r-label">${j === AMB ? "Ambient" : j ? "Sensor 2" : "Sensor 1"}<small>${j === AMB ? "Surrounding air" : "On motor"}</small></span>
        <b class="r-value num ${online ? tCls(v, j, amb) : "muted"}">${online ? v.toFixed(1) : "—"}<small>°C</small></b>
        <span class="r-sub num">${j === AMB ? "&nbsp;" : online ? `Rise ${(v - amb).toFixed(1)} K` : ""}</span>
      </div>`).join("")}</div>`;
  }
  const signalBars = (n) => `<span class="signal" aria-label="Signal ${n} of 4">${[1, 2, 3, 4].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  /* ---------- Graphs (SVG / CSS, theme-aware) ---------- */
  const COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)"]; // Sensor 1, Sensor 2, ambient
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
      out += `<path class="line${s.dash ? " predicted" : ""}" style="stroke:${s.color}" d="${s.points.map((p, i) => (i ? "L" : "M") + x(p.t).toFixed(1) + " " + y(p.v).toFixed(1)).join("")}"/>`;
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
    const actual = (rise ? [0, 1] : [0, 1, 2]).map((j) => ({ name: j === AMB ? "Ambient" : `Sensor ${j + 1}${rise ? " rise" : ""}`, short: j === AMB ? "Amb" : `S${j + 1}`, color: COLORS[j],
      points: pts.map((p) => ({ t: p.t, v: +(rise ? p.v[j] - p.v[AMB] : p.v[j]).toFixed(1) })) }));
    if (!th.confident) return actual;
    // predicted continuation from the fitted heating curve, up to equilibrium (15–90 min ahead)
    const now = Date.now(), tNow = runMinutes(m), ahead = Math.min(90, Math.max(15, th.eqIn + 10));
    const pred = [0, 1].map((j) => {
      const sn = th.sensors[j], r0 = sn.r0 ?? 0, points = [];
      for (let k = 0; k <= ahead; k++) {
        const t = tNow + k, r = sn.final - (sn.final - r0) * Math.exp(-t / sn.tau);
        points.push({ t: now + k * 60000, v: +(rise ? r : amb + r).toFixed(1) });
      }
      return { name: `Sensor ${j + 1} predicted`, short: `S${j + 1} final`, color: COLORS[j], dash: true, points };
    });
    actual.forEach((s, j) => { if (j < 2) s.label = false; });
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
    const v = pts.map((p) => Math.max(p.v[0], p.v[1])), fail = amb + LIMITS.riseCrit;
    const lo = Math.min(...v, amb) - 2, hi = Math.max(...v, fail) + 2;
    const X = (i) => ((i / Math.max(1, v.length - 1)) * 100).toFixed(2), Y = (val) => (30 - ((val - lo) / (hi - lo)) * 28).toFixed(2);
    return `<svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none" role="img" aria-label="Hotter sensor trend, now ${v[v.length - 1].toFixed(1)} °C">
      <line x1="0" x2="100" y1="${Y(fail)}" y2="${Y(fail)}" class="spark-fail" vector-effect="non-scaling-stroke"/>
      <path d="${v.map((val, i) => (i ? "L" : "M") + X(i) + " " + Y(val)).join("")}" style="stroke:var(--${status === "ok" ? "series-1" : status})" vector-effect="non-scaling-stroke"/>
    </svg>`;
  }

  // grouped bars: Sensor 1 and Sensor 2 rise above ambient for every motor, against warning / alarm limits
  function riseBars(rows) {
    const max = Math.max(LIMITS.riseCrit * 1.35, ...rows.map((r) => Math.max(r.e.rise, r.e.th && r.e.th.confident ? r.e.th.final : 0) + 4));
    const ticks = Array.from({ length: Math.floor(max / 10) + 1 }, (_, i) => i * 10);
    const marks = `<i class="rb-mark warn" style="left:${pct(LIMITS.riseWarn, max)}"></i><i class="rb-mark fail" style="left:${pct(LIMITS.riseCrit, max)}"></i>`;
    return `<div class="rb">
      <div class="rb-row rb-head"><span></span><span class="rb-track rb-labels"><span style="left:${pct(LIMITS.riseWarn, max)}">Warn ${LIMITS.riseWarn}</span><span class="fail" style="left:${pct(LIMITS.riseCrit, max)}">Alarm ${LIMITS.riseCrit} K</span></span><span></span></div>
      ${rows.map(({ d, m, e }) => {
        const rDe = m.live[0] - m.live[AMB], rNde = m.live[1] - m.live[AMB];
        return `<a class="rb-row" href="motors.html?device=${encodeURIComponent(d.id)}&motor=${m.slot}" data-tip="${esc(m.id)} · ${esc(d.name)} slot ${m.slot}|Sensor 1 rise: ${rDe.toFixed(1)} K${e.th && e.th.confident ? ` → final ${e.th.sensors[0].final.toFixed(1)} K` : ""}|Sensor 2 rise: ${rNde.toFixed(1)} K${e.th && e.th.confident ? ` → final ${e.th.sensors[1].final.toFixed(1)} K` : ""}|Alarm at ${LIMITS.riseCrit} K">
          <span class="rb-label"><b>${esc(m.id)}</b><span>${esc(d.name)} · ${m.slot}</span></span>
          <span class="rb-track">${marks}${[rDe, rNde].map((r, j) => {
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
    const rise = pts.map((p) => ({ x: (p.t - m.runStart) / 60000, y: Math.max(p.v[0], p.v[1]) - p.v[AMB] }));
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
    const rings = [0, 1].map((j) => progressRing(th.confident ? s[j].pct : null, COLORS[j], th.confident ? `${Math.round(s[j].pct * 100)}%` : "—", `Sensor ${j + 1}`)).join("");
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
        ${[0, 1].map((j) => finalBar(`Sensor ${j + 1}`, COLORS[j], s[j].now, th.confident ? s[j].final : null, max)).join("")}
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

  const limitLine = () => `Alarm at: ${LIMITS.riseCrit} K above ambient · ${LIMITS.crit} °C · Sensor 1 / 2 Δ ${LIMITS.devCrit} °C`;

  /* =========================================================
     Page: Dashboard — every device and motor at a glance
     ========================================================= */
  function pageDashboard() {
    const render = () => {
      const evals = liveMotors().map((x) => ({ ...x, e: evalMotor(x.m) }));
      const online = DEVICES.filter((d) => d.online).length;
      const c = { ok: 0, warn: 0, crit: 0 };
      evals.forEach((x) => c[x.e.status]++);
      $("#summary").innerHTML = `
        <div><span>Motors monitored</span><b class="num">${evals.length}<small> on ${online} of ${DEVICES.length} devices</small></b></div>
        <div><span style="color:var(--ok-text)">${ico("checkCircle")}Good</span><b class="num">${c.ok}</b></div>
        <div><span style="color:var(--warn-text)">${ico("alert")}Monitor</span><b class="num">${c.warn}</b></div>
        <div><span style="color:var(--crit-text)">${ico("xCircle")}Not OK</span><b class="num">${c.crit}</b></div>
        ${evals.length ? `<div class="cond-split" role="img" aria-label="${c.ok} good, ${c.warn} monitor, ${c.crit} not OK">${["ok", "warn", "crit"].filter((k) => c[k]).map((k) => `<span class="${k}" style="flex:${c[k]}" data-tip="${VERDICT_SHORT[k]}|${c[k]} of ${evals.length} motors"></span>`).join("")}</div>` : ""}`;

      // alarm banner: only motors that need action
      const bad = evals.filter((x) => x.e.status !== "ok").sort((a, b) => RANK[b.e.status] - RANK[a.e.status]);
      $("#alarmBar").hidden = !bad.length;
      $("#alarmBar").innerHTML = bad.map(({ d, m, e }) => `
        <a class="alarm-row ${e.status}" href="motors.html?device=${encodeURIComponent(d.id)}&motor=${m.slot}">
          ${ico(STATUS[e.status].icon)}<b>${esc(m.id)}</b><span class="alarm-where">${esc(d.name)} · slot ${m.slot}</span>
          <span class="alarm-reason">${esc(reasonOf(e))}</span><em>${VERDICT_SHORT[e.status]}</em>
        </a>`).join("");

      $("#riseChart").innerHTML = evals.length ? riseBars(evals.slice().sort((a, b) => b.e.rise - a.e.rise)) : `<p class="muted">No motors being monitored.</p>`;

      $("#deviceGrid").innerHTML = DEVICES.map((d) => {
        const head = `
          <div class="card-head">
            <div class="device-title"><div class="device-ico">${ico("cpu")}</div><div><h3>${esc(d.name)}</h3><div class="sub">${esc(d.id)} · ${esc(d.location)}</div></div></div>
            ${d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : badge("off")}
          </div>`;
        if (!d.online) return `<div class="card device-card">${head}<div class="offline-mask">${ico("wifiOff")}<b>Device offline</b><div>Last seen ${esc(d.lastSeen || "—")}</div></div></div>`;
        const slots = [1, 2].map((s) => { const m = d.motors.find((x) => x.slot === s); return m ? motorPanel(d, m) : emptySlot(s, d); }).join("");
        return `<div class="card device-card">${head}<div class="motor-slots">${slots}</div></div>`;
      }).join("");
      updateAlertCount();
    };
    render();
    return render;
  }

  /* =========================================================
     Page: Motors — one motor's readings, trend and register
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
          <td data-label="Device" class="col-opt">${esc(dd.name)} · slot ${mm.slot}</td>
          ${mm.live.map((v, j) => `<td data-label="${j === AMB ? "Ambient" : j ? "Sensor 2" : "Sensor 1"}" class="num${j === AMB ? " col-opt" : ""} ${dd.online ? tCls(v, j, mm.live[AMB]) : "muted"}">${dd.online ? v.toFixed(1) : "—"}</td>`).join("")}
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
        $("#motorHero").innerHTML = `<div class="empty-state">${ico("motor")}<h3>No motors yet</h3><p>Add a motor to a device to start monitoring Sensor 1, Sensor 2 and Ambient.</p><button type="button" class="btn btn-primary" data-add-motor="">${ico("plus")}Add motor</button></div>`;
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
          <div class="mh-verdict">${verdictPill(st)}<span>${st === "ok" ? "All checks within limits" : st === "off" ? "Device offline" : esc(reasonOf(e))}</span></div>
        </div>
        ${readings(m, d.online, "lg")}
        <div class="mh-foot">
          <span>Monitoring for <b>${fmtRun(runMinutes(m))}</b></span>
          <span>Sensor 1 / 2 Δ <b class="num">${e.dev.toFixed(1)} °C</b></span>
          <span>Trend <b>${trendText(e)}</b></span>
          <span class="mh-limits">${limitLine()} <button type="button" class="link-btn" data-edit-limits>Edit limits</button></span>
          <span class="mh-actions">
            <button type="button" class="btn btn-sm" data-edit-motor="${esc(d.id)}|${m.slot}">${ico("edit")}Edit</button>
            <button type="button" class="btn btn-sm btn-danger" data-del-motor="${esc(d.id)}|${m.slot}">${ico("trash")}Delete</button>
          </span>
        </div>`;

      $("#condPill").innerHTML = verdictPill(st);
      $("#condBody").innerHTML = conditionCard(d, m, e);
      $("#eqChart").innerHTML = gradientChart(m);
      $("#eqMeta").textContent = e.th.eq ? "Equilibrium reached — the last two 15-minute intervals both changed by less than 2 K/h" : "Equilibrium when two successive intervals each change by less than 2 K/h";

      const mode = ($("input[name=trendMode]:checked") || {}).value || "temp";
      const series = runSeries(m, mode);
      lineChart($("#runChart"), { series, lines: runLines(m, mode), start: m.runStart, now: e.th.confident ? Date.now() : null, unit: mode === "rise" ? "K" : "°C", title: `${m.id} temperature trend` });

      // same device, same conditions: rise of this motor vs the other motor
      const p = partnerOf(m);
      $("#cmpCard").hidden = !p;
      if (p) {
        const hotRise = (mm) => trendPoints(mm).map((q) => ({ t: q.t, v: +(Math.max(q.v[0], q.v[1]) - q.v[AMB]).toFixed(1) }));
        $("#cmpSub").textContent = `${m.id} and ${p.id} share ${d.name}, so they should heat alike · hotter sensor rise above ambient`;
        lineChart($("#cmpChart"), {
          series: [{ name: m.id, short: m.id, color: "var(--primary)", points: hotRise(m) }, { name: p.id, short: p.id, color: "var(--muted)", points: hotRise(p) }],
          lines: [{ v: LIMITS.riseCrit, label: `Alarm ${LIMITS.riseCrit} K`, cls: "limit" }],
          start: Math.min(m.runStart, p.runStart), unit: "K", height: 220, title: "Motor comparison",
          xfmt: (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      }
      $("#runLegend").innerHTML = series.filter((s) => !s.dash).map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join("") + (series.some((s) => s.dash) ? `<span><i class="pred"></i>Predicted</span>` : "") + `<span><i class="dash"></i>Limits</span>`;

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
    const pages = { dashboard: pageDashboard, motors: pageMotors, devices: pageDevices, login: pageLogin };
    const render = pages[page] ? pages[page]() : null;
    if (render) rerender = render;
    paintLimitText();
    if (page !== "login") updateAlertCount();
    if (render) setInterval(() => { tick(); render(); }, STEP_MS);
    else if (page !== "login") setInterval(tick, STEP_MS);
  });
})();
