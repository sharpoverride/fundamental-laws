// App.jsx — The 7 Fundamental Laws, fluid scroll experience.

const { useEffect, useRef, useState, useCallback, useLayoutEffect } = React;

// Smooth lerp hook for a value (for smoothed scroll position)
function useSmoothed(target, stiffness = 0.08) {
  const [val, setVal] = useState(target);
  const raf = useRef(null);
  const current = useRef(target);
  const goal = useRef(target);
  useEffect(() => {
    goal.current = target;
    const step = () => {
      const diff = goal.current - current.current;
      if (Math.abs(diff) < 0.0005) {
        current.current = goal.current;
        setVal(current.current);
        raf.current = null;
        return;
      }
      current.current += diff * stiffness;
      setVal(current.current);
      raf.current = requestAnimationFrame(step);
    };
    if (!raf.current) raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [target, stiffness]);
  return val;
}

// (scroll mapping is done inline in App)


const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (t) => t * t * (3 - 2 * t);

// Full-screen canvas that renders blended visuals crossfading between adjacent laws.
function CosmicCanvas({ scrollProgress }) {
  const canvasRef = useRef(null);
  const raf = useRef(null);
  const timeRef = useRef(0);
  const lastTs = useRef(null);
  const progRef = useRef(scrollProgress);

  useEffect(() => { progRef.current = scrollProgress; }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = (ts) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = (ts - lastTs.current) / 1000;
      lastTs.current = ts;
      timeRef.current += dt;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // fade previous frame gently for trails
      ctx.fillStyle = "rgba(6, 6, 10, 0.18)";
      ctx.fillRect(0, 0, w, h);

      const p = progRef.current; // 0..LAWS.length (intro at -0.5..0)
      const total = window.LAWS.length;

      // which two laws to crossfade between?
      // Map scrollProgress (0..total) into active law indices.
      // During intro (p < 0), show law 0 dimly.
      const pp = Math.max(0, Math.min(total - 0.001, p));
      const i0 = Math.floor(pp);
      const i1 = Math.min(total - 1, i0 + 1);
      const k = pp - i0; // 0..1 transition
      // spend most time on each law (ease curve)
      const ease = k < 0.5 ? 0 : smooth((k - 0.5) * 2);

      const lawA = window.LAWS[i0];
      const lawB = window.LAWS[i1];

      // intro dimming
      const introFade = p < 0 ? 1 + p : 1; // p=-1 → 0, p=0 → 1
      const aA = (1 - ease) * Math.max(0.3, introFade);
      const aB = ease;

      ctx.globalAlpha = aA;
      window.LAW_VISUALS[lawA.n](ctx, timeRef.current, w, h, lawA);
      if (lawA !== lawB) {
        ctx.globalAlpha = aB;
        window.LAW_VISUALS[lawB.n](ctx, timeRef.current, w, h, lawB);
      }
      ctx.globalAlpha = 1;

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="cosmic-canvas" />;
}

// Small inline glyph — subtle SVG mark for each law
function LawGlyph({ law, size = 64 }) {
  const stroke = law.accent;
  const commonProps = { width: size, height: size, viewBox: "0 0 64 64", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  switch (law.n) {
    case 1: return (
      <svg {...commonProps}>
        <circle cx="22" cy="32" r="14" stroke={stroke} strokeWidth="1.2" opacity="0.8"/>
        <circle cx="42" cy="32" r="14" stroke={stroke} strokeWidth="1.2" opacity="0.8"/>
      </svg>
    );
    case 2: return (
      <svg {...commonProps}>
        <path d="M10 32 Q22 14 32 32 T54 32" stroke={stroke} strokeWidth="1.2"/>
        <path d="M10 32 Q22 50 32 32 T54 32" stroke={stroke} strokeWidth="1.2" opacity="0.6"/>
      </svg>
    );
    case 3: return (
      <svg {...commonProps}>
        <path d="M8 32 L56 32" stroke={stroke} strokeWidth="0.8" opacity="0.5"/>
        <path d="M12 22 Q22 12 32 22 T52 22" stroke={stroke} strokeWidth="1.2"/>
        <path d="M12 42 Q22 52 32 42 T52 42" stroke={stroke} strokeWidth="1.2"/>
      </svg>
    );
    case 4: {
      const branch = (x, y, len, ang, d, path) => {
        if (d === 0) return null;
        const x2 = x + Math.cos(ang) * len;
        const y2 = y + Math.sin(ang) * len;
        return (
          <g key={path}>
            <line x1={x} y1={y} x2={x2} y2={y2} stroke={stroke} strokeWidth={Math.max(0.6, d * 0.35)} opacity={0.4 + d * 0.12}/>
            {branch(x2, y2, len * 0.7, ang - 0.5, d - 1, path + "L")}
            {branch(x2, y2, len * 0.7, ang + 0.5, d - 1, path + "R")}
          </g>
        );
      };
      return <svg {...commonProps}>{branch(32, 56, 12, -Math.PI / 2, 4, "r")}</svg>;
    }
    case 5: return (
      <svg {...commonProps}>
        <circle cx="32" cy="32" r="3" fill={stroke}/>
        <circle cx="32" cy="32" r="10" stroke={stroke} strokeWidth="1" opacity="0.5"/>
        <circle cx="32" cy="32" r="18" stroke={stroke} strokeWidth="1" opacity="0.3"/>
        <circle cx="32" cy="32" r="26" stroke={stroke} strokeWidth="1" opacity="0.15"/>
      </svg>
    );
    case 6: return (
      <svg {...commonProps}>
        <path d="M6 32 L14 20 L22 44 L30 16 L38 48 L46 24 L58 32" stroke={stroke} strokeWidth="1.2"/>
      </svg>
    );
    case 7: return (
      <svg {...commonProps}>
        <circle cx="20" cy="24" r="2" fill={stroke}/>
        <circle cx="44" cy="40" r="2" fill={stroke}/>
        <circle cx="38" cy="18" r="2" fill={stroke}/>
        <line x1="20" y1="24" x2="44" y2="40" stroke={stroke} strokeWidth="0.8" opacity="0.5"/>
        <line x1="20" y1="24" x2="38" y2="18" stroke={stroke} strokeWidth="0.8" opacity="0.5"/>
        <line x1="44" y1="40" x2="38" y2="18" stroke={stroke} strokeWidth="0.8" opacity="0.5"/>
      </svg>
    );
    default: return null;
  }
}

// ─── Intro ──────────────────────────────────────────────────────────────
function Intro({ visible }) {
  return (
    <section className={`intro ${visible ? "" : "intro--gone"}`}>
      <div className="intro-inner">
        <div className="mono tag">Cele 7 Legi Fundamentale</div>
        <h1 className="title">
          <span className="title-line">The Seven</span>
          <span className="title-line title-em">Fundamental</span>
          <span className="title-line">Laws</span>
        </h1>
        <p className="sub">
          A quiet map of the currents that move beneath every life —
          drawn from the teaching of Monica Ion.
        </p>
        <div className="scroll-hint">
          <span className="mono">Scroll to begin</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <rect x="0.5" y="0.5" width="13" height="21" rx="6.5" stroke="currentColor" opacity="0.5"/>
            <circle cx="7" cy="6" r="1.5" fill="currentColor" className="scroll-dot"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

// ─── Chapter (one law) ─────────────────────────────────────────────────
function Chapter({ law, index, scrollProgress, introGone }) {
  const local = scrollProgress - index;
  const translateY = local * -30;
  const absLocal = Math.abs(local);
  let opacity = absLocal < 0.35 ? 1 : clamp(1 - (absLocal - 0.35) * 3.5, 0, 1);
  // Keep chapter 1 fully hidden until the intro has faded out.
  if (index === 0 && !introGone) opacity = 0;

  return (
    <section
      className="chapter"
      data-screen-label={`${String(law.n).padStart(2, "0")} ${law.english}`}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: opacity > 0.5 ? "auto" : "none",
      }}
    >
      <div className="chapter-grid">
        <div className="chapter-meta">
          <div className="num-row">
            <span className="num-roman">{["I","II","III","IV","V","VI","VII"][law.n - 1]}</span>
            <span className="num-mono mono">LAW · 0{law.n} / 07</span>
          </div>
          <div className="glyph-wrap" style={{ color: law.accent }}>
            <LawGlyph law={law} size={72} />
          </div>
          <div className="mono lens">{law.lens.toUpperCase()}</div>
          {law.domain && (
            <div className="meta-block">
              <div className="meta-label mono">Source field</div>
              <div className="meta-value" style={{ color: law.accent }}>{law.domain}</div>
            </div>
          )}
          {Array.isArray(law.keywords) && law.keywords.length > 0 && (
            <div className="keywords">
              {law.keywords.map((kw) => (
                <span key={kw} className="keyword mono">{kw}</span>
              ))}
            </div>
          )}
        </div>

        <div className="chapter-body">
          <div className="ro mono">{law.romanian}</div>
          <h2 className="chapter-title" style={{ color: "#fff" }}>
            {law.english}
          </h2>
          <p className="tagline" style={{ color: law.accent }}>
            {law.tagline}
          </p>
          <p className="body-text">{law.body}</p>
          <blockquote className="aphorism" style={{ borderColor: law.accent }}>
            <span className="aphorism-mark" style={{ color: law.accent }}>—</span>
            {law.aphorism}
          </blockquote>
          {law.visual && (
            <div className="visual mono" style={{ borderColor: law.accent + "55" }}>
              {law.visual}
            </div>
          )}
          {Array.isArray(law.questions) && law.questions.length > 0 && (
            <div className="questions">
              <div className="questions-label mono" style={{ color: law.accent }}>Sit with</div>
              <ol className="questions-list">
                {law.questions.map((q, i) => (
                  <li key={i} className="question">{q}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Outro ─────────────────────────────────────────────────────────────
function Outro({ scrollProgress }) {
  const total = window.LAWS.length;
  const local = scrollProgress - total;
  const opacity = clamp(local * 1.2, 0, 1);
  return (
    <section
      className="outro"
      style={{ opacity, pointerEvents: opacity > 0.3 ? "auto" : "none" }}
    >
      <div className="outro-inner">
        <div className="mono tag">·  ·  ·</div>
        <h2 className="outro-title">
          Seven currents.<br/>
          One movement.
        </h2>
        <p className="outro-sub">
          The laws do not stand in sequence — they braid. Live one, and you brush against the others.
        </p>
        <button className="restart" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="mono">Return to the beginning ↑</span>
        </button>
      </div>
    </section>
  );
}

// ─── Chapter rail (right-side nav) ─────────────────────────────────────
function Rail({ scrollProgress, onJump }) {
  const total = window.LAWS.length;
  // Intro is index -1 on the rail; active while in intro band.
  const introActive = scrollProgress < 0.1;
  return (
    <nav className="rail" aria-label="Laws">
      <button
        key="intro"
        className={`rail-item rail-item--intro ${introActive ? "rail-item--active" : ""}`}
        style={{ "--accent": "#f2ecdc" }}
        onClick={() => onJump(-1)}
        title="Introduction"
      >
        <span className="rail-dot" />
        <span className="rail-label mono">
          <span className="rail-num">00</span>
          <span className="rail-name">Intro</span>
        </span>
      </button>
      {window.LAWS.map((law, i) => {
        const local = scrollProgress - i;
        const active = !introActive && Math.abs(local) < 0.5;
        return (
          <button
            key={law.n}
            className={`rail-item ${active ? "rail-item--active" : ""}`}
            style={{ "--accent": law.accent }}
            onClick={() => onJump(i)}
            title={`${law.n}. ${law.english}`}
          >
            <span className="rail-dot" />
            <span className="rail-label mono">
              <span className="rail-num">0{law.n}</span>
              <span className="rail-name">{law.english}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Top HUD ───────────────────────────────────────────────────────────
function Hud({ scrollProgress }) {
  const total = window.LAWS.length;
  const introActive = scrollProgress < 0.1;
  const pp = clamp(scrollProgress, 0, total);
  const pct = Math.round(((scrollProgress + 0.1) / (total + 0.1)) * 100);
  const active = window.LAWS[Math.max(0, Math.min(total - 1, Math.floor(pp)))];

  return (
    <header className="hud">
      <div className="hud-left mono">
        <span className="hud-dot" style={{ background: introActive ? "#f2ecdc" : active.accent }} />
        <span>Monica Ion · The Seven</span>
      </div>
      <div className="hud-right mono">
        <span>{introActive ? "00" : String(Math.min(total, Math.floor(pp) + 1)).padStart(2, "0")} / 07</span>
        <span className="hud-sep">·</span>
        <span>{pct.toString().padStart(2, "0")}%</span>
      </div>
    </header>
  );
}

// (tweaks removed)

// ─── Root ──────────────────────────────────────────────────────────────
function App() {
  const total = window.LAWS.length;
  const [rawProgress, setRawProgress] = useState(0);
  const scrollProgress = useSmoothed(rawProgress, 0.09);


  // Force EB Garamond
  useEffect(() => {
    document.documentElement.style.setProperty("--serif", `"EB Garamond", Georgia, serif`);
  }, []);

  // Persist scroll
  useEffect(() => {
    const stored = parseFloat(localStorage.getItem("laws:scroll") || "0");
    if (isFinite(stored) && stored > 0) {
      requestAnimationFrame(() => window.scrollTo(0, stored));
    }
  }, []);

  // Scroll listener
  // Mapping:
  //   0%  → rawProgress = -0.1   (pure intro)
  //   5%  → rawProgress = 0      (polarity just revealing; intro done)
  //  10%  → rawProgress = 0      (polarity centered / locked)
  // After that each 4% of page scroll advances one law.
  const LAW_STEP = 0.04;
  const INTRO_END = 0.05;
  const POLARITY_LOCK = 0.08; // hold polarity from 5%..8%
  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
      let mapped;
      if (pct < INTRO_END) {
        mapped = -0.1 + (pct / INTRO_END) * 0.1; // -0.1 → 0
      } else if (pct < POLARITY_LOCK) {
        mapped = 0; // hold polarity entrance
      } else {
        mapped = (pct - POLARITY_LOCK) / LAW_STEP;
      }
      setRawProgress(mapped);
      localStorage.setItem("laws:scroll", String(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [total]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const lawStep = scrollable * LAW_STEP;
      const nudge = lawStep * 0.25;
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        window.scrollTo({ top: window.scrollY + (e.shiftKey ? lawStep : nudge), behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        window.scrollTo({ top: window.scrollY - (e.shiftKey ? lawStep : nudge), behavior: "smooth" });
      } else if (e.key === "PageDown") {
        e.preventDefault();
        window.scrollTo({ top: window.scrollY + lawStep, behavior: "smooth" });
      } else if (e.key === "PageUp") {
        e.preventDefault();
        window.scrollTo({ top: window.scrollY - lawStep, behavior: "smooth" });
      } else if (e.key === "Home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "End") {
        window.scrollTo({ top: scrollable, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const jumpTo = (index) => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (index < 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = (POLARITY_LOCK + index * LAW_STEP) * scrollable;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const introVisible = rawProgress < 0.08;
  const introGone = rawProgress > 0.1;

  return (
    <>
      <CosmicCanvas scrollProgress={scrollProgress} />
      <div className="vignette" />
      <div className="readability" />
      <div className="grain" />

      <Hud scrollProgress={scrollProgress} />
      <Rail scrollProgress={scrollProgress} onJump={jumpTo} />

      {/* Fixed stage that pins all chapters on top of each other */}
      <div className="stage">
        <Intro visible={introVisible} />
        {window.LAWS.map((law, i) => (
          <Chapter key={law.n} law={law} index={i} scrollProgress={scrollProgress} introGone={introGone} />
        ))}
        <Outro scrollProgress={scrollProgress} />
      </div>

      {/* Tall spacer drives scroll — more vh per law so each chapter lingers */}
      <div className="scroll-driver" style={{ height: `${(total + 2) * 180}vh` }} />


    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
