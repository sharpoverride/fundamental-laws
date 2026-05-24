import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Fingerprint, Activity, Zap, Orbit, Database, Cpu, Radio } from 'lucide-react';

// --- DATA ---
export interface Law {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
  theory: {
    principle: string;
    fridaySparkRef: string;
  };
  reality: {
    mechanism: string;
    validScience: string;
    pseudoscience: string;
    rating: number; 
  };
  patterns: {
    myPattern: string;
    childhood: string;
    present: string;
    cost: string;
  };
  questions: {
    diagnostic: string[];
    situational: {
      relationship: string;
      money: string;
      work: string;
      identity: string;
    };
    action: string;
  };
  keywords: string[];
  domain: string;
  visual: string;
}

const LAWS: Law[] = [
  {
    id: 1,
    title: "Dualitatea și polaritatea",
    subtitle: "Echilibrul opuselor complementare",
    color: "#00f3ff",
    icon: <Orbit className="w-6 h-6" />,
    theory: {
      principle: "Nimic nu e unilateral. Orice persoană are echilibru perfect de beneficii și dezavantaje. Mintea vede doar o față → suferință.",
      fridaySparkRef: "Ep. 25: Oaia Neagră — copilul \"problemă\" servește sistemul familial."
    },
    reality: {
      mechanism: "Cognitive reframing (CBT). Schimbarea perspectivei reduce vinovăția. Vina excesivă → beliefs 'nu merit' → autosabotaj → confirmare beliefs.",
      validScience: "Reframing cognitiv. Studii dovedesc că reappraisal-ul reduce stresul și rușinea toxica (Beck et al. 1979, Tangney & Dearing 2002).",
      pseudoscience: "\"Legea dualității\" ca lege cosmică universală e filozofie taoistă, NU fizică. Forțarea \"echilibrului perfect\" poate fi periculoasă — uneori vina E justificată și trebuie reparată acțiunea, nu doar \"echilibrată\" percepția.",
      rating: 5
    },
    patterns: {
      myPattern: "Etichetarea defensivă",
      childhood: "Nevoia de a externaliza vina pentru a nu confirma un tipar intern de inadecvare.",
      present: "\"Borderline\", \"Bully\", \"Nu oferă pasiune\" — etichetele PROTEJEAZĂ de a vedea propriul pattern (retragerea ca strategie). Externalizezi problema (\"ea e prea mult\") ca să nu procesezi inadecvarea (\"nu sunt destul\").",
      cost: "Blocaj în progresul relației și ciclu repetitiv de retragere-apropiere superficială."
    },
    questions: {
      diagnostic: [
        "Ce etichetă i-am pus recent cuiva din viața mea (partener, angajat, client)?",
        "Dacă aș scoate eticheta, ce problemă/frică a MEA ar trebui să confrunt în acea relație?"
      ],
      situational: {
        relationship: "Când partenera mă solicită emoțional, ce \"defect\" al ei scot în față ca să-mi justific retragerea?",
        money: "Ce decizie financiară proastă justific printr-o \"nevoie inerentă a pieței\" în loc să îmi asum?",
        work: "Ce angajat incompetent \"tolerez\" pentru că de fapt îmi e frică să confrunt procesul de concediere?",
        identity: "Ce etichetă negativă (lentoare, comoditate) îmi pun mie însumi pentru a mă scuza că nu fac greutățile esențiale?"
      },
      action: "Azi: Observă prima oară când pui o etichetă cuiva. Oprește-te și scrie ce simțeai TU înainte să-i pui eticheta."
    },
    keywords: ["ETICHARE", "RETRAGERE", "REFRAMING"],
    domain: "Psihologie Cognitiv-Comportamentală",
    visual: "[ CAȘTIGĂTOR ] ⟷ [ PIERZĂTOR ]"
  },
  {
    id: 2,
    title: "Transformarea",
    subtitle: "Nimic nu se pierde, totul se transformă",
    color: "#ff3366",
    icon: <Activity className="w-6 h-6" />,
    theory: {
      principle: "Nimic nu se pierde, totul se transformă. Energia ia diverse forme și direcții. Fiecare criză devine materia primă pentru următoarea versiune a ta.",
      fridaySparkRef: "Ep. 96: John Demartini — trăsăturile cuiva drag care nu mai e fizic sunt preluate de noi oameni."
    },
    reality: {
      mechanism: "Meaning-making și procesarea pierderii (Davis et al. 1998, Gross 2002). Căutarea sensului după o criză te ajută să închizi episodul. NU există garanție cosmică — uneori pierzi și punct.",
      validScience: "Reappraisal cognitiv. Găsirea de oportunități în mijlocul unei crize lărgește atenția și scade ruminația.",
      pseudoscience: "\"Forma nouă e ÎNTOTDEAUNA mai eficientă\" = wishful thinking cosmic și just-world fallacy. Forțarea găsirii de valoare pentru a echilibra un raport matematic (ex: 185k vs 175k) duce la confirmation bias și confabulare.",
      rating: 5
    },
    patterns: {
      myPattern: "Tiparul transgenerațional (Absența emoțională)",
      childhood: "Bunicul a absentat fizic, tatăl a absentat prin alcoolizm (mecanism distructiv).",
      present: "Absența emoțională nu s-a pierdut, doar și-a schimbat forma. Tu lipsești prin muncă și proiecte (mecanism aparent productiv). Forma e diferită, dar output-ul relațional e identic: Absență.",
      cost: "Perpetuarea traumei abandonului și a distanțării emoționale în următoarea generație / relație de cuplu."
    },
    questions: {
      diagnostic: [
        "Ce formă ia absența mea azi, deghizată în virtute?",
        "Care este un lucru / client / oportunitate de care mă agăț obsesiv ca să nu 'pierd', deși forma actuală face mai mult rău?"
      ],
      situational: {
        relationship: "Cum folosesc o virtute (Munca / Codul / Proiectele / Banii) ca scut perfect pentru a justifica absența mea dintr-un conflict cu ea?",
        money: "Ce justificare folosesc pentru a continua să muncesc epuizant deși rațional știu că suficiența financiară există?",
        work: "Când pretind că 'construiesc viitorul', de ce emoție stânjenitoare din prezent fug chiar acum?",
        identity: "Dacă mâine aș pierde toate proiectele și label-urile de consultant / dezvoltator, cine aș fi în cameră doar cu mine însumi?"
      },
      action: "Azi: Fii PREZENT fizic și mental 15 minute într-o discuție care în mod normal te-ar face să te retragi în muncă."
    },
    keywords: ["ABSENȚĂ", "TRANSGENERAȚIONAL", "REFUGIU"],
    domain: "Psihologia Dezvoltării",
    visual: "[ ABSENȚĂ DESTRUCTIVĂ ] ⟶ [ ABSENȚĂ PRODUCTIVĂ ]"
  },
  {
    id: 3,
    title: "Reflexia",
    subtitle: "Tot ce vezi în ceilalți este oglindirea ta",
    color: "#00ff9d",
    icon: <Fingerprint className="w-6 h-6" />,
    theory: {
      principle: "Tot ce percepi în exterior este proiecție a interiorului. Dacă admiri geniul cuiva, ai același geniu în domeniul tău. Ce condamni la altul, reprimi la tine.",
      fridaySparkRef: "Ep. 16: Oglindirea Succesului — „bogăția” celuilalt reflectă o altă formă a bogăției tale."
    },
    reality: {
      mechanism: "Proiecția psihologică jungiană + Shadow work. Vederea complexității umane prin reintegrarea părților scindate (splitting: all-good vs all-bad) scade reactivitatea.",
      validScience: "De-idealizarea sănătoasă și de-defensivarea egoului. Psihologia analitică arată clar legătura proiecției cu traumele neprocesate.",
      pseudoscience: "A o considera o 'lege universală garantată'. Nu TOT ce vezi în altul e despre tine. Uneori, un comportament toxic e doar un comportament toxic, nu e o reflecție a ta.",
      rating: 6
    },
    patterns: {
      myPattern: "Pattern-ul \"Nu oferă pasiune\"",
      childhood: "A învăța că pasiunea sau manifestarea intensă a emoțiilor duce la deconectare sau conflict (certuri în familie).",
      present: "Soția = oglinda care arată exact ce eviți în tine însuți. Ea cere vulnerabilitate, dependență emoțională, prezență pasională FĂRĂ control. Ea nu e problema, e mirror-ul care îți indică ce ai amorțit.",
      cost: "Senzația de \"uscat\" în relație, un business plan corect matematic dar lipsit de esență vitală."
    },
    questions: {
      diagnostic: [
        "Ce mă irită cel mai tare (cu o reacție disproporționată corp/minte) la altă persoană și unde fac și EU exact același lucru, dar într-o altă formă?",
        "Când declar că partenerul / celălalt 'nu îmi dă ceva', ce refuz eu să aduc la masă?"
      ],
      situational: {
        relationship: "Când îi spun că este 'prea intensă' sau că 'face o dramă', de fapt ce incapacitate a mea de a conține emoții puternice iese la suprafață?",
        money: "Când îi judec pe clienți că se zgârcesc, unde fac fix același lucru, blocând fluxul de dragul 'controlului'?",
        work: "Când refuz să colaborez cu cineva pentru că mi se pare superficial, cu ce superficialitate de-a mea nu vreau să fiu confruntat?",
        identity: "Cine aș fi dacă aș recunoaște că partea intunecată a celui pe care îl judec este de fapt fix felul în care m-am protejat?"
      },
      action: "Azi: Când vrei să critici pe cineva intern, schimbă pronumele pe tine. Ex: „El este iresponsabil” -> „Unde sunt eu iresponsabil chiar acum?”"
    },
    keywords: ["PROIECȚIE", "VULNERABILITATE", "OGLINDĂ"],
    domain: "Psihologie Analitică",
    visual: "[ EU ] ⟷ [ CELĂLALT ]"
  },
  {
    id: 4,
    title: "Fractalii",
    subtitle: "Cum faci un lucru, așa le faci pe toate",
    color: "#7000ff",
    icon: <Cpu className="w-6 h-6" />,
    theory: {
      principle: "Microcosmosul reflectă macrocosmosul. Fiecare detaliu se răsfrânge asupra celorlalte aspecte ale existenței; cum faci curat în casă e cum faci curat în conturi.",
      fridaySparkRef: "Ep. 50: Banii și Tatăl — blocajul financiar a fost fractalul refuzului protecției."
    },
    reality: {
      mechanism: "Tipare comportamentale fixate (schema therapy). Rețelele neuronale repetă aceleași strategii adaptive formate în urma traumelor/copilăriei în absolut toate domeniile.",
      validScience: "Psihologia comportamentală: corelațiile cross-domain sunt valide pentru că aparțin de aceleași mecanisme de apărare și motivatori de bază.",
      pseudoscience: "Atribuirea unor cauzalități mistice („Haos în sertar = Universul îți taie contractele”). Simpla aranjare a sertarului nu garantează cash-flow-ul dacă acțiunile financiare reale lipsesc.",
      rating: 7
    },
    patterns: {
      myPattern: "Retragerea fractală (Sistemul Defensiv Perfect)",
      childhood: "Copilul de 8-12 ani care, pentru a se feri de bullies și porecle, abandonează 'stadionul public' și se ascunde în siguranța casei.",
      present: "EXACT același pattern la scări diferite. Copilul de 8 ani care fuge E AICI ACUM. \n(1) Program Inspired Life: vrei să termini sarcinile rapid (rush). \n(2) Banii: buget strict (control = fortăreață). \n(3) Relația: Prezent FIZIC dar absent MENTAL. Toate urmează aceeași axiomă: Control > Vulnerabilitate.",
      cost: "Trăiești într-un 'safe room' invizibil: viață sigură, impecabilă, dar izolată intern și plină de disconfort mascat."
    },
    questions: {
      diagnostic: [
        "Acum, în acest moment, care este reflexul meu automat? Să stau în confruntare, sau să găsesc un exit rapid și politicos?",
        "Dacă retragerea este soluția la toate problemele mele, cu ce se aseamănă asta din ce făceam la 8 ani?"
      ],
      situational: {
        relationship: "Dacă relația mea este un fractal, ce spune tiparul 'stau aici, dar gândul îmi e la cod' despre capacitatea mea de a mă dărui aievea?",
        money: "Dacă frica mea de a nu avea suficienți bani este doar copilul de 8 ani căutând protecție, de ce refuz abundența pe care o pot genera?",
        work: "Când fac over-engineering la un cod simplu, ce lipsă de control încerc să compensez în alte domenii vitale?",
        identity: "Dacă mâine aș sta în 'focul' emoțiilor mele în loc să mă retrag în control logic, ce cred că s-ar întâmpla?"
      },
      action: "Azi: Nu te ascunde la următoarea provocare mică. Dacă cineva te critică sau are o cerere neașteptată, așteaptă 10 secunde înainte să răspunzi logic."
    },
    keywords: ["RETRAGERE", "CONTROL", "SIGURANȚĂ", "COPIL 8 ANI"],
    domain: "Psihologia Comportamentală",
    visual: "[ COPILĂRIE ] ≈ [ PREZENT ]"
  },
  {
    id: 5,
    title: "Atracția și gravitația",
    subtitle: "Ce emiți în lume, atragi înapoi",
    color: "#ffb700",
    icon: <Database className="w-6 h-6" />,
    theory: {
      principle: "Tot ceea ce gândești și simți atrage circumsțanțe similare. Rezonezi magnetic cu situațiile aliniate cu valorile tale reale, nu cu idealurile tale declarative.",
      fridaySparkRef: "Ep. 5: Alinierea Mentală — ordonarea percepțiilor dizolvă necesitatea corpului de a semnaliza conflictul prin boală."
    },
    reality: {
      mechanism: "Values-based action (ACT) & Operant conditioning. Acțiunile tale reale întăresc sau sting oportunitățile.",
      validScience: "Conectarea acțiunilor de zi cu zi cu valorile tale de bază îți ghidează automat deciziile. Faci ceea ce valorizezi cel mai mult, evitând ceea ce asociezi cu disconfortul.",
      pseudoscience: "\"Legea atracției\" (The Secret). Gândurile NU 'emit o frecvență gravitațională' în univers. Acțiunile tale concrete, subconștiente, sunt cele care atrag anumite realități.",
      rating: 6
    },
    patterns: {
      myPattern: "Banii = Supraviețuire (Nu prezență)",
      childhood: "Pattern moștenit de la mama: stres constant, 'banii niciodată nu ajung', siguranța depinde strict de contabilitate.",
      present: "Banii nu sunt folosiți pentru experiențe, ci pentru *izolare sigură*. Logica internă: 'Banii niciodată nu sunt destui → simt panica lipsei → mă închid emoțional de cei dragi → pierd conexiunea.' Atragi exact ce crezi despre bani: un refugiu singuratic.",
      cost: "Trăiești pentru a aduna provizii, uiți să trăiești. Resursele redevin un scop, nu un mijloc."
    },
    questions: {
      diagnostic: [
        "Care sunt acțiunile mele REALE (din ultimele 72h) și ce valori ascunse demonstrează ele, versus valorile mele declarative?",
        "Dacă aș fi sincer, ce vreau și obțin mereu prin focusarea pe aspectul financiar?"
      ],
      situational: {
        relationship: "Dacă declar că te iubesc dar la fiecare criză discut despre 'cine a cheltuit mai mult', care e de fapt prioritatea mea nr 1?",
        money: "Când intru în modul 'ghosting emoțional' pentru a supraviețui financiar, cine plătește de fapt prețul invizibil?",
        work: "Care e proiectul pe care l-am ales 'doar pentru bani' și cum mi-a atras el exact o doză direct proporțională de stres inutil?",
        identity: "Ce înseamnă banii pentru mine, în subconștient: libertatea de a trăi, sau scutul suprem anti-uman?"
      },
      action: "Azi: Bifează un 'cheltuială de experiență' neglijabilă matematic, complet ilogică, care spune minții tale: „Azi e despre viață, nu supraviețuire”."
    },
    keywords: ["PANICĂ FINANCIARĂ", "VALORI REALE", "GHOSTING EMOȚIONAL"],
    domain: "Economie Comportamentală",
    visual: "[ ACȚIUNI ZILNICE ] ⟶ [ REZULTATE ]"
  },
  {
    id: 6,
    title: "Escalarea eristică",
    subtitle: "Chemarea către echilibru complet",
    color: "#ff003c",
    icon: <Zap className="w-6 h-6" />,
    theory: {
      principle: "Dorința obsesivă de 'doar pace' va atrage magnetic 'războiul'. Cu cât fugi mai tare de un aspect (jumătatea negativă), cu atât el va deveni mai puternic pentru a forța echilibrul.",
      fridaySparkRef: "Ep. 101: Lupta cu Elementele — forțarea stabilității ('pământ') într-un mediu fluid ('apă') a blocat sistemul."
    },
    reality: {
      mechanism: "Ironic process theory (Wegner). Suprimarea unui concept de frică îl face hiper-activ în rețeaua neurală. Exposure therapy arată că evitarea anxietății O HRĂNEȘTE masiv.",
      validScience: "Psihologia clinică validează conceptul: efortul depus pentru evitarea unui feedback inconfortabil îl face central în procesarea decizională. Ce reziști, persistă.",
      pseudoscience: "Escalarea și compensarea nu se întâmplă magic în Univers pentru că tu ai dorit prea tare ceva. Mintea TA filtrează realitatea doar prin acea frică obsedantă.",
      rating: 5
    },
    patterns: {
      myPattern: "Frica Supremă: Inadequacy ('Nu-s destul')",
      childhood: "Frica de abandon s-a metamorfozat. Dacă nu ești util sau perfect compatibil logic cu cineva, îți pierzi valoarea (dreptul de a exista).",
      present: "Cu cât fugi mai tare de realitatea emoțională stângace ('nu știu ce să îi ofer sufletește'), cu cât încerci să controlezi discuțiile rațional, cu atât EA escaladează cererea emoțională. Retragerea TA declanșează fix ceea ce voiai să eviți: războiul masiv emoțional.",
      cost: "Lupta permanentă contra propriei frici, ceea ce stoarce sistemul de energie și transformă orice critică într-un atac existențial."
    },
    questions: {
      diagnostic: [
        "De ce aspect al realității mele curente FUG cu cea mai mare intensitate în acest moment?",
        "Cum efortul meu obsesiv de a crea 'doar pace și liniște' rațională contribuie la conflictul emoțional actual?"
      ],
      situational: {
        relationship: "Când ei îi 'cade fața' că eu îi dau o soluție rațională în loc de empatie, de ce fel de intimitate organică m-am panicat?",
        money: "Când economisesc cu agresivitate de frica să nu pierd ce am, cum îmi amplific singur propria anxietate financiară?",
        work: "Când refuz orice proiect unde aș putea părea incompetent, cum tocmai acel control absolut îmi ucide curiozitatea naturală?",
        identity: "Dacă ea ar zice chiar acum 'Nu ești deloc iubitor, ești un iceberg', de la 1 la 10, cât refuz să accept că are o mică parte de dreptate?"
      },
      action: "Azi: Observă instinctul tău de a 'rezolva logic' o situație care alunecă emoțional. Propune-ți, în loc să rezolvi, să doar ASIȘTI și să asculți validând emoția."
    },
    keywords: ["FRICĂ ABANDON", "INADEQUACY", "EVITARE", "PRAGMATISM"],
    domain: "Psihoterapie Cognitivă & ACT",
    visual: "[ CĂUTAREA PĂCII ] ⍻ [ ESCALARE CONFLICT ]"
  },
  {
    id: 7,
    title: "Sincronicitatea",
    subtitle: "Fiecare acțiune declanșează o reacție",
    color: "#ccff00",
    icon: <Radio className="w-6 h-6" />,
    theory: {
      principle: "Nu există coincidențe, ci doar o rețea de conexiuni. Universul îți arată în exact același moment o provocare și soluția ei, sau un câștig concomitent cu o pierdere.",
      fridaySparkRef: "Ep. 101: Lux și Disconfort — prezența confortului (vila în Bali) balansează perfect disconfortul minor (insecte pe laptop)."
    },
    reality: {
      mechanism: "Attention bias. Odată ce ești pre-activat să observi ceva, ți se va părea omniprezent. Efectul Zeigarnik: buclele deschise forțează atenția să caute closure constant.",
      validScience: "Closure-ul cognitiv are rol clar medical-psihologic în reducerea incertitudinii. Tipare similare le percepi simultan pentru că mintea ta hiper-activă caută tipare, nu pentru că universul ți le trimite.",
      pseudoscience: "Cherry-picking evenimente. Forțarea corelației temporale „În aceeași clipă...”. Cauzalitatea directă cosmică e falsă.",
      rating: 4
    },
    patterns: {
      myPattern: "Buclele Deschise & Proxy-urile",
      childhood: "Model lipsă patern. Dependență evitată: „Dacă mă bazez pe cineva total, risc abisul”.",
      present: "Toate certurile zilnice sunt un PRETEXT. Când aduci tabelul logic (control), ea cere vacanța de neuitat (experiență). Ambele sunt Proxy-uri pentru: Independență Defensivă vs. Dependență Emoțională Autentică. Bucle neînchise din trecut ocupă 60% din cache-ul minții tale și rulează în surdină constant.",
      cost: "Simulezi prezența în timp ce creierul tău suprasolicitat procesează thread-uri de fundal neterminate."
    },
    questions: {
      diagnostic: [
        "Care este 'bucla deschisă' nerezolvată care rulează cu cea mai mare turație în background azi?",
        "Cum pot separa 'problema practică' (ex: bugete) de ADEVĂRATA problemă emoțională ascunsă în ea?"
      ],
      situational: {
        relationship: "Dacă eu și ea eram forțați să nu mai vorbim NICIODATĂ de bani sau chestiuni logistice, care ar fi defectul meu pe care l-ar semnala constant?",
        money: "Ce încerc de fapt să evit psihologic când fac calcule raționale la fiecare mică decizie?",
        work: "Ce sarcină de la muncă o amân mental de luni de zile fix pentru că simbolizează un compromis cu mine însumi?",
        identity: "Ce dovadă banală primesc AZI că tiparul retragerii nu a funcționat nicicând să-mi ofere o viață caldă, conectată?"
      },
      action: "Azi: Bifează O buclă administrativă banală care e pe pending de săptămâni. Oprește-te și închide-o pe loc."
    },
    keywords: ["BUCLE DESCHISE", "PROXY-URI EMOȚIONALE", "INDIVIDUALISM"],
    domain: "Psihologie Cognitivă",
    visual: "[ PROXY EXTERN ] ⇄ [ ADEVĂRATA PROBLEMĂ ]"
  }
];

// --- CANVAS BACKGROUND COMPONENT ---
const SineWaveBackground = ({ isIntro, activeColor, isRealityMode }: { isIntro: boolean, activeColor: string, isRealityMode: boolean }) => {
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
      className={`fixed inset-0 w-full h-full z-0 pointer-events-none transition-opacity duration-1000 ${isRealityMode ? 'opacity-0' : 'opacity-80'}`}
    />
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [isIntro, setIsIntro] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'theory' | 'reality' | 'patterns' | 'questions'>('theory');
  const [isRealityMode, setIsRealityMode] = useState(false);
  
  const [journalData, setJournalData] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('ftp_journal');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleJournalChange = (lawId: number, text: string) => {
    setJournalData(prev => {
      const next = { ...prev, [lawId]: text };
      localStorage.setItem('ftp_journal', JSON.stringify(next));
      return next;
    });
  };

  // Reset tab when changing laws
  useEffect(() => {
    setActiveTab('theory');
  }, [activeIndex]);

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

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev, isIntro]);

  return (
    <div className={`relative w-full h-screen text-white overflow-hidden transition-colors duration-1000 selection:bg-white/20 ${isRealityMode ? 'bg-[#0a0f12] font-mono' : 'bg-[#050505] font-sans'}`}>
      {/* Backgrounds */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ${isRealityMode ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-100' : 'bg-grid opacity-30'}`}></div>
      <SineWaveBackground isIntro={isIntro} activeColor={isIntro ? '#00f3ff' : activeLaw.color} isRealityMode={isRealityMode} />
      
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
            key={isRealityMode ? "reality-main" : "cosmic-main"}
            className="absolute inset-0 z-10 flex flex-col"
            initial={{ opacity: 0, scale: isRealityMode ? 0.99 : 1.01, filter: isRealityMode ? 'contrast(1.5) blur(10px)' : 'brightness(1.5) blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'contrast(1) brightness(1) blur(0px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Top HUD */}
            <header className="w-full p-6 flex justify-between items-center font-mono text-xs tracking-widest border-b border-white/5 bg-black/20 backdrop-blur-md relative z-30">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeLaw.color }}></div>
                <span className="opacity-50 hidden md:inline">SYS.OP.01 //</span>
                <span>METODOLOGIA FTP</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsRealityMode(!isRealityMode)}
                  className={`px-4 py-2 border transition-all duration-300 ${isRealityMode ? 'border-[#00ff9d] text-[#00ff9d] bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20' : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white'}`}
                >
                  {isRealityMode ? '[ REALITY MODE : ON ]' : '[ COSMIC MODE : ON ]'}
                </button>
                <span className="opacity-50 hidden md:inline ml-4">[ ONLINE ]</span>
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

                      {/* Right Column: Content (TABS) */}
                      <div className="lg:col-span-7 flex flex-col space-y-6">
                        {/* Tab Headers */}
                        <div className="flex space-x-2 border-b border-white/10 pb-2 overflow-x-auto custom-scrollbar">
                          {(['theory', 'reality', 'patterns', 'questions'] as const).map(tab => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`px-4 py-2 font-mono text-xs tracking-widest transition-colors whitespace-nowrap ${
                                activeTab === tab 
                                  ? 'text-white border-b-2' 
                                  : 'text-white/40 hover:text-white/70'
                              }`}
                              style={{ borderColor: activeTab === tab ? activeLaw.color : 'transparent' }}
                            >
                              {tab === 'theory' && 'TEORIE'}
                              {tab === 'reality' && 'FIRST PRINCIPLES'}
                              {tab === 'patterns' && 'TIPARUL TĂU'}
                              {tab === 'questions' && 'DIAGNOSTIC'}
                            </button>
                          ))}
                        </div>

                        {/* Tab Content Areas */}
                        <div className="flex-1 relative min-h-[300px]">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeTab}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0 overflow-y-auto pr-2 custom-scrollbar"
                            >
                              {activeTab === 'theory' && (
                                <div className="space-y-6">
                                  <div className="p-6 bg-white/5 border-l-2" style={{ borderColor: activeLaw.color }}>
                                    <h3 className="font-mono text-xs tracking-widest text-white/50 mb-3">PRINCIPIUL</h3>
                                    <p className="text-base leading-relaxed text-white/90">{activeLaw.theory.principle}</p>
                                  </div>
                                  <div className="p-4 border border-white/10 bg-black/20">
                                    <h3 className="font-mono text-xs tracking-widest text-white/50 mb-2">REFERINȚĂ FRIDAY SPARK</h3>
                                    <p className="text-sm text-white/70 italic">{activeLaw.theory.fridaySparkRef}</p>
                                  </div>
                                </div>
                              )}

                              {activeTab === 'reality' && (
                                <div className="space-y-6">
                                  <div className="flex items-center gap-4">
                                    <h3 className="font-mono text-xs tracking-widest text-white/50">MECANISM REAL (CBT/ACT)</h3>
                                    <div className="flex-1 h-px bg-white/10"></div>
                                    <div className="font-mono text-xs font-bold px-2 py-1" style={{ color: activeLaw.color, backgroundColor: `${activeLaw.color}20` }}>RATING: {activeLaw.reality.rating}/10</div>
                                  </div>
                                  <p className="text-sm leading-relaxed text-white/80">{activeLaw.reality.mechanism}</p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="p-4 bg-green-900/10 border border-green-500/20 rounded">
                                      <div className="flex items-center gap-2 mb-2 text-green-400">
                                        <span className="font-mono text-xs tracking-widest">✅ FUNDAMENTAT ȘTIINȚIFIC</span>
                                      </div>
                                      <p className="text-xs text-green-100/70">{activeLaw.reality.validScience}</p>
                                    </div>
                                    <div className="p-4 bg-red-900/10 border border-red-500/20 rounded">
                                      <div className="flex items-center gap-2 mb-2 text-red-400">
                                        <span className="font-mono text-xs tracking-widest">❌ ABUR COSMIC (PSEUDOȘTIINȚĂ)</span>
                                      </div>
                                      <p className="text-xs text-red-100/70">{activeLaw.reality.pseudoscience}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeTab === 'patterns' && (
                                <div className="space-y-6">
                                  <h3 className="text-xl font-light text-white mb-2" style={{ color: activeLaw.color }}>{activeLaw.patterns.myPattern}</h3>
                                  <div className="space-y-4">
                                    <div className="relative pl-4 border-l border-white/20">
                                      <h4 className="font-mono text-[10px] tracking-widest text-white/40 mb-1">RĂDĂCINA (TRECUT)</h4>
                                      <p className="text-sm text-white/80 italic">{activeLaw.patterns.childhood}</p>
                                    </div>
                                    <div className="relative pl-4 border-l" style={{ borderColor: `${activeLaw.color}80` }}>
                                      <h4 className="font-mono text-[10px] tracking-widest text-white/40 mb-1">MANIFESTAREA PREZENTĂ</h4>
                                      <p className="text-sm text-white/90">{activeLaw.patterns.present}</p>
                                    </div>
                                    <div className="relative pl-4 border-l border-red-500/50">
                                      <h4 className="font-mono text-[10px] tracking-widest text-white/40 mb-1">COSTUL CURENT (CE PIERZI)</h4>
                                      <p className="text-sm text-red-300/80">{activeLaw.patterns.cost}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeTab === 'questions' && (
                                <div className="space-y-6">
                                  <div className="p-4 border border-white/10 bg-white/5 relative">
                                    <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-white/10 text-white/30 font-mono text-xs">01</div>
                                    <h3 className="font-mono text-xs tracking-widest text-white/50 mb-3">AUTO-DIAGNOSTICARE</h3>
                                    <ul className="space-y-3">
                                      {activeLaw.questions.diagnostic.map((q, i) => (
                                        <li key={i} className="text-sm text-white/90 flex gap-2">
                                          <span className="text-white/40">■</span> {q}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-mono text-xs tracking-widest text-white/50 mb-3 pt-2">CALIBRARE SITUAȚIONALĂ</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="p-3 bg-black/40 border border-white/5 rounded">
                                        <div className="font-mono text-[10px] text-pink-400 mb-1">RELAȚIE</div>
                                        <p className="text-xs text-white/70">{activeLaw.questions.situational.relationship}</p>
                                      </div>
                                      <div className="p-3 bg-black/40 border border-white/5 rounded">
                                        <div className="font-mono text-[10px] text-green-400 mb-1">BANI</div>
                                        <p className="text-xs text-white/70">{activeLaw.questions.situational.money}</p>
                                      </div>
                                      <div className="p-3 bg-black/40 border border-white/5 rounded">
                                        <div className="font-mono text-[10px] text-blue-400 mb-1">MUNCĂ (COD/PROIECTE)</div>
                                        <p className="text-xs text-white/70">{activeLaw.questions.situational.work}</p>
                                      </div>
                                      <div className="p-3 bg-black/40 border border-white/5 rounded">
                                        <div className="font-mono text-[10px] text-purple-400 mb-1">IDENTITATE</div>
                                        <p className="text-xs text-white/70">{activeLaw.questions.situational.identity}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-4 border border-white/10 bg-black/50 overflow-hidden relative group mt-4">
                                    <div className="absolute right-0 top-0 bottom-0 w-1 group-hover:w-full transition-all duration-700 ease-out z-0" style={{ backgroundColor: `${activeLaw.color}20` }}></div>
                                    <h3 className="font-mono text-xs tracking-widest mb-2 relative z-10" style={{ color: activeLaw.color }}>ACȚIUNEA TA PENTRU AZI:</h3>
                                    <p className="text-sm text-white font-medium relative z-10">{activeLaw.questions.action}</p>
                                  </div>

                                  <div className="mt-6 pt-4 border-t border-white/10">
                                    <h3 className="font-mono text-xs tracking-widest text-[#00f3ff] mb-3 flex justify-between items-center">
                                      <span>JURNALIZARE ACTIVĂ</span>
                                      {journalData[activeLaw.id] && <span className="text-[10px] opacity-50 px-2 py-1 bg-white/10 rounded">[ SALVAT LOCAL ]</span>}
                                    </h3>
                                    <textarea 
                                      value={journalData[activeLaw.id] || ''}
                                      onChange={(e) => handleJournalChange(activeLaw.id, e.target.value)}
                                      placeholder="Răspunde aici la o întrebare de diagnoză. Reflecția ta va fi salvată în browserul tău..."
                                      className="w-full h-32 bg-black/40 border border-white/20 rounded p-4 text-sm font-mono text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#00f3ff] transition-colors resize-y custom-scrollbar"
                                    />
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Timeline */}
            <footer className="w-full pt-6 pb-12 px-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
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
                      <div className="relative">
                        <div 
                          className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? 'scale-150' : 'bg-white/20 group-hover:bg-white/50'}`}
                          style={{ backgroundColor: isActive ? law.color : undefined, boxShadow: isActive ? `0 0 15px ${law.color}` : 'none' }}
                        ></div>
                        {journalData[law.id] && journalData[law.id].trim().length > 0 && (
                          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#00f3ff] rounded-full ring-2 ring-black"></div>
                        )}
                      </div>
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
