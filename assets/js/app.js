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
    wifi: '<path d="M5 12.55a11 11 0 0 1 14 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>',
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
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronUp: '<path d="m18 15-6-6-6 6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>',
    play: '<path d="M7 5v14l11-7z"/>',
    minus: '<path d="M5 12h14"/>',
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
  /* Permissions are CRUD per area: "<area>.<action>". An area only lists the actions that exist
     for it (e.g. reports can be viewed and created = downloaded / printed, never deleted). */
  const ACTIONS = [["view", "View"], ["create", "Create"], ["update", "Update"], ["delete", "Delete"]];
  const AREAS = [
    { key: "monitor", label: "Dashboard & monitor", does: { view: "Live readings, dashboard and each motor's page" } },
    { key: "monitoring", label: "Monitoring runs", does: { create: "Switch on a free channel", update: "Start / stop monitoring a motor" } },
    { key: "motors", label: "Motors", does: { view: "Motors page", create: "Register motors", update: "Edit details, add details, assign to a device", delete: "Delete motors" } },
    { key: "devices", label: "Devices", does: { view: "Devices page", create: "Add devices", update: "Edit devices", delete: "Delete devices, reset demo data" } },
    { key: "limits", label: "Alarm & terminal limits", does: { view: "Settings page", update: "Change alarm and terminal limits" } },
    { key: "reports", label: "Results", does: { view: "Results page", create: "Download and print results" } },
    { key: "activity", label: "Activity log", does: { view: "Activity log page" } },
    { key: "users", label: "Users", does: { view: "Users page", create: "Add users", update: "Edit users, enable / disable accounts", delete: "Delete users" } },
    { key: "roles", label: "Roles & permissions", does: { view: "Roles & permissions page", create: "Add roles", update: "Edit roles and their permissions", delete: "Delete roles" } }
  ];
  const ACTION_LABEL = Object.fromEntries(ACTIONS);
  const PERMISSIONS = AREAS.flatMap((a) => ACTIONS.filter(([k]) => a.does[k]).map(([k, l]) => ({ key: `${a.key}.${k}`, area: a.key, action: k, label: `${a.label} · ${l}`, locked: a.key === "monitor" ? "all" : undefined })));
  const permLabel = (k) => (PERMISSIONS.find((p) => p.key === k) || { label: k }).label;
  // create / update / delete need the area's page: they bring View with them
  const withViews = (keys) => { const s = new Set(keys); keys.forEach((k) => { const v = k.split(".")[0] + ".view"; if (PERMISSIONS.some((p) => p.key === v)) s.add(v); }); return PERMISSIONS.map((p) => p.key).filter((k) => s.has(k)); };
  const ADMIN_ROLE = "Administrator";
  const DEFAULT_ROLES = [
    { name: "Administrator", desc: "Full access, including users and permissions" },
    { name: "Supervisor", desc: "Runs the shed floor: devices, motors, limits and reports" },
    { name: "Operator", desc: "Starts and stops monitoring runs and prints reports" },
    { name: "Viewer", desc: "Read-only access to live readings" }
  ];
  const READ_ONLY = ["monitor.view", "motors.view", "devices.view", "limits.view", "reports.view"];
  const DEFAULT_GRANTS = {
    Administrator: PERMISSIONS.map((p) => p.key),
    Supervisor: PERMISSIONS.map((p) => p.key).filter((k) => !/^(users|roles)\./.test(k)),
    Operator: [...READ_ONLY, "monitoring.create", "monitoring.update", "reports.create"],
    Viewer: READ_ONLY
  };
  // permissions saved before CRUD (one switch per area) → the CRUD permissions they covered
  const LEGACY_GRANTS = {
    view: READ_ONLY, trigger: ["monitoring.create", "monitoring.update"], limits: ["limits.update"], reports: ["reports.create"],
    motors: ["motors.create", "motors.update", "motors.delete"], devices: ["devices.create", "devices.update", "devices.delete"], activity: ["activity.view"],
    users: ["users.view", "users.create", "users.update", "users.delete", "roles.view", "roles.create", "roles.update", "roles.delete"]
  };
  const DEFAULT_USERS = [
    { id: 1, name: "Arun Prakash", username: "admin", email: "arun.prakash@railshed.in", role: "Administrator", password: "admin", active: true, lastLogin: null },
    { id: 2, name: "Meera Iyer", username: "meera", email: "meera.iyer@railshed.in", role: "Supervisor", password: "meera123", active: true, lastLogin: null },
    { id: 3, name: "Ravi Kumar", username: "ravi", email: "ravi.kumar@railshed.in", role: "Operator", password: "ravi1234", active: true, lastLogin: null },
    { id: 4, name: "Sunil Das", username: "sunil", email: "sunil.das@railshed.in", role: "Viewer", password: "sunil123", active: true, lastLogin: null },
    { id: 5, name: "Kavya Nair", username: "kavya", email: "kavya.nair@railshed.in", role: "Operator", password: "kavya123", active: false, lastLogin: null }
  ];
  const USERS_KEY = "tt-users-v2", GRANTS_KEY = "tt-grants-v3", OLD_GRANTS_KEY = "tt-grants-v2", ROLES_KEY = "tt-roles-v1", SESSION_KEY = "tt-session"; // v3: CRUD permissions
  let ROLES = store.get(ROLES_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_ROLES));
  if (!ROLES.some((r) => r.name === ADMIN_ROLE)) ROLES.unshift(JSON.parse(JSON.stringify(DEFAULT_ROLES[0])));
  const saveRoles = () => store.set(ROLES_KEY, ROLES);
  let USERS = store.get(USERS_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_USERS));
  const oldGrants = store.get(GRANTS_KEY, null) ? {} : Object.fromEntries(Object.entries(store.get(OLD_GRANTS_KEY, {})).map(([r, keys]) => [r, withViews(keys.flatMap((k) => LEGACY_GRANTS[k] || []))]));
  let GRANTS = { ...JSON.parse(JSON.stringify(DEFAULT_GRANTS)), ...oldGrants, ...store.get(GRANTS_KEY, {}) };
  const saveUsers = () => store.set(USERS_KEY, USERS);
  const saveGrants = () => store.set(GRANTS_KEY, GRANTS);
  if (Object.keys(oldGrants).length) saveGrants();
  // Administrator has everything; locked permissions are always granted
  const grantsOf = (role) => (role === ADMIN_ROLE ? PERMISSIONS.map((p) => p.key)
    : withViews(PERMISSIONS.filter((p) => p.locked === "all" || (GRANTS[role] || []).includes(p.key)).map((p) => p.key)));
  const currentUser = () => USERS.find((u) => u.id === store.get(SESSION_KEY, null) && u.active) || null;
  const can = (perm) => { const u = currentUser(); return !!u && grantsOf(u.role).includes(perm); };
  const isAdmin = () => (currentUser() || {}).role === ADMIN_ROLE;
  // guard an action: returns true when allowed, otherwise tells the user why not
  const allowed = (perm) => {
    if (can(perm)) return true;
    toast(`Your role does not allow: ${permLabel(perm)}`);
    logActivity("access", `Tried: ${permLabel(perm)} — not allowed for this role`);
    return false;
  };
  const initials = (n) => String(n).trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  /* ---------- Activity log ----------
     Every action is recorded with who did it and when (kept in this browser, newest
     2000 entries). The log is read-only: nothing in the app edits or clears it. */
  const ACT_KEY = "tt-activity-v1", ACT_MAX = 2000;
  const ACT_CATS = { auth: "Sign-in", device: "Devices", motor: "Motors", test: "Tests & monitoring", limits: "Limits & settings", user: "Users", role: "Roles & permissions", report: "Results", access: "Access denied" };
  function logActivity(cat, text, who) {
    const u = who === undefined ? currentUser() : who;
    const log = store.get(ACT_KEY, []);
    log.push({ t: Date.now(), cat, text, user: u ? u.name : "Unknown", username: u ? u.username : "", role: u ? u.role : "" });
    if (log.length > ACT_MAX) log.splice(0, log.length - ACT_MAX);
    store.set(ACT_KEY, log);
  }
  // mark the page with what the user may NOT do, so CSS hides those controls everywhere
  function applyPerms() {
    PERMISSIONS.forEach((p) => document.body.classList.toggle(`no-perm-${p.key.replace(".", "-")}`, !can(p.key)));
    document.body.classList.toggle("no-admin-nav", !["users.view", "roles.view", "activity.view"].some(can));
    const u = currentUser();
    $$(".user-chip").forEach((chip) => {
      if (!u) return;
      chip.innerHTML = `<span class="avatar">${esc(initials(u.name))}</span><span class="who"><b>${esc(u.name)}</b><span>${esc(u.role)}</span></span>`;
      chip.title = `Signed in as ${u.username}`;
    });
  }

  /* =========================================================
     Data model
     Device → monitors at most MAX_RUN (2) motors at once, one per channel; a motor
              can only be assigned while a channel is free.
              A finished check is switched off ("Stopped") and keeps its readings.
     Device → 2 channels; each channel checks one motor with 2 temperature
              sensors on it (DE drive end, NDE non-drive end) + 1 ambient (TA)
     Readings are arrays in that order: [DE, NDE, TA]

     A motor is judged on how far its hottest probe is above ambient,
     its absolute temperature, the DE / NDE difference, the final
     temperature predicted by the heating model, and how it compares with
     the other motor on the same device. All limits are editable.
     ========================================================= */
  const DEFAULT_LIMITS = { warn: 80, crit: 100, riseWarn: 25, riseCrit: 30, devWarn: 10, devCrit: 15, partnerWarn: 8, partnerCrit: 12 };
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
    { id: "TMU-01", name: "Device A", location: "Loco Shed · Bay 3", ip: "192.168.10.21", fw: "2.4.1", online: true, signal: 4,
      motors: [
        { id: "TM-4471", testId: "TEST-0001", stator: "ST-60681", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [50, 53, 31], runMin: 95, tau: 12, channel: 1 },
        { id: "TM-4472", testId: "TEST-0002", stator: "ST-60682", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31245", base: [57, 59, 32], runMin: 95, tau: 14, channel: 2 }
      ] },
    { id: "TMU-02", name: "Device B", location: "Loco Shed · Bay 5", ip: "192.168.10.22", fw: "2.4.1", online: true, signal: 3,
      motors: [
        { id: "TM-3810", testId: "TEST-0003", stator: "ST-15251", model: "HS 15250A · 3-phase AC", loco: "WAP-7 #30412", base: [66, 69, 33], runMin: 62, tau: 15, channel: 1 },
        { id: "TM-3811", testId: "TEST-0004", stator: "ST-15252", model: "HS 15250A · 3-phase AC", loco: "WAP-7 #30412", base: [57, 59, 33], runMin: 62, tau: 15, channel: 2 },
        { id: "TM-5121", testId: "TEST-0005", stator: "ST-65912", model: "TAO 659 · DC series", loco: "WAG-7 #27850", base: [41, 53, 29], runMin: 70, tau: 10, active: false, channel: 1 }
      ] }
  ];

  const DEV_KEY = "tt-devices-v6"; // v6: two devices, two channels each
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
  const RANK = { stop: -1, ok: 0, warn: 1, crit: 2 };
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
    return { hot, amb, rise, dev, th, stable: !!(th && th.eq), checks, status: m.active === false ? "stop" : status, condition: status };
  }
  const allMotors = () => DEVICES.flatMap((d) => d.motors.map((m) => ({ d, m })));
  const liveMotors = () => allMotors().filter((x) => x.d.online && x.m.active !== false);
  // registered motors not assigned to any device (no readings until assigned)
  const DEFAULT_SPARE = [
    { id: "TM-4473", stator: "ST-60683", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31246" },
    { id: "TM-5120", stator: "ST-65911", model: "TAO 659 · DC series", loco: "WAG-7 #27850" },
    { id: "TM-6002", stator: "ST-60690", model: "6FRA 6068 · 3-phase AC", loco: "WAG-9 #31250" }
  ];
  const SPARE_KEY = "tt-spare-v1";
  let SPARE = store.get(SPARE_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_SPARE));
  const saveSpare = () => store.set(SPARE_KEY, SPARE.map(({ id, stator, model, loco, tests }) => ({ id, stator, model, loco, tests: tests || [] })));
  const spareOf = (m) => ({ id: m.id, stator: m.stator, model: m.model, loco: m.loco, tests: m.tests || [] });
  // motors saved before the stator number existed: take it from the sample data when the ID matches
  const DEFAULT_STATOR = Object.fromEntries([...DEFAULT_DEVICES.flatMap((d) => d.motors), ...DEFAULT_SPARE].map((m) => [m.id, m.stator]));
  [...DEVICES.flatMap((d) => d.motors), ...SPARE].forEach((m) => { if (!m.stator && DEFAULT_STATOR[m.id]) m.stator = DEFAULT_STATOR[m.id]; });
  // motors saved while devices still had a queue go back to the not-assigned list
  if (DEVICES.some((d) => d.motors.some((m) => m.queued))) {
    DEVICES.forEach((d) => {
      d.motors.filter((m) => m.queued).forEach((m) => SPARE.push(spareOf(m)));
      d.motors = d.motors.filter((m) => !m.queued);
    });
    saveDevices(); saveSpare();
  }
  const everyMotor = () => [...allMotors(), ...SPARE.map((m) => ({ d: null, m }))];
  if (!store.get("tt-history-seeded", false)) {
    const DAY = 86400000, at = (days, h) => Date.now() - days * DAY - h * 3600000;
    const run = (testId, days, mins, device, channel, de, nde, rise, result) => ({ testId, device, channel, start: at(days, 3), end: at(days, 3) + mins * 60000, de, nde, rise, result });
    const SEED = {
      "TM-4471": [run("TEST-25-0412", 21, 110, "Device A", 1, 51.2, 54.0, 23.1, "ok"), run("TEST-25-0388", 48, 95, "Device B", 2, 58.9, 61.7, 29.4, "warn")],
      "TM-3810": [run("TEST-25-0431", 14, 80, "Device B", 1, 66.0, 70.2, 37.0, "crit")],
      "TM-6002": [run("TEST-25-0402", 30, 120, "Device A", 2, 49.0, 51.5, 20.4, "ok"), run("TEST-25-0350", 62, 100, "Device A", 1, 50.3, 52.8, 21.0, "ok")]
    };
    everyMotor().forEach(({ m }) => { if (SEED[m.id] && !(m.tests || []).length) m.tests = SEED[m.id]; });
    store.set("tt-history-seeded", true);
    if (allMotors().some(({ m }) => SEED[m.id])) store.set(DEV_KEY, DEVICES.map((d) => ({ ...d, motors: d.motors.map(({ live, hist, trend, runStart, _th, ...m }) => m) })));
    store.set(SPARE_KEY, SPARE.map(({ id, stator, model, loco, tests }) => ({ id, stator, model, loco, tests: tests || [] })));
  }
  /* Test ID: one per test run (a motor checked on a device). Given when the motor is
     assigned for test; a stopped test keeps its ID; restarting starts a new test. */
  const TEST_SEQ_KEY = "tt-test-seq";
  const DEFAULT_TEST = Object.fromEntries(DEFAULT_DEVICES.flatMap((d) => d.motors).map((m) => [m.id, m.testId]));
  const testNo = (t) => { const r = /^TEST-(\d+)$/i.exec(t || ""); return r ? +r[1] : 0; }; // only the app's own numbering counts; your own IDs don't move it
  // never repeats a number used now or in any motor's test history
  const nextTestId = () => "TEST-" + String(Math.max(store.get(TEST_SEQ_KEY, 0), ...everyMotor().flatMap(({ m }) => [testNo(m.testId), ...(m.tests || []).map((r) => testNo(r.testId))])) + 1).padStart(4, "0");
  const useTestId = (t) => { store.set(TEST_SEQ_KEY, Math.max(store.get(TEST_SEQ_KEY, 0), testNo(t))); return t; };
  // a free, well-formed Test ID, or an error message
  const checkTestId = (raw, self) => {
    const t = String(raw || "").trim().toUpperCase();
    if (!t) return { err: "Test ID is required." };
    if (!/^[A-Z0-9][A-Z0-9-]{2,23}$/.test(t)) return { err: "Test ID: 3–24 letters, numbers or dashes." };
    const other = allMotors().find(({ m }) => m !== self && (m.testId || "").toUpperCase() === t);
    const past = everyMotor().find(({ m }) => (m.tests || []).some((r) => r.testId.toUpperCase() === t));
    if (past) return { err: `Test ID ${t} was already used for ${past.m.id}.` };
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
    stop: { label: "Stopped", icon: "pause" }
  };
  const badge = (s, label) => `<span class="badge ${s}">${ico(STATUS[s].icon)}${esc(label || STATUS[s].label)}</span>`;
  // device connection status, as shown in the Devices table and the device form
  const statusCell = (d) => (d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : `${badge("off")}<span class="muted last-seen">Last seen ${esc(d.lastSeen || "—")}</span>`);

  function updateAlertCount() {
    const n = liveMotors().filter((x) => evalMotor(x.m).status !== "ok").length;
    $$("[data-alert-count]").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
    $$("[data-alert-dot]").forEach((el) => (el.hidden = n === 0));
  }

  /* ---------- Shared fragments (readings, stopped-motor list, 3D view) sit with the pages ---------- */

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
      // progress from the same clock as t0 and kept within 0–1, so the number never swings past either value
      const step = () => {
        if (!out.isConnected) return;
        const k = Math.max(0, Math.min(1, (performance.now() - t0) / DUR)), ease = 1 - Math.pow(1 - k, 3);
        out.textContent = (from + (to - from) * ease).toFixed(1);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      setTimeout(() => { if (out.isConnected) out.textContent = to.toFixed(1); }, DUR + 150); // always lands on the reading, even if frames stall
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
    if (!allowed(preset.id ? "motors.update" : "motors.create")) return;
    const cur = preset.id ? findMotor(preset.id) : null;
    const editing = cur && cur.m;
    const fresh = editing && editing.untitled; // switched on without a motor: details are entered for the first time
    const target = !editing && preset.device ? DEVICES.find((x) => x.id === preset.device) || null : null;
    const d = makeDialog("motorDialog", `
      <form id="motorForm" novalidate style="display:contents">
        ${dlgHead(fresh ? "Add motor details" : editing ? `Edit motor ${editing.id}` : "Add motor", fresh ? `Readings are already being recorded under ${editing.id}${cur.d ? ` on ${cur.d.name} ${chLabel(editing)}` : ""} · they stay with the motor.` : editing ? "Update the motor details." : "Register a traction motor with its stator number.")}
        <div class="modal-body">
          <div class="form-error" id="mfError" role="alert"></div>
          <div class="form-grid">
            <div class="field"><label for="mf-id">Motor ID</label><input class="input mono" id="mf-id" name="id" placeholder="TM-0001" required autofocus></div>
            <div class="field"><label for="mf-stator">Stator No.</label><input class="input mono" id="mf-stator" name="stator" placeholder="ST-00001" required autocomplete="off"></div>
            <div class="field"><label for="mf-model">Model / type</label><input class="input" id="mf-model" name="model" placeholder="3-phase AC traction motor"></div>
            <div class="field"><label for="mf-loco">Locomotive</label><input class="input" id="mf-loco" name="loco" placeholder="WAG-9 #31245"></div>
          </div>
          ${target ? `<div class="form-grid" style="margin-top:14px">${testIdField("mf-test", nextTestId())}</div>` : ""}
          ${target ? `<p class="form-note">${ico("cpu")}Will be assigned to <b>${esc(target.name)}</b> and checked straight away on CH ${freeChannel(target)}.</p>` : ""}
        </div>
        <div class="modal-foot"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">${fresh ? "Save details" : editing ? "Save changes" : "Add motor"}</button></div>
      </form>`);
    const f = d.querySelector("#motorForm"), err = d.querySelector("#mfError");
    const clean = (v) => (v === "—" ? "" : v || "");
    if (editing) { f.elements.id.value = fresh ? "" : editing.id; f.elements.stator.value = clean(editing.stator); f.elements.model.value = clean(editing.model); f.elements.loco.value = clean(editing.loco); }
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
      if (target && !freeChannel(target)) return fail(`Both channels on ${target.name} are in use — switch one off first.`);
      const info = { id, stator, model: f.elements.model.value.trim() || "—", loco: f.elements.loco.value.trim() || "—" };
      const LBL = { id: "ID", stator: "stator no.", model: "model", loco: "locomotive" };
      const changes = editing ? Object.keys(LBL).filter((k) => (editing[k] || "—") !== info[k]).map((k) => `${LBL[k]} ${editing[k] || "—"} → ${info[k]}`) : [];
      const oldId = editing && editing.id;
      if (editing) { Object.assign(editing, info); delete editing.untitled; }
      else attachMotor({ ...info }, target, tid.t);
      saveDevices(); saveSpare();
      d.close();
      const mm = target && target.motors.find((x) => x.id === id);
      logActivity(target ? "test" : "motor", fresh ? `Added details for ${oldId} — now motor ${id} (stator ${stator}) · test ${editing.testId || "—"}`
        : editing ? `Edited motor ${id}${changes.length ? ` — ${changes.join(", ")}` : " — no changes"}`
        : target ? `Registered motor ${id} (stator ${stator}) and assigned it to ${target.name} for test ${tid.t} · checking started on ${chLabel(mm)}` : `Registered motor ${id} (stator ${stator}) · not assigned`);
      toast(fresh ? `Details saved · now ${id}` : editing ? `${id} updated` : target ? `${id} added to ${target.name} · ${tid.t} · checking now` :`${id} registered — assign it to a device to start checking`);
      // the motor page is addressed by motor ID: follow a renamed motor there
      if (oldId && oldId !== id && document.body.dataset.page === "motor") { const from = new URLSearchParams(location.search).get("from");
        location.replace(`motor.html?motor=${encodeURIComponent(id)}${from ? `&from=${encodeURIComponent(from)}` : ""}`); return; }
      rerender();
    });
    d.showModal();
  }
  // a device checks at most MAX_RUN motors: explain why nothing more can start on it
  const channelsFull = (d) => confirmDialog({ title: `Both channels on ${d.name} are in use`, message: `${runningOn(d).map((x) => `${x.id} (${chLabel(x)})`).join(" and ")} are being checked now. Switch one of them off, then try again.`, confirmLabel: "OK", danger: false });
  // Assign a motor to a device, move it to another one, or take it off
  // "Assign motor" on a device: search the registered motors and put one on test there
  function pickMotorDialog(deviceId) {
    if (!allowed("motors.update")) return;
    const target = DEVICES.find((x) => x.id === deviceId);
    if (!target) return motorDialog({});
    if (!freeChannel(target)) { channelsFull(target); return; }
    const where = ({ d, m }) => !d ? "Not assigned" : `On ${d.name} · ${isRunning(m) ? `${chLabel(m)} · checking now` : "stopped"}`;
    const order = ({ d, m }) => (!d ? 0 : !isRunning(m) ? 1 : 2); // free motors first
    const pool = () => everyMotor().filter(({ d }) => d !== target).sort((a, b) => order(a) - order(b) || a.m.id.localeCompare(b.m.id));
    const dlg = makeDialog("pickDialog", `
      <form id="pickForm" novalidate style="display:contents">
        ${dlgHead(`Assign a motor to ${target.name}`, `Pick the motor to test · checking starts straight away on CH ${freeChannel(target)}.`)}
        <div class="modal-body">
          <div class="form-error" id="pkError" role="alert"></div>
          <div class="pick-test">${testIdField("pk-test", nextTestId())}</div>
          <label class="pick-label" for="pk-search">Motor to test</label>
          <div class="input-icon"><i data-icon="search"></i>
            <input class="input" id="pk-search" type="search" autocomplete="off" placeholder="Search motor ID, stator no., model or locomotive" aria-label="Search motors"></div>
          <div class="pick-count muted" id="pkCount"></div>
          <ul class="pick-list" id="pkList" role="listbox" aria-label="Motors"></ul>
        </div>
        <div class="modal-foot">${can("motors.create") ? `<button type="button" class="btn btn-ghost" id="pkNew" style="margin-right:auto">${ico("plus")}Register new motor</button>` : ""}<button type="button" class="btn" data-close>Cancel</button></div>
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
        : `<li class="pick-empty">${all.length ? `No motors match “${esc(search.value.trim())}”.` : "No other motors are registered yet."}${can("motors.create") ? ` <button type="button" class="link-btn" data-new>Register a new motor</button>` : ""}</li>`;
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
      logActivity("test", `Assigned ${id} to ${target.name} for test ${tid.t}${cur.d ? ` (moved from ${cur.d.name})` : ""} · checking started on ${chLabel(mm)}`);
      toast(`${id} assigned to ${target.name} · ${tid.t} · checking now`);
      rerender();
    };
    list.addEventListener("click", (ev) => {
      if (ev.target.closest("[data-new]")) { dlg.close(); motorDialog({ device: target.id }); return; }
      const b = ev.target.closest("[data-pick]"); if (b) assign(b.dataset.pick);
    });
    dlg.querySelector("#pkNew")?.addEventListener("click", () => { dlg.close(); motorDialog({ device: target.id }); });
    search.addEventListener("input", draw);
    dlg.querySelector("#pickForm").addEventListener("submit", (ev) => { ev.preventDefault(); const first = list.querySelector("[data-pick]"); if (first) assign(first.dataset.pick); }); // Enter picks the top match
    dlg.querySelector("#pk-test").addEventListener("input", () => dlg.querySelector("#pkError").classList.remove("show"));
    draw();
    dlg.showModal();
    search.focus();
  }

  function assignDialog(id) {
    if (!allowed("motors.update")) return;
    const cur = findMotor(id);
    if (!cur) return;
    const opts = DEVICES.map((x) => {
      const busy = runningOn(x).filter((m) => m !== cur.m).length >= MAX_RUN;
      return `<option value="${esc(x.id)}"${busy && x !== cur.d ? " disabled" : ""}>${esc(x.name)} (${esc(x.id)})${busy && x !== cur.d ? " — both channels in use" : ""}</option>`;
    }).join("");
    const d = makeDialog("assignDialog", `
      <form id="assignForm" novalidate style="display:contents">
        ${dlgHead(`Assign ${cur.m.id}`, `Stator No. ${cur.m.stator || "—"} · choose the device that checks this motor.`)}
        <div class="modal-body">
          <div class="field"><label for="as-dev">Device</label>
            <select class="select" id="as-dev" name="device"><option value="">Not assigned</option>${opts}</select>
            <span class="hint">A device checks up to ${MAX_RUN} motors at a time · switch one off to free a channel</span></div>
          <div class="form-error" id="asError" role="alert" style="margin-top:12px"></div>
          <div id="asTest" style="margin-top:12px">${testIdField("as-test", nextTestId())}</div>
        </div>
        <div class="modal-foot"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
      </form>`);
    const f = d.querySelector("#assignForm"), dev = f.elements.device;
    dev.value = cur.d ? cur.d.id : (DEVICES.find((x) => runningOn(x).length < MAX_RUN) || {}).id || "";
    // a Test ID is only needed when the motor goes onto a (different) device
    const syncTest = () => { d.querySelector("#asTest").hidden = !dev.value || (cur.d && dev.value === cur.d.id); };
    dev.addEventListener("change", syncTest); syncTest();
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = DEVICES.find((x) => x.id === dev.value) || null;
      if (target === cur.d) { d.close(); return; }
      const tid = target ? checkTestId(f.elements.testId.value, cur.m) : {};
      const full = target && !freeChannel(target) && `Both channels on ${target.name} are in use — switch one off first.`;
      if (tid.err || full) { const er = d.querySelector("#asError"); er.textContent = tid.err || full; er.classList.add("show"); return; }
      d.close();
      const oldTest = cur.m.testId;
      detachMotor(cur); attachMotor(cur.m, target, tid.t);
      if (!target) delete cur.m.testId;
      logActivity("test", target ? `Assigned ${cur.m.id} to ${target.name} for test ${tid.t}${cur.d ? ` (moved from ${cur.d.name})` : ""} · checking started on ${chLabel(cur.m)}` : `Unassigned ${cur.m.id} from ${cur.d.name}${oldTest ? ` (test ${oldTest} ended)` : ""}`);
      saveDevices(); saveSpare();
      toast(target ? `${cur.m.id} assigned to ${target.name} · ${tid.t} · checking now` : `${cur.m.id} is no longer assigned`);
      rerender();
    });
    d.showModal();
  }
  // highest readings of the current run
  const runPeak = (m) => { const pts = trendPoints(m), max = (j) => Math.max(...pts.map((p) => p.v[j])); return { de: max(0), nde: max(1), rise: Math.max(...pts.map((p) => hotOf(p.v) - p.v[AMB])) }; };
  // a motor (same stator) can be tested many times: when a run ends for good it goes into the motor's test history
  function archiveRun(m, d) {
    if (!m.testId || !m.trend || !m.trend.length || !m.runStart) return;
    const pk = runPeak(m);
    (m.tests = m.tests || []).unshift({ testId: m.testId, device: d ? d.name : "—", channel: m.channel || null, start: m.runStart, end: m.stoppedAt || Date.now(),
      de: +pk.de.toFixed(1), nde: +pk.nde.toFixed(1), rise: +pk.rise.toFixed(1), result: evalMotor(m).condition,
      // its readings (at most 120, evenly spread over the run) so this test's own report can be downloaded later
      readings: m.trend.filter((_, i, a) => i % Math.ceil(a.length / 120) === 0 || i === a.length - 1).map((p) => [p.t, ...p.v]) });
    if (m.tests.length > 50) m.tests.length = 50;
  }
  // take a motor off its device (or out of the unassigned list); its run so far is kept in its history
  function detachMotor({ d, m }) {
    if (d) { archiveRun(m, d); d.motors = d.motors.filter((x) => x !== m); }
    else SPARE = SPARE.filter((x) => x !== m);
  }
  // put a motor on a device (checking starts now on its free channel — callers check there is one) or into the unassigned list
  function attachMotor(m, d, testId) {
    if (!d) { SPARE.push(spareOf(m)); return; }
    m.testId = useTestId(testId || nextTestId());
    const p = Math.round(44 + Math.random() * 10), ch = freeChannel(d);
    delete m.slot; delete m.stoppedAt; delete m.queued; // a new test on this device
    Object.assign(m, { base: [p, p + 2, Math.round(28 + Math.random() * 4)], runMin: 0.5, tau: 12, active: true, channel: ch });
    seedMotor(m);
    d.motors.push(m);
  }

  // "Switch on" a free channel without picking a motor: readings start at once under a temporary ID,
  // the motor's details are added later (motorDialog clears the "untitled" flag)
  const NEW_ID = "NEW-";
  const nextNewId = () => { let n = 1; while (everyMotor().some(({ m }) => m.id === NEW_ID + String(n).padStart(3, "0"))) n++; return NEW_ID + String(n).padStart(3, "0"); };
  function quickStart(deviceId) {
    if (!allowed("monitoring.create")) return;
    const d = DEVICES.find((x) => x.id === deviceId); if (!d) return;
    if (!d.online) { toast(`${d.name} is offline`); return; }
    if (!freeChannel(d)) { channelsFull(d); return; }
    const m = { id: nextNewId(), stator: "", model: "—", loco: "—", untitled: true };
    attachMotor(m, d, nextTestId());
    saveDevices();
    logActivity("test", `Switched on ${d.name} ${chLabel(m)} without a motor selected · temporary ID ${m.id} · test ${m.testId}`);
    toast(`${d.name} ${chLabel(m)} on · ${m.testId} — add the motor details any time`);
    rerender();
  }

  async function deleteMotor(id) {
    if (!allowed("motors.delete")) return;
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

  const testsText = (m, d) => {
    const n = (m.tests || []).length + (d && m.testId ? 1 : 0), last = (m.tests || [])[0];
    return n ? `${n} test${n === 1 ? "" : "s"}${d && m.testId ? ` · now <span class="mono">${esc(m.testId)}</span>` : ""}${last ? ` · last finished <span class="mono">${esc(last.testId)}</span> (${VERDICT_SHORT[last.result] || "—"})` : ""}` : "Not tested yet";
  };
  function viewMotor(id) {
    const x = findMotor(id);
    if (!x) return;
    const { d, m } = x;
    const e = d ? evalMotor(m) : null;
    const dlg = viewDialog({
      title: m.id, sub: d ? `${d.name} · ${d.location}` : "Not assigned to a device",
      hero: d ? readings(m, d.online) : "",
      rows: [["Condition", d ? verdictPill(d.online ? e.status : "off") : `<span class="verdict-pill off">Not monitored</span>`], ["Stator No.", `<span class="mono">${esc(m.stator || "—")}</span>`], ["Model / type", esc(m.model)], ["Locomotive", esc(m.loco)],
        ["Device", d ? `${esc(d.name)} (${esc(d.id)})` : "Not assigned"], ["Tests", testsText(m, d)], ...(d ? [["Monitoring for", fmtRun(runMinutes(m))], ["Predicted final", e.th && e.th.confident ? `${e.th.finalTemp.toFixed(1)} °C` : "Collecting data"]] : [])],
      actions: `${can("motors.delete") ? `<button type="button" class="btn btn-danger" data-v-del>${ico("trash")}Delete</button>` : ""}${can("motors.update") ? `<button type="button" class="btn" data-v-edit>${ico("edit")}Edit</button>` : ""}${d ? `<a class="btn btn-primary" href="motor.html?motor=${encodeURIComponent(m.id)}${document.body.dataset.page === "motors" ? "&from=motors" : ""}">${ico("activity")}Monitor</a>` : ""}`
    });
    dlg.querySelector("[data-v-edit]")?.addEventListener("click", () => { dlg.close(); motorDialog({ id: m.id }); });
    dlg.querySelector("[data-v-del]")?.addEventListener("click", () => { dlg.close(); deleteMotor(m.id); });
  }

  // Update thresholds (persisted)
  function limitsDialog() {
    if (!allowed("limits.update")) return;
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
      rerender();
    });
    d.showModal();
  }

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
    const qs = e.target.closest("[data-quick-start]");
    if (qs && !qs.disabled) quickStart(qs.dataset.quickStart);
    const tg = e.target.closest("[data-trigger]");
    if (tg && !tg.disabled) toggleMonitoring(tg.dataset.trigger);
  });
  /* =========================================================
     Readings, Dashboard and Motors pages
     ========================================================= */
  const VERDICT_SHORT = { ok: "Good", warn: "Monitor", crit: "Not OK", off: "Offline", stop: "Stopped" };
  // monitoring on/off switch for one motor
  const triggerBtn = (m, d) => {
    const on = m.active !== false;
    return `<button type="button" class="trigger${on ? " on" : ""}" role="switch" aria-checked="${on}" data-trigger="${esc(m.id)}" ${d && !d.online ? "disabled" : ""}
      title="${on ? "Monitoring on — click to stop" : "Monitoring off — click to start a new run"}"><i></i><span>${on ? "On" : "Off"}</span></button>`;
  };
  async function toggleMonitoring(id) {
    if (!allowed("monitoring.update")) return;
    const x = findMotor(id); if (!x || !x.d) return;
    const { d, m } = x, on = m.active !== false;
    if (!d.online) { toast(`${d.name} is offline`); return; }
    if (!on && !freeChannel(d, m)) { await channelsFull(d); return; }
    const ok = await confirmDialog(on
      ? { title: `Stop monitoring ${m.id}?`, message: "Readings stop and the last values and result are kept. Alarms for this motor are paused and its channel is free again.", confirmLabel: "Stop monitoring" }
      : { title: `Start monitoring ${m.id}?`, message: `A new test ${nextTestId()} starts now (${m.testId} and its results go into this motor's test history): readings, trend and heating analysis begin from zero.`, confirmLabel: "Start monitoring", danger: false });
    if (!ok) return;
    if (on) { m.active = false; m.stoppedAt = Date.now(); }
    else { archiveRun(m, d); m.testId = useTestId(nextTestId()); m.channel = freeChannel(d, m); m.active = true; delete m.stoppedAt; m.runMin = 0.05; seedMotor(m); }
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
        <span class="r-sub num">${j === AMB ? "Ambient air" : online ? `Rise ${(v - amb).toFixed(1)} K` : ""}</span>
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

  function runLines(m, mode) {
    const amb = m.live[AMB];
    return mode === "rise"
      ? [{ v: LIMITS.riseWarn, label: `Warning ${LIMITS.riseWarn} K`, cls: "limit-warn" }, { v: LIMITS.riseCrit, label: `Alarm ${LIMITS.riseCrit} K`, cls: "limit" }]
      : [{ v: amb + LIMITS.riseWarn, label: `Warning: ambient + ${LIMITS.riseWarn} K`, cls: "limit-warn" }, { v: amb + LIMITS.riseCrit, label: `Alarm: ambient + ${LIMITS.riseCrit} K`, cls: "limit" }];
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
        <div class="mp-head">
          <div class="mp-id"><b class="ch-tag">${chLabel(m)}</b><b class="mp-name mono">${esc(m.id)}</b></div>
          ${verdictPill(e.status)}
          <div class="mp-meta">${m.untitled ? "Details pending" : esc(m.loco)} · <span class="mono" title="Test ID">${esc(m.testId || "—")}</span></div>
          ${triggerBtn(m, d)}
        </div>
        ${m.untitled ? `<div class="panel-note">${ico("edit")}<span>Reading without motor details</span><button type="button" class="btn btn-sm btn-primary" data-edit-motor="${esc(m.id)}">Add details</button></div>` : ""}
        ${readings(m, true, "panel")}
        ${e.status === "stop" ? `<div class="panel-heat stopped">${ico("pause")}<div class="ph-text"><span>Monitoring stopped${m.stoppedAt ? " at " + new Date(m.stoppedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span><b>Last readings shown</b><small>Switch on to start a new run</small></div><a href="motor.html?motor=${encodeURIComponent(m.id)}">Details →</a></div>` : `<div class="panel-heat">
          ${progressRing(e.th && e.th.confident ? e.th.sensors[e.th.hot].pct : null, e.status === "ok" ? "var(--series-1)" : `var(--${e.status})`, e.th && e.th.confident ? `${Math.round(e.th.sensors[e.th.hot].pct * 100)}%` : "—", "heated", 50)}
          <div class="ph-text">
            <span>${trendText(e)}</span>
            <b class="num">${e.th && e.th.confident ? `Final ≈ ${e.th.finalTemp.toFixed(1)} °C` : "Final: collecting data…"}</b>
            <small class="num">${e.th && e.th.confident ? (e.th.alarmIn != null && e.rise < LIMITS.riseCrit ? `Alarm in about ${fmtMin(e.th.alarmIn)}` : e.th.eq ? "Equilibrium reached" : e.th.eqIn < 1 ? "Settling" : `Equilibrium in about ${fmtMin(e.th.eqIn)}`) : "&nbsp;"}</small>
          </div>
          <a href="motor.html?motor=${encodeURIComponent(m.id)}">Details →</a>
        </div>`}
      </div>`;
  }
  const emptySlot = (d) => `
    <div class="empty-slot">
      <div>${ico("plus")}<div><b>Channel ${freeChannel(d)} is free</b></div><div>Switch on to read temperatures now and add the motor details later, or assign a registered motor</div>
      <div class="slot-btns">
        <button type="button" class="btn btn-sm btn-primary slot-on" data-quick-start="${esc(d.id)}">${ico("power")}Switch on</button>
        <button type="button" class="btn btn-sm" data-add-motor="${esc(d.id)}">Assign motor</button>
      </div></div>
    </div>`;
  // one device: header + its motors (or offline notice); its name opens the device page
  function deviceWidget(d, selectedId, target = false) {
    const cls = `card device-card${target ? " is-target" : ""}" id="dev-${esc(d.id)}`;
    const head = `
      <div class="card-head">
        <div class="device-title"><div class="device-ico">${ico("cpu")}</div><div><h3><a class="dev-link" href="device.html?device=${encodeURIComponent(d.id)}" title="Open ${esc(d.name)}: the device and both motors">${esc(d.name)}</a></h3><div class="sub">${esc(d.id)} · ${esc(d.location)}</div></div></div>
        <div class="mp-actions">${d.online ? `<button type="button" class="btn btn-sm btn-primary slot-on" data-quick-start="${esc(d.id)}" title="${freeChannel(d) ? `Start reading on CH ${freeChannel(d)} now · add the motor details later` : "Both channels are in use — switch one off first"}">${ico("power")}Switch on</button><span class="badge ok"><span class="pulse"></span>Online</span>` : badge("off")}<a class="btn btn-sm" href="device.html?device=${encodeURIComponent(d.id)}">Open device ${ico("chevronRight")}</a></div>
      </div>`;
    if (!d.online) return `<div class="${cls}">${head}<div class="offline-mask">${ico("wifiOff")}<b>Device offline</b><div>Last seen ${esc(d.lastSeen || "—")}</div></div></div>`;
    const cells = runningOn(d).map((m) => motorPanel(d, m, m.id === selectedId));
    if (cells.length < MAX_RUN) cells.push(emptySlot(d));
    return `<div class="${cls}">${head}<div class="motor-slots">${cells.join("")}</div>${deviceStopped(d, selectedId)}</div>`;
  }
  // motors on a device whose check was stopped: last readings / result kept, can be switched on again
  function deviceStopped(d, selectedId) {
    const done = d.motors.filter((m) => !isRunning(m));
    if (!done.length) return "";
    return `<div class="dev-stopped">
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
        <div><span>Motors monitored</span><b class="num">${evals.length}<small> on ${online} of ${DEVICES.length} devices</small></b></div>
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
     Page: Monitor — live widgets for every device; a device opens its own page, a motor opens its page
     ========================================================= */
  function pageMonitor() {
    const q = new URLSearchParams(location.search);
    if (q.get("motor")) { location.replace(`motor.html?motor=${encodeURIComponent(q.get("motor"))}`); return null; } // old links
    let filter = "all";
    // arriving with monitor.html?device=ID: bring that device into view and outline it for a moment
    let target = DEVICES.some((d) => d.id === q.get("device")) ? q.get("device") : null;
    const render = () => {
      const devs = DEVICES.filter((d) => filter === "all" || d.online);
      $("#monitorGrid").innerHTML = devs.length ? devs.map((d) => deviceWidget(d, null, d.id === target)).join("")
        : DEVICES.length ? `<div class="card card-body muted">No devices match this filter.</div>`
        : `<div class="card empty-state">${ico("cpu")}<h3>No devices yet</h3><p>Register a device, then assign motors to it.</p><a class="btn btn-primary" href="devices.html">${ico("plus")}Add device</a></div>`;
      updateAlertCount();
    };
    // click a motor widget (anywhere but its buttons and links) to open the motor's own page
    $("#monitorGrid").addEventListener("click", (ev) => {
      const panel = ev.target.closest("[data-pick-motor]");
      if (!panel || ev.target.closest("button, a")) return;
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

  /* ---------- 3D view (Monitor page and each motor's page) ----------
     One device and the motors on its channels, drawn by a small canvas renderer (no library):
     flat-shaded faces sorted back to front. Drag to turn the camera. While a motor is checked
     its fan spins and pulses run along its cable; the housing colour follows the rise above
     ambient (cool steel → amber → red at the alarm limit). Labels are HTML pinned to 3D points. */
  // details: Wi-Fi / probe / TA labels and motor details with leader lines; fixed: the camera doesn't turn
  function motorScene(el, { details = true, fixed = false } = {}) {
    const cv = document.createElement("canvas"), tags = document.createElement("div");
    tags.className = "scene-tags";
    el.prepend(cv, tags);
    const ctx = cv.getContext("2d");
    const cam = { yaw: 0.78, pitch: 0.62, zoom: 1, auto: false }; // one fixed view: high in the front-right corner, looking down at the equipment
    // no 360°: the camera stays in front of the device, from its left side round to its right side
    const YAW_MAX = 1.57, clampYaw = (y) => Math.max(-YAW_MAX, Math.min(YAW_MAX, Math.atan2(Math.sin(y), Math.cos(y))));
    const TARGET = [0, 14, 2];
    let intro = 1; // one constant view: no fly-in
    let devId = null, focusId = null, solo = false, leds = {}, slots = [], W = 0, H = 0, dpr = 1, last = performance.now(), visible = true, theme = null, themeAt = 0;
    let anchors = []; // 3D point for each label, same order as the label elements

    // vectors
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const unit = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
    const LIGHT = unit([-0.45, 1, 0.65]);
    const rgb = (c, k = 1, a = 1) => `rgba(${Math.round(c[0] * k)},${Math.round(c[1] * k)},${Math.round(c[2] * k)},${a})`;
    const parse = (s, fb) => { s = (s || "").trim(); let m = /^#([0-9a-f]{6})$/i.exec(s); if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)); m = /rgba?\(([^)]+)\)/.exec(s); return m ? m[1].split(",").slice(0, 3).map(Number) : fb; };
    const COL = { body: [44, 56, 78], screen: [12, 22, 30], port: [24, 28, 36], steel: [176, 184, 194], foot: [72, 80, 92], base: [96, 104, 116], cowl: [64, 72, 84], blade: [30, 34, 42], cable: [58, 66, 80], tb: [80, 90, 104], ok: [12, 163, 12], warn: [250, 178, 25], crit: [208, 59, 59], stop: [140, 148, 160], de: [42, 120, 214], nde: [235, 104, 52] };
    const STATUS_C = { ok: COL.ok, warn: COL.warn, crit: COL.crit, stop: COL.stop, off: COL.stop };
    // housing colour from the rise above ambient (grey when not being checked)
    // housing colour from the rise above ambient; a checked (stopped) motor keeps the colour of its last readings, a little muted
    const heat = (m, on) => {
      const rise = hotOf(m.live) - m.live[AMB], w = LIMITS.riseWarn, c = LIMITS.riseCrit;
      const col = rise < w ? mix([92, 122, 158], [190, 170, 110], Math.max(0, (rise - w * 0.5) / (w * 0.5)))
        : mix([214, 160, 60], [214, 66, 52], Math.min(1, (rise - w) / Math.max(1, c - w)));
      return on ? col : mix(col, [150, 156, 166], 0.35);
    };

    // ----- meshes: faces { p: points, n: outward normal, c: colour, bias, paint } -----
    const face = (p, n, c, extra) => ({ p, n, c, ...extra });
    function box(x, y, z, w, h, d, c, out) {
      const X = [x - w / 2, x + w / 2], Y = [y - h / 2, y + h / 2], Z = [z - d / 2, z + d / 2], P = (i, j, k) => [X[i], Y[j], Z[k]];
      out.push(face([P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], [0, 0, 1], c), face([P(1, 0, 0), P(0, 0, 0), P(0, 1, 0), P(1, 1, 0)], [0, 0, -1], c),
        face([P(1, 0, 1), P(1, 0, 0), P(1, 1, 0), P(1, 1, 1)], [1, 0, 0], c), face([P(0, 0, 0), P(0, 0, 1), P(0, 1, 1), P(0, 1, 0)], [-1, 0, 0], c),
        face([P(0, 1, 1), P(1, 1, 1), P(1, 1, 0), P(0, 1, 0)], [0, 1, 0], c), face([P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], [0, -1, 0], c));
    }
    // cylinder along x between a and b; fins = raised rings for the cooling fins
    function cyl(a, b, y, z, r, c, out, fins = 0, sides = 18) {
      const x0 = Math.min(a, b), x1 = Math.max(a, b), segs = fins ? fins * 2 + 1 : 1, step = (x1 - x0) / segs;
      const rad = (s) => (fins && s % 2 ? r * 1.09 : r);
      const pt = (x, rr, k) => { const t = (k / sides) * Math.PI * 2; return [x, y + rr * Math.cos(t), z + rr * Math.sin(t)]; };
      for (let s = 0; s < segs; s++) {
        const xa = x0 + s * step, xb = xa + step, rr = rad(s);
        for (let k = 0; k < sides; k++) { const t = ((k + 0.5) / sides) * Math.PI * 2; out.push(face([pt(xa, rr, k), pt(xb, rr, k), pt(xb, rr, k + 1), pt(xa, rr, k + 1)], [0, Math.cos(t), Math.sin(t)], c)); }
        if (s < segs - 1) { const r2 = rad(s + 1), nx = r2 > rr ? -1 : 1; for (let k = 0; k < sides; k++) out.push(face([pt(xb, rr, k), pt(xb, r2, k), pt(xb, r2, k + 1), pt(xb, rr, k + 1)], [nx, 0, 0], c)); }
      }
      out.push(face(Array.from({ length: sides }, (_, k) => pt(x0, rad(0), k)), [-1, 0, 0], c), face(Array.from({ length: sides }, (_, k) => pt(x1, rad(segs - 1), k)), [1, 0, 0], c));
    }
    // cylinder along z between a and b (the motors lie with their shaft towards the viewer)
    function cylZ(a, b, x, y, r, c, out, fins = 0, sides = 18) {
      const z0 = Math.min(a, b), z1 = Math.max(a, b), segs = fins ? fins * 2 + 1 : 1, step = (z1 - z0) / segs;
      const rad = (s) => (fins && s % 2 ? r * 1.09 : r);
      const pt = (z, rr, k) => { const t = (k / sides) * Math.PI * 2; return [x + rr * Math.cos(t), y + rr * Math.sin(t), z]; };
      for (let s = 0; s < segs; s++) {
        const za = z0 + s * step, zb = za + step, rr = rad(s);
        for (let k = 0; k < sides; k++) { const t = ((k + 0.5) / sides) * Math.PI * 2; out.push(face([pt(za, rr, k), pt(zb, rr, k), pt(zb, rr, k + 1), pt(za, rr, k + 1)], [Math.cos(t), Math.sin(t), 0], c)); }
        if (s < segs - 1) { const r2 = rad(s + 1), nz = r2 > rr ? -1 : 1; for (let k = 0; k < sides; k++) out.push(face([pt(zb, rr, k), pt(zb, r2, k), pt(zb, r2, k + 1), pt(zb, rr, k + 1)], [0, 0, nz], c)); }
      }
      out.push(face(Array.from({ length: sides }, (_, k) => pt(z0, rad(0), k)), [0, 0, -1], c), face(Array.from({ length: sides }, (_, k) => pt(z1, rad(segs - 1), k)), [0, 0, 1], c));
    }
    const R = 13, MY = 8 + R, L = 46; // motor radius, axis height, length
    // the two channels side by side in a straight line; each motor's shaft (drive end) points at the viewer, fan end towards the device
    const SLOT = { 1: { x: -38, z: 26, out: -1 }, 2: { x: 38, z: 26, out: 1 } };
    // a probe on top of the housing: DE (j = 0) near the shaft, NDE (j = 1) near the fan
    const probeAt = (ch, j) => [SLOT[ch].x, MY + R + 3, SLOT[ch].z + (j === 0 ? 1 : -1) * (L / 2 - 7)];
    // the device's 5 terminals: 2 per motor (DE, NDE) and 1 for the ambient sensor
    const TERMS = [{ ch: 1, j: 0, x: -24, label: "1 DE" }, { ch: 1, j: 1, x: -12, label: "1 NDE" }, { ta: true, x: 0, label: "TA" }, { ch: 2, j: 1, x: 12, label: "2 NDE" }, { ch: 2, j: 0, x: 24, label: "2 DE" }];
    const termAt = (t) => [t.x, 10, -28];
    const ANT_TIP = [26, 60.5, -48], TA_AT = [-41.5, 29.5, -42];
    const shown = () => (solo ? slots.map((x) => x.ch) : CHANNELS);

    function motorMesh(s, t, out) {
      const { x, z } = SLOT[s.ch], m = s.m, c = heat(m, s.on);
      const zF = z + L / 2, zB = z - L / 2, zC = zB - 7; // drive end (front), fan end (back), fan cowl
      box(x, 1, z, 36, 2, 64, COL.base, out);
      box(x, 5, z - 14, 26, 8, 7, COL.foot, out); box(x, 5, z + 14, 26, 8, 7, COL.foot, out);
      cylZ(zB, zF, x, MY, R, c, out, 5);
      cylZ(zC, zB, x, MY, R * 1.02, COL.cowl, out);
      cylZ(zF, zF + 13, x, MY, 2.6, COL.steel, out, 0, 10); // shaft, towards the viewer
      const ka = s.fan * 0.8; box(x + 2.5 * Math.cos(ka), MY + 2.5 * Math.sin(ka), zF + 8, 1.5, 1.5, 8, COL.blade, out); // shaft key
      box(x, MY + R + 4, z, 13, 8, 13, COL.tb, out); // terminal box
      const de = probeAt(s.ch, 0), nde = probeAt(s.ch, 1);
      box(de[0], de[1] - 1.4, de[2], 4, 3, 4, COL.de, out); box(nde[0], nde[1] - 1.4, nde[2], 4, 3, 4, COL.nde, out);
      // fan blades behind the cowl, turning while the motor is checked
      const zc = zC - 0.4;
      for (let i = 0; i < 7; i++) {
        const a = s.fan + (i * Math.PI * 2) / 7, p = (rr, da) => [x + rr * Math.cos(a + da), MY + rr * Math.sin(a + da), zc];
        out.push(face([p(3, -0.22), p(R * 0.86, -0.12), p(R * 0.86, 0.12), p(3, 0.22)], [0, 0, -1], COL.blade, { bias: 1 }));
      }
    }
    function deviceMesh(d, t, out) {
      box(0, 22, -42, 66, 44, 26, COL.body, out);
      box(26, 51, -48, 2, 14, 2, COL.foot, out); box(26, 58.5, -48, 3.4, 3, 3.4, COL.crit, out); // antenna
      box(-37, 40, -42, 9, 2, 3, COL.foot, out); box(-41.5, 35, -42, 3, 10, 3, COL.steel, out); // TA sensor in the air beside the device
      const fz = -28.7;
      // screen: live temperature per channel, drawn on the face itself
      out.push(face([[-26, 25, fz], [26, 25, fz], [26, 40, fz], [-26, 40, fz]], [0, 0, 1], COL.screen, { bias: 1, paint: screenText }));
      // terminal names under the screen
      out.push(face([[-31, 17.5, fz], [31, 17.5, fz], [31, 21.5, fz], [-31, 21.5, fz]], [0, 0, 1], COL.body, { bias: 1, paint: termText }));
      // the 5 terminals, each with a status light: its channel's condition, or the ambient sensor
      TERMS.forEach((tm) => {
        box(tm.x, 10, -28, 6, 5, 2, COL.port, out);
        const st = tm.ta ? (d.online ? "amb" : null) : leds[tm.ch], lc = st === "amb" ? [138, 143, 152] : st ? STATUS_C[st] : [70, 78, 92];
        const blink = st && st !== "off" ? 0.75 + 0.25 * Math.sin(t / 220 + tm.x) : 1;
        out.push(face([[tm.x - 1.8, 14, fz], [tm.x + 1.8, 14, fz], [tm.x + 1.8, 16.4, fz], [tm.x - 1.8, 16.4, fz]], [0, 0, 1], lc.map((v) => v * blink), { bias: 1, glow: !!st }));
      });
    }
    function termText(pp) {
      const [p0, p1, , p3] = pp, Wd = 124, Hd = 8;
      ctx.save();
      ctx.setTransform(dpr * (p1.x - p0.x) / Wd, dpr * (p1.y - p0.y) / Wd, dpr * (p0.x - p3.x) / Hd, dpr * (p0.y - p3.y) / Hd, dpr * p3.x, dpr * p3.y);
      ctx.font = "700 4.2px system-ui, sans-serif"; ctx.fillStyle = "rgba(226,232,240,.9)"; ctx.textAlign = "center";
      TERMS.forEach((tm) => ctx.fillText(tm.label, ((tm.x + 31) / 62) * Wd, 6));
      ctx.restore();
    }
    // device screen text, mapped onto the projected screen with an affine transform
    function screenText(pp) {
      const [p0, p1, , p3] = pp, Wd = 104, Hd = 30; // p0 bottom-left, p1 bottom-right, p3 top-left
      ctx.save();
      ctx.setTransform(dpr * (p1.x - p0.x) / Wd, dpr * (p1.y - p0.y) / Wd, dpr * (p0.x - p3.x) / Hd, dpr * (p0.y - p3.y) / Hd, dpr * p3.x, dpr * p3.y);
      ctx.font = "700 7px ui-monospace, Consolas, monospace"; ctx.fillStyle = "#3ee07a";
      shown().forEach((ch, i) => {
        const s = slots.find((x) => x.ch === ch);
        ctx.fillText(s ? `CH${ch} ${s.m.id.slice(0, 9).padEnd(9)} ${hotOf(s.m.live).toFixed(1)}°` : `CH${ch} free`, 5, 11 + i * 11);
      });
      ctx.restore();
    }

    // ----- camera & projection -----
    function camera() {
      const k = 1 - Math.pow(1 - intro, 3), yaw = cam.yaw - (1 - k) * 0.7, pitch = cam.pitch + (1 - k) * 0.35; // fly-in: wider and higher, easing in
      const D = Math.max(170, (92 * H * 0.92) / (0.45 * W)) / (cam.zoom * (solo ? 1.02 : 1) * (0.55 + 0.45 * k)); // a single motor is shown closer
      const pos = [TARGET[0] + D * Math.sin(yaw) * Math.cos(pitch), TARGET[1] + D * Math.sin(pitch), TARGET[2] + D * Math.cos(yaw) * Math.cos(pitch)];
      const f = unit(sub(TARGET, pos)), r = unit(cross(f, [0, 1, 0])), u = cross(r, f), F = H * 0.92; // a slightly wide lens
      return { pos, project: (p) => { const v = sub(p, pos), z = dot(v, f); return { x: W / 2 + (dot(v, r) * F) / z, y: H / 2 - (dot(v, u) * F) / z, z }; } };
    }
    const path = (pp) => { ctx.beginPath(); pp.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y))); ctx.closePath(); };

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1); W = el.clientWidth; H = el.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    }
    function readTheme() {
      const cs = getComputedStyle(document.documentElement);
      theme = { wifi: parse(cs.getPropertyValue("--primary"), [31, 95, 191]), focus: cs.getPropertyValue("--primary").trim() || "#1f5fbf", floor: parse(cs.getPropertyValue("--surface-2"), [247, 249, 251]), grid: parse(cs.getPropertyValue("--border"), [226, 231, 238]), text: parse(cs.getPropertyValue("--text-2"), [71, 85, 105]) };
    }

    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (intro < 1) intro = Math.min(1, intro + dt / 1.3);
      if (!visible || document.hidden || !W) return;
      if (now - themeAt > 1000) { readTheme(); themeAt = now; }
      if (cam.auto && !drag) cam.yaw += dt * 0.12;
      if (goal && !drag) { const k = Math.min(1, dt * 6); cam.yaw += (goal.yaw - cam.yaw) * k; cam.pitch += (goal.pitch - cam.pitch) * k; if (Math.abs(goal.yaw - cam.yaw) + Math.abs(goal.pitch - cam.pitch) < 0.002) goal = null; }
      slots.forEach((s) => { if (s.on && !calm.matches) s.fan += dt * 9; });
      const { pos, project } = camera();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = "round";
      // floor with a grid, then soft shadows under each object
      const fl = (x, z) => project([x, 0, z]);
      path([fl(-120, -90), fl(120, -90), fl(120, 90), fl(-120, 90)]); ctx.fillStyle = rgb(theme.floor); ctx.fill();
      ctx.strokeStyle = rgb(theme.grid); ctx.lineWidth = 1;
      for (let g = -120; g <= 120; g += 20) { ctx.beginPath(); const a = fl(g, -90), b = fl(g, 90); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      for (let g = -90; g <= 90; g += 20) { ctx.beginPath(); const a = fl(-120, g), b = fl(120, g); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      const shadow = (x, z, rx, rz) => { path(Array.from({ length: 24 }, (_, k) => fl(x + rx * Math.cos((k / 24) * Math.PI * 2), z + rz * Math.sin((k / 24) * Math.PI * 2)))); ctx.fillStyle = "rgba(15,23,42,.12)"; ctx.fill(); };
      shadow(4, -38, 44, 20);
      shown().forEach((ch) => {
        const s = slots.find((x) => x.ch === ch), { x, z } = SLOT[ch];
        if (s) shadow(x + 3, z + 2, 24, 40);
        if (s && s.m.id === focusId && !solo) { // the motor this page is about: a ring on the floor
          path(Array.from({ length: 36 }, (_, k) => fl(x + 30 * Math.cos((k / 36) * Math.PI * 2), z + 46 * Math.sin((k / 36) * Math.PI * 2))));
          ctx.strokeStyle = theme.focus; ctx.lineWidth = 2.5; ctx.setLineDash([]); ctx.stroke();
        }
        if (!s) { // free channel: dashed pad where a motor would stand
          path([fl(x - 19, z - 32), fl(x + 19, z - 32), fl(x + 19, z + 32), fl(x - 19, z + 32)]);
          ctx.setLineDash([6, 5]); ctx.strokeStyle = rgb(theme.text, 1, 0.6); ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
        }
      });
      // everything else, back to front
      const faces = [], d = DEVICES.find((x) => x.id === devId);
      if (d) { deviceMesh(d, now, faces); slots.forEach((s) => motorMesh(s, now, faces)); }
      const items = [];
      faces.forEach((fc) => {
        const cen = fc.p.reduce((a, p) => [a[0] + p[0] / fc.p.length, a[1] + p[1] / fc.p.length, a[2] + p[2] / fc.p.length], [0, 0, 0]);
        if (dot(fc.n, sub(pos, cen)) <= 0) return; // facing away
        const pp = fc.p.map(project);
        if (pp.some((q) => q.z < 1)) return;
        const k = 0.52 + 0.48 * Math.max(0, dot(fc.n, LIGHT));
        items.push({ z: pp.reduce((a, q) => a + q.z, 0) / pp.length - (fc.bias || 0), draw: () => {
          path(pp); ctx.fillStyle = ctx.strokeStyle = rgb(fc.c, fc.glow ? 1.15 : k); ctx.lineWidth = 0.6; ctx.fill(); ctx.stroke();
          if (fc.paint) fc.paint(pp);
        } });
      });
      // cables: each terminal wired to its probe (2 per motor) and to the ambient sensor; a pulse runs along while readings come in
      const wire = (p0, c1, c2, p3, live, col, phase) => {
        const at = (t) => [0, 1, 2].map((j) => (1 - t) ** 3 * p0[j] + 3 * (1 - t) ** 2 * t * c1[j] + 3 * (1 - t) * t * t * c2[j] + t ** 3 * p3[j]);
        const pts = Array.from({ length: 25 }, (_, k) => project(at(k / 24)));
        for (let k = 0; k < 24; k++) {
          const a = pts[k], b = pts[k + 1];
          items.push({ z: (a.z + b.z) / 2, draw: () => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = rgb(COL.cable); ctx.lineWidth = Math.max(2.2, (3.4 * H * 1.15) / ((a.z + b.z) / 2)); ctx.lineCap = "round"; ctx.stroke(); } });
        }
        if (live && !calm.matches) {
          const q = project(at(((now / 1500) + phase) % 1));
          items.push({ z: q.z - 2, draw: () => { ctx.beginPath(); ctx.arc(q.x, q.y, Math.max(2.2, (2.8 * H) / q.z), 0, Math.PI * 2); ctx.fillStyle = rgb(col, 1.1); ctx.shadowColor = rgb(col); ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0; } });
        }
      };
      TERMS.forEach((tm, i) => {
        const p0 = termAt(tm);
        if (tm.ta) { if (d) wire(p0, [p0[0], 1, p0[2] + 14], [TA_AT[0] + 6, 1, TA_AT[2] + 16], TA_AT, d.online, [138, 143, 152], 0.2); return; }
        const s = slots.find((x) => x.ch === tm.ch); if (!s) return;
        const p3 = probeAt(tm.ch, tm.j), side = SLOT[tm.ch].out;
        wire(p0, [p0[0], 1, p0[2] + 18], [p3[0] + side * 17, 1, p3[2]], p3, s.on, tm.j === 0 ? COL.de : COL.nde, i * 0.23);
      });
      items.sort((a, b) => b.z - a.z).forEach((it) => it.draw());
      if (!calm.matches) slots.forEach((sl, i) => {
        if (!sl.on) return;
        const { x, z } = SLOT[sl.ch], ph = ((now + i * 400) % STEP_MS) / STEP_MS;
        [[probeAt(sl.ch, 0), COL.de], [probeAt(sl.ch, 1), COL.nde]].forEach(([pt, col]) => {
          const q = project(pt);
          ctx.beginPath(); ctx.arc(q.x, q.y, 3 + ph * 16, 0, Math.PI * 2); ctx.strokeStyle = rgb(col, 1, 0.75 * (1 - ph)); ctx.lineWidth = 2; ctx.stroke();
        });
        const rise = hotOf(sl.m.live) - sl.m.live[AMB];
        if (rise >= LIMITS.riseWarn * 0.85) { // heat shimmer: wavy lines rising off the housing
          const strength = Math.min(1, (rise - LIMITS.riseWarn * 0.85) / (LIMITS.riseCrit - LIMITS.riseWarn * 0.85 + 1) + 0.35);
          [-12, 0, 12].forEach((off, j) => {
            const t0 = ((now / 1600) + j * 0.33) % 1;
            ctx.beginPath();
            for (let k = 0; k <= 12; k++) {
              const h = k / 12, q = project([x + Math.sin(now / 260 + k * 0.9 + j) * 1.6, MY + R + 6 + (t0 * 10) + h * 18, z + off]);
              k ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
            }
            ctx.strokeStyle = rgb(COL.crit, 1, strength * 0.55 * Math.sin(Math.PI * t0)); ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
          });
        }
      });
      // Wi-Fi: waves from the antenna while the device is online
      const dv = DEVICES.find((x) => x.id === devId);
      if (dv && dv.online) {
        const tip = project(ANT_TIP), k0 = calm.matches ? 0.15 : (now / 1700) % 1;
        for (let k = 0; k < 3; k++) {
          const f = (k / 3 + k0) % 1;
          ctx.beginPath(); ctx.arc(tip.x, tip.y - 4, 7 + f * 26, -Math.PI * 0.78, -Math.PI * 0.22);
          ctx.strokeStyle = rgb(theme.wifi, 1, 0.85 * (1 - f)); ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.stroke();
        }
      }
      // labels sit beside their part (outward for each motor) and a leader line joins them
      const mid = anchors[0] ? project(anchors[0].p).x : W / 2, links = [], placed = [];
      [...tags.children].forEach((t, i) => {
        const a = anchors[i], tw = t.offsetWidth, th = t.offsetHeight;
        if (!a || !tw) return; // hidden (details off)
        const q = project(a.p), out = a.side || (q.x < mid ? -1 : 1);
        const left = Math.max(6, Math.min(W - tw - 6, q.x + a.dx * out - tw / 2));
        let top = Math.max(6, Math.min(H - th - 6, q.y + a.dy - th / 2));
        // never cover a label placed before this one: step below it, or above when there's no room below
        for (let pass = 0; pass < 3; pass++) placed.forEach((r) => {
          if (left < r.l + r.w + 4 && left + tw + 4 > r.l && top < r.t + r.h + 4 && top + th + 4 > r.t) top = r.t + r.h + 4 + th <= H - 6 ? r.t + r.h + 4 : Math.max(6, r.t - th - 4);
        });
        placed.push({ l: left, t: top, w: tw, h: th });
        t.style.transform = `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px)`;
        if (a.line) links.push({ q, x: Math.max(left, Math.min(left + tw, q.x)), y: Math.max(top, Math.min(top + th, q.y)), a });
      });
      links.forEach(({ q, x, y, a }) => {
        const col = a.color === "wifi" ? rgb(theme.wifi) : a.color || rgb(theme.text, 1, 0.75);
        ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(x, y);
        ctx.strokeStyle = col; ctx.lineWidth = 1.5;
        if (a.wireless) { ctx.setLineDash([5, 4]); ctx.lineDashOffset = calm.matches ? 0 : -now / 50; } // data going out over Wi-Fi
        ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(q.x, q.y, 3.6, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
      });
    }

    // ----- data: which motors are on the device's channels; labels -----
    // a label: html, its 3D point p, offset dx (outward, × side) / dy in px, line = leader line to the point
    function refresh() {
      const d = DEVICES.find((x) => x.id === devId);
      const prev = Object.fromEntries(slots.map((s) => [s.m.id, s.fan]));
      slots = d ? runningOn(d).filter((m) => m.channel).map((m) => ({ ch: m.channel, m, on: d.online, st: d.online ? evalMotor(m).status : "off", fan: prev[m.id] || 0 })) : [];
      leds = Object.fromEntries(slots.map((x) => [x.ch, x.st]));
      if (solo) { // a motor's own page: only that motor; a stopped one stands grey on the channel it was last on
        const m = d && d.motors.find((x) => x.id === focusId);
        slots = m ? [{ ch: m.channel || 1, m, on: d.online && isRunning(m), st: !d.online ? "off" : evalMotor(m).status, fan: prev[m.id] || 0 }] : [];
      }
      const fs = slots.find((x) => x.m.id === focusId);
      TARGET[0] = fs ? SLOT[fs.ch].x * (solo ? 0.62 : 0.4) : 0;
      if (!d) { tags.innerHTML = ""; anchors = []; return; }
      const one = solo && slots[0], list = [];
      const add = (html, p, dx, dy, opt = {}) => list.push({ html, a: { p, dx, dy, ...opt } });
      add(`<div class="scene-tag dev"><b>${esc(d.name)}</b><span>${esc(d.id)} · ${!d.online ? "offline" : one ? `${one.on ? "" : "was "}CH ${one.ch}` : `${slots.length} of ${MAX_RUN} channels in use`}</span></div>`, [0, 44, -42], 0, -46, { side: 1, line: true });
      // Wi-Fi link: antenna → network details
      add(`<div class="scene-tag net detail"><b>${ico(d.online ? "wifi" : "wifiOff")}Wi-Fi · ${d.online ? "connected" : "offline"}</b><span class="net-sig">${signalBars(d.online ? d.signal || 0 : 0)} IP <span class="mono">${esc(d.ip)}</span></span><span>Firmware v${esc(d.fw || "2.4.1")} · sample every ${STEP_MS / 1000} s</span></div>`,
        ANT_TIP, 150, -22, { side: 1, line: true, wireless: true, color: "wifi" });
      // ambient air sensor
      const ta = (one || slots[0] || {}).m;
      add(`<div class="scene-tag mini ta"><b>TA ${ta && d.online ? ta.live[AMB].toFixed(1) + " °C" : "—"}</b><span>ambient air</span></div>`, TA_AT, 70, 34, { side: -1, line: true, color: rgb([138, 143, 152]) });
      shown().forEach((ch) => {
        const s = slots.find((x) => x.ch === ch), { x, z } = SLOT[ch], side = SLOT[ch].out;
        if (!s) {
          add(`<div class="scene-tag free"><b>CH ${ch} free</b>${d.online ? `<button type="button" class="btn btn-sm btn-primary slot-on" data-quick-start="${esc(d.id)}">${ico("power")}Switch on</button>` : ""}</div>`, [x, 6, z], 0, -16, { side: 1 });
          return;
        }
        const m = s.m, e = evalMotor(m), live = d.online, v = (j) => (live ? `${m.live[j].toFixed(1)} °C` : "—");
        // motor details: terminal box → card
        add(`<a class="scene-tag ${s.st}${m.id === focusId ? " is-focus" : ""}" href="motor.html?motor=${encodeURIComponent(m.id)}" title="Open ${esc(m.id)}">
          <b>${s.on || !solo ? "" : "Stopped · "}CH ${ch} · ${esc(m.id)}</b>
          <span class="x">${m.untitled ? "Details pending — add the motor details" : `${esc(m.model)} · ${esc(m.loco)}`}</span>
          <span class="x">${m.untitled ? "No stator no. yet" : `Stator <span class="mono">${esc(m.stator || "—")}</span>`} · <span class="mono">${esc(m.testId || "—")}</span> · ${fmtRun(runMinutes(m))}</span>
          <span class="x">Rise ${live ? e.rise.toFixed(1) : "—"} K above ambient</span>${verdictPill(s.st)}</a>`,
          [x, MY + R + 8, z], 120, -62, { line: true, color: rgb(STATUS_C[s.st]) });
        // probes: DE at the drive (shaft) end, NDE at the fan end
        add(`<div class="scene-tag mini de detail"><b class="${live ? tCls(m.live[0], 0, m.live[AMB]) : ""}">DE ${v(0)}</b><span>drive end</span></div>`, probeAt(ch, 0), 70, 46, { side, line: true, color: rgb(COL.de) });
        add(`<div class="scene-tag mini nde detail"><b class="${live ? tCls(m.live[1], 1, m.live[AMB]) : ""}">NDE ${v(1)}</b><span>non-drive end</span></div>`, probeAt(ch, 1), 86, -26, { side, line: true, color: rgb(COL.nde) });
      });
      anchors = list.map((x) => x.a);
      tags.innerHTML = list.map((x) => x.html).join("");
    }

    // ----- controls: drag to turn; buttons zoom / reset / auto-turn -----
    let drag = null, goal = null;
    cv.addEventListener("pointerdown", (e) => {
      if (fixed) return;
      goal = null; drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; cv.setPointerCapture(e.pointerId); el.classList.add("is-dragging"); });
    cv.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      cam.yaw = clampYaw(cam.yaw - (e.clientX - drag.x) * 0.008); cam.pitch = Math.max(0.08, Math.min(1.25, cam.pitch + (e.clientY - drag.y) * 0.006));
      drag.x = e.clientX; drag.y = e.clientY;
      if (cam.auto) setAuto(false);
    });
    const end = () => { drag = null; el.classList.remove("is-dragging"); };
    cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
    const tools = el.querySelector(".scene-tools");
    const setAuto = (on) => { cam.auto = on; const b = tools && tools.querySelector("[data-scene=auto]"); if (!b) return; b.innerHTML = ico(on ? "pause" : "play"); b.setAttribute("aria-label", on ? "Stop turning" : "Turn slowly"); b.title = b.getAttribute("aria-label"); };
    if (tools) tools.addEventListener("click", (e) => {
      const b = e.target.closest("[data-scene]"); if (!b) return;
      const a = b.dataset.scene;
      if (a === "in") cam.zoom = Math.min(2.2, cam.zoom * 1.2);
      if (a === "out") cam.zoom = Math.max(0.6, cam.zoom / 1.2);
      if (a === "reset") { goal = { yaw: 0.22, pitch: 0.44 }; cam.zoom = 1; }
      if (a === "auto") setAuto(!cam.auto);
      saveView();
    });
    setAuto(cam.auto);
    el.classList.toggle("compact", !details); // overview: device + motors only

    // ----- customise the view: preset angles, step turning, which labels to show (remembered per page) -----
    const VIEW_KEY = `tt-view-${el.id}`, saved = store.get(VIEW_KEY, null);
    const VIEWS = { angle: ["3/4", 0.22, 0.44], front: ["Front", 0, 0.16], side: ["Side", 1.5, 0.2], top: ["Top", 0.001, 1.25] };
    const LAYERS = details ? [["net", "Wi-Fi"], ["probe", "DE / NDE"], ["ta", "Ambient"], ["info", "Motor details"]] : [["ta", "Ambient"]];
    const hidden = new Set((saved && saved.hidden) || []);
    if (!fixed && saved && saved.yaw != null) { cam.yaw = clampYaw(saved.yaw); cam.pitch = saved.pitch; cam.zoom = saved.zoom || 1; setAuto(false); }
    function saveView() { store.set(VIEW_KEY, { yaw: goal ? goal.yaw : cam.yaw, pitch: goal ? goal.pitch : cam.pitch, zoom: cam.zoom, hidden: [...hidden] }); }
    const bar = document.createElement("div");
    bar.className = "scene-bar";
    // with a fixed camera only the label switches are offered
    bar.innerHTML = (fixed ? "" : `<div class="sb-group" role="group" aria-label="Camera angle"><span>View</span>${Object.entries(VIEWS).map(([k, [l]]) => `<button type="button" class="sb-btn" data-view="${k}">${l}</button>`).join("")}</div>
      <div class="sb-group" role="group" aria-label="Turn the view">${[["left", "chevronLeft", "Turn left"], ["right", "chevronRight", "Turn right"], ["up", "chevronUp", "Tilt up"], ["down", "chevronDown", "Tilt down"]].map(([k, i, l]) => `<button type="button" class="sb-btn icon" data-turn="${k}" aria-label="${l}" title="${l}">${ico(i)}</button>`).join("")}</div>`) + `
      <div class="sb-group sb-layers" role="group" aria-label="Labels to show"><span>Show</span>${LAYERS.map(([k, l]) => `<button type="button" class="sb-chip" data-layer="${k}">${l}</button>`).join("")}</div>`;
    el.before(bar);
    const applyLayers = () => {
      LAYERS.forEach(([k]) => el.classList.toggle(`hide-${k}`, hidden.has(k)));
      $$("[data-layer]", bar).forEach((b) => { const on = !hidden.has(b.dataset.layer); b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); b.title = `${on ? "Hide" : "Show"} ${b.textContent}`; });
    };
    bar.addEventListener("click", (e) => {
      const v = e.target.closest("[data-view]"), t = e.target.closest("[data-turn]"), l = e.target.closest("[data-layer]");
      if (v) { const [, yaw, pitch] = VIEWS[v.dataset.view]; goal = { yaw: clampYaw(yaw), pitch }; setAuto(false); }
      if (t) {
        const g = goal || { yaw: cam.yaw, pitch: cam.pitch }, dir = t.dataset.turn;
        goal = { yaw: clampYaw(g.yaw + (dir === "left" ? 0.4 : dir === "right" ? -0.4 : 0)), pitch: Math.max(0.08, Math.min(1.25, g.pitch + (dir === "up" ? 0.15 : dir === "down" ? -0.15 : 0))) };
        setAuto(false);
      }
      if (l) { const k = l.dataset.layer; if (hidden.has(k)) hidden.delete(k); else hidden.add(k); applyLayers(); }
      if (v || t || l) saveView();
    });
    cv.addEventListener("pointerup", () => { if (!fixed) saveView(); });
    applyLayers();
    el.classList.toggle("fixed", fixed);
    new ResizeObserver(resize).observe(el);
    if (window.IntersectionObserver) new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(el);
    resize(); readTheme();
    requestAnimationFrame(frame);
    return { show(id, focus, only = false) { if (id !== devId && !calm.matches && !fixed) intro = 0; devId = id; focusId = focus || null; solo = only && !!focusId; refresh(); }, refresh, get device() { return devId; }, get focus() { return focusId; } };
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
  // a motor's tests: the current run first, then the earlier ones; and the rows of the Test history table
  const testRuns = (d, m, e) => [...(m.testId ? [{ cur: true, testId: m.testId, device: d.name, channel: m.channel, start: m.runStart, end: isRunning(m) ? null : m.stoppedAt || null, ...runPeak(m), result: isRunning(m) ? null : e.condition }] : []), ...(m.tests || [])];
  const testRowsHtml = (m, runs) => runs.map((r) => `<tr${r.cur ? ' class="is-current"' : ""}>
        <td class="lead-cell" data-label="Test ID"><b class="mono">${esc(r.testId)}</b>${r.cur ? ` ${badge(isRunning(m) ? "ok" : "stop", isRunning(m) ? "Current · running" : "Current · stopped")}` : ""}</td>
        <td data-label="Device">${esc(r.device)}${r.channel ? ` · CH ${r.channel}` : ""}</td>
        <td data-label="Started">${esc(repStamp(r.start))}</td>
        <td data-label="Duration" class="num">${fmtRun(((r.end || Date.now()) - r.start) / 60000)}</td>
        <td data-label="Max DE °C" class="num">${r.de.toFixed(1)}</td>
        <td data-label="Max NDE °C" class="num">${r.nde.toFixed(1)}</td>
        <td data-label="Max rise K" class="num">${r.rise.toFixed(1)}</td>
        <td data-label="Result">${r.result ? verdictPill(r.result) : '<span class="muted">In progress</span>'}</td>
        <td data-label="Results" class="hist-dl"><button type="button" class="btn btn-sm" data-dl-test="${esc(r.testId)}" data-dl-motor="${esc(m.id)}" title="Download the results of test ${esc(r.testId)}">${ico("download")}<span>Download</span></button></td>
      </tr>`).join("");
  // statsEl: where the overall min / average / max go (the motor page's strip by default)
  function aggChart(el, m, stepMin, statsEl = $("#aggStats")) {
    const B = aggBuckets(m, stepMin);
    if (!B.length) { el.innerHTML = '<p class="muted">Collecting data.</p>'; return; }
    // nested bars: one bar per interval with DE, NDE and TA inside each other — the highest average is the widest
    // bar at the back, the lowest the narrowest in front — and each value beside the bar, level with its top
    const W = Math.max(el.clientWidth, 300), H = 280, M = { t: 14, r: 12, b: 30, l: 40 };
    const vals = B.flatMap((b) => b.s.map((a) => a.avg));
    const lo = Math.max(0, Math.floor((Math.min(...vals) - 12) / 10) * 10), hi = Math.ceil((Math.max(...vals) + 4) / 10) * 10;
    const y = (v) => M.t + ((hi - v) / (hi - lo || 1)) * (H - M.t - M.b);
    const gw = (W - M.l - M.r) / B.length, showVals = gw >= 52;
    const bw = Math.max(10, Math.min(56, gw * (showVals ? 0.5 : 0.72))), WIDTH = [1, 0.66, 0.36];
    let svg = "";
    for (let v = lo; v <= hi; v += hi - lo > 60 ? 20 : 10) svg += `<line class="${v === lo ? "baseline" : "gridline"}" x1="${M.l}" x2="${W - M.r}" y1="${y(v)}" y2="${y(v)}"/><text class="tick-label" x="${M.l - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
    const every = Math.max(1, Math.ceil(B.length / (W < 520 ? 4 : 10)));
    B.forEach((b, i) => {
      const gx = M.l + i * gw + gw / 2, bx = showVals ? gx - gw * 0.18 : gx, base = y(lo);
      const order = b.s.map((a, j) => ({ a, j })).sort((p, q) => q.a.avg - p.a.avg); // highest first = back
      const tip = `T + ${b.from}–${b.to} min|` + PROBES.map((p, j) => `${p}: avg ${b.s[j].avg.toFixed(1)} °C · min ${b.s[j].min.toFixed(1)} · max ${b.s[j].max.toFixed(1)}`).join("|") + `|${b.s[0].n} reading${b.s[0].n === 1 ? "" : "s"}`;
      let bars = "", labels = "", lastY = -Infinity;
      order.forEach(({ a, j }, k) => {
        const w = bw * WIDTH[k], top = y(a.avg);
        bars += `<rect x="${bx - w / 2}" y="${top}" width="${w}" height="${Math.max(2, base - top)}" rx="3" style="fill:${COLORS[j]}" class="agg-col"/>`;
        // values beside the bar, top to bottom, nudged apart when two averages are close
        const ly = Math.max(top + 4, lastY + 11); lastY = ly;
        if (showVals) labels += `<text x="${bx + bw / 2 + 4}" y="${ly}" class="agg-val" style="fill:${COLORS[j]}">${a.avg.toFixed(1)}</text>`;
      });
      svg += `<g class="agg-bar" data-tip="${esc(tip)}"><rect x="${gx - gw / 2 + 1}" y="${M.t}" width="${gw - 2}" height="${H - M.t - M.b}" class="agg-hit"/>${bars}${labels}</g>`;
      if (i % every === 0) svg += `<text class="tick-label" x="${gx}" y="${H - 9}" text-anchor="middle">T + ${b.from}</text>`;
    });
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="agg-svg" role="img" aria-label="Average per ${stepMin}-minute interval, with min and max">${svg}</svg>`;
    // overall since the test started, per sensor
    const all = PROBES.map((p, j) => { const pts = trendPoints(m).map((q) => q.v[j]); return { p, j, min: Math.min(...pts), max: Math.max(...pts), avg: pts.reduce((a, v) => a + v, 0) / pts.length }; });
    if (statsEl) statsEl.innerHTML = all.map((a) => `<div><span><i style="background:${COLORS[a.j]}"></i>${a.p}</span><b class="num">${a.avg.toFixed(1)} °C</b><small class="num">min ${a.min.toFixed(1)} · max ${a.max.toFixed(1)}</small></div>`).join("") +
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
  // motors that have readings to report (every motor on a device)
  const reportableMotors = allMotors;

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

  // the motor page's "Download report" button (the Motors page links there with #report)
  function downloadMotorReport(id, stepMin = 10) {
    if (!allowed("reports.create")) return;
    const x = id && findMotor(id);
    if (!x) return;
    const { d, m } = x;
    if (!d) { toast(`${m.id} is not assigned to a device — no readings to report`); return; }
    const n = trendPoints(m).length;
    saveCsv([...reportHead("Motor test results"), ...motorReportLines(d, m, stepMin)], `tractiontherm-${m.id}-${(m.testId || "test").toLowerCase()}-${fileStamp()}.csv`);
    logActivity("report", `Downloaded the motor results for ${m.id} · test ${m.testId || "—"} · ${n} readings`);
    toast(`Downloaded ${m.id} results · ${n} readings`);
  }

  // one test of a motor: the current run in full, an earlier one from its stored summary and readings
  const aggStepNow = () => +(($("input[name=aggStep]:checked") || $("input[name=dvAggStep]:checked") || {}).value || 10);
  // the full report of one test: the current run from the live data, an earlier one from its stored summary and readings
  function testReportLines(d, m, testId, stepMin = aggStepNow()) {
    if (d && testId === m.testId) return motorReportLines(d, m, stepMin);
    const r = (m.tests || []).find((t) => t.testId === testId); if (!r) return null;
    const f1 = (v) => (+v).toFixed(1), pts = r.readings || [];
    return [
      ["Motor", m.id], ["Test ID", r.testId], ["Stator No.", m.stator || ""], ["Model / type", m.model || ""], ["Locomotive", m.loco || ""],
      ["Device", r.device], ["Channel", r.channel ? `CH ${r.channel}` : ""], ["Test started", repStamp(r.start)], ["Test ended", repStamp(r.end)],
      ["Duration", fmtRun((r.end - r.start) / 60000)], ["Result", VERDICT_SHORT[r.result] || ""], ["Limits", limitLine()], [],
      ["Summary", "Max DE °C", "Max NDE °C", "Max rise K"], ["Test", f1(r.de), f1(r.nde), f1(r.rise)], [],
      ...(pts.length ? [["Readings", ...PROBES.map((p) => `${p} °C`), "Max rise K", "DE / NDE Δ °C"],
        ...pts.map(([t, ...v]) => [repStamp(t), ...v.map(f1), f1(hotOf(v) - v[AMB]), f1(spreadOf(v))])]
        : [["Readings", "Not stored for this test · only its summary is kept"]])];
  }
  // a motor's tests, newest first: the current one, then the earlier ones
  const testsOf = (d, m) => [...(d && m.testId ? [{ testId: m.testId, start: m.runStart, cur: true }] : []), ...(m.tests || [])];
  function downloadTestReport(motorId, testId) {
    if (!allowed("reports.create")) return;
    const x = findMotor(motorId); if (!x) return;
    const { d, m } = x;
    if (d && testId === m.testId) { downloadMotorReport(m.id, aggStepNow()); return; }
    const lines = testReportLines(d, m, testId); if (!lines) return;
    saveCsv([...reportHead("Motor test results"), ...lines], `tractiontherm-${m.id}-${testId.toLowerCase()}-${fileStamp()}.csv`);
    logActivity("report", `Downloaded the results of ${m.id} · test ${testId}`);
    toast(`Downloaded ${m.id} · ${testId}`);
  }
  // every test of one motor in one file: an overview row per test, then each test's full report
  function downloadMotorTests(motorId) {
    if (!allowed("reports.create")) return;
    const x = findMotor(motorId); if (!x) return;
    const { d, m } = x, tests = testsOf(d, m);
    if (!tests.length) { toast(`${m.id} has no tests yet`); return; }
    const lines = [...reportHead(`All tests of ${m.id}`), ["Motor", m.id], ["Stator No.", m.stator || ""], ["Model / type", m.model || ""], ["Locomotive", m.loco || ""], ["Tests", tests.length], [],
      ["Overview", "Started", "Device", "Result"],
      ...tests.map((t) => { const r = t.cur ? null : t; const res = t.cur ? (d.online ? (evalMotor(m).status === "stop" ? evalMotor(m).condition : evalMotor(m).status) : "off") : r.result;
        return [t.testId, t.start ? repStamp(t.start) : "", t.cur ? d.name : r.device, (t.cur && isRunning(m) && d.online ? "In progress · " : "") + (VERDICT_SHORT[res] || "")]; }),
      ...tests.flatMap((t) => [[], [], [`===== Test ${t.testId} =====`], ...testReportLines(d, m, t.testId)])];
    saveCsv(lines, `tractiontherm-${m.id}-all-tests-${fileStamp()}.csv`);
    logActivity("report", `Downloaded all ${tests.length} tests of ${m.id}`);
    toast(`Downloaded ${m.id} · ${tests.length} test${tests.length === 1 ? "" : "s"}`);
  }
  document.addEventListener("click", (ev) => { const b = ev.target.closest("[data-dl-test]"); if (b) downloadTestReport(b.dataset.dlMotor, b.dataset.dlTest); });

  // whole report: an overview row per motor, then each motor's full report one after another
  function downloadAllMotorReports(stepMin = 10) {
    if (!allowed("reports.create")) return;
    const list = reportableMotors();
    if (!list.length) { toast("No motors with readings to report yet"); return; }
    const condOf = ({ d, m }) => { const e = evalMotor(m), st = d.online ? e.status : "off"; return st === "stop" ? e.condition : st; };
    const lines = [
      ...reportHead("Motor test results · all motors"), ["Motors", list.length], ["Limits", limitLine()], [],
      ["Overview", "Test ID", "Stator No.", "Device", "Channel", ...PROBES.map((p) => `${p} °C now`), "Condition", "Reason", "Monitoring for"],
      ...list.map((x) => { const { d, m } = x, c = condOf(x); return [m.id, m.testId || "", m.stator || "", d.name, chLabel(m), ...m.live.map((v) => v.toFixed(1)), VERDICT_SHORT[c], c === "ok" ? "" : reasonOf(evalMotor(m)), fmtRun(runMinutes(m))]; }),
      ...list.flatMap(({ d, m }) => [[], [], [`===== ${m.id} =====`], ...motorReportLines(d, m, stepMin)])
    ];
    saveCsv(lines, `tractiontherm-all-motors-${fileStamp()}.csv`);
    logActivity("report", `Downloaded the full motor results — ${list.length} motors (${list.map(({ m }) => m.id).join(", ")})`);
    toast(`Downloaded full results · ${list.length} motors`);
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
    const ORIGINS = { dashboard: "Dashboard", monitor: "All devices", motors: "Motors", devices: "Devices", reports: "Results" };
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

    // a motor opened from Results (checked motors only) or the Motors list shows its readings and history without the 3D view
    const noScene = ["results", "motors"].includes(q.get("from"));
    const scene = noScene ? null : motorScene($("#motorScene"), { fixed: true }); // the selected motor in 3D, on its device, with every detail
    const render = () => {
      const x = selected && findMotor(selected);
      const d = x && x.d, m = x && x.m;
      $$(".motor-detail").forEach((el) => (el.hidden = !d));
      // the live 3D view only while this motor is being tested (not for checked / stopped motors)
      $("#motorLive").hidden = !d || noScene || !(d.online && isRunning(m)); $("#motorHero").hidden = !d; $("#mpEmpty").hidden = !!d;
      if (!d) { updateAlertCount(); return; }
      document.title = `${m.id} · TractionTherm`;
      $("#mpTitle").textContent = m.id;
      const dl = $("#mpDownload");
      dl.title = `Download the results of test ${m.testId || ""} on ${m.id} (CSV)`;
      // every test of this motor (this one and the earlier ones) on the Results page
      const rl = $("#mpResults");
      rl.href = `reports.html?motor=${encodeURIComponent(m.id)}`; rl.title = `All tests of ${m.id} on the Results page`;
      const e = evalMotor(m);
      const st = d.online ? e.status : "off";
      $("#motorHero").innerHTML = `
        <div class="mh-top">
          <div>
            <div class="crumbs">${esc(d.name)} · ${esc(d.id)}${m.channel ? ` · ${isRunning(m) ? "Channel" : "was channel"} ${m.channel}` : ""} · ${esc(d.location)}</div>
            <h2>${esc(m.id)}</h2>
            <div class="muted">Test ID <b class="mono test-id">${esc(m.testId || "—")}</b> · ${esc(m.model)} · ${esc(m.loco)} · Stator No. <span class="mono">${esc(m.stator || "—")}</span></div>
          </div>
          <div class="mh-verdict">${verdictPill(st)}<span>${st === "ok" ? "All checks within limits" : st === "off" ? "Device offline" : st === "stop" ? `Check stopped — last readings shown · result ${VERDICT_SHORT[e.condition]}` : esc(reasonOf(e))}</span></div>
        </div>
        ${readings(m, d.online, "lg")}
        <div class="mh-foot">
          <span>Monitoring for <b>${fmtRun(runMinutes(m))}</b></span>
          <span>DE / NDE Δ <b class="num">${e.dev.toFixed(1)} °C</b></span>
          <span>Trend <b>${trendText(e)}</b></span>
          <span class="mh-limits">${limitLine()} <button type="button" class="link-btn" data-edit-limits>Edit limits</button></span>
          <span class="mh-actions">
            <span class="mh-trigger">Monitoring ${triggerBtn(m, d)}</span>
            <button type="button" class="btn btn-sm${m.untitled ? " btn-primary" : ""}" data-edit-motor="${esc(m.id)}">${ico("edit")}${m.untitled ? "Add details" : "Edit"}</button>
          </span>
        </div>`;
      // live view: only the selected motor, on its device, with Wi-Fi, DE / NDE, TA and the motor's details
      $("#animPill").innerHTML = verdictPill(st);
      if (scene && !$("#motorLive").hidden) { if (scene.device !== d.id || scene.focus !== m.id) scene.show(d.id, m.id, true); else scene.refresh(); }
      $("#animSub").textContent = isRunning(m) && m.channel
        ? `${m.id} on ${d.name} ${chLabel(m)} · Wi-Fi, probes and ambient sensor linked to their readings · housing colour = rise above ambient (cool → red at ${LIMITS.riseCrit} K)`
        : `${m.id} on ${d.name} · stopped${m.channel ? ` (was ${chLabel(m)})` : ""} · last readings shown · switch it on to start a new run`;

      // every test of this motor: the current run first, then the earlier ones (same stator, a new Test ID each run)
      const runs = testRuns(d, m, e);
      $("#histSub").textContent = `${runs.length} test${runs.length === 1 ? "" : "s"} of ${m.id} · stator ${m.stator || "—"} · every run gets its own Test ID`;
      $("#histRows").innerHTML = testRowsHtml(m, runs);
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
    $$("input[name=aggStep]").forEach((r) => r.addEventListener("change", () => render()));
    render();
    return render;
  }

  /* =========================================================
     Page: Device — one device, its two channels side by side (split view)
     ========================================================= */
  function pageDevice() {
    const q = new URLSearchParams(location.search);
    const id = DEVICES.some((d) => d.id === q.get("device")) ? q.get("device") : (DEVICES[0] || {}).id;
    $("#dvSwitch").innerHTML = DEVICES.map((d) => `<option value="${esc(d.id)}">${esc(d.name)} (${esc(d.id)})</option>`).join("");
    $("#dvSwitch").value = id || "";
    $("#dvSwitch").addEventListener("change", (e) => (location.href = `device.html?device=${encodeURIComponent(e.target.value)}`));
    const onCh = (d, c) => runningOn(d).find((m) => m.channel === c) || null;
    const scene = motorScene($("#dvScene"), { details: false, fixed: true }); // the device and both motors in 3D
    let sig = "";
    // one half of the split view: the same details as the motor's own page, for the motor on that channel.
    // A fixed frame (so the charts keep their state) with its content refreshed every sample.
    const frame = (c) => `<section class="card dv-ch" id="dvCh${c}" aria-label="Channel ${c}">
        <div id="dvTop${c}"></div>
        <div class="dv-sec" id="dvRtSec${c}"><div class="dv-sec-h"><b>Real-time</b><span>last 5 minutes · hover for values</span></div>
          <div class="card-body dv-chart"><div class="chart" id="dvChart${c}"></div></div></div>
        <div class="dv-sec" id="dvAggSec${c}"><div class="dv-sec-h"><b>Aggregation</b><span id="dvAggLbl${c}"></span></div>
          <div class="card-body"><div class="agg-chart" id="dvAgg${c}"></div></div><div class="agg-stats" id="dvAggStats${c}"></div></div>
        <div class="dv-sec" id="dvHistSec${c}"><div class="dv-sec-h"><b>Test history</b><span id="dvHistLbl${c}"></span></div>
          <div class="table-wrap"><table class="table responsive hist-table"><thead><tr><th>Test ID</th><th>Device</th><th>Started</th><th class="num">Duration</th><th class="num">Max DE °C</th><th class="num">Max NDE °C</th><th class="num">Max rise K</th><th>Result</th><th class="hist-dl">Results</th></tr></thead><tbody id="dvHist${c}"></tbody></table></div></div>
        <div class="dv-foot" id="dvFoot${c}"></div>
      </section>`;
    const aggStep = () => +(($("input[name=dvAggStep]:checked") || {}).value || 10);
    function fill(d, c) {
      const m = onCh(d, c), top = $(`#dvTop${c}`), chart = $(`#dvChart${c}`), foot = $(`#dvFoot${c}`), card = $(`#dvCh${c}`);
      $(`#dvRtSec${c}`).hidden = !m || !d.online; $(`#dvAggSec${c}`).hidden = !m; $(`#dvHistSec${c}`).hidden = !m;
      if (!m) {
        card.className = "card dv-ch is-free";
        top.innerHTML = `<div class="dv-free">${ico("plus")}<b>CH ${c} is free</b><span>No motor is being checked on this channel</span>${d.online ? `<button type="button" class="btn btn-sm btn-primary slot-on" data-quick-start="${esc(d.id)}">${ico("power")}Switch on</button>` : ""}</div>`;
        foot.innerHTML = "";
        return;
      }
      const e = evalMotor(m), st = d.online ? e.status : "off", th = e.th;
      card.className = `card dv-ch is-${st}`;
      top.innerHTML = `<div class="mp-head">
          <div class="mp-id"><b class="ch-tag">CH ${c}</b><a class="mp-name mono" href="motor.html?motor=${encodeURIComponent(m.id)}">${esc(m.id)}</a></div>
          ${verdictPill(st)}
          <div class="mp-meta">${m.untitled ? "Details pending" : esc(m.loco)} · <span class="mono" title="Test ID">${esc(m.testId || "—")}</span> · ${fmtRun(runMinutes(m))}</div>
          ${triggerBtn(m, d)}
        </div>
        <div class="dv-about">
          <span>${m.untitled ? "Details pending" : `${esc(m.model)} · Stator No. <span class="mono">${esc(m.stator || "—")}</span>`}</span>
          <span class="dv-why ${st}">${st === "ok" ? "All checks within limits" : st === "off" ? "Device offline" : esc(reasonOf(e))}</span>
        </div>
        ${m.untitled ? `<div class="panel-note">${ico("edit")}<span>Reading without motor details</span><button type="button" class="btn btn-sm btn-primary" data-edit-motor="${esc(m.id)}">Add details</button></div>` : ""}
        ${readings(m, d.online)}`;
      // aggregation and test history, as on the motor's own page
      const step = aggStep();
      $(`#dvAggLbl${c}`).textContent = `average per ${step}-minute interval · DE, NDE and TA in one bar`;
      aggChart($(`#dvAgg${c}`), m, step, $(`#dvAggStats${c}`));
      const runs = testRuns(d, m, e);
      $(`#dvHistLbl${c}`).textContent = `${runs.length} test${runs.length === 1 ? "" : "s"} · stator ${m.stator || "—"}`;
      $(`#dvHist${c}`).innerHTML = testRowsHtml(m, runs);
      if (d.online) {
        const rt = m.hist.t.map((t, i) => ({ t, i }));
        lineChart(chart, {
          series: PROBES.map((p, j) => ({ name: `${p} · ${PROBE_NAME[p]}`, short: p, color: COLORS[j], points: rt.map(({ t, i }) => ({ t, v: m.hist.v[j][i] })) })),
          lines: runLines(m, "temp"), unit: "°C", height: 200, title: `${m.id} real-time`,
          xfmt: (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      }
      foot.innerHTML = `<span>Rise <b class="num">${e.rise.toFixed(1)} K</b></span><span>DE / NDE Δ <b class="num">${e.dev.toFixed(1)} °C</b></span>
        <span>${th && th.confident ? `Final ≈ <b class="num">${th.finalTemp.toFixed(1)} °C</b>` : "Final: collecting data…"}</span>
        <a class="dv-open" href="motor.html?motor=${encodeURIComponent(m.id)}">Open motor ${ico("chevronRight")}</a>`;
    }
    const render = () => {
      const d = DEVICES.find((x) => x.id === id);
      $("#dvEmpty").hidden = !!d; $("#dvBody").hidden = !d;
      if (!d) { updateAlertCount(); return; }
      document.title = `${d.name} · TractionTherm`;
      $("#dvTitle").textContent = d.name;
      $("#dvSub").textContent = `${d.id} · ${d.location} · both channels side by side · readings refresh every sample`;
      $("#dvInfo").innerHTML = `
        <div><span>Status</span>${statusCell(d)}</div>
        <div><span>IP address</span><b class="mono">${esc(d.ip)}</b></div>
        <div><span>Firmware</span><b>v${esc(d.fw || "2.4.1")}</b></div>
        <div><span>Signal</span>${signalBars(d.online ? d.signal || 0 : 0)}</div>
        <div><span>Channels in use</span><b class="num">${runningOn(d).length} of ${MAX_RUN}</b></div>
        <div><span>Motors on this device</span><b class="num">${d.motors.length}</b></div>`;
      // the live 3D view only while a motor on this device is being tested
      $("#dvSceneCard").hidden = !(d.online && runningOn(d).some((m) => m.channel));
      if (!$("#dvSceneCard").hidden) { if (scene.device !== d.id) scene.show(d.id); else scene.refresh(); }
      // the two halves are rebuilt only when what's on the channels changes
      const now = CHANNELS.map((c) => (onCh(d, c) || {}).id || "-").join("|") + d.online;
      if (now !== sig) { sig = now; $("#dvSplit").innerHTML = CHANNELS.map(frame).join(""); paintIcons($("#dvSplit")); }
      CHANNELS.forEach((c) => fill(d, c));
      const stopped = deviceStopped(d);
      $("#dvStoppedCard").hidden = !stopped;
      $("#dvStopped").innerHTML = stopped;
      updateAlertCount();
    };
    $$("input[name=dvAggStep]").forEach((r) => r.addEventListener("change", () => render()));
    render();
    return render;
  }

  /* =========================================================
     Page: Devices — table of registered devices
     ========================================================= */
  function pageDevices() {
    const dlg = $("#deviceDialog"), form = $("#deviceForm");
    let filter = "all", editing = null;
    let selected = new URLSearchParams(location.search).get("device"); // device whose motors are listed below the table

    // every motor on the selected device (checking now first, then stopped), refreshed with each sample
    const renderMotors = () => {
      const box = $("#devMotors"), d = DEVICES.find((x) => x.id === selected);
      box.hidden = !d;
      if (!d) return;
      const list = [...runningOn(d), ...d.motors.filter((m) => !isRunning(m))], free = d.online && freeChannel(d);
      $("#dmTitle").textContent = `Motors on ${d.name}`;
      $("#dmSub").textContent = `${d.id} · ${d.location} · ${list.length} motor${list.length === 1 ? "" : "s"} · ${runningOn(d).length} of ${MAX_RUN} channels in use`;
      $("#dmActions").innerHTML = (free ? `<button type="button" class="btn btn-sm btn-primary slot-on" data-quick-start="${esc(d.id)}">${ico("power")}Switch on CH ${free}</button>` : "")
        + `<button type="button" class="icon-btn" data-dm-close aria-label="Close the motor list" title="Close">${ico("x")}</button>`;
      $("#dmRows").innerHTML = list.length ? list.map((m) => {
        const e = evalMotor(m), id = esc(m.id);
        return `<tr>
          <td class="lead-cell" data-label="Motor"><b class="mono">${id}</b><span class="muted stator-no">${m.untitled ? "Details pending" : `Stator No. <span class="mono">${esc(m.stator || "—")}</span>`}</span></td>
          <td data-label="Model / type" class="col-mid"><div class="cell-stack">${esc(m.model)}<span class="muted cell-sub">${esc(m.loco)}</span></div></td>
          <td data-label="Channel / test"><div class="cell-stack">${isRunning(m) ? chLabel(m) : m.channel ? `Was ${chLabel(m)}` : "—"}<span class="muted cell-sub mono">${esc(m.testId || "")}</span></div></td>
          ${PROBES.map((p, j) => `<td data-label="${p} °C" class="num${j === AMB ? " col-opt" : ""} ${d.online ? tCls(m.live[j], j, m.live[AMB]) : "muted"}">${d.online ? m.live[j].toFixed(1) : "—"}</td>`).join("")}
          <td data-label="Condition">${verdictPill(d.online ? e.status : "off")}</td>
          <td data-label="Monitoring">${triggerBtn(m, d)}</td>
          <td data-label=""><div class="row-actions">
            <a class="btn btn-sm" href="motor.html?motor=${encodeURIComponent(m.id)}" title="Live view and analysis">${ico("activity")}<span class="hide-sm">Monitor</span></a>
            <button class="btn btn-sm btn-ghost" data-edit-motor="${id}" aria-label="${m.untitled ? "Add details for" : "Edit"} ${id}" title="${m.untitled ? "Add details" : "Edit"}">${ico("edit")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="${6 + PROBES.length}" class="muted" style="text-align:center;padding:28px">No motors on ${esc(d.name)} yet${free ? " — switch on a channel" : ""}.</td></tr>`;
    };

    const render = () => {
      const term = ($("#devSearch").value || "").toLowerCase();
      const list = DEVICES.filter((d) =>
        (filter === "all" || (filter === "online") === d.online) &&
        [d.id, d.name, d.location, d.ip, ...d.motors.map((m) => m.id)].join(" ").toLowerCase().includes(term));
      $("#devCount").textContent = `${list.length} of ${DEVICES.length} devices`;
      $("#devRows").innerHTML = list.length ? list.map((d) => {
        return `<tr class="dev-row${d.id === selected ? " is-selected" : ""}" data-dev="${esc(d.id)}" tabindex="0" aria-selected="${d.id === selected}" title="Show the motors on ${esc(d.name)}">
          <td class="lead-cell" data-label="Device"><div class="cell-dev"><span class="device-ico">${ico("cpu")}</span><div><b>${esc(d.name)}</b><span class="mono">${esc(d.id)} · v${esc(d.fw || "2.4.1")}</span></div></div></td>
          <td data-label="Location">${esc(d.location)}</td>
          <td data-label="IP address" class="mono">${esc(d.ip)}</td>
          <td data-label="Signal" class="col-opt">${signalBars(d.signal || 0)}</td>
          <td data-label="Status">${statusCell(d)}</td>
          <td data-label=""><div class="row-actions">
            <a class="btn btn-sm" href="device.html?device=${encodeURIComponent(d.id)}" title="Open ${esc(d.name)}: both channels side by side">${ico("activity")}<span class="hide-sm">Open</span></a>
            <button class="btn btn-sm btn-ghost" data-view="${esc(d.id)}" aria-label="View ${esc(d.id)}" title="View">${ico("eye")}</button>
            <button class="btn btn-sm btn-ghost" data-edit="${esc(d.id)}" aria-label="Edit ${esc(d.id)}" title="Edit">${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-del="${esc(d.id)}" aria-label="Delete ${esc(d.id)}" title="Delete">${ico("trash")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="6" class="muted" style="text-align:center;padding:32px">${DEVICES.length ? "No devices match your filters." : "No devices yet — use “Add device”."}</td></tr>`;
      renderMotors();
      updateAlertCount();
    };
    // pick a device: its row is highlighted and its motors are listed (same device again closes the list)
    const select = (id) => {
      selected = selected === id ? null : id;
      render();
      if (selected) requestAnimationFrame(() => $("#devMotors").scrollIntoView({ block: "nearest", behavior: calm.matches ? "auto" : "smooth" }));
    };

    function open(d) {
      if (!allowed(d ? "devices.update" : "devices.create")) return;
      editing = d || null;
      form.reset();
      $$("input, select", form).forEach((el) => el.setCustomValidity("")); // clear errors left by a cancelled attempt
      $("#dlgTitle").textContent = d ? `Edit device ${d.id}` : "Add new device";
      $("#dlgSub").textContent = d ? "Update the device's name, location or IP address." : "Register a monitoring device. Then switch it on from Monitor, or assign motors to it.";
      $("#dlgSave").textContent = d ? "Save changes" : "Add device";
      form.elements.id.readOnly = !!d;
      if (d) {
        form.elements.id.value = d.id; form.elements.name.value = d.name; form.elements.location.value = d.location;
        form.elements.ip.value = d.ip;
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
      const data = { id, name: f.name.value.trim(), location: f.location.value.trim(), ip: f.ip.value.trim() };
      const changes = editing ? ["name", "location", "ip"].filter((k) => editing[k] !== data[k]).map((k) => `${k === "ip" ? "IP" : k} ${editing[k]} → ${data[k]}`) : [];
      if (editing) Object.assign(editing, data); // status stays as the device reports it
      else DEVICES.push({ ...data, online: true, motors: [], fw: "2.4.1", signal: 4 }); // demo: a new device connects straight away
      saveDevices();
      dlg.close();
      logActivity("device", editing ? `Edited device ${id}${changes.length ? ` — ${changes.join(", ")}` : " — no changes"}` : `Registered device ${id} (${data.name}, ${data.location}, ${data.ip})`);
      toast(editing ? `${id} updated` : `${id} added — switch it on from Monitor, or assign motors to it`);
      render();
    });
    form.addEventListener("input", (e) => e.target.setCustomValidity && e.target.setCustomValidity(""));

    function viewDevice(d) {
      const rows = d.motors.map((m) => {
        const e = evalMotor(m);
        return `<li><span class="muted">${ico("motor")}</span><b>${esc(m.id)}</b><span class="num">${d.online ? m.live.map((v) => v.toFixed(1)).join(" / ") + " °C" : "—"}</span>${verdictPill(d.online ? e.status : "off")}</li>`;
      }).join("");
      const dlg = viewDialog({
        title: d.name, sub: `${d.id} · ${d.location}`,
        rows: [["Status", d.online ? `<span class="badge ok"><span class="pulse"></span>Online</span>` : `${badge("off")} <span class="muted">Last seen ${esc(d.lastSeen || "—")}</span>`],
          ["IP address", `<span class="mono">${esc(d.ip)}</span>`], ["Firmware", `v${esc(d.fw || "2.4.1")}`], ["Signal", signalBars(d.signal || 0)], ["Channels", CHANNELS.map((c) => { const m = runningOn(d).find((x) => x.channel === c); return `CH ${c}: ${m ? m.id : "free"}`; }).join(" · ")], ["Motors", `${d.motors.length} assigned`]],
        body: `<div><div class="detail-title">Motors monitored <span class="muted">(${PROBES.join(" / ")} °C)</span></div><ul class="detail-slots">${rows}</ul></div>`,
        actions: `${can("devices.delete") ? `<button type="button" class="btn btn-danger" data-v-del>${ico("trash")}Delete</button>` : ""}${can("devices.update") ? `<button type="button" class="btn btn-primary" data-v-edit>${ico("edit")}Edit</button>` : ""}`
      });
      dlg.querySelector("[data-v-edit]")?.addEventListener("click", () => { dlg.close(); open(d); });
      dlg.querySelector("[data-v-del]")?.addEventListener("click", () => { dlg.close(); removeDevice(d.id); });
    }

    async function removeDevice(id) {
      if (!allowed("devices.delete")) return;
      const d = DEVICES.find((x) => x.id === id);
      if (!d) return;
      const ok = await confirmDialog({
        title: `Delete device ${d.id}?`,
        message: d.motors.length ? `${d.name} will be removed. Its motors (${d.motors.map((m) => m.id).join(", ")}) stay in the motor register as not assigned. This cannot be undone.` : `${d.name} will be removed. This cannot be undone.`,
        confirmLabel: "Delete device"
      });
      if (!ok) return;
      d.motors.forEach((m) => { archiveRun(m, d); SPARE.push(spareOf(m)); });
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
      // anywhere else on the row (not a button or link): show that device's motors
      const row = e.target.closest("tr[data-dev]");
      if (row && !e.target.closest("a, button")) select(row.dataset.dev);
    });
    $("#devRows").addEventListener("keydown", (e) => {
      const row = e.target.closest("tr[data-dev]");
      if (row && e.target === row && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(row.dataset.dev); }
    });
    $("#devMotors").addEventListener("click", (e) => { if (e.target.closest("[data-dm-close]")) { selected = null; render(); } });
    $("#devSearch").addEventListener("input", render);
    $$("[name=devFilter]").forEach((r) => r.addEventListener("change", () => { filter = r.value; render(); }));
    $("#resetDemo") && $("#resetDemo").addEventListener("click", async () => {
      if (!allowed("devices.delete")) return;
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
        const { d, m } = x, cond = condOf(x), live = d && d.online, e = d ? evalMotor(m) : null;
        const id = esc(m.id);
        return `<tr class="motor-row" data-row-motor="${id}" tabindex="0" title="${d ? `Open ${id}'s monitoring` : `${id} details (not on a device yet)`}">
          <td class="lead-cell" data-label="Motor"><b class="mono">${id}</b><span class="muted stator-no">Stator No. <span class="mono">${esc(m.stator || "—")}</span></span></td>
          <td data-label="Model / type" class="col-mid"><div class="cell-stack">${esc(m.model)}<span class="muted cell-sub">${esc(m.loco)}</span></div></td>
          <td data-label="Device"><span>${d ? `${esc(d.name)}${isRunning(m) && m.channel ? ` · ${chLabel(m)}` : ""}<span class="muted cell-sub mono">${esc(m.testId || "")}</span>` : `<span class="muted">Not assigned</span>`} <button type="button" class="link-btn" data-assign-motor="${id}">${d ? "Change" : "Assign"}</button></span></td>
          ${PROBES.map((p, j) => `<td data-label="${p} °C" class="num${j === AMB ? " col-opt" : ""} ${live ? tCls(m.live[j], j, m.live[AMB]) : "muted"}">${live ? m.live[j].toFixed(1) : "—"}</td>`).join("")}
          <td data-label="Predicted final" class="num col-opt">${live && e.th && e.th.confident ? e.th.finalTemp.toFixed(1) + " °C" : "—"}</td>
          <td data-label="Condition">${cond === "none" ? `<span class="verdict-pill off">Not monitored</span>` : verdictPill(cond)}</td>
          <td data-label="Monitoring">${d ? triggerBtn(m, d) : '<span class="muted">—</span>'}</td>
          <td data-label=""><div class="row-actions">
            ${d ? `<a class="btn btn-sm" href="motor.html?motor=${encodeURIComponent(m.id)}&from=motors" title="Monitor">${ico("activity")}<span class="hide-sm">Monitor</span></a>` : ""}
            <a class="btn btn-sm" href="reports.html?motor=${encodeURIComponent(m.id)}" title="All tests of ${id}, test by test">${ico("report")}<span class="hide-sm">Results</span></a>
            <button class="btn btn-sm btn-ghost" data-view-motor="${id}" aria-label="View ${id}" title="View">${ico("eye")}</button>
            <button class="btn btn-sm btn-ghost" data-edit-motor="${id}" aria-label="Edit ${id}" title="Edit">${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-del-motor="${id}" aria-label="Delete ${id}" title="Delete">${ico("trash")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="${7 + PROBES.length}" class="muted" style="text-align:center;padding:32px">${all.length ? "No motors match your filters." : "No motors yet — use “Add motor”."}</td></tr>`;
      updateAlertCount();
    };
    // click (or Enter on) a motor's row: that motor's own monitoring page; a motor not on a device has none yet → its details
    const openRow = (ev) => {
      const row = ev.target.closest("tr[data-row-motor]");
      if (!row || ev.target.closest("a, button, input, select, label")) return;
      if (ev.type === "keydown" && (ev.target !== row || (ev.key !== "Enter" && ev.key !== " "))) return;
      ev.preventDefault();
      const x = findMotor(row.dataset.rowMotor); if (!x) return;
      if (x.d) location.href = `motor.html?motor=${encodeURIComponent(x.m.id)}&from=motors`; else viewMotor(x.m.id);
    };
    $("#motorRows").addEventListener("click", openRow);
    $("#motorRows").addEventListener("keydown", openRow);
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
     Page: Settings — min / max limit for each terminal (DE, NDE, TA)
     ========================================================= */
  function pageSettings() {
    const editable = can("limits.update"), SCALE = { lo: -20, hi: 160 }; // °C shown on the range bars
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
      if (!allowed("limits.update")) return;
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
      if (!allowed("limits.update")) return;
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

  /* =========================================================
     Page: Reports — filtered condition summary / readings log, CSV + print
     ========================================================= */
  function pageReports() {
    const f = $("#repForm").elements, q = new URLSearchParams(location.search);
    const stamp = repStamp;
    const fillMotors = () => {
      const keep = f.motor.value;
      const list = everyMotor().filter(({ d }) => (f.device.value === "all" || (d && d.id === f.device.value)));
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
      if (x) {
        // every test of the motor, whichever device it ran on
        f.device.value = "all"; fillMotors();
        f.motor.value = x.m.id;
        const back = $("#repBack"), ref = /\/motor\.html\?/.test(document.referrer) ? document.referrer : "";
        if (back && x.d) { back.href = ref || `motor.html?motor=${encodeURIComponent(x.m.id)}`; back.textContent = `← Back to ${x.m.id}`; back.hidden = false; }
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

    // every test that matches the device / motor filters: each motor's current test and its earlier ones (from its history)
    const devOfTest = (r) => DEVICES.find((x) => x.name === r.device) || null;
    function allTests() {
      const out = [];
      everyMotor().forEach(({ d, m }) => {
        if (d && m.testId) out.push({ cur: true, d, m, testId: m.testId, start: m.runStart });
        (m.tests || []).forEach((r) => out.push({ cur: false, d: devOfTest(r), m, r, testId: r.testId, start: r.start }));
      });
      return out.filter((t) => (f.device.value === "all" || (t.d && t.d.id === f.device.value)) && (f.motor.value === "all" || t.m.id === f.motor.value));
    }
    // build the report rows for the current filters: one row per test
    function build() {
      const statusOf = ({ d, m }) => (d.online ? evalMotor(m).status : "off");
      if (f.type.value === "summary") {
        const f1 = (v) => (+v).toFixed(1);
        const rows = allTests().map((t) => {
          const { d, m } = t;
          if (t.cur) {
            const e = evalMotor(m), th = e.th, ok = th && th.confident, st = statusOf(t), res = st === "stop" ? e.condition : st;
            return { t: t.start || 0, status: res, types: Object.keys(CTYPE_CHECK).filter((k) => failing(e, k)), reason: res === "ok" ? "" : reasonOf(e),
              cells: [m.testId, m.id, m.stator || "", m.model, m.loco, d.name, chLabel(m), d.location, t.start ? repStamp(t.start) : "", fmtRun(runMinutes(m)), isRunning(m) && d.online ? "In progress" : "Completed",
                ...m.live.map(f1), e.rise.toFixed(1), e.dev.toFixed(1), ok ? th.finalTemp.toFixed(1) : "", ok ? th.tau.toFixed(0) : "", th && th.eq ? "Reached" : "Not yet", VERDICT_SHORT[res], res === "ok" ? "" : reasonOf(e)] };
          }
          // an earlier test: its last stored reading, or its peaks when no readings were kept
          const r = t.r, last = r.readings && r.readings.length ? r.readings[r.readings.length - 1].slice(1) : null;
          const v = last || [r.de, r.nde, NaN], spread = last ? spreadOf(last) : Math.abs(r.de - r.nde);
          const types = [r.rise >= LIMITS.riseWarn && "rise", Math.max(r.de, r.nde) >= LIMITS.warn && "temp", spread >= LIMITS.devWarn && "spread"].filter(Boolean);
          const reason = r.result === "ok" ? "" : types.map((k) => CTYPE_NAME[k]).join(" · ") || "See test readings";
          return { t: r.start, status: r.result || "ok", types, reason,
            cells: [r.testId, m.id, m.stator || "", m.model || "", m.loco || "", r.device, r.channel ? `CH ${r.channel}` : "", t.d ? t.d.location : "", repStamp(r.start), fmtRun((r.end - r.start) / 60000), "Completed",
              ...v.map((x) => (isFinite(x) ? f1(x) : "")), f1(r.rise), f1(spread), "", "", "", VERDICT_SHORT[r.result] || "", reason] };
        }).filter((row, i, a) => {
          if (f.cond.value !== "all" && row.status !== f.cond.value) return false;
          if (f.ctype.value !== "all" && !row.types.includes(f.ctype.value)) return false;
          const c = row.cells;
          return matches({ test: c[0], motor: c[1], stator: c[2], model: c[3], loco: c[4], device: `${c[5]} ${(DEVICES.find((x) => x.name === c[5]) || {}).id || ""}`, location: c[7], reason: row.reason });
        }).sort((a, b) => b.t - a.t);
        return { title: "Test results", cols: ["Test ID", "Motor", "Stator No.", "Model / type", "Locomotive", "Device", "Channel", "Location", "Started", "Monitoring for", "State", ...PROBES.map((p) => `${p} °C`), "Rise K", "DE / NDE Δ °C", "Predicted final °C", "τ min", "Equilibrium", "Condition", "Reason"],
          num: [9, ...Array.from({ length: PROBES.length + 4 }, (_, i) => 11 + i)], statusCol: 11 + PROBES.length + 5, motorCol: 1, rows };
      }
      // readings log: trend points sampled at the chosen interval inside the time range
      const now = Date.now(), from = f.range.value === "all" ? 0 : now - +f.range.value * 60000, step = +f.interval.value * 60000;
      const rows = [];
      allTests().forEach((x) => {
        const { m } = x, tid = x.testId, dev = x.cur ? x.d.name : x.r.device, devId = x.d ? x.d.id : "", ch = x.cur ? chLabel(m) : x.r.channel ? `CH ${x.r.channel}` : "";
        const pts = x.cur ? trendPoints(m) : (x.r.readings || []).map(([t, ...v]) => ({ t, v }));
        let last = -Infinity;
        pts.forEach((p) => {
          if (p.t < from || p.t - last < step - 1000) return;
          last = p.t;
          const hot = hotOf(p.v), rise = hot - p.v[AMB], spread = spreadOf(p.v);
          const lv = { rise: lvl(rise, LIMITS.riseWarn, LIMITS.riseCrit), temp: lvl(hot, LIMITS.warn, LIMITS.crit), spread: lvl(spread, LIMITS.devWarn, LIMITS.devCrit), term: termBreaches(p.v).length ? "crit" : "ok" };
          const s = [lv.rise, lv.temp, lv.spread, lv.term].reduce((w, c) => (RANK[c] > RANK[w] ? c : w), "ok");
          if (f.cond.value !== "all" && s !== f.cond.value) return;
          if (f.ctype.value !== "all" && (lv[f.ctype.value] || "ok") === "ok") return;
          if (!matches({ motor: m.id, test: tid, device: `${dev} ${devId}`, time: stamp(p.t) })) return;
          rows.push({ t: p.t, status: s, types: Object.keys(lv).filter((t) => lv[t] !== "ok"), cells: [tid, stamp(p.t), m.id, dev, ch, ...p.v.map((v) => v.toFixed(1)), rise.toFixed(1), spread.toFixed(1), VERDICT_SHORT[s]] });
        });
      });
      rows.sort((a, b) => a.t - b.t || a.cells[2].localeCompare(b.cells[2]));
      return { title: "Temperature readings", cols: ["Test ID", "Time", "Motor", "Device", "Channel", ...PROBES.map((p) => `${p} °C`), "Max rise K", "DE / NDE Δ °C", "Status"], num: Array.from({ length: PROBES.length + 2 }, (_, i) => 5 + i), statusCol: 5 + PROBES.length + 2, motorCol: 2, rows };
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
      const motorsIn = new Set(report.rows.map((r) => r.cells[0])).size;
      $("#repSummary").innerHTML = `
        <div><span>${report.title === "Test results" ? "Tests in report" : "Readings in report"}</span><b class="num">${report.rows.length}${report.title === "Test results" ? "" : `<small> from ${motorsIn} test${motorsIn === 1 ? "" : "s"}</small>`}</b></div>
        <div><span style="color:var(--ok-text)">${ico("checkCircle")}Good</span><b class="num">${c.ok}</b></div>
        <div><span style="color:var(--warn-text)">${ico("alert")}Monitor</span><b class="num">${c.warn}</b></div>
        <div><span style="color:var(--crit-text)">${ico("xCircle")}Not OK</span><b class="num">${c.crit + c.off}</b></div>
        ${report.rows.length ? `<div class="cond-split" role="img" aria-label="${c.ok} good, ${c.warn} monitor, ${c.crit} not OK">${["ok", "warn", "crit"].filter((k) => c[k]).map((k) => `<span class="${k}" style="flex:${c[k]}" data-tip="${VERDICT_SHORT[k]}|${c[k]} of ${report.rows.length} rows"></span>`).join("")}</div>` : ""}`;
      // one motor chosen: its details, its tests in order and a download of every test's full report
      const mx = f.motor.value !== "all" && findMotor(f.motor.value);
      $("#repMotorCard").hidden = !mx;
      if (mx) {
        const { d, m } = mx, tests = testsOf(d, m);
        $("#repMotorCard").innerHTML = `
          <div class="card-head"><div><h3>${esc(m.id)} · test by test</h3><div class="sub">Stator No. <span class="mono">${esc(m.stator || "—")}</span> · ${esc(m.model || "—")} · ${esc(m.loco || "—")} · ${d ? `now on ${esc(d.name)}` : "not on a device"} · ${tests.length} test${tests.length === 1 ? "" : "s"}</div></div>
            <div class="actions">${d ? `<a class="btn btn-sm" href="motor.html?motor=${encodeURIComponent(m.id)}&from=results">${ico("activity")}Open motor</a>` : ""}
              ${tests.length ? `<button type="button" class="btn btn-sm btn-primary" data-dl-motor-tests="${esc(m.id)}">${ico("download")}Download all ${tests.length} test${tests.length === 1 ? "" : "s"}</button>` : ""}</div></div>
          ${tests.length ? `<ol class="rep-tests">${tests.map((t, i) => `<li><b class="mono">${esc(t.testId)}</b><span class="muted">${t.start ? esc(repStamp(t.start)) : ""}${t.cur ? (isRunning(m) && d.online ? " · in progress" : " · latest") : ""}${i === tests.length - 1 ? " · first test" : ""}</span>
            <button type="button" class="btn btn-sm btn-ghost" data-dl-test="${esc(t.testId)}" data-dl-motor="${esc(m.id)}" title="Download the full results of test ${esc(t.testId)}">${ico("download")}<span class="hide-sm">Download</span></button></li>`).join("")}</ol>` : '<p class="muted rep-tests-empty">No tests yet.</p>'}`;
      }
      $("#repTitle").textContent = report.title;
      $("#repMeta").textContent = `${filterText().join(" · ")} · data as of ${new Date().toLocaleTimeString()}`;
      $("#repPrintHead").innerHTML = `<h2>TractionTherm · ${esc(report.title)}</h2><p>Generated ${esc(stamp(Date.now()))} · ${esc(filterText().join(" · "))}</p><p>Limits: warning ${LIMITS.riseWarn} K / alarm ${LIMITS.riseCrit} K rise above ambient · alarm ${LIMITS.crit} °C · DE / NDE Δ ${LIMITS.devCrit} °C · terminals ${PROBES.map((p) => `${p} ${TERM[p].min}–${TERM[p].max}`).join(", ")} °C · equilibrium &lt; ${EQ_RATE} K/h (IEC 60034-1)</p>`;
      // on screen each row also gets Open / Edit for its motor (not part of the download)
      $("#repHead").innerHTML = `<tr>${report.cols.map((h, i) => `<th${report.num.includes(i) ? ' class="num"' : ""}>${esc(h)}</th>`).join("")}<th class="num rep-act-h">Actions</th></tr>`;
      $("#repRows").innerHTML = report.rows.length ? report.rows.map((r) => {
        const id = r.cells[report.motorCol], tid = r.cells[report.cols.indexOf("Test ID")];
        return `<tr>${r.cells.map((v, i) => `<td data-label="${esc(report.cols[i])}"${i === 0 ? ' class="lead-cell"' : report.num.includes(i) ? ' class="num"' : ""}>${i === report.statusCol ? verdictPill(r.status) : i === report.motorCol ? `<a class="rep-motor" href="motor.html?motor=${encodeURIComponent(v)}&from=results" title="Open ${esc(v)}: readings, graphs and test history">${esc(v)}</a>` : esc(v || "—")}</td>`).join("")}
          <td data-label="" class="rep-act"><div class="row-actions">
            <a class="btn btn-sm" href="motor.html?motor=${encodeURIComponent(id)}&from=results" title="Open ${esc(id)}: readings, graphs and test history">${ico("activity")}<span class="hide-sm">Open</span></a>
            ${tid ? `<button type="button" class="btn btn-sm btn-ghost" data-dl-test="${esc(tid)}" data-dl-motor="${esc(id)}" aria-label="Download test ${esc(tid)}" title="Download the results of test ${esc(tid)}">${ico("download")}</button>` : ""}
            <button type="button" class="btn btn-sm btn-ghost" data-edit-motor="${esc(id)}" aria-label="Edit ${esc(id)}" title="Edit ${esc(id)}'s details">${ico("edit")}</button>
          </div></td></tr>`;
      }).join("")
        : `<tr><td colspan="${report.cols.length + 1}" class="muted" style="text-align:center;padding:28px">No data matches these filters.</td></tr>`;
      $("#repFoot").textContent = `${report.rows.length} row${report.rows.length === 1 ? "" : "s"} · the download contains exactly the rows shown above`;
      updateAlertCount();
    };

    $("#repMotorCard").addEventListener("click", (ev) => { const b = ev.target.closest("[data-dl-motor-tests]"); if (b) downloadMotorTests(b.dataset.dlMotorTests); });
    $("#repCsv").addEventListener("click", () => {
      if (!allowed("reports.create")) return;
      if (!report || !report.rows.length) { toast("Nothing to download — change the filters"); return; }
      // "Label: value" → two cells (split at the first ": " only, a search term may contain one)
      const meta = filterText().map((t) => { const i = t.indexOf(": "); return i < 0 ? [t] : [t.slice(0, i), t.slice(i + 2)]; });
      saveCsv([["Report", report.title], ["Generated", stamp(Date.now())], ...meta, [], report.cols, ...report.rows.map((r) => r.cells)], `tractiontherm-${f.type.value}-${fileStamp()}.csv`);
      logActivity("report", `Downloaded ${report.title} CSV — ${report.rows.length} rows · ${filterText().join(" · ")}`);
      toast(`Downloaded ${report.rows.length} rows`);
    });
    $("#repPrint").addEventListener("click", () => { if (!allowed("reports.create")) return; render(); logActivity("report", `Printed ${report.title} — ${report.rows.length} rows · ${filterText().join(" · ")}`); window.print(); });
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
    // results are a snapshot (no 2 s refresh), but after editing a motor here the table shows its new details
    rerender = () => { fillMotors(); render(); };
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
      // only an Administrator can hand out the Administrator role; typing a new role needs Roles · Create
      form.elements.role.innerHTML = ROLES.map((r) => `<option${r.name === ADMIN_ROLE && !isAdmin() ? " disabled" : ""}>${esc(r.name)}</option>`).join("") + (can("roles.create") ? `<option value="${NEW_ROLE}">+ Enter a new role…</option>` : "");
    };
    const syncRoleNew = () => {
      const typed = form.elements.role.value === NEW_ROLE, box = form.elements.roleNew;
      box.hidden = !typed;
      $("#roleHint").textContent = typed ? "A new role starts with view-only access · set its permissions on Roles & Permissions" : can("roles.create") ? "Pick a role, or choose “Enter a new role…” to type one" : "Pick a role";
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
        const adminOnly = u.role === ADMIN_ROLE && !isAdmin() ? "Only an Administrator can change an Administrator's account" : "";
        const block = self ? "You can't delete your own account" : lastAdmin ? "At least one active Administrator is required" : adminOnly;
        return `<tr>
          <td class="lead-cell" data-label="User"><div class="cell-dev"><span class="avatar">${esc(initials(u.name))}</span><div><b>${esc(u.name)}${self ? ' <span class="you-tag">You</span>' : ""}</b><span>${esc(u.email)}</span></div></div></td>
          <td data-label="Username" class="mono">${esc(u.username)}</td>
          <td data-label="Role">${roleBadge(u.role)}</td>
          <td data-label="Status">${u.active ? `<span class="badge ok">${ico("checkCircle")}Active</span>` : `<span class="badge off">${ico("lock")}Disabled</span>`}</td>
          <td data-label="Last sign-in" class="num">${esc(fmtLogin(u.lastLogin))}</td>
          <td data-label=""><div class="row-actions">
            <button class="btn btn-sm btn-ghost" data-uview="${u.id}" aria-label="View ${esc(u.name)}" title="View">${ico("eye")}</button>
            <button class="btn btn-sm btn-ghost" data-uedit="${u.id}" aria-label="Edit ${esc(u.name)}" title="${adminOnly || "Edit"}" ${adminOnly ? "disabled" : ""}>${ico("edit")}</button>
            <button class="btn btn-sm btn-ghost btn-danger" data-udel="${u.id}" aria-label="Delete ${esc(u.name)}" title="${block || "Delete"}" ${block ? "disabled" : ""}>${ico("trash")}</button>
          </div></td>
        </tr>`;
      }).join("") : `<tr><td colspan="6" class="muted" style="text-align:center;padding:28px">No users match your filters.</td></tr>`;
    };

    function open(u) {
      if (!allowed(u ? "users.update" : "users.create")) return;
      if (u && u.role === ADMIN_ROLE && !isAdmin()) { toast("Only an Administrator can change an Administrator's account"); return; }
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
      } else form.elements.role.value = ROLES.some((r) => r.name === "Operator") ? "Operator" : (ROLES.find((r) => r.name !== ADMIN_ROLE) || ROLES[0]).name;
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
      if (data.role === ADMIN_ROLE && (!editing || editing.role !== ADMIN_ROLE) && !isAdmin()) return fail("Only an Administrator can give someone the Administrator role.");
      if (newRole && !can("roles.create")) return fail("Your role can't create new roles — pick an existing one.");
      if (editing && me && editing.id === me.id && (!data.active || data.role !== editing.role) && editing.role === "Administrator" && activeAdmins().length === 1) return fail("You are the only active Administrator — keep your role and account active.");
      if (editing && editing.role === "Administrator" && editing.active && (data.role !== "Administrator" || !data.active) && activeAdmins().length === 1) return fail("At least one active Administrator is required.");
      const changes = editing ? [editing.name !== data.name && `name ${editing.name} → ${data.name}`, editing.username !== data.username && `username ${editing.username} → ${data.username}`,
        editing.email !== data.email && "email changed", editing.role !== data.role && `role ${editing.role} → ${data.role}`,
        editing.active !== data.active && (data.active ? "account enabled" : "account disabled"), pw && "password changed"].filter(Boolean) : [];
      if (newRole) {
        ROLES.push({ name: newRole, desc: "Added from the Users page" });
        GRANTS[newRole] = ["monitor.view"]; // view-only until permissions are given on Roles & Permissions
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
      // one line per area: "Motors — View, Create, Update"
      const g = grantsOf(u.role);
      const perms = AREAS.map((a) => [a.label, ACTIONS.filter(([k]) => g.includes(`${a.key}.${k}`)).map(([, l]) => l)]).filter(([, acts]) => acts.length);
      const d = viewDialog({
        title: u.name, sub: `${u.username} · ${u.email}`,
        rows: [["Role", roleBadge(u.role)], ["Status", u.active ? "Active" : "Disabled"], ["Last sign-in", esc(fmtLogin(u.lastLogin))]],
        body: `<div><div class="detail-title">What this role can do <a class="link-btn" href="roles.html" style="margin-left:6px">Edit permissions</a></div><ul class="perm-list">${perms.map(([area, acts]) => `<li>${ico("checkCircle")}<span><b>${esc(area)}</b> · ${esc(acts.join(", "))}</span></li>`).join("")}</ul></div>`,
        actions: can("users.update") ? `<button type="button" class="btn btn-primary" data-v-edit>${ico("edit")}Edit</button>` : ""
      });
      const ed = d.querySelector("[data-v-edit]");
      if (ed) ed.addEventListener("click", () => { d.close(); open(u); });
    }
    async function removeUser(u) {
      if (!allowed("users.delete")) return;
      if (u.role === ADMIN_ROLE && !isAdmin()) { toast("Only an Administrator can delete an Administrator's account"); return; }
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
     Page: Roles & Permissions — roles, and a View / Create / Update / Delete grid per role.
     Administrator is a system role: always full access, can't be renamed, deleted or changed.
     ========================================================= */
  // the grid for one role: a row per area, a column per action ("—" where the action doesn't exist)
  function permGrid(have, editable) {
    return `<div class="table-wrap"><table class="table crud-table">
      <thead><tr><th>Area</th>${ACTIONS.map(([, l]) => `<th class="crud-col">${l}</th>`).join("")}</tr></thead>
      <tbody>${AREAS.map((a) => `<tr>
        <td class="crud-area"><b>${esc(a.label)}</b><small>${esc(Object.values(a.does)[0])}</small></td>
        ${ACTIONS.map(([k, l]) => {
          const key = `${a.key}.${k}`, p = PERMISSIONS.find((x) => x.key === key);
          if (!p) return `<td class="crud-cell na"><span title="Not used for ${esc(a.label)}">—</span></td>`;
          const lock = !editable || !!p.locked;
          return `<td class="crud-cell"><label class="perm-check${lock ? " locked" : ""}" title="${esc(a.does[k])}${p.locked ? " · always on" : ""}">
            <input type="checkbox" data-perm="${key}" ${have.includes(key) || p.locked ? "checked" : ""} ${lock ? "disabled" : ""} aria-label="${esc(a.label)} · ${l}: ${esc(a.does[k])}"><span>${ico("check")}</span></label></td>`;
        }).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  // tick rules: Create / Update / Delete bring View with them; removing View clears the rest of the row
  function permGridTick(root, cb) {
    const [area, act] = cb.dataset.perm.split(".");
    const box = (k) => root.querySelector(`input[data-perm="${area}.${k}"]`);
    if (act !== "view" && cb.checked && box("view")) box("view").checked = true;
    if (act === "view" && !cb.checked) ACTIONS.forEach(([k]) => { const x = box(k); if (x && !x.disabled) x.checked = false; });
  }
  const gridKeys = (root) => withViews($$("input[data-perm]:checked", root).map((c) => c.dataset.perm));
  const sameKeys = (a, b) => [...a].sort().join() === [...b].sort().join();
  const permDiff = (was, now) => {
    const add = now.filter((k) => !was.includes(k)).map(permLabel), rem = was.filter((k) => !now.includes(k)).map(permLabel);
    return [add.length ? `granted: ${add.join(", ")}` : "", rem.length ? `removed: ${rem.join(", ")}` : ""].filter(Boolean).join(" — ");
  };

  function pageRoles() {
    const dlg = $("#roleDialog"), form = $("#roleForm"), err = $("#rfError"), grid = $("#permGrid");
    let editing = null;
    let current = (ROLES.find((r) => r.name !== ADMIN_ROLE) || ROLES[0]).name; // role shown in the grid
    const snapshot = () => Object.fromEntries(ROLES.map((r) => [r.name, grantsOf(r.name)]));
    let draft = snapshot();
    const changed = (name) => !sameKeys(draft[name] || [], grantsOf(name));
    const editable = () => current !== ADMIN_ROLE && can("roles.update");

    // everything except the grid itself, so ticking a box keeps keyboard focus
    const renderTop = () => {
      $("#roleCount").textContent = `${ROLES.length} role${ROLES.length === 1 ? "" : "s"}`;
      $("#roleCards").innerHTML = ROLES.map((r) => {
        const n = USERS.filter((u) => u.role === r.name).length, g = (draft[r.name] || []).length, sys = r.name === ADMIN_ROLE;
        return `<div class="card role-card${r.name === current ? " is-current" : ""}">
          <div class="role-top">${roleBadge(r.name)}<span class="muted">${n} user${n === 1 ? "" : "s"}</span></div>
          <p>${esc(r.desc || "—")}</p>
          <div class="role-meter"><span class="bar"><i style="width:${((g / PERMISSIONS.length) * 100).toFixed(0)}%"></i></span><span class="num">${g} / ${PERMISSIONS.length}</span></div>
          <div class="role-actions">
            <button type="button" class="btn btn-sm" data-rshow="${esc(r.name)}">${ico("key")}Permissions</button>
            <a class="btn btn-sm btn-ghost" href="users.html?role=${encodeURIComponent(r.name)}" title="Users with this role">${ico("users")}</a>
            ${sys ? `<span class="role-sys" title="The Administrator role always has full access">${ico("lock")}System</span>` : `
            <button type="button" class="btn btn-sm btn-ghost" data-redit="${esc(r.name)}" aria-label="Edit ${esc(r.name)}" title="Edit">${ico("edit")}</button>
            <button type="button" class="btn btn-sm btn-ghost btn-danger" data-rdel="${esc(r.name)}" aria-label="Delete ${esc(r.name)}" title="Delete">${ico("trash")}</button>`}
          </div>
        </div>`;
      }).join("");
      $("#permRoles").innerHTML = ROLES.map((r) => `<button type="button" class="role-tab${r.name === current ? " on" : ""}" data-rtab="${esc(r.name)}" aria-pressed="${r.name === current}">${esc(r.name)}${changed(r.name) ? ' <i class="tab-dot" title="Unsaved changes"></i>' : ""}</button>`).join("")
        + (can("roles.create") ? `<button type="button" class="role-tab add" data-rnew>${ico("plus")}Custom role</button>` : "");
      $("#permNote").textContent = current === ADMIN_ROLE ? "Administrator always has every permission and can't be changed."
        : !can("roles.update") ? "Your role can see these permissions but not change them."
        : `What people with the ${current} role may do · Create, Update and Delete include View.`;
      const d = ROLES.some((r) => changed(r.name));
      $("#permDirty").hidden = !d; $("#permSave").disabled = !d;
    };
    const render = () => { if (!ROLES.some((r) => r.name === current)) current = ROLES[0].name; grid.innerHTML = permGrid(draft[current] || [], editable()); renderTop(); };

    // ----- add / edit role (name, description, permissions) -----
    function open(role) {
      if (!allowed(role ? "roles.update" : "roles.create")) return;
      editing = role || null;
      form.reset(); err.classList.remove("show");
      $("#rTitle").textContent = role ? `Edit role · ${role.name}` : "Add role";
      $("#rSave").textContent = role ? "Save role" : "Add role";
      form.elements.name.value = role ? role.name : "";
      form.elements.desc.value = role ? role.desc || "" : "";
      // a custom role can start as a copy of another role (only when adding)
      $("#rFromBox").hidden = !!role;
      form.elements.from.innerHTML = `<option value="">Blank · view live readings only</option>` + ROLES.map((r) => `<option>${esc(r.name)}</option>`).join("");
      $("#rPerms").innerHTML = permGrid(role ? draft[role.name] || [] : ["monitor.view"], true);
      dlg.showModal();
    }
    form.elements.from.addEventListener("change", (e) => { $("#rPerms").innerHTML = permGrid(e.target.value ? grantsOf(e.target.value) : ["monitor.view"], true); });
    $("#rPerms").addEventListener("change", (e) => { const cb = e.target.closest("input[data-perm]"); if (cb) permGridTick($("#rPerms"), cb); });
    $("#rAll").addEventListener("click", () => $$("#rPerms input:not(:disabled)").forEach((c) => (c.checked = true)));
    $("#rNone").addEventListener("click", () => $$("#rPerms input:not(:disabled)").forEach((c) => (c.checked = false)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fail = (m) => { err.textContent = m; err.classList.add("show"); };
      const name = form.elements.name.value.trim().replace(/\s+/g, " "), desc = form.elements.desc.value.trim();
      if (name.length < 2 || name.length > 30) return fail("Role name: 2–30 characters.");
      if (!/^[A-Za-z0-9 &/_-]+$/.test(name)) return fail("Role name: letters, numbers, spaces, & / _ - only.");
      if (ROLES.some((r) => r !== editing && r.name.toLowerCase() === name.toLowerCase())) return fail(`A role called ${name} already exists.`);
      const perms = gridKeys($("#rPerms"));
      const oldName = editing ? editing.name : null, oldPerms = editing ? grantsOf(editing.name) : [];
      if (editing) {
        if (oldName !== name) {
          USERS.forEach((u) => { if (u.role === oldName) u.role = name; });
          delete GRANTS[oldName]; delete draft[oldName];
          saveUsers();
        }
        editing.name = name; editing.desc = desc;
      } else ROLES.push({ name, desc });
      GRANTS[name] = perms; draft[name] = grantsOf(name);
      current = name;
      saveRoles(); saveGrants(); applyPerms();
      const diff = permDiff(oldPerms, grantsOf(name));
      logActivity("role", editing ? `Edited role ${name}${oldName !== name ? ` (renamed from ${oldName})` : ""}${diff ? ` — ${diff}` : oldName === name ? " — no permission changes" : ""}`
        : `Added role ${name} with ${grantsOf(name).length} permissions: ${grantsOf(name).map(permLabel).join(", ")}`);
      dlg.close(); toast(editing ? `Role ${name} saved` : `Role ${name} added`);
      render();
    });
    async function removeRole(role) {
      if (!allowed("roles.delete")) return;
      const n = USERS.filter((u) => u.role === role.name).length;
      if (n) {
        await confirmDialog({ title: `${role.name} is in use`, message: `${n} user${n === 1 ? " has" : "s have"} this role. Move ${n === 1 ? "that user" : "them"} to another role on the Users page, then delete it.`, confirmLabel: "OK", danger: false });
        return;
      }
      if (!(await confirmDialog({ title: `Delete role ${role.name}?`, message: "The role and its permissions are removed. This cannot be undone.", confirmLabel: "Delete role" }))) return;
      ROLES = ROLES.filter((r) => r !== role);
      delete GRANTS[role.name]; delete draft[role.name];
      saveRoles(); saveGrants(); logActivity("role", `Deleted role ${role.name}`); toast(`Role ${role.name} deleted`); render();
    }

    $("#addRole").addEventListener("click", () => open());
    $("#roleCards").addEventListener("click", (e) => {
      const b = e.target.closest("[data-redit],[data-rdel],[data-rshow]"); if (!b) return;
      const role = ROLES.find((r) => r.name === (b.dataset.redit || b.dataset.rdel || b.dataset.rshow)); if (!role) return;
      if (b.dataset.rshow) { current = role.name; render(); $("#permCard").scrollIntoView({ block: "start", behavior: calm.matches ? "auto" : "smooth" }); }
      else if (b.dataset.redit) open(role); else removeRole(role);
    });
    $("#permRoles").addEventListener("click", (e) => {
      if (e.target.closest("[data-rnew]")) { open(); return; }
      const b = e.target.closest("[data-rtab]"); if (b) { current = b.dataset.rtab; render(); }
    });
    // ----- the grid: tick, then Save (changes for several roles can be saved together) -----
    grid.addEventListener("change", (e) => {
      const cb = e.target.closest("input[data-perm]"); if (!cb) return;
      permGridTick(grid, cb);
      draft[current] = gridKeys(grid);
      renderTop();
    });
    $("#permSave").addEventListener("click", () => {
      if (!allowed("roles.update")) return;
      const diff = ROLES.filter((r) => changed(r.name)).map((r) => `${r.name}: ${permDiff(grantsOf(r.name), draft[r.name])}`);
      ROLES.forEach((r) => { if (r.name !== ADMIN_ROLE) GRANTS[r.name] = (draft[r.name] || []).slice(); });
      saveGrants(); applyPerms();
      logActivity("role", `Saved permissions — ${diff.join("; ")}`);
      draft = snapshot(); render(); toast("Permissions saved");
    });
    $("#permReset").addEventListener("click", async () => {
      if (!allowed("roles.update")) return;
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
      saveCsv([["Time", "User", "Username", "Role", "Category", "Activity"], ...list.map((e) => [when(e.t), e.user, e.username, e.role, ACT_CATS[e.cat] || e.cat, e.text])], `tractiontherm-activity-${fileStamp()}.csv`);
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
    // a page needs its area's View permission
    const PAGE_VIEW = { motors: "motors.view", devices: "devices.view", device: "devices.view", settings: "limits.view", reports: "reports.view", activity: "activity.view", users: "users.view", roles: "roles.view" };
    if (PAGE_VIEW[page] && !can(PAGE_VIEW[page])) { location.replace("dashboard.html"); return; }
    if (page === "login") store.set(SESSION_KEY, null);
    initShell();
    applyPerms();
    $$('.nav a[href="index.html"]').forEach((a) => a.addEventListener("click", () => { logActivity("auth", "Signed out"); store.set(SESSION_KEY, null); }));
    const pages = { dashboard: pageDashboard, monitor: pageMonitor, motor: pageMotor, reports: pageReports, devices: pageDevices, device: pageDevice, motors: pageMotorMgmt, settings: pageSettings, users: pageUsers, roles: pageRoles, activity: pageActivity, login: pageLogin };
    const render = pages[page] ? pages[page]() : null;
    if (render) rerender = render;
    animateValues();
    if (!calm.matches) { document.body.classList.add("anim-in"); setTimeout(() => document.body.classList.remove("anim-in"), 1600); }
    if (page !== "login") updateAlertCount();
    if (render) setInterval(() => { tick(); render(); animateValues(); }, STEP_MS);
    else if (page !== "login") setInterval(tick, STEP_MS);
  });
})();
