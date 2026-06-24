/* ==================================================================
   Freyr Pulse — Design System (Enterprise refresh)
   ------------------------------------------------------------------
   Identity: deep navy / charcoal base, a single teal accent, a cool
   soft-gray canvas with crisp white cards. Bold where it counts (the
   Opportunity Score and the "Why Should Freyr Care?" verdict sit on a
   dark navy panel), quiet everywhere else. Not colourful, not cluttered.
   ================================================================== */

:root {
  /* ---- Text ---- */
  --ink: #0f1b2e;          /* charcoal-navy, primary text */
  --ink-soft: #38465b;     /* secondary text */
  --muted: #64748b;        /* tertiary / captions */
  --faint: #94a3b8;        /* hints / disabled */

  /* ---- Surfaces ---- */
  --paper: #eef1f6;        /* app canvas (cool soft gray) */
  --surface: #ffffff;      /* cards */
  --surface-2: #f1f4f9;    /* inset / hover */
  --line: #e2e8f1;         /* hairline borders */
  --line-strong: #cfd8e6;

  /* ---- Navy base / dark chrome ---- */
  --navy: #0b1f33;
  --navy-2: #103155;
  --navy-line: #21456b;
  --ink-on-dark: #eef4fb;
  --muted-on-dark: #9fb6cf;

  /* ---- The one accent: teal ---- */
  --accent: #0d9488;
  --accent-ink: #0b7d72;   /* darker, for text on light */
  --accent-bright: #2dd4bf;/* highlight (rings on dark) */
  --accent-soft: #e6f6f3;
  --accent-line: #b7e3dc;

  /* ---- Semantic (low-saturation) ---- */
  --high: #0d9488;  --high-soft: #e6f6f3;
  --med: #b45309;   --med-soft: #fbeede;
  --low: #64748b;   --low-soft: #eaeef4;
  --danger: #b91c1c; --danger-soft: #fbe9e9;

  /* ---- Type ---- */
  --font-display: "Fraunces", Georgia, "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;

  /* ---- Radius / shadow / layout ---- */
  --r-sm: 7px;
  --r-md: 11px;
  --r-lg: 16px;
  --shadow-sm: 0 1px 2px rgba(15, 27, 46, 0.05), 0 1px 3px rgba(15, 27, 46, 0.05);
  --shadow-md: 0 6px 16px rgba(15, 27, 46, 0.07), 0 18px 40px rgba(15, 27, 46, 0.08);
  --shadow-navy: 0 10px 30px rgba(11, 31, 51, 0.28);
  --maxw: 1200px;
}

* { box-sizing: border-box; }

html, body {
  margin: 0; padding: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

a { color: var(--accent-ink); text-decoration: none; }
a:hover { text-decoration: underline; }

h1, h2, h3, h4 { margin: 0; font-weight: 650; line-height: 1.18; letter-spacing: -0.015em; color: var(--ink); }

button { font-family: inherit; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: var(--r-sm); }

/* ---- Layout helpers ---- */
.container { max-width: var(--maxw); margin: 0 auto; padding: 0 28px; }
.stack > * + * { margin-top: 16px; }
.row { display: flex; align-items: center; gap: 12px; }
.row-wrap { display: flex; flex-wrap: wrap; gap: 12px; }
.spread { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.grid { display: grid; gap: 18px; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 880px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }

/* ---- Eyebrow (mono label) ---- */
.eyebrow {
  font-family: var(--font-mono);
  font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--muted); font-weight: 500;
}

/* ---- Cards ---- */
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}
.card-pad-lg { padding: 30px; }
.card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.card-title { font-size: 18px; font-weight: 650; letter-spacing: -0.01em; }
.card-sub { color: var(--muted); font-size: 13.5px; }

/* Clickable card (search results, quick picks) */
.card-link { cursor: pointer; transition: box-shadow .16s ease, transform .08s ease, border-color .16s ease; }
.card-link:hover { box-shadow: var(--shadow-md); border-color: var(--line-strong); transform: translateY(-1px); }
.card-link:active { transform: translateY(0); }

.section-num { font-family: var(--font-mono); font-size: 12px; color: var(--accent-ink); font-weight: 500; }

/* ---- Dividers ---- */
.hr { height: 1px; background: var(--line); border: 0; margin: 20px 0; }
.hr-dotted { height: 0; border: 0; border-top: 1px dashed var(--line-strong); margin: 16px 0; }

/* ---- Chips / badges ---- */
.chip {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 500; padding: 4px 11px; border-radius: 999px;
  background: var(--surface-2); color: var(--ink-soft); border: 1px solid var(--line);
  white-space: nowrap;
}
.chip-accent { background: var(--accent-soft); color: var(--accent-ink); border-color: var(--accent-line); }
.chip-mono { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.04em; }

/* Confidence chips */
.conf {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.06em;
  text-transform: uppercase; font-weight: 500; padding: 3px 9px; border-radius: 999px;
  border: 1px solid var(--line);
}
.conf::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.conf-verified { color: var(--high); background: var(--high-soft); border-color: var(--accent-line); }
.conf-likely   { color: var(--med);  background: var(--med-soft);  border-color: #ecd9bd; }
.conf-inferred { color: var(--low);  background: var(--low-soft);  border-color: var(--line-strong); }
.conf-unknown  { color: var(--faint);background: var(--surface-2); border-color: var(--line); }

/* Opportunity level pill */
.level { font-family: var(--font-mono); font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; font-size: 11.5px; padding: 5px 13px; border-radius: 999px; }
.level-high { color: #042f2a; background: var(--accent-bright); }
.level-medium { color: #fff; background: var(--med); }
.level-low { color: #fff; background: var(--low); }

/* ---- Buttons ---- */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 14px; font-weight: 550; text-decoration: none;
  padding: 10px 17px; border-radius: var(--r-md);
  border: 1px solid var(--line-strong); background: var(--surface); color: var(--ink);
  cursor: pointer; transition: background .15s ease, border-color .15s ease, transform .05s ease, box-shadow .15s ease;
}
.btn:hover { background: var(--surface-2); text-decoration: none; }
.btn:active { transform: translateY(1px); }
.btn-primary { background: var(--accent); border-color: var(--accent); color: #fff; box-shadow: 0 1px 2px rgba(13,148,136,.25); }
.btn-primary:hover { background: var(--accent-ink); border-color: var(--accent-ink); }
.btn-dark { background: var(--navy); border-color: var(--navy); color: var(--ink-on-dark); }
.btn-dark:hover { background: var(--navy-2); }
.btn-ghost { border-color: transparent; background: transparent; color: var(--ink-soft); }
.btn-ghost:hover { background: var(--surface-2); }
.btn-sm { padding: 7px 12px; font-size: 13px; }
.btn:disabled { opacity: .5; cursor: not-allowed; }

/* ---- Forms ---- */
.input, .select, .textarea {
  width: 100%; font-family: inherit; font-size: 14px; color: var(--ink);
  background: var(--surface); border: 1px solid var(--line-strong);
  border-radius: var(--r-md); padding: 11px 13px;
}
.textarea { resize: vertical; min-height: 90px; line-height: 1.5; }
.input:focus, .select:focus, .textarea:focus { outline: 2px solid var(--accent); outline-offset: 0; border-color: var(--accent); }
.field-label { display: block; font-size: 13px; font-weight: 550; color: var(--ink-soft); margin-bottom: 6px; }

/* ---- Utility text ---- */
.muted { color: var(--muted); }
.soft { color: var(--ink-soft); }
.small { font-size: 13.5px; }
.tiny { font-size: 12px; }
.mono { font-family: var(--font-mono); }
.display { font-family: var(--font-display); }
.strong { font-weight: 650; }
.nowrap { white-space: nowrap; }
.fade-in { animation: fadeIn .4s ease both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

/* ---- Lists ---- */
.list-reasons { margin: 0; padding: 0; list-style: none; }
.list-reasons li { position: relative; padding-left: 22px; margin: 9px 0; }
.list-reasons li::before { content: ""; position: absolute; left: 4px; top: 9px; width: 7px; height: 7px; border-radius: 2px; background: var(--accent); transform: rotate(45deg); }
.list-check { margin: 0; padding: 0; list-style: none; }
.list-check li { position: relative; padding-left: 24px; margin: 8px 0; }
.list-check li::before { content: "→"; position: absolute; left: 0; top: 0; color: var(--accent-ink); font-weight: 600; }

/* ---- Dark panel (hero / nav) ---- */
.panel-dark {
  background: linear-gradient(150deg, var(--navy) 0%, var(--navy-2) 100%);
  color: var(--ink-on-dark);
  border: 1px solid var(--navy-line);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-navy);
}
.panel-dark .eyebrow { color: var(--accent-bright); }

/* ---- Demo data notice ---- */
.demo-notice {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 500; color: var(--med);
  background: var(--med-soft); border: 1px solid #ecd9bd;
  padding: 6px 12px; border-radius: 999px;
}
.demo-notice::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--med); flex: 0 0 auto; }

/* Button-styled links shouldn't pick up the global anchor underline on hover */
.btn:hover, .brand:hover { text-decoration: none; }

/* The verdict hero stacks on small screens (score dial above the verdict) */
.why-hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; }
@media (max-width: 640px) {
  .why-hero-top { flex-direction: column-reverse; align-items: center; }
  .why-hero-top .why-hero-verdict { width: 100%; }
}

/* Responsive tightening for tablet / mobile */
@media (max-width: 600px) {
  html, body { font-size: 14.5px; }
  .container { padding: 0 16px; }
  .nav-brand-text { display: none; }
  .card { padding: 18px; }
  .card-pad-lg { padding: 20px; }
  h1.display { font-size: 26px !important; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
