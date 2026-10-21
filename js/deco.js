/* Décor des marges : pellicules sur les bords, formes d'affiche et de cinéma.
   Purement décoratif (aria-hidden), visible seulement sur grands écrans. */
(function () {
  'use strict';
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const NOIR = '#171513', ROUGE = '#E2553F', JAUNE = '#E6B94A', ACIER = '#2F5D7C', PAPIER = '#F1E4C3', BLEU = '#7FA8C4';

  function eclat(n, r1, r2) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? r2 : r1;
      const a = (Math.PI * i) / n - Math.PI / 2;
      pts.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }

  const BLANC = '#FBF3DF', GRIS = '#8A7F66';

  const bobine = (() => {
    const trous = [0, 1, 2, 3, 4].map((i) => {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      return '<circle cx="' + (50 + 26 * Math.cos(a)).toFixed(1) + '" cy="' + (50 + 26 * Math.sin(a)).toFixed(1) + '" r="9" fill="' + PAPIER + '"/>';
    }).join('');
    return '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="' + NOIR + '"/><circle cx="50" cy="50" r="43" fill="none" stroke="' + JAUNE + '" stroke-width="3"/>' + trous + '<circle cx="50" cy="50" r="7" fill="' + PAPIER + '"/></svg>';
  })();

  const clap =
    '<svg viewBox="0 0 100 90"><rect x="6" y="38" width="88" height="46" fill="' + NOIR + '"/>' +
    '<rect x="16" y="52" width="40" height="5" fill="' + PAPIER + '"/><rect x="16" y="64" width="26" height="5" fill="' + PAPIER + '"/>' +
    '<rect x="64" y="52" width="20" height="17" fill="' + ROUGE + '"/>' +
    '<g class="bras"><rect x="6" y="20" width="88" height="16" fill="' + NOIR + '"/>' +
    '<g fill="' + JAUNE + '"><polygon points="18,20 30,20 24,36 12,36"/><polygon points="42,20 54,20 48,36 36,36"/><polygon points="66,20 78,20 72,36 60,36"/></g></g></svg>';

  /* Militantisme : un mégaphone. */
  const megaphone =
    '<svg viewBox="0 0 130 100"><rect x="8" y="36" width="22" height="26" rx="3" fill="' + NOIR + '"/>' +
    '<polygon points="30,38 80,10 80,88 30,60" fill="' + NOIR + '"/>' +
    '<rect x="76" y="6" width="10" height="86" rx="3" fill="' + ROUGE + '"/>' +
    '<rect x="36" y="64" width="12" height="26" rx="3" fill="' + ACIER + '"/>' +
    '<g fill="none" stroke="' + ACIER + '" stroke-width="5" stroke-linecap="round">' +
    '<path class="onde" d="M97 32 Q109 49 97 66"/><path class="onde" d="M108 20 Q127 49 108 78"/></g></svg>';

  /* Jeux vidéo : une jaquette, sans titre ni détails. */
  const jaquette =
    '<svg viewBox="0 0 80 110"><rect x="2" y="2" width="76" height="106" rx="5" fill="' + NOIR + '"/>' +
    '<rect x="2" y="2" width="76" height="16" rx="5" fill="' + ROUGE + '"/><rect x="2" y="12" width="76" height="6" fill="' + ROUGE + '"/>' +
    '<rect x="8" y="24" width="64" height="56" rx="2" fill="' + ACIER + '"/>' +
    '<rect x="16" y="40" width="48" height="26" rx="13" fill="' + PAPIER + '"/>' +
    '<rect x="25" y="50" width="12" height="4" fill="' + NOIR + '"/><rect x="29" y="46" width="4" height="12" fill="' + NOIR + '"/>' +
    '<circle cx="51" cy="49" r="3.5" fill="' + ROUGE + '"/><circle cx="57" cy="56" r="3.5" fill="' + JAUNE + '"/>' +
    '<rect x="8" y="88" width="40" height="5" fill="' + PAPIER + '" opacity=".85"/><rect x="8" y="97" width="24" height="4" fill="' + BLEU + '"/></svg>';

  /* Excel : un mini tableur avec sa cellule sélectionnée. */
  const tableur =
    '<svg viewBox="0 0 120 90"><rect x="2" y="2" width="116" height="82" fill="' + BLANC + '" stroke="' + NOIR + '" stroke-width="4"/>' +
    '<rect x="4" y="18" width="22" height="64" fill="#D9C99B"/><rect x="2" y="2" width="116" height="16" fill="' + NOIR + '"/>' +
    '<g stroke="' + GRIS + '" stroke-width="1.5"><path d="M26 18V84M56 18V84M86 18V84M2 34H118M2 50H118M2 66H118"/></g>' +
    '<g fill="' + GRIS + '"><rect x="7" y="24" width="12" height="4"/><rect x="7" y="40" width="12" height="4"/><rect x="7" y="56" width="12" height="4"/><rect x="7" y="72" width="12" height="4"/></g>' +
    '<rect class="cel" x="29" y="37" width="24" height="10" fill="' + ACIER + '"/><rect class="cel" x="59" y="37" width="24" height="10" fill="' + ROUGE + '"/>' +
    '<rect class="cel" x="59" y="53" width="24" height="10" fill="' + ACIER + '"/><rect class="cel" x="89" y="69" width="26" height="10" fill="' + ROUGE + '"/>' +
    '<rect class="cel" x="29" y="69" width="24" height="10" fill="' + ACIER + '"/>' +
    '<rect class="sel" x="26" y="18" width="30" height="16" fill="none" stroke="' + ROUGE + '" stroke-width="3"/></svg>';

  /* Photo : un appareil. */
  const appareil =
    '<svg viewBox="0 0 110 80"><rect x="2" y="14" width="106" height="62" rx="8" fill="' + NOIR + '"/>' +
    '<rect x="30" y="4" width="26" height="14" rx="3" fill="' + NOIR + '"/><rect x="82" y="6" width="16" height="10" rx="2" fill="' + ROUGE + '"/>' +
    '<circle cx="55" cy="45" r="24" fill="' + PAPIER + '"/><circle cx="55" cy="45" r="19" fill="' + ACIER + '"/><circle cx="55" cy="45" r="10" fill="' + NOIR + '"/>' +
    '<circle cx="49" cy="39" r="4" fill="' + PAPIER + '" opacity=".8"/><circle cx="14" cy="27" r="4" fill="' + ROUGE + '"/>' +
    '<circle class="flash" cx="55" cy="45" r="30" fill="' + BLANC + '" opacity="0"/></svg>';

  /* Podcast : un micro. */
  const micro =
    '<svg viewBox="0 0 70 120"><ellipse class="ring" cx="35" cy="32" rx="30" ry="30" fill="none" stroke="' + ACIER + '" stroke-width="3" opacity="0"/>' +
    '<ellipse class="ring" cx="35" cy="32" rx="30" ry="30" fill="none" stroke="' + ROUGE + '" stroke-width="3" opacity="0"/>' +
    '<rect x="20" y="4" width="30" height="56" rx="15" fill="' + NOIR + '"/>' +
    '<g stroke="' + PAPIER + '" stroke-width="2"><path d="M27 20H43M27 30H43M27 40H43"/></g>' +
    '<path d="M10 40V50A25 25 0 0 0 60 50V40" fill="none" stroke="' + NOIR + '" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="32" y="76" width="6" height="26" fill="' + NOIR + '"/><rect x="18" y="102" width="34" height="7" rx="2" fill="' + ROUGE + '"/></svg>';


  /* Objets supplémentaires du quotidien, du jeu et de l'animation. */
  const MENTE = '#8FC9A9';
  const mot = (texte, couleur) => '<span class="mot" style="--c:var(' + couleur + ')">' + texte + '</span>';
  const objet = (type, dessin) => '<svg viewBox="0 0 100 100" role="presentation">' + dessin + '</svg>';
  const cd = objet('cd','<circle cx="50" cy="50" r="43" fill="#B8C8C8" stroke="'+NOIR+'" stroke-width="5"/><circle cx="50" cy="50" r="28" fill="none" stroke="'+PAPIER+'" stroke-width="5"/><circle cx="50" cy="50" r="9" fill="'+ROUGE+'" stroke="'+NOIR+'" stroke-width="3"/>');
  const cafe = objet('cafe','<path d="M20 32h53v39a12 12 0 0 1-12 12H32a12 12 0 0 1-12-12z" fill="'+PAPIER+'" stroke="'+NOIR+'" stroke-width="5"/><path d="M73 42h8a12 12 0 0 1 0 24h-8" fill="none" stroke="'+NOIR+'" stroke-width="5"/><path d="M34 24q-8-8 0-16M49 24q-8-8 0-16M64 24q-8-8 0-16" fill="none" stroke="'+ROUGE+'" stroke-width="4" stroke-linecap="round"/><path d="M20 72h53" stroke="'+ROUGE+'" stroke-width="5"/>');
  const pancarte = objet('pancarte','<path d="M30 55l-6 39M70 55l6 39" stroke="'+NOIR+'" stroke-width="5"/><path d="M8 12h84v47H8z" fill="'+PAPIER+'" stroke="'+NOIR+'" stroke-width="5"/><path d="M18 25h64M18 36h48M18 47h56" stroke="'+ROUGE+'" stroke-width="5"/>');
  const feuille = objet('feuille','<path d="M19 7h46l17 18v68H19z" fill="'+PAPIER+'" stroke="'+NOIR+'" stroke-width="4"/><path d="M65 7v19h17" fill="none" stroke="'+NOIR+'" stroke-width="4"/><path d="M30 40h39M30 52h34M30 64h39M30 76h26" stroke="'+ACIER+'" stroke-width="4"/><path d="M67 70l8 8 14-21" fill="none" stroke="'+ROUGE+'" stroke-width="5"/>');
  const sifflet = objet('sifflet','<path d="M12 38h48a24 24 0 0 1 0 48H35A23 23 0 0 1 12 63z" fill="'+JAUNE+'" stroke="'+NOIR+'" stroke-width="5"/><path d="M60 39l25-20 8 10-17 23" fill="'+ROUGE+'" stroke="'+NOIR+'" stroke-width="4"/><circle cx="48" cy="61" r="9" fill="'+PAPIER+'" stroke="'+NOIR+'" stroke-width="4"/>');
  const des = objet('des','<g transform="rotate(-9 50 50)"><rect x="10" y="10" width="80" height="80" rx="12" fill="'+ROUGE+'" stroke="'+NOIR+'" stroke-width="5"/><g fill="'+PAPIER+'"><circle cx="30" cy="30" r="6"/><circle cx="70" cy="30" r="6"/><circle cx="50" cy="50" r="6"/><circle cx="30" cy="70" r="6"/><circle cx="70" cy="70" r="6"/></g></g>');
  const ballon = objet('ballon','<circle cx="50" cy="50" r="39" fill="'+MENTE+'" stroke="'+NOIR+'" stroke-width="5"/><path d="M50 11l12 22-12 17-12-17zM12 38l26-5M88 38l-26-5M26 80l12-30M74 80L62 50M38 89l12-39 12 39" fill="none" stroke="'+NOIR+'" stroke-width="4"/>');
  const cartes = objet('cartes','<g transform="rotate(-10 43 52)"><rect x="9" y="13" width="57" height="76" rx="4" fill="'+PAPIER+'" stroke="'+NOIR+'" stroke-width="4"/><path d="M23 31l8 12 8-12-8-8zM31 51v21" fill="'+ROUGE+'" stroke="'+ROUGE+'" stroke-width="4"/></g><g transform="rotate(12 65 46)"><rect x="38" y="7" width="53" height="75" rx="4" fill="'+JAUNE+'" stroke="'+NOIR+'" stroke-width="4"/><circle cx="64" cy="42" r="12" fill="'+ACIER+'"/></g>');
  const pinceau = objet('pinceau','<path d="M20 74L65 29l12 12-45 45q-12 7-12-12z" fill="'+PAPIER+'" stroke="'+NOIR+'" stroke-width="4"/><path d="M62 28l13-15q10-5 14 5l-12 24z" fill="'+ROUGE+'" stroke="'+NOIR+'" stroke-width="4"/><path d="M16 83q-5 12 10 6" fill="none" stroke="'+ACIER+'" stroke-width="4"/>');
  const puzzle = objet('puzzle','<path d="M12 12h23q-4 16 9 16t9-16h35v26q-15-4-15 9t15 9v32H61q4-15-9-15t-9 15H12V58q15 4 15-9t-15-9z" fill="'+BLEU+'" stroke="'+NOIR+'" stroke-width="4"/>');
  const pool = [
    {type:'mega',h:megaphone},{type:'clap',h:clap},{type:'bobine',h:bobine,spin:true},{type:'jaquette',h:jaquette},{type:'photo',h:appareil},{type:'tableur',h:tableur},{type:'micro',h:micro},
    {type:'cd',h:cd},{type:'cafe',h:cafe},{type:'pancarte',h:pancarte},{type:'feuille',h:feuille},{type:'sifflet',h:sifflet},{type:'des',h:des},{type:'ballon',h:ballon},{type:'cartes',h:cartes},{type:'pinceau',h:pinceau},{type:'puzzle',h:puzzle},
    {type:'mot',h:mot('Ça tourne','--rouge'),mot:true},{type:'mot',h:mot('À suivre','--acier'),mot:true}
  ];
  for (let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  /* Les objets restent dans la zone de contenu : ils ne passent pas sous le bandeau ni le pied de page. */
  const positions = [13,19,25,31,37,43,49,55,61,67,73,79];
  const formes = pool.slice(0,12).map((f,i)=>({c:i%2?'d':'g',t:positions[i],k:[.7,.85,1,.9][i%4],r:[-6,7,0,6,-5,-4,8,-9,12][i%9],dl:Math.random()*2.5,...f}));

  const couche = document.createElement('div');
  couche.className = 'deco';
  couche.setAttribute('aria-hidden', 'true');
  const estQui = document.body.classList.contains('page-qui');
  const visibles = estQui ? formes.filter((_, i) => [0, 3, 6, 9].includes(i)) : formes;
  couche.innerHTML =
    '<div class="pellicule pellicule-g"></div><div class="pellicule pellicule-d"></div>' +
    visibles.map((f) =>
      '<div class="forme ' + f.c + (f.mot ? ' forme-mot' : '') + (f.spin ? ' forme-spin' : '') + '" data-type="' + f.type + '" style="top:' + f.t + '%;--k:' + f.k + ';--rot:' + f.r + 'deg;--dl:-' + f.dl + 's"><div class="in">' + f.h + '</div></div>'
    ).join('');
  document.body.prepend(couche);

  /* ---------- Petites réactions au clic (discrètes, coupées si l'on préfère moins d'animations) ---------- */
  const joue = (n, kf, opt) => (n && n.animate ? n.animate(kf, Object.assign({ duration: 600, easing: 'ease-out' }, opt || {})) : null);
  const tous = (f, sel) => Array.from(f.querySelectorAll(sel));

  const reactions = {
    mega(f, i) {
      joue(i, [{ transform: 'rotate(0)' }, { transform: 'rotate(-9deg) scale(1.08)' }, { transform: 'rotate(5deg) scale(1.04)' }, { transform: 'rotate(0)' }], { duration: 550 });
      tous(f, '.onde').forEach((o, k) => joue(o, [{ opacity: 1, transform: 'translateX(0) scale(1)' }, { opacity: 0, transform: 'translateX(12px) scale(1.3)' }, { opacity: 1, transform: 'translateX(0) scale(1)' }], { duration: 750, delay: k * 150 }));
    },
    clap(f) {
      joue(f.querySelector('.bras'), [{ transform: 'rotate(-14deg)' }, { transform: 'rotate(-38deg)', offset: 0.35 }, { transform: 'rotate(1deg)', offset: 0.6 }, { transform: 'rotate(-14deg)' }], { duration: 650 });
    },
    bobine(f, i) {
      joue(i, [{ transform: 'rotate(0)' }, { transform: 'rotate(540deg)' }], { duration: 1300, easing: 'cubic-bezier(.1,.7,.2,1)' });
    },
    jaquette(f, i) {
      joue(i, [{ transform: 'perspective(300px) rotateY(0)' }, { transform: 'perspective(300px) rotateY(360deg)' }], { duration: 900, easing: 'ease-in-out' });
    },
    photo(f, i) {
      joue(f.querySelector('.flash'), [{ opacity: 0 }, { opacity: 0.95, offset: 0.15 }, { opacity: 0 }], { duration: 450 });
      joue(i, [{ transform: 'scale(1)' }, { transform: 'scale(1.07)' }, { transform: 'scale(1)' }], { duration: 300 });
    },
    tableur(f) {
      tous(f, '.cel').forEach((c, k) => joue(c, [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 420, delay: k * 110, easing: 'steps(1,end)' }));
    },
    cd(f, i) { joue(i, [{transform:'rotate(0)'},{transform:'rotate(360deg)'}], {duration:700}); },
    cafe(f, i) { joue(i, [{transform:'rotate(0)'},{transform:'rotate(-8deg)'},{transform:'rotate(0)'}], {duration:420}); },
    pancarte(f, i) { joue(i, [{transform:'rotate(0)'},{transform:'rotate(8deg)'},{transform:'rotate(-5deg)'},{transform:'rotate(0)'}], {duration:500}); },
    feuille(f, i) { joue(i, [{transform:'translateY(0)'},{transform:'translateY(-8px) rotate(3deg)'},{transform:'translateY(0)'}], {duration:450}); },
    sifflet(f, i) { joue(i, [{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}], {duration:350}); },
    des(f, i) { joue(i, [{transform:'rotate(0)'},{transform:'rotate(180deg)'},{transform:'rotate(360deg)'}], {duration:550}); },
    ballon(f, i) { joue(i, [{transform:'translateY(0)'},{transform:'translateY(-16px)'},{transform:'translateY(0)'}], {duration:450}); },
    cartes(f, i) { joue(i, [{transform:'rotate(0)'},{transform:'rotate(12deg)'},{transform:'rotate(0)'}], {duration:400}); },
    pinceau(f, i) { joue(i, [{transform:'rotate(0)'},{transform:'rotate(-18deg)'},{transform:'rotate(0)'}], {duration:400}); },
    puzzle(f, i) { joue(i, [{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}], {duration:400}); },
    micro(f, i) {
      tous(f, '.ring').forEach((r, k) => joue(r, [{ opacity: 0.9, transform: 'scale(.6)' }, { opacity: 0, transform: 'scale(1.7)' }], { duration: 750, delay: k * 200, fill: 'none' }));
      joue(i, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 300 });
    },
    mot(f, i) {
      joue(i, [{ transform: 'scale(1.3) rotate(-4deg)' }, { transform: 'scale(.96) rotate(2deg)', offset: 0.5 }, { transform: 'scale(1) rotate(0)' }], { duration: 420, easing: 'cubic-bezier(.2,1.5,.4,1)' });
    },
  };

  const PAILLETTES = [ROUGE, ACIER, NOIR, '#8FC9A9', '#BFA6DE'];
  function eclate(f) {
    const cx = f.offsetLeft + f.offsetWidth / 2, cy = f.offsetTop + f.offsetHeight / 2;
    for (let n = 0; n < 8; n++) {
      const p = document.createElement('i');
      const a = (Math.PI * 2 * n) / 8 + Math.random() * 0.5, d = 38 + Math.random() * 34;
      p.className = 'paillette';
      p.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;background:' + PAILLETTES[n % PAILLETTES.length] + ';' + (n % 2 ? 'border-radius:50%' : '');
      couche.append(p);
      const anim = joue(p, [{ opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }, { opacity: 0, transform: 'translate(calc(-50% + ' + (Math.cos(a) * d).toFixed(0) + 'px), calc(-50% + ' + (Math.sin(a) * d - 14).toFixed(0) + 'px)) rotate(' + (n * 70) + 'deg) scale(.4)' }], { duration: 750 + Math.random() * 250, easing: 'cubic-bezier(.2,.7,.3,1)' });
      if (anim) anim.onfinish = () => p.remove(); else p.remove();
    }
  }

  if (!calme) {
    couche.addEventListener('click', (e) => {
      const f = e.target.closest('.forme');
      if (!f || f.dataset.occupe) return;
      f.dataset.occupe = '1';
      setTimeout(() => { delete f.dataset.occupe; }, 900);
      const r = reactions[f.dataset.type];
      if (r) r(f, f.querySelector('.in'));
      if (window.Sons) {
        const sons = { mega:'sifflet', clap:'clap', bobine:'roulette', jaquette:'papier', photo:'camera', tableur:'tableur', micro:'cloche', cd:'roulette', cafe:'bois', pancarte:'bois', feuille:'papier', sifflet:'sifflet', des:'clap', ballon:'bulle', cartes:'papier', pinceau:'crayon', puzzle:'cloche', mot:'filtre' };
        window.Sons.jouer(sons[f.dataset.type] || 'papier');
      }
      eclate(f);
    });
  }

  /* Les pellicules défilent doucement quand on fait défiler la page. */
  if (!calme) {
    let prevu = false;
    const maj = () => { prevu = false; document.documentElement.style.setProperty('--defile', String(scrollY)); };
    addEventListener('scroll', () => { if (!prevu) { prevu = true; requestAnimationFrame(maj); } }, { passive: true });
    maj();
  }
})();
