/* Lecteur musical : autoplay tenté, commandes accessibles, progression et mode compact. */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const player = $('#lecteur-musique');
  const audio = $('#musique-audio');
  if (!player || !audio) return;

  // Sortir le lecteur de tout conteneur transformé/filtré : position:fixed
  // sera ainsi calculé par rapport à la fenêtre, et non à la zone centrale.
  if (player.parentElement !== document.body) document.body.appendChild(player);
  const dialog = $('#credits-musique-dialog');
  const titre = $('#musique-titre');
  const auteur = $('#musique-auteur');
  const play = $('#musique-lecture');
  const progression = $('#musique-progression');
  const tempsActuel = $('#musique-temps-actuel');
  const tempsTotal = $('#musique-temps-total');
  const boutonCompact = $('#musique-compact');
  let pistes = [], index = -1, muet = false, rechercheEnCours = false;
  const historique = [];
  const mouvementReduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const chemin = (v) => String(v || '').trim().replace(/^\/+/, '');
  const nomFichier = (v) => decodeURIComponent(chemin(v).split('/').pop() || '').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
  const texte = (v) => String(v || '').trim();
  const formatTemps = (v) => {
    if (!Number.isFinite(v) || v < 0) return '–:––';
    const s = Math.floor(v);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };

  function afficherPiste() {
    const p = pistes[index];
    if (!p) return;
    titre.textContent = texte(p.titre) || nomFichier(p.fichier) || 'Bande-son';
    auteur.textContent = texte(p.auteur) || '';
    player.setAttribute('aria-label', 'Lecteur musical : ' + titre.textContent);
    requestAnimationFrame(() => { const deborde = titre.scrollWidth > titre.clientWidth + 2; titre.classList.toggle('musique-titre-long', deborde); titre.style.setProperty('--titre-decalage', Math.max(0, titre.scrollWidth - titre.parentElement.clientWidth) + 'px'); });
  }
  function choisirSuivante() {
    if (!pistes.length) return;
    if (pistes.length === 1) { index = 0; return; }
    let prochain;
    do { prochain = Math.floor(Math.random() * pistes.length); } while (prochain === index);
    if (index >= 0) historique.push(index);
    index = prochain;
  }
  function actualiserLecture() {
    const enLecture = !audio.paused;
    play.textContent = enLecture ? 'Ⅱ' : '▶';
    play.setAttribute('aria-label', enLecture ? 'Mettre la musique en pause' : 'Lire la musique');
    play.title = enLecture ? 'Mettre en pause' : 'Lire la musique';
    player.classList.toggle('lecteur-en-lecture', enLecture);
  }
  function actualiserProgression() {
    const duree = audio.duration;
    const valide = Number.isFinite(duree) && duree > 0;
    if (tempsActuel) tempsActuel.textContent = formatTemps(audio.currentTime);
    if (tempsTotal) tempsTotal.textContent = formatTemps(duree);
    if (progression) {
      progression.disabled = !valide;
      if (!rechercheEnCours) {
        const valeur = valide ? Math.max(0, Math.min(1000, Math.round(audio.currentTime / duree * 1000))) : 0;
        progression.value = String(valeur);
        progression.style.setProperty('--progression-musique', (valeur / 10) + '%');
      }
      progression.setAttribute('aria-valuetext', valide ? formatTemps(audio.currentTime) + ' sur ' + formatTemps(duree) : 'Durée indisponible');
    }
  }

  // Le lecteur reste fixé au véritable coin inférieur droit de la fenêtre.
  function placerPresDeLaBobine() {
    player.classList.remove('lecteur-pres-bobine');
    player.style.removeProperty('--lecteur-haut');
    player.style.removeProperty('--lecteur-droite');
  }

  async function lirePiste(nouvelle = false) {
    if (!pistes.length) return;
    if (nouvelle || index < 0) choisirSuivante();
    const p = pistes[index];
    const src = chemin(p.fichier);
    if (!src) return;
    if (audio.dataset.piste !== src) {
      audio.src = src;
      audio.dataset.piste = src;
      audio.load();
    }
    afficherPiste();
    try {
      await audio.play();
    } catch (_) {
      // L'autoplay sonore peut être refusé par le navigateur : les commandes restent disponibles.
      actualiserLecture();
    }
  }
  async function pistePrecedente() {
    if (!historique.length) { await lirePiste(true); return; }
    index = historique.pop();
    const p = pistes[index];
    const src = chemin(p && p.fichier);
    if (!src) return;
    audio.src = src; audio.dataset.piste = src; audio.load(); afficherPiste();
    try { await audio.play(); } catch (_) { actualiserLecture(); }
  }
  function credits() {
    const liste = $('#credits-musique-liste');
    if (!liste) return;
    liste.replaceChildren();
    pistes.forEach((p) => {
      const bloc = document.createElement('article'); bloc.className = 'credit-musique-item';
      const h = document.createElement('h3'); h.textContent = texte(p.titre) || nomFichier(p.fichier) || 'Morceau sans titre'; bloc.append(h);
      const ligne = (label, valeur) => { if (!texte(valeur)) return; const el = document.createElement('p'); const strong = document.createElement('strong'); strong.textContent = label + ' : '; el.append(strong, document.createTextNode(texte(valeur))); bloc.append(el); };
      if (texte(p.attribution)) { const a = document.createElement('p'); a.textContent = texte(p.attribution); bloc.append(a); }
      else { ligne('Auteur / compositeur', p.auteur); ligne('Droits', p.droits); ligne('Licence / autorisation', p.licence); }
      if (/^https?:\/\//i.test(texte(p.source))) {
        const row = document.createElement('p'); const a = document.createElement('a'); a.href = texte(p.source); a.textContent = 'Source'; a.target = '_blank'; a.rel = 'noopener noreferrer'; row.append(a); bloc.append(row);
      }
      liste.append(bloc);
    });
    if (!pistes.length) { const p = document.createElement('p'); p.textContent = 'Aucune musique de fond n’est configurée pour le moment.'; liste.append(p); }
  }

  // Le lecteur démarre compact sur petit écran pour préserver la lisibilité du contenu.
  if (window.matchMedia && window.matchMedia('(max-width: 600px)').matches) {
    player.classList.add('lecteur-compact');
    if (boutonCompact) { const chevron = boutonCompact.querySelector('.lecteur-chevron'); if (chevron) chevron.style.transform = 'rotate(180deg)'; boutonCompact.setAttribute('aria-label', 'Agrandir le lecteur musical'); boutonCompact.title = 'Agrandir le lecteur'; boutonCompact.setAttribute('aria-pressed', 'true'); }
  }

  fetch('contenu/musiques.json', { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error('Musiques indisponibles'); return r.json(); }).then(async (data) => {
    pistes = (Array.isArray(data) ? data : []).filter((p) => p && chemin(p.fichier));
    if (!pistes.length) {
      player.hidden = true;
      const ouvrir = $('#credits-musique-ouvrir'); if (ouvrir) ouvrir.hidden = true;
      return;
    }
    player.hidden = false;
    audio.volume = 0.15;
    audio.muted = false;
    let reprise = null;
    try { reprise = JSON.parse(sessionStorage.getItem('rose-musique-session') || 'null'); } catch (_) {}
    const repriseIndex = reprise && pistes.findIndex(p => chemin(p.fichier) === reprise.fichier);
    if (reprise && repriseIndex >= 0) {
      index = repriseIndex;
      const src = chemin(pistes[index].fichier);
      audio.src = src; audio.dataset.piste = src;
      afficherPiste(); credits();
      audio.addEventListener('loadedmetadata', function restaurer() {
        audio.removeEventListener('loadedmetadata', restaurer);
        if (Number.isFinite(reprise.temps)) { try { audio.currentTime = reprise.temps; } catch (_) {} }
        actualiserProgression();
        if (reprise.enLecture) audio.play().catch(() => actualiserLecture());
      });
      audio.load();
    } else {
      choisirSuivante(); afficherPiste(); credits();
      await lirePiste(false);
    }
    actualiserProgression();
  }).catch(() => { player.hidden = true; const ouvrir = $('#credits-musique-ouvrir'); if (ouvrir) ouvrir.hidden = true; });

  play.addEventListener('click', () => {
    if (audio.paused) lirePiste(index < 0);
    else audio.pause();
  });
  $('#musique-suivant').addEventListener('click', () => lirePiste(true));
  $('#musique-precedent').addEventListener('click', pistePrecedente);
  $('#musique-volume').addEventListener('click', () => {
    muet = !muet; audio.muted = muet;
    const b = $('#musique-volume'); b.textContent = muet ? '×' : '♫'; b.setAttribute('aria-label', muet ? 'Rétablir le son de la musique' : 'Couper la musique'); b.title = muet ? 'Rétablir le son' : 'Couper le son';
  });
  if (boutonCompact) boutonCompact.addEventListener('click', () => {
    const compact = player.classList.toggle('lecteur-compact');
    const chevron = boutonCompact.querySelector('.lecteur-chevron');
    if (chevron) chevron.style.transform = compact ? 'rotate(180deg)' : 'rotate(0deg)';
    boutonCompact.setAttribute('aria-pressed', String(compact));
    boutonCompact.setAttribute('aria-label', compact ? 'Agrandir le lecteur musical' : 'Réduire le lecteur musical');
    boutonCompact.title = compact ? 'Agrandir le lecteur' : 'Réduire le lecteur';
  });
  if (progression) {
    progression.addEventListener('input', () => {
      rechercheEnCours = true;
      const d = audio.duration;
      const valeur = Math.max(0, Math.min(1000, Number(progression.value) || 0));
      progression.style.setProperty('--progression-musique', (valeur / 10) + '%');
      if (Number.isFinite(d) && d > 0) {
        const t = valeur / 1000 * d;
        if (tempsActuel) tempsActuel.textContent = formatTemps(t);
        progression.setAttribute('aria-valuetext', formatTemps(t) + ' sur ' + formatTemps(d));
      }
    });
    const terminerRecherche = () => {
      const d = audio.duration;
      if (Number.isFinite(d) && d > 0) {
        const valeur = Math.max(0, Math.min(1000, Number(progression.value) || 0));
        try { audio.currentTime = valeur / 1000 * d; } catch (_) {}
      }
      rechercheEnCours = false;
      actualiserProgression();
    };
    progression.addEventListener('change', terminerRecherche);
    progression.addEventListener('pointerup', terminerRecherche);
    progression.addEventListener('keyup', (e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') terminerRecherche(); });
  }
  audio.addEventListener('timeupdate', actualiserProgression);
  audio.addEventListener('durationchange', actualiserProgression);
  audio.addEventListener('loadedmetadata', () => { actualiserProgression(); placerPresDeLaBobine(); });
  audio.addEventListener('canplay', actualiserProgression);
  audio.addEventListener('seeked', actualiserProgression);
  window.addEventListener('resize', placerPresDeLaBobine, { passive: true });
  window.addEventListener('scroll', placerPresDeLaBobine, { passive: true });
  // deco.js s'exécute juste après ce fichier : attendre quelques frames que la bobine soit créée.
  requestAnimationFrame(() => requestAnimationFrame(placerPresDeLaBobine));
  audio.addEventListener('play', actualiserLecture);
  audio.addEventListener('pause', actualiserLecture);
  audio.addEventListener('ended', () => lirePiste(true));
  window.addEventListener('pagehide', () => {
    try {
      sessionStorage.setItem('rose-musique-session', JSON.stringify({
        fichier: pistes[index] ? chemin(pistes[index].fichier) : '',
        temps: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
        enLecture: !audio.paused
      }));
    } catch (_) {}
  });
  const ouvrir = $('#credits-musique-ouvrir');
  if (ouvrir && dialog) ouvrir.addEventListener('click', () => {
    credits();
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
      dialog.style.display = 'block';
    }
  });
  const fermer = $('#credits-musique-fermer'); if (fermer && dialog) fermer.addEventListener('click', () => {
    if (typeof dialog.close === 'function') dialog.close();
    else { dialog.removeAttribute('open'); dialog.style.display = ''; }
  });
  if (dialog) dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
})();
