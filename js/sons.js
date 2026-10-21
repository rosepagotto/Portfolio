/* Sons retravaillés : petits sons tactiles, plus organiques et moins synthétiques.
   Le son reste coupé par défaut ; le son de filtre conserve son petit timbre clair. */
(function () {
  'use strict';
  let actif = false, ctx = null;
  try { actif = localStorage.getItem('rose-sons') === 'oui'; } catch (_) {}

  function jouer(type) {
    if (!actif) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const t = ctx.currentTime;
      const gain = (g, debut, duree, niveau = .15) => { g.gain.setValueAtTime(.0001, t + debut); g.gain.exponentialRampToValueAtTime(niveau, t + debut + .006); g.gain.exponentialRampToValueAtTime(.0001, t + debut + duree); };
      if (type === 'filtre') {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(760, t); o.frequency.exponentialRampToValueAtTime(1040, t + .055);
        gain(g, 0, .085, .12); o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .095); return;
      }
      if (type === 'copie') type = 'papier';
      if (type === 'jeu') type = 'clap';
      if (type === 'attrape') type = 'ding';
      if (type === 'perdu') type = 'erreur';
      if (type === 'fin') type = 'clap';
      if (type === 'clic' || type === 'plaque') type = 'bois';
      if (type === 'tampon') type = 'tampon';
      if (type === 'papier') {
        const n = Math.floor(ctx.sampleRate * .045), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
        const src = ctx.createBufferSource(), filt = ctx.createBiquadFilter(), g = ctx.createGain();
        src.buffer = b; filt.type = 'bandpass'; filt.frequency.value = 1700; filt.Q.value = .7; gain(g, 0, .05); src.connect(filt); filt.connect(g); g.connect(ctx.destination); src.start(t); return;
      }
      const configs = {
        bois: [{f:230,d:.045,w:'triangle',end:155}],
        tampon: [{f:125,d:.105,w:'triangle',end:76},{f:78,d:.07,w:'sine',end:62,delay:.018}],
        clap: [{f:420,d:.035,w:'square',end:250},{f:190,d:.075,w:'triangle',end:105,delay:.025}],
        ding: [{f:660,d:.08,w:'sine',end:880},{f:990,d:.06,w:'sine',end:760,delay:.035}],
        erreur: [{f:190,d:.11,w:'triangle',end:125},{f:130,d:.12,w:'sine',end:95,delay:.05}],
        camera: [{f:1150,d:.025,w:'square',end:1800},{f:800,d:.055,w:'sine',end:520,delay:.018}],
        sifflet: [{f:1500,d:.07,w:'sine',end:2100},{f:1900,d:.055,w:'sine',end:1600,delay:.04}],
        roulette: [{f:310,d:.045,w:'triangle',end:470},{f:470,d:.05,w:'triangle',end:220,delay:.045}],
        bulle: [{f:240,d:.045,w:'sine',end:540}],
        crayon: [{f:430,d:.025,w:'triangle',end:280},{f:300,d:.04,w:'triangle',end:180,delay:.025}],
        tableur: [{f:950,d:.018,w:'square',end:620},{f:740,d:.018,w:'square',end:480,delay:.03}],
        cloche: [{f:880,d:.11,w:'sine',end:1040},{f:1320,d:.1,w:'sine',end:990,delay:.025}]
      };
      (configs[type] || configs.bois).forEach(p => {
        const o = ctx.createOscillator(), g = ctx.createGain(), start = t + (p.delay || 0);
        o.type = p.w; o.frequency.setValueAtTime(p.f, start); o.frequency.exponentialRampToValueAtTime(p.end, start + p.d);
        gain(g, p.delay || 0, p.d); o.connect(g); g.connect(ctx.destination); o.start(start); o.stop(start + p.d + .01);
      });
    } catch (_) {}
  }
  function configure() {
    const b = document.getElementById('son-bouton'); if (!b) return;
    function paint() { b.innerHTML = '<svg class="son-icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3Z"/><path class="son-ondes" d="M16 9a5 5 0 0 1 0 6M18.5 6.5a9 9 0 0 1 0 11"/><path class="son-barre" d="M4 4l16 16"/></svg>'; b.classList.toggle('son-coupe', !actif); b.setAttribute('aria-pressed', String(actif)); b.setAttribute('aria-label', actif ? 'Désactiver les effets sonores' : 'Activer les effets sonores'); b.title = actif ? 'Désactiver les effets sonores' : 'Activer les effets sonores'; }
    paint();
    b.addEventListener('click', () => { actif = !actif; try { localStorage.setItem('rose-sons', actif ? 'oui' : 'non'); } catch (_) {} paint(); if (actif) jouer('bois'); });
  }
  document.addEventListener('DOMContentLoaded', configure);
  document.addEventListener('click', e => {
    const t = e.target.closest('button,a,.filtre,.tampon'); if (!t || t.id === 'son-bouton') return;
    if (t.matches('.filtre,.tampon')) jouer('filtre');
    else if (t.id === 'email-copier') jouer('papier');
    else if (t.closest('.cuisine-jeu')) jouer(t.classList.contains('cuisine-servir') ? 'tampon' : 'papier');
    else if (t.closest('.deco .forme')) jouer('papier');
    else if (t.matches('button,a')) jouer('bois');
  }, true);
  window.Sons = { jouer, actif: () => actif };
})();
