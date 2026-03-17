import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Fingerprint, Activity, Zap, Orbit, Database, Cpu, Radio } from 'lucide-react';

// --- DATA ---
const LAWS = [
  {
    id: 1,
    title: "Dualitatea și polaritatea",
    subtitle: "Echilibrul opuselor complementare",
    color: "#00f3ff", // Cyan
    icon: <Orbit className="w-6 h-6" />,
    body: "Fiecare experiență, situație sau persoană are două fețe — una pozitivă și una negativă. Polaritatea este esența echilibrului: un dans etern între forțe aparent opuse dar indispensabile pentru armonie.",
    insight: "Cel mai mare cadou pe care ți-l face cineva care aduce ceva negativ în viața ta este că joacă acel rol până devii suficient de confortabil să îți asumi tu însuți acea latură întunecată.",
    domain: "Fizică Cuantică",
    keywords: ["ECHILIBRU", "POLARITATE", "YIN-YANG"],
    visual: "[ LUMINĂ ] ⟷ [ ÎNTUNERIC ]"
  },
  {
    id: 2,
    title: "Transformarea",
    subtitle: "Nimic nu se pierde, totul se transformă",
    color: "#ff3366", // Neon Pink
    icon: <Activity className="w-6 h-6" />,
    body: "Energia ta poate lua diverse forme și direcții. Această lege te ajută să fii deschis schimbării, să înveți din fiecare experiență și să te redefinești constant. Schimbarea nu este pierdere — este metamorfoză.",
    insight: "Când accepți că totul se transformă, nu mai lupți contra curentului. Fiecare criză devine materia primă pentru următoarea versiune a ta.",
    domain: "Termodinamică",
    keywords: ["METAMORFOZĂ", "ENERGIE", "FLUX"],
    visual: "[ CRIZĂ ] ⟶ [ CREȘTERE ]"
  },
  {
    id: 3,
    title: "Reflexia",
    subtitle: "Tot ce vezi în ceilalți este oglindirea ta",
    color: "#00ff9d", // Neon Green
    icon: <Fingerprint className="w-6 h-6" />,
    body: "Legea Reflexiei te invită într-o călătorie spre autodescoperire: tot ceea ce vezi în ceilalți este oglindirea propriei naturi. Te încurajează să îți înfrunți cu compasiune aspectele pe care le percepi ca negative.",
    insight: "Tot ce există în microcosmosul tău este o reflectare a macrocosmosului — într-o formă unică.",
    domain: "Psihologie",
    keywords: ["OGLINDĂ", "PROIECȚIE", "AUTENTICITATE"],
    visual: "[ EU ] ⟷ [ CELĂLALT ]"
  },
  {
    id: 4,
    title: "Fractalii",
    subtitle: "Cum faci un lucru, așa le faci pe toate",
    color: "#7000ff", // Deep Purple
    icon: <Cpu className="w-6 h-6" />,
    body: "Fiecare detaliu din viața ta este o reflexie a întregului. Fiecare gest și acțiune se răsfrânge asupra tuturor celorlalte aspecte ale existenței, creând un model complex și interconectat.",
    insight: "Observă cum te comporti într-un singur domeniu al vieții — acolo vei găsi tiparul care se repetă în toate celelalte.",
    domain: "Geometrie Fractală",
    keywords: ["TIPAR", "AUTO-SIMILARITATE", "MICRO-MACRO"],
    visual: "[ PARTE ] ≈ [ ÎNTREG ]"
  },
  {
    id: 5,
    title: "Atracția și gravitația",
    subtitle: "Ce emiți în lume, atragi înapoi",
    color: "#ffb700", // Neon Gold
    icon: <Database className="w-6 h-6" />,
    body: "Tot ceea ce gândești și simți atrage spre tine experiențe similare. Circumstanțele din viața ta sunt atrase ca un magnet de valorile și principiile tale fundamentale.",
    insight: "Dacă ai ordine interioară și transmiți cu iubire, vindecarea devine posibilă la orice nivel, proporțional cu nivelul de ordine.",
    domain: "Fizică Newtoniană",
    keywords: ["FRECVENȚĂ", "MAGNETISM", "VIBRAȚIE"],
    visual: "[ GÂNDURI ] ⟶ [ REALITATE ]"
  },
  {
    id: 6,
    title: "Escalarea eristică",
    subtitle: "Chemarea către echilibru complet",
    color: "#ff003c", // Crimson
    icon: <Zap className="w-6 h-6" />,
    body: "Intervine când tinzi să vezi doar jumătatea pozitivă și să scapi de cea negativă. Această lege funcționează ca o chemare către echilibru, deschidere, flexibilitate și grație.",
    insight: "Cu cât fugi mai tare de un aspect al realității, cu atât mai puternic te urmărește. Acceptarea ambelor jumătăți dizolvă conflictul.",
    domain: "Dinamica Conflictului",
    keywords: ["ACCEPTARE", "UMBRĂ", "FLEXIBILITATE"],
    visual: "[ DOAR + ] ⍻ [ CONFLICT ]"
  },
  {
    id: 7,
    title: "Sincronicitatea",
    subtitle: "Fiecare acțiune declanșează o reacție",
    color: "#ccff00", // Lime
    icon: <Radio className="w-6 h-6" />,
    body: "Fiecare energie emisă se întoarce sub forma unei forțe egale și opuse. Această lege te îndeamnă să deschizi ochii pentru a recunoaște acele semne subtile care te ghidează.",
    insight: "Nu există coincidențe, ci doar o rețea complexă de modele și conexiuni care te îndeamnă să îți asumi propria transformare.",
    domain: "Mecanică Cuantică",
    keywords: ["SEMNE", "SINCRONICITATE", "CONEXIUNE"],
    visual: "[ ACȚIUNE ] ⇄ [ REACȚIE ]"
  }
];

// --- CANVAS BACKGROUND COMPONENT ---
const SineWaveBackground = ({ isIntro, activeColor }: { isIntro: boolean, activeColor: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Smoothly transition amplitude and speed
    let currentAmplitudeMult = isIntro ? 2.5 : 0.8;
    let currentSpeedMult = isIntro ? 1.5 : 0.5;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 243, 255';
    };

    const draw = () => {
      // Target values based on state
      const targetAmp = isIntro ? 2.5 : 0.8;
      const targetSpeed = isIntro ? 1.5 : 0.5;
      
      // Lerp
      currentAmplitudeMult += (targetAmp - currentAmplitudeMult) * 0.05;
      currentSpeedMult += (targetSpeed - currentSpeedMult) * 0.05;

      // Fade background for trail effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01 * currentSpeedMult;
      const rgbColor = hexToRgb(activeColor);

      const waves = [
        { amp: 120, freq: 0.002, speedOffset: 1, phase: 0, opacity: 0.6, width: 2 },
        { amp: 80, freq: 0.003, speedOffset: -1.5, phase: Math.PI / 2, opacity: 0.4, width: 1.5 },
        { amp: 180, freq: 0.0015, speedOffset: 2, phase: Math.PI, opacity: 0.2, width: 3 },
        { amp: 50, freq: 0.005, speedOffset: 0.5, phase: Math.PI / 4, opacity: 0.8, width: 1 }
      ];

      ctx.globalCompositeOperation = 'screen';

      waves.forEach((wave) => {
        ctx.beginPath();
        const centerY = canvas.height / 2;
        
        for (let x = 0; x < canvas.width; x += 5) {
          // Add some complex modulation
          const modulation = Math.sin(x * 0.001 + time) * 0.5 + 1;
          const y = centerY + Math.sin(x * wave.freq + time * wave.speedOffset + wave.phase) * (wave.amp * currentAmplitudeMult * modulation);
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(${rgbColor}, ${wave.opacity})`;
        ctx.lineWidth = wave.width;
        ctx.shadowBlur = isIntro ? 20 : 10;
        ctx.shadowColor = `rgba(${rgbColor}, 0.8)`;
        ctx.stroke();
      });

      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isIntro, activeColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-80"
    />
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [isIntro, setIsIntro] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const activeLaw = LAWS[activeIndex];

  // Keyboard & Wheel Navigation
  const handleNext = useCallback(() => {
    if (isIntro) return;
    setActiveIndex((prev) => (prev + 1) % LAWS.length);
  }, [isIntro]);

  const handlePrev = useCallback(() => {
    if (isIntro) return;
    setActiveIndex((prev) => (prev - 1 + LAWS.length) % LAWS.length);
  }, [isIntro]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') handlePrev();
      if (e.key === 'Enter' && isIntro) setIsIntro(false);
    };

    const handleWheel = (e: WheelEvent) => {
      if (isIntro || isScrolling) return;
      setIsScrolling(true);
      
      if (e.deltaY > 50) handleNext();
      else if (e.deltaY < -50) handlePrev();
      
      setTimeout(() => setIsScrolling(false), 800); // Debounce wheel
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleNext, handlePrev, isIntro, isScrolling]);

  return (
    <div className="relative w-full h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-white/20">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-grid z-0 opacity-30 pointer-events-none"></div>
      <SineWaveBackground isIntro={isIntro} activeColor={isIntro ? '#00f3ff' : activeLaw.color} />
      
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] z-0 pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {isIntro ? (
          // --- INTRO SCREEN ---
          <motion.div 
            key="intro"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              className="text-center space-y-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="font-mono text-xs tracking-[0.3em] text-[#00f3ff] mb-8 opacity-70">
                [ SYSTEM INITIALIZED // MONICA ION METHODOLOGY ]
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter">
                CELE 7 LEGI
                <br />
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                  UNIVERSALE
                </span>
              </h1>
              <p className="font-mono text-sm tracking-widest text-white/50 max-w-md mx-auto leading-relaxed">
                HARTA INTERIOARĂ A TRANSFORMĂRII DURABILE. O CĂLĂTORIE PRIN FRECVENȚELE REALITĂȚII.
              </p>
              
              <motion.button
                onClick={() => setIsIntro(false)}
                className="mt-12 group relative px-8 py-4 bg-transparent border border-white/20 hover:border-[#00f3ff] overflow-hidden transition-colors duration-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-[#00f3ff]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                <span className="relative font-mono text-sm tracking-[0.2em] text-white group-hover:text-[#00f3ff] transition-colors duration-500">
                  INIȚIAZĂ SECVENȚA
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          // --- MAIN EXPLORATION UI ---
          <motion.div 
            key="main"
            className="absolute inset-0 z-10 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {/* Top HUD */}
            <header className="w-full p-6 flex justify-between items-center font-mono text-xs tracking-widest border-b border-white/5 bg-black/20 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeLaw.color }}></div>
                <span className="opacity-50 hidden md:inline">SYS.OP.01 //</span>
                <span>METODOLOGIA FTP</span>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <span>[ ONLINE ]</span>
              </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
              
              {/* Left/Right Navigation Areas */}
              <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20">
                <button onClick={handlePrev} className="p-4 rounded-full border border-white/10 bg-black/50 backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition-all group">
                  <ChevronLeft className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </button>
              </div>
              <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20">
                <button onClick={handleNext} className="p-4 rounded-full border border-white/10 bg-black/50 backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition-all group">
                  <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Law Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLaw.id}
                  className="w-full max-w-4xl relative"
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Glowing backdrop */}
                  <div 
                    className="absolute inset-0 blur-3xl opacity-20 transition-colors duration-1000"
                    style={{ backgroundColor: activeLaw.color }}
                  ></div>

                  <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 overflow-hidden">
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/30"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                      
                      {/* Left Column: Title & Meta */}
                      <div className="lg:col-span-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10" style={{ color: activeLaw.color }}>
                              {activeLaw.icon}
                            </div>
                            <div className="font-mono text-sm tracking-widest opacity-60">
                              LEGEA 0{activeLaw.id}
                            </div>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 leading-tight">
                            {activeLaw.title}
                          </h2>
                          <p className="text-lg text-white/50 font-light italic mb-8">
                            "{activeLaw.subtitle}"
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="font-mono text-xs tracking-widest opacity-40 mb-2">PARAMETRI:</div>
                          <div className="flex flex-wrap gap-2">
                            {activeLaw.keywords.map(kw => (
                              <span key={kw} className="px-3 py-1 text-[10px] font-mono border border-white/10 bg-white/5 tracking-wider">
                                {kw}
                              </span>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-white/10 mt-6">
                            <div className="font-mono text-xs tracking-widest opacity-40 mb-1">DOMENIU SURSĂ:</div>
                            <div className="text-sm" style={{ color: activeLaw.color }}>{activeLaw.domain}</div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Content */}
                      <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                        <p className="text-base md:text-lg leading-relaxed font-light text-white/80">
                          {activeLaw.body}
                        </p>

                        <div className="p-6 bg-white/5 border-l-2 relative overflow-hidden group" style={{ borderColor: activeLaw.color }}>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: activeLaw.color }}></div>
                          <div className="font-mono text-xs tracking-widest mb-3 opacity-50 flex items-center gap-2">
                            <Database className="w-3 h-3" /> INSIGHT DECODAT
                          </div>
                          <p className="text-sm md:text-base italic leading-relaxed text-white/90">
                            {activeLaw.insight}
                          </p>
                        </div>

                        <div className="font-mono text-sm tracking-widest text-center py-4 border border-white/5 bg-black/50">
                          {activeLaw.visual}
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Timeline */}
            <footer className="w-full p-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
              <div className="max-w-4xl mx-auto flex justify-between items-center relative">
                {/* Connecting line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 z-0"></div>
                
                {LAWS.map((law, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button 
                      key={law.id}
                      onClick={() => setActiveIndex(idx)}
                      className="relative z-10 flex flex-col items-center gap-3 group"
                    >
                      <div 
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? 'scale-150' : 'bg-white/20 group-hover:bg-white/50'}`}
                        style={{ backgroundColor: isActive ? law.color : undefined, boxShadow: isActive ? `0 0 15px ${law.color}` : 'none' }}
                      ></div>
                      <span className={`font-mono text-[10px] tracking-widest transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white/70'} hidden md:block absolute top-6 whitespace-nowrap`}>
                        0{law.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
