/* Petits outils partagés par toutes les pages.
   Tout le contenu affiché passe par textContent : rien de ce qui est saisi
   dans le CMS n'est interprété comme du HTML. */
(function () {
  'use strict';

  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  function el(tag, attrs, ...enfants) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'text') n.textContent = v;
      else if (k === 'class') n.className = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const c of enfants.flat()) {
      if (c === null || c === undefined || c === false) continue;
      n.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return n;
  }

  async function charger(nom) {
    const r = await fetch('contenu/' + nom + '.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error('contenu/' + nom + '.json : ' + r.status);
    return r.json();
  }

  /* Le CMS écrit des chemins comme « /images/photo.jpg ».
     Sur GitHub Pages le site vit dans un sous-dossier : on les rend relatifs. */
  const chemin = (p) => String(p || '').trim().replace(/^\/+/, '');

  const paragraphes = (t) => String(t || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  const urlSure = (u) => /^https?:\/\//i.test(String(u || '').trim());

  /* Dates : « 2025 » ou « 2025-03 ». */
  function parseDate(d) {
    const m = /^(\d{4})(?:-(\d{1,2}))?$/.exec(String(d || '').trim());
    if (!m) return null;
    const mois = m[2] ? Number(m[2]) : null;
    return { a: Number(m[1]), m: mois >= 1 && mois <= 12 ? mois : null };
  }

  const texteDate = (p) => (p.m ? MOIS[p.m - 1] + ' ' + p.a : String(p.a));

  function plage(debut, fin, enCours) {
    const d = parseDate(debut);
    const f = parseDate(fin);
    if (enCours) return d ? 'depuis ' + texteDate(d) : 'en cours';
    if (!d && !f) return '';
    if (d && !f) return texteDate(d);
    if (!d && f) return texteDate(f);
    if (d.a === f.a && d.m === f.m) return texteDate(d);
    if (!d.m && !f.m) return d.a + '–' + f.a;
    if (d.a === f.a) return MOIS[d.m - 1] + ' – ' + texteDate(f);
    return texteDate(d) + ' – ' + texteDate(f);
  }

  function image(src, alt, classe) {
    const s = chemin(src);
    const vide = () => el('div', { class: (classe || '') + ' vide', role: 'img', 'aria-label': alt || 'Photo à venir' }, el('span', { text: 'photo à venir' }));
    if (!s) return vide();
    const img = el('img', { class: classe || '', src: s, alt: alt || '', loading: 'lazy' });
    img.addEventListener('error', () => img.replaceWith(vide()));
    return img;
  }

  window.U = { el, charger, chemin, paragraphes, norm, urlSure, parseDate, plage, image };
})();
