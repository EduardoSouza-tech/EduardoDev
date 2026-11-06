(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const damp = (a, b, tau, dt) => lerp(a, b, 1 - Math.exp(-dt / tau));
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const TAU = Math.PI * 2;
  const INK = '#0a0a0a';

  /* ---------- Sempre ativo: não depende de animação ---------- */

  $('#currentYear').textContent = new Date().getFullYear();

  const clockEl = $('#clock');
  const clockFmt = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tickClock = () => { clockEl.textContent = clockFmt.format(new Date()); };
  tickClock();
  setInterval(tickClock, 1000);

  const burger = $('#burger');
  const menu = $('#menu');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  $$('.menu-link').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  const zoom = $('#zoom');
  const zoomImg = $('img', zoom);
  const zoomCap = $('figcaption', zoom);
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-zoom]');
    if (!link || typeof zoom.showModal !== 'function') return;
    e.preventDefault();
    const thumb = $('img', link);
    zoomImg.src = link.getAttribute('href');
    zoomImg.alt = thumb ? thumb.alt : '';
    zoomCap.textContent = link.dataset.title || '';
    zoom.showModal();
    root.classList.add('zoom-open');
  });
  zoom.addEventListener('click', () => zoom.close());
  zoom.addEventListener('close', () => root.classList.remove('zoom-open'));

  /* ---------- Tipografia ajustada à largura ---------- */

  root.classList.add('fitted');

  // Parte do tamanho atual para não encolher a página ao medir (isso moveria a rolagem).
  // Duas passadas porque a largura do texto não escala de forma exatamente linear.
  const fitTo = (el, measure, apply, box, maxSize) => {
    let size = parseFloat(getComputedStyle(el).fontSize);
    for (let pass = 0; pass < 2; pass++) {
      const width = measure(size);
      if (!width) return;
      size = Math.min(maxSize, (size * box) / width);
      apply(size);
    }
  };

  const fitLines = () => {
    const maxSize = innerHeight * 0.5;
    $$('[data-fit]').forEach((el) => {
      const box = el.clientWidth;
      $$('.line', el).forEach((line) => {
        fitTo(line, () => line.getBoundingClientRect().width, (size) => { line.style.fontSize = `${size}px`; }, box, maxSize);
      });
    });
  };

  const heroName = $('#heroName');
  const nameWords = $$('.name-word', heroName);
  const heroStage = $('#heroStage');
  const portrait = $('#portrait');
  const fitHero = () => {
    const box = heroName.clientWidth;
    const stacked = getComputedStyle(heroName).flexDirection === 'column';
    if (stacked) {
      nameWords.forEach((w) => {
        fitTo(w, () => w.getBoundingClientRect().width, (size) => { w.style.fontSize = `${size}px`; }, box, Infinity);
      });
    } else {
      fitTo(
        nameWords[0],
        (size) => nameWords[0].getBoundingClientRect().width + nameWords[1].getBoundingClientRect().width + size * 0.18,
        (size) => nameWords.forEach((w) => { w.style.fontSize = `${size}px`; }),
        box,
        innerHeight * 0.44,
      );
    }
    heroStage.style.setProperty('--name-h', `${heroName.offsetHeight}px`);
    // Em telas baixas o nome subiria até a boca: o retrato sobe junto para manter o rosto legível
    const stageH = heroStage.clientHeight;
    const nameTop = stageH - parseFloat(getComputedStyle(heroName).bottom) - heroName.offsetHeight;
    const shift = stacked ? 0 : clamp(stageH * 0.75 - (nameTop - 8), 0, stageH * 0.16);
    heroStage.style.setProperty('--portrait-shift', `${shift}px`);
    // Empilhado, o nome ocupa mais altura: o retrato encolhe até a boca ficar acima dele
    if (stacked) {
      const vw = root.clientWidth;
      const fit = (nameTop - stageH * 0.02) / 0.745;
      heroStage.style.setProperty('--portrait-w', `${clamp(fit, vw * 0.7, vw * 1.4)}px`);
    }
  };

  const refit = () => { fitLines(); fitHero(); };

  if (!root.classList.contains('motion')) {
    refit();
    addEventListener('resize', refit);
    if (document.fonts) document.fonts.ready.then(refit);
    return;
  }

  root.classList.add('anim');

  const GLYPHS = '!<>-_/[]{}=+*^?#01';
  const scramble = (el, to, duration = 720) => {
    const from = el.textContent;
    const len = Math.max(from.length, to.length);
    const t0 = performance.now();
    const step = (now) => {
      const p = clamp((now - t0) / duration);
      let out = '';
      for (let i = 0; i < len; i++) {
        const settle = 0.3 + ((i + 1) / len) * 0.7;
        if (p >= settle) out += to[i] || '';
        else if (p >= settle - 0.3) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else out += from[i] || '';
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Quebra de texto para as animações ---------- */

  const splitChars = (el) => {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) { walk(n); return; }
        if (n.nodeType !== Node.TEXT_NODE) return;
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((token) => {
          if (!token) return;
          if (/^\s+$/.test(token)) { frag.append(' '); return; }
          const word = document.createElement('span');
          word.className = 'w';
          word.setAttribute('aria-hidden', 'true');
          [...token].forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'c';
            c.textContent = ch;
            c.style.setProperty('--i', i++);
            word.append(c);
          });
          frag.append(word);
        });
        n.replaceWith(frag);
      });
    };
    walk(el);
  };
  $$('[data-split]').forEach(splitChars);

  const manifesto = $('#manifesto');
  const inkWords = manifesto.textContent.trim().split(/\s+/).map((text) => {
    const s = document.createElement('span');
    s.className = 'ink';
    s.textContent = text;
    return s;
  });
  manifesto.textContent = '';
  inkWords.forEach((s, i) => { if (i) manifesto.append(' '); manifesto.append(s); });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], [data-split]:not([data-split="manual"])').forEach((el) => revealObserver.observe(el));

  const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      tagObserver.unobserve(e.target);
      const label = e.target.lastElementChild;
      const text = label.dataset.text;
      label.textContent = '';
      scramble(label, text, 900);
    });
  }, { threshold: 1 });
  $$('.sec-tag').forEach((tag) => {
    const label = document.createElement('span');
    label.textContent = tag.lastChild.textContent.trim();
    label.dataset.text = label.textContent;
    tag.lastChild.replaceWith(' ', label);
    tagObserver.observe(tag);
  });

  /* ---------- Motor: um único rAF, medidas em cache ---------- */

  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const S = { y: scrollY, sy: scrollY, vy: 0, vw: root.clientWidth, vh: innerHeight, px: -1, py: -1, pointer: false };
  const scenes = [];
  const measures = [];
  const scene = (fn) => scenes.push(fn);
  const onMeasure = (fn) => measures.push(fn);
  const pageTop = (el) => el.getBoundingClientRect().top + scrollY;

  const measure = () => {
    S.vw = root.clientWidth;
    S.vh = innerHeight;
    refit();
    measures.forEach((fn) => fn());
  };

  /* ---------- Hero: o rosto escrito com a stack ---------- */

  const layer = $('#portraitLayer');
  const canvas = $('#codeLayer');
  const ctx = canvas.getContext('2d');
  const heroUi = $('#heroUi');
  const MAP = window.PORTRAIT_MAP;
  const STACK = 'React Native Expo Router TypeScript Zustand React Query Next.js Tailwind CSS JavaScript HTML Python FastAPI APIs REST WebSockets JWT C# .NET PostgreSQL MySQL SQLite Redis Docker Git Railway ';
  const luma = MAP ? Uint8Array.from(MAP.d, (ch) => parseInt(ch, 16)) : null;
  const code = { W: 0, H: 0, layers: [], rect: null, ready: false };
  const TONES = [
    { fill: 'rgba(255,255,255,.05)', weight: 300 },
    { fill: 'rgba(209,255,26,.15)', weight: 300 },
    { fill: 'rgba(209,255,26,.3)', weight: 300 },
    { fill: 'rgba(209,255,26,.52)', weight: 400 },
    { fill: 'rgba(209,255,26,.78)', weight: 500 },
    { fill: '#d1ff1a', weight: 600 },
    { fill: '#f4ffc4', weight: 600 },
  ];

  const toneOf = (v) => {
    if (v < 0.07) return 0;
    if (v < 0.22) return 1;
    if (v < 0.36) return 2;
    if (v < 0.5) return 3;
    if (v < 0.64) return 4;
    return v < 0.8 ? 5 : 6;
  };

  // Mapa pré-calculado em vez de getImageData: ler a foto em canvas falharia ao abrir por file://
  const buildCode = () => {
    const W = heroStage.clientWidth;
    const H = heroStage.clientHeight;
    if (!W || !H || !luma) return;
    const dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(3.2e6 / (W * H)));
    code.W = W;
    code.H = H;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const prev = layer.style.transform;
    layer.style.transform = '';
    const stageBox = heroStage.getBoundingClientRect();
    const box = portrait.getBoundingClientRect();
    layer.style.transform = prev;
    const px = box.left - stageBox.left;
    const py = box.top - stageBox.top;
    code.rect = { x: px, y: py, w: box.width, h: box.height };

    const size = clamp(Math.round(Math.min(W, H) / 84), 8, 13);
    const fontFor = (weight) => `${weight} ${size}px "Martian Mono", ui-monospace, monospace`;
    ctx.font = fontFor(500);
    const cw = ctx.measureText('M').width;
    const ch = size * 1.28;
    const cols = Math.ceil(W / cw);
    const rows = Math.ceil(H / ch);

    code.layers = [0, 1, 2].map((shift) => {
      const cv = document.createElement('canvas');
      cv.width = canvas.width;
      cv.height = canvas.height;
      const g = cv.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.textBaseline = 'top';
      const buckets = TONES.map(() => []);
      let idx = shift * 3;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const glyph = STACK[idx++ % STACK.length];
          if (glyph === ' ') continue;
          const x = c * cw;
          const y = r * ch;
          const u = (x + cw / 2 - px) / box.width;
          const v = (y + ch / 2 - py) / box.height;
          const inside = u >= 0 && u < 1 && v >= 0 && v < 1;
          const value = inside ? luma[Math.floor(v * MAP.n) * MAP.n + Math.floor(u * MAP.n)] / 15 : 0;
          buckets[toneOf(value)].push(glyph, x, y);
        }
      }
      buckets.forEach((list, t) => {
        g.font = fontFor(TONES[t].weight);
        g.fillStyle = TONES[t].fill;
        for (let i = 0; i < list.length; i += 3) g.fillText(list[i], list[i + 1], list[i + 2]);
      });
      return cv;
    });
    code.ready = true;
  };

  const lens = { x: 0, y: 0, r: 0 };
  const intro = { start: 0, running: false, done: false };
  const INTRO_MS = 1800;

  const drawCode = (now, takeover) => {
    const { W, H, layers } = code;
    ctx.clearRect(0, 0, W, H);
    if (!code.ready) {
      // Sem o mapa de luz não há camada de código: o retrato simplesmente fica visível
      if (luma && !intro.done) { ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H); }
      return;
    }
    const frame = layers[Math.floor(now / 150) % layers.length];

    if (!intro.done) {
      const k = intro.running ? (now - intro.start) / INTRO_MS : 0;
      const yCode = H * easeIO(clamp(k / 0.62));
      const yPhoto = H * easeIO(clamp((k - 0.36) / 0.64));
      ctx.fillStyle = INK;
      ctx.fillRect(0, yPhoto, W, H - yPhoto);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, yPhoto, W, Math.max(0, yCode - yPhoto));
      ctx.clip();
      ctx.drawImage(frame, 0, 0, W, H);
      ctx.restore();
      if (k > 0 && yCode < H) { ctx.fillStyle = '#d1ff1a'; ctx.fillRect(0, yCode - 1, W, 2); }
      if (k >= 0.36 && yPhoto < H) { ctx.fillStyle = '#fff'; ctx.fillRect(0, yPhoto - 0.5, W, 1); }
      if (k >= 1) intro.done = true;
    }

    const radius = lens.r + Math.pow(takeover, 1.5) * Math.hypot(W, H);
    if (radius < 1) return;
    const cx = lerp(lens.x, W / 2, takeover);
    const cy = lerp(lens.y, H * 0.46, takeover);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(frame, 0, 0, W, H);
    ctx.restore();
    ctx.strokeStyle = '#d1ff1a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.stroke();
  };

  const heroParallax = { x: 0, y: 0 };
  scene((dt, now) => {
    const { vh } = S;
    const covered = S.sy > vh * 1.1;
    heroStage.style.visibility = covered ? 'hidden' : '';
    if (covered) return;

    const p = clamp(S.sy / (vh * 0.92));
    const over = fine && S.pointer && S.py < vh - S.y && intro.done;
    const baseR = clamp(Math.min(code.W, code.H) * 0.17, 74, 190);
    const rect = code.rect || { x: 0, y: 0, w: code.W, h: code.H };
    const wanderX = rect.x + rect.w * (0.5 + Math.sin(now * 0.00034) * 0.2);
    const wanderY = rect.y + rect.h * (0.46 + Math.cos(now * 0.00047) * 0.16);
    const tx = over ? S.px : wanderX;
    const ty = over ? S.py : wanderY;
    const tau = over ? 70 : 420;
    if (lens.r < 0.5 && intro.done) { lens.x = tx; lens.y = ty; }
    lens.x = damp(lens.x, tx, tau, dt);
    lens.y = damp(lens.y, ty, tau, dt);
    lens.r = damp(lens.r, intro.done ? (over ? baseR : baseR * 0.62) : 0, 260, dt);
    drawCode(now, p);

    const mx = over ? S.px / S.vw - 0.5 : 0;
    const my = over ? S.py / vh - 0.5 : 0;
    heroParallax.x = damp(heroParallax.x, mx, 240, dt);
    heroParallax.y = damp(heroParallax.y, my, 240, dt);
    const scale = 1 + p * 0.1;
    const shift = `translate3d(${(-heroParallax.x * 16).toFixed(2)}px, ${(-heroParallax.y * 10 - p * vh * 0.04).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    layer.style.transform = shift;
    canvas.style.transform = shift;

    const split = p * S.vw * 0.5;
    const drift = heroParallax.x * 14;
    nameWords[0].style.transform = `translate3d(${(drift - split).toFixed(2)}px, 0, 0)`;
    nameWords[1].style.transform = `translate3d(${(drift + split).toFixed(2)}px, 0, 0)`;

    const uiAlpha = clamp(1 - p * 2.4);
    heroUi.style.opacity = uiAlpha.toFixed(3);
    heroUi.style.transform = `translate3d(0, ${(-p * 46).toFixed(2)}px, 0)`;
    heroUi.style.visibility = uiAlpha < 0.02 ? 'hidden' : '';
  });

  const roleWord = $('#roleWord');
  const roles = roleWord.dataset.words.split(',');
  let roleIndex = 0;
  const startRoles = () => setInterval(() => {
    if (S.y > S.vh || document.hidden) return;
    roleIndex = (roleIndex + 1) % roles.length;
    scramble(roleWord, roles[roleIndex]);
  }, 2600);

  /* ---------- Fitas: velocidade e sentido seguem a rolagem ---------- */

  const tapesBox = $('.tapes');
  const tapes = $$('.tape').map((el) => ({ el, track: $('.tape-track', el), set: $('.tape-set', el), dir: Number(el.dataset.dir), x: 0, w: 1 }));
  let tapesTop = 0;
  let tapeHeading = 1;
  onMeasure(() => {
    tapesTop = pageTop(tapesBox);
    tapes.forEach((t) => {
      while (t.track.children.length > 1) t.track.lastElementChild.remove();
      t.w = t.set.getBoundingClientRect().width || 1;
      const copies = Math.ceil((S.vw * 1.3) / t.w) + 1;
      for (let i = 0; i < copies; i++) t.track.append(t.set.cloneNode(true));
    });
  });
  scene((dt) => {
    if (S.sy + S.vh < tapesTop - 200 || S.sy > tapesTop + 500) return;
    if (Math.abs(S.vy) > 0.4) tapeHeading = S.vy > 0 ? 1 : -1;
    const speed = 0.05 + Math.min(Math.abs(S.vy), 80) * 0.028;
    tapes.forEach((t) => {
      t.x -= t.dir * tapeHeading * speed * dt;
      if (t.x <= -t.w) t.x += t.w;
      if (t.x > 0) t.x -= t.w;
      t.track.style.transform = `translate3d(${t.x.toFixed(2)}px, 0, 0)`;
    });
  });

  /* ---------- Manifesto: as palavras ganham tinta com a rolagem ---------- */

  const ink = { top: 0, h: 0, painted: -1 };
  onMeasure(() => {
    ink.top = pageTop(manifesto);
    ink.h = manifesto.offsetHeight;
  });
  scene(() => {
    if (S.sy + S.vh < ink.top || S.sy > ink.top + ink.h) return;
    const p = clamp((S.sy + S.vh * 0.82 - ink.top) / (ink.h + S.vh * 0.28));
    const painted = p * inkWords.length;
    if (Math.abs(painted - ink.painted) < 0.01) return;
    ink.painted = painted;
    inkWords.forEach((w, i) => { w.style.opacity = (0.13 + clamp(painted - i) * 0.87).toFixed(3); });
  });

  /* ---------- Parallax: cada camada anda numa velocidade ---------- */

  const depths = $$('[data-depth]').map((el) => ({ el, k: Number(el.dataset.depth), c: 0, h: 0 }));
  onMeasure(() => {
    depths.forEach((d) => {
      const saved = d.el.style.transform;
      d.el.style.transform = '';
      d.h = d.el.offsetHeight;
      d.c = pageTop(d.el) + d.h / 2;
      d.el.style.transform = saved;
    });
  });
  scene(() => {
    depths.forEach((d) => {
      const off = d.c - (S.sy + S.vh / 2);
      if (Math.abs(off) > S.vh + d.h) return;
      d.el.style.transform = `translate3d(0, ${(off * d.k).toFixed(1)}px, 0)`;
    });
  });

  /* ---------- Crachá: pêndulo que reage à rolagem, ao arrasto e ao cursor ---------- */

  const rig = $('#rig');
  const badge = $('#badge');
  const sobre = $('#sobre');
  const pend = { a: 0, v: 0, drag: false, startX: 0, startA: 0, len: 600, max: 3, top: 0, bottom: 0, tx: 0, ty: 0, ttx: 0, tty: 0 };
  onMeasure(() => {
    const slot = rig.parentElement;
    const savedRig = rig.style.transform;
    const savedSlot = slot.style.transform;
    rig.style.transform = '';
    slot.style.transform = '';
    const secTop = pageTop(sobre);
    const strap = Math.max(60, pageTop(slot) - secTop);
    rig.style.transform = savedRig;
    slot.style.transform = savedSlot;
    rig.style.setProperty('--strap-h', `${strap}px`);
    pend.len = strap + badge.offsetHeight * 0.6;
    pend.max = (Math.atan2(S.vw < 700 ? 34 : 64, pend.len) * 180) / Math.PI;
    pend.top = secTop;
    pend.bottom = secTop + sobre.offsetHeight;
  });
  scene((dt) => {
    if (S.sy + S.vh < pend.top || S.sy > pend.bottom) return;
    const f = dt / 16.67;
    if (!pend.drag) {
      const accel = -0.0026 * pend.a - 0.016 * pend.v + clamp(S.vy, -70, 70) * 0.00011 * (pend.max / 3);
      pend.v += accel * f;
      pend.a = clamp(pend.a + pend.v * f, -pend.max * 2.4, pend.max * 2.4);
    }
    rig.style.transform = `rotate(${pend.a.toFixed(3)}deg)`;
    pend.tx = damp(pend.tx, pend.ttx, 140, dt);
    pend.ty = damp(pend.ty, pend.tty, 140, dt);
    badge.style.transform = `rotateX(${pend.tx.toFixed(2)}deg) rotateY(${pend.ty.toFixed(2)}deg)`;
  });
  badge.addEventListener('pointerdown', (e) => {
    pend.drag = true;
    pend.startX = e.clientX;
    pend.startA = pend.a;
    pend.v = 0;
    badge.setPointerCapture(e.pointerId);
  });
  badge.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') {
      const box = badge.getBoundingClientRect();
      const nx = clamp((e.clientX - box.left) / box.width);
      const ny = clamp((e.clientY - box.top) / box.height);
      pend.ttx = (0.5 - ny) * 16;
      pend.tty = (nx - 0.5) * 16;
      badge.style.setProperty('--sx', `${(nx * 100).toFixed(1)}%`);
      badge.style.setProperty('--sy', `${(ny * 100).toFixed(1)}%`);
    }
    if (!pend.drag) return;
    // O pivô fica acima do crachá: ângulo positivo leva a ponta para a esquerda, por isso o sinal é invertido
    const target = pend.startA - ((e.clientX - pend.startX) / pend.len) * (180 / Math.PI);
    const next = clamp(target, -pend.max * 2.4, pend.max * 2.4);
    pend.v = next - pend.a;
    pend.a = next;
  });
  const releaseBadge = () => { pend.drag = false; };
  badge.addEventListener('pointerup', releaseBadge);
  badge.addEventListener('pointercancel', releaseBadge);
  badge.addEventListener('pointerleave', () => { pend.ttx = 0; pend.tty = 0; });

  /* ---------- Habilidades em toque: a linha mais perto do centro acende ---------- */

  const rows = $$('.stack-row').map((el) => ({ el, c: 0, on: false }));
  const stackBox = { top: 0, bottom: 0 };
  onMeasure(() => {
    rows.forEach((r) => { r.c = pageTop(r.el) + r.el.offsetHeight / 2; });
    const list = $('#stackList');
    stackBox.top = pageTop(list);
    stackBox.bottom = stackBox.top + list.offsetHeight;
  });
  if (!fine) {
    scene(() => {
      const center = S.y + S.vh / 2;
      const inside = center > stackBox.top && center < stackBox.bottom;
      rows.forEach((r) => {
        const on = inside && Math.abs(r.c - center) < r.el.offsetHeight / 2;
        if (on !== r.on) { r.on = on; r.el.classList.toggle('is-on', on); }
      });
    });
  }

  /* ---------- Galeria horizontal ---------- */

  const RATIO = 0.8;
  const pinQuery = matchMedia('(min-width: 900px) and (min-height: 520px)');
  const gal = {
    el: $('#projetos'),
    track: $('#galleryTrack'),
    ghost: $('#galleryGhost'),
    panels: $$('.pj').map((el) => ({ el, name: el.dataset.name, media: $('.pj-media', el), img: $('.frame-view img', el), info: $('.pj-info', el), title: $('.pj-title', el), left: 0, w: 0, tick: null })),
    top: 0, range: 1, dist: 0, pinned: false, active: -1,
  };
  const railNow = $('#railNow');
  const railName = $('#railName');
  const railTicks = $('#railTicks');

  const setActive = (index) => {
    if (index === gal.active) return;
    gal.panels.forEach((p, i) => p.el.classList.toggle('is-active', i === index));
    gal.active = index;
    if (index < 0) return;
    railNow.textContent = String(index + 1).padStart(2, '0');
    if (railName.textContent !== gal.panels[index].name) scramble(railName, gal.panels[index].name, 420);
  };

  const goToPanel = (index) => {
    const p = gal.panels[index];
    const k = clamp((p.left + p.w / 2 - S.vw / 2) / gal.dist);
    scrollTo({ top: gal.top + k * gal.range, behavior: 'smooth' });
  };

  gal.panels.forEach((p, i) => {
    const tick = document.createElement('button');
    tick.type = 'button';
    tick.className = 'rail-tick';
    tick.setAttribute('aria-label', `Ir para ${p.name}`);
    tick.addEventListener('click', () => goToPanel(i));
    railTicks.append(tick);
    p.tick = tick;
  });

  onMeasure(() => {
    gal.pinned = pinQuery.matches;
    gal.el.classList.toggle('is-pinned', gal.pinned);
    if (!gal.pinned) {
      gal.el.style.height = '';
      gal.track.style.transform = '';
      gal.panels.forEach((p) => {
        p.info.style.transform = '';
        p.title.style.fontStretch = '';
        p.media.style.transform = '';
        p.img.style.removeProperty('--px');
      });
      return;
    }
    gal.panels.forEach((p) => {
      p.img.style.setProperty('--r', (p.img.getAttribute('width') / p.img.getAttribute('height')).toFixed(4));
    });
    gal.dist = Math.max(1, gal.track.offsetWidth - S.vw);
    gal.range = gal.dist * RATIO;
    gal.el.style.height = `${gal.range + S.vh}px`;
    gal.top = pageTop(gal.el);
    gal.panels.forEach((p) => { p.left = p.el.offsetLeft; p.w = p.el.offsetWidth; });
  });

  scene(() => {
    if (!gal.pinned) return;
    if (S.y + S.vh < gal.top - 200 || S.y > gal.top + gal.range + S.vh + 200) return;
    const x = -clamp((S.sy - gal.top) / gal.range) * gal.dist;
    gal.track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    gal.ghost.style.transform = `translate3d(${(x * 0.24).toFixed(2)}px, -50%, 0)`;
    const skew = clamp(S.vy * 0.07, -5, 5).toFixed(2);
    let nearest = -1;
    let nearestD = Infinity;
    gal.panels.forEach((p, i) => {
      const center = p.left + p.w / 2 + x;
      const d = (center - S.vw / 2) / S.vw;
      if (Math.abs(d) < nearestD) { nearestD = Math.abs(d); nearest = i; }
      p.tick.style.setProperty('--fill', clamp((S.vw / 2 - (p.left + x)) / p.w).toFixed(3));
      if (Math.abs(d) > 1.15) return;
      const near = clamp(1 - Math.abs(d) * 1.8);
      p.img.style.setProperty('--px', `${(-d * 34).toFixed(1)}px`);
      p.info.style.transform = `translate3d(${(-d * 22).toFixed(1)}px, 0, 0)`;
      p.title.style.fontStretch = `${(62 + near * near * 12).toFixed(1)}%`;
      p.media.style.transform = `skewX(${skew}deg)`;
    });
    setActive(nearestD < 0.62 ? nearest : -1);
  });

  const panelObserver = new IntersectionObserver((entries) => {
    if (gal.pinned) return;
    entries.forEach((e) => e.target.classList.toggle('is-active', e.isIntersecting));
  }, { threshold: 0.5 });
  const seenObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.closest('.pj').classList.add('is-seen');
      seenObserver.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  gal.panels.forEach((p) => {
    panelObserver.observe(p.el);
    seenObserver.observe(p.media);
  });

  gal.track.addEventListener('focusin', (e) => {
    if (!gal.pinned) return;
    const index = gal.panels.findIndex((p) => p.el === e.target.closest('.pj'));
    if (index >= 0) goToPanel(index);
  });

  $('#galleryPin').addEventListener('wheel', (e) => {
    if (!gal.pinned || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    scrollBy({ top: e.deltaX * RATIO, behavior: 'instant' });
  }, { passive: false });

  /* ---------- Linha do tempo ---------- */

  const timeline = $('#timeline');
  const tl = { top: 0, h: 1 };
  onMeasure(() => {
    tl.top = pageTop(timeline);
    tl.h = timeline.offsetHeight || 1;
  });
  scene(() => {
    if (S.sy + S.vh < tl.top || S.sy > tl.top + tl.h) return;
    timeline.style.setProperty('--fill', clamp((S.sy + S.vh * 0.62 - tl.top) / tl.h).toFixed(4));
  });

  /* ---------- Contato: a inundação ---------- */

  const flood = $('#flood');
  const floodOver = $('#floodOver');
  const floodUnder = floodOver.cloneNode(true);
  floodUnder.removeAttribute('id');
  floodUnder.classList.replace('flood-over', 'flood-under');
  floodUnder.dataset.theme = 'ink';
  floodUnder.inert = true;
  floodUnder.setAttribute('aria-hidden', 'true');
  floodOver.before(floodUnder);

  const fl = { top: 0, range: 1, maxR: 1, flipR: 1, r: 0, active: false };
  onMeasure(() => {
    fl.top = pageTop(flood);
    fl.range = Math.max(1, flood.offsetHeight - S.vh);
    fl.maxR = Math.hypot(S.vw / 2, S.vh / 2) * 1.02;
    fl.flipR = Math.hypot(S.vw * 0.34, S.vh / 2 - 36);
    fl.active = getComputedStyle($('.flood-sticky')).position === 'sticky';
  });
  scene(() => {
    if (!fl.active) { floodOver.style.clipPath = ''; fl.r = fl.maxR; return; }
    if (S.sy + S.vh < fl.top - 50 || S.sy > fl.top + fl.range + S.vh) return;
    const p = clamp((S.sy - fl.top + S.vh * 0.42) / (fl.range * 0.76 + S.vh * 0.42));
    fl.r = p <= 0 ? 0 : Math.max(6, Math.pow(p, 1.7) * fl.maxR);
    floodOver.style.clipPath = fl.r >= fl.maxR ? 'none' : `circle(${fl.r.toFixed(1)}px at 50% 50%)`;
  });

  /* ---------- Navegação, progresso, voltar ao topo ---------- */

  const nav = $('#nav');
  const navPct = $('#navPct');
  const backTop = $('#backTop');
  const backRing = $('#backTopRing');
  const zones = $$('main > section, .footer').map((el) => ({ el, theme: el.dataset.theme, top: 0, bottom: 0 }));
  const navTargets = $$('.nav-link').map((link) => {
    const id = link.getAttribute('href').slice(1);
    return { link, id, el: id === 'contato' ? flood : document.getElementById(id), top: 0 };
  });
  let docMax = 1;
  let lastY = S.y;
  let scrollingUp = false;
  let lastPct = -1;
  let activeId = '';

  onMeasure(() => {
    zones.forEach((z) => {
      z.top = pageTop(z.el);
      z.bottom = z.top + z.el.offsetHeight;
    });
    navTargets.forEach((t) => { if (t.id !== 'hero') t.top = pageTop(t.el); });
    docMax = Math.max(1, root.scrollHeight - S.vh);
  });

  scene(() => {
    const probe = S.y + 34;
    const inFlood = probe >= fl.top && probe < fl.top + flood.offsetHeight;
    let zone = 'ink';
    zones.forEach((z) => { if (probe >= z.top && probe < z.bottom) zone = z.theme; });
    if (inFlood) zone = fl.r >= fl.flipR ? 'signal' : 'ink';
    if (root.dataset.zone !== zone) root.dataset.zone = zone;

    const bottomProbe = S.y + S.vh - 50;
    const floodAtBottom = bottomProbe >= fl.top && bottomProbe < fl.top + flood.offsetHeight && fl.r >= fl.maxR * 0.9;
    const zoneEnd = floodAtBottom ? 'signal' : 'other';
    if (root.dataset.zoneEnd !== zoneEnd) root.dataset.zoneEnd = zoneEnd;

    const delta = S.y - lastY;
    if (S.y < 70) nav.classList.remove('is-hidden');
    else if (delta > 2) nav.classList.add('is-hidden');
    else if (delta < -2) nav.classList.remove('is-hidden');
    nav.classList.toggle('is-solid', S.y >= 70);
    if (delta > 2) scrollingUp = false;
    else if (delta < -2) scrollingUp = true;
    lastY = S.y;

    const pct = Math.round(clamp(S.y / docMax) * 100);
    if (pct !== lastPct) { lastPct = pct; navPct.textContent = String(pct).padStart(2, '0'); }

    const center = S.y + S.vh * 0.4;
    let current = 'hero';
    navTargets.forEach(({ id, top }) => { if (id !== 'hero' && center >= top) current = id; });
    if (current !== activeId) {
      activeId = current;
      navTargets.forEach(({ link, id }) => link.classList.toggle('is-active', id === current));
    }

    const inGallery = gal.pinned && S.y >= gal.top - S.vh * 0.3 && S.y <= gal.top + gal.range;
    const atEnd = S.y > docMax - S.vh * 0.4;
    backTop.classList.toggle('show', S.y > S.vh * 1.1 && !inGallery && (scrollingUp || atEnd));
    backRing.style.transform = `rotate(${(S.sy * 0.12).toFixed(1)}deg)`;
  });

  /* ---------- Cursor e microinterações ---------- */

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    S.px = e.clientX;
    S.py = e.clientY;
    S.pointer = true;
  }, { passive: true });
  document.addEventListener('mouseleave', () => { S.pointer = false; });

  if (fine) {
    root.classList.add('has-cursor');
    const cursor = $('#cursor');
    const dot = $('.cursor-dot', cursor);
    const ring = $('.cursor-ring', cursor);
    const label = $('.cursor-label', cursor);
    const trail = { x: -100, y: -100 };
    const inspect = (target) => {
      if (!target || !target.closest) return;
      const labelled = target.closest('[data-cursor]');
      cursor.classList.toggle('is-label', Boolean(labelled));
      if (labelled) label.textContent = labelled.dataset.cursor;
      cursor.classList.toggle('is-link', !labelled && Boolean(target.closest('a, button')));
      const themed = target.closest('[data-theme]');
      if (themed) cursor.dataset.theme = themed.dataset.theme;
    };
    addEventListener('pointerover', (e) => inspect(e.target), { passive: true });
    let lastInspect = 0;
    scene((dt, now) => {
      if (!S.pointer) { cursor.style.opacity = '0'; return; }
      cursor.style.opacity = '1';
      trail.x = damp(trail.x, S.px, 90, dt);
      trail.y = damp(trail.y, S.py, 90, dt);
      dot.style.transform = `translate3d(${S.px}px, ${S.py}px, 0)`;
      ring.style.transform = `translate3d(${trail.x.toFixed(1)}px, ${trail.y.toFixed(1)}px, 0)`;
      cursor.classList.toggle('in-hero', S.py < S.vh - S.y);
      if (Math.abs(S.vy) > 0.5 && now - lastInspect > 160) {
        lastInspect = now;
        inspect(document.elementFromPoint(S.px, S.py));
      }
    });

    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const box = el.getBoundingClientRect();
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height / 2);
        el.style.transition = 'transform .25s ease-out, color .35s, border-color .35s, background-color .3s';
        el.style.transform = `translate3d(${(dx * 0.26).toFixed(1)}px, ${(dy * 0.34).toFixed(1)}px, 0)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = '';
        el.style.transform = '';
      });
    });
  }

  $$('.btn').forEach((btn) => {
    btn.addEventListener('pointerenter', (e) => {
      const box = btn.getBoundingClientRect();
      btn.style.setProperty('--x', `${e.clientX - box.left}px`);
      btn.style.setProperty('--y', `${e.clientY - box.top}px`);
    });
  });

  /* ---------- Loop ---------- */

  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(now - last, 50) || 16.67;
    last = now;
    const prev = S.sy;
    S.y = scrollY;
    S.sy = Math.abs(S.y - S.sy) < 0.05 ? S.y : damp(S.sy, S.y, 85, dt);
    S.vy = damp(S.vy, ((S.sy - prev) / dt) * 16.67, 90, dt);
    for (let i = 0; i < scenes.length; i++) scenes[i](dt, now);
    requestAnimationFrame(loop);
  };

  /* ---------- Medidas e redimensionamento ---------- */

  let codeW = 0;
  let codeH = 0;
  const rebuildCode = () => {
    if (heroStage.clientWidth === codeW && heroStage.clientHeight === codeH && code.ready) return;
    codeW = heroStage.clientWidth;
    codeH = heroStage.clientHeight;
    buildCode();
  };

  let resizeTimer = 0;
  let lastW = innerWidth;
  let lastH = innerHeight;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Barra de endereço do celular muda só a altura: re-medir aí faria a página pular
      if (!fine && innerWidth === lastW && Math.abs(innerHeight - lastH) < 130) return;
      lastW = innerWidth;
      lastH = innerHeight;
      measure();
      rebuildCode();
    }, 180);
  });

  pinQuery.addEventListener('change', measure);

  /* ---------- Entrada ---------- */

  const loader = $('#loader');
  const loaderNum = $('#loaderNum');
  const loaderBar = $('#loaderBar');

  let returning = false;
  try { returning = sessionStorage.getItem('es-visited') === '1'; sessionStorage.setItem('es-visited', '1'); } catch { /* armazenamento bloqueado */ }

  const imageReady = portrait.complete ? Promise.resolve() : new Promise((resolve) => {
    portrait.addEventListener('load', resolve, { once: true });
    portrait.addEventListener('error', resolve, { once: true });
  });
  const fontsReady = document.fonts
    ? Promise.all([document.fonts.load('500 12px "Martian Mono"'), document.fonts.load('900 100px "Archivo"'), document.fonts.load('italic 100px "Instrument Serif"')]).catch(() => {})
    : Promise.resolve();
  const cap = new Promise((resolve) => setTimeout(resolve, 3500));

  let interacted = false;
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => {
    addEventListener(type, () => { interacted = true; }, { once: true, passive: true });
  });

  const applyHash = () => {
    if (interacted || !location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'instant' });
  };

  addEventListener('load', () => {
    measure();
    applyHash();
    // Só agora: com rolagem suave desde o início, o salto nativo para a âncora terminaria numa posição antiga
    requestAnimationFrame(() => root.classList.add('smooth-scroll'));
  });

  measure();
  requestAnimationFrame(loop);

  const finishIntro = () => {
    loader.classList.add('is-done');
    setTimeout(() => loader.remove(), 1100);
    const startScan = () => {
      intro.start = performance.now();
      intro.running = true;
      setTimeout(() => heroName.classList.add('in'), INTRO_MS * 0.46);
      setTimeout(() => root.classList.add('hero-in'), INTRO_MS * 0.62);
      setTimeout(startRoles, INTRO_MS);
    };
    if (scrollY > S.vh) {
      intro.done = true;
      heroName.classList.add('in');
      root.classList.add('hero-in');
      startRoles();
    } else {
      setTimeout(startScan, 260);
    }
  };

  let assetsDone = false;
  Promise.race([Promise.all([imageReady, fontsReady]), cap]).then(() => {
    measure();
    rebuildCode();
    applyHash();
    assetsDone = true;
  });

  const minTime = returning ? 300 : 1500;
  const t0 = performance.now();
  const count = (now) => {
    const k = clamp((now - t0) / minTime);
    const value = assetsDone ? k : Math.min(k, 0.88);
    const eased = 1 - Math.pow(1 - value, 2.4);
    loaderNum.textContent = String(Math.round(eased * 100)).padStart(3, '0');
    loaderBar.style.transform = `scaleX(${eased.toFixed(3)})`;
    if (assetsDone && k >= 1) finishIntro();
    else requestAnimationFrame(count);
  };
  requestAnimationFrame(count);
})();
