(async function () {
  'use strict';
  const { el, charger, chemin, paragraphes, norm, plage, parseDate, image, urlSure } = U;
  const $ = (s, r = document) => r.querySelector(s);
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = calme ? 'auto' : 'smooth';
  const DUREE_FILTRE = calme ? 0 : 420;

  const TYPES = { travail: 'Travail', benevolat: 'Bénévolat', etudes: 'Études', diplomes: 'Diplômes' };
  const COULEUR_TYPE = { travail: '--rouge', benevolat: '--menthe', etudes: '--bleu', diplomes: '--lilas' };
  const COULEURS = ['--jaune', '--rouge', '--menthe', '--bleu', '--lilas'];
  const ROT = ['-2deg', '1.5deg', '-1.5deg', '2deg'];

  /* ---------- Apparitions : on prépare l'observateur tout de suite ---------- */
  let io = null;
  if ('IntersectionObserver' in window && !calme) {
    document.documentElement.classList.add('anim');
    io = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('pose');
        // Les tampons se posent en même temps que leur plaque (avec un léger retard en CSS).
        e.target.querySelectorAll('.tampon:not(.filtre)').forEach((t) => t.classList.add('pose'));
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
  }
  const voir = (racine) => {
    if (!io) return;
    racine.querySelectorAll('.reveal, .wipe').forEach((n) => io.observe(n));
  };
  const echelonner = (liste, pas = 70, max = 6) =>
    [...liste.children].forEach((c, i) => c.style.setProperty('--d', Math.min(i, max) * pas + 'ms'));
  if (io) document.querySelectorAll('.plaque-titre').forEach((n) => io.observe(n));

  let profil, comps, projets, parcours, galerie, appr, menu;
  try {
    [profil, comps, projets, parcours, galerie, appr, menu] = await Promise.all(
      ['profil', 'competences', 'projets', 'parcours', 'galerie', 'appreciations', 'menu'].map(charger)
    );
  } catch (e) {
    console.error(e);
    $('main').replaceChildren(el('p', { class: 'erreur', text: "Le contenu n'a pas pu être chargé. Réessayez dans un instant." }));
    return;
  }

  /* ---------- En-tête, ruban et pied de page ---------- */
  $('#nom').textContent = profil.nom || '';
  $('#sous-titre').textContent = profil.sous_titre || '';
  $('#pied-texte').textContent = '© ' + new Date().getFullYear() + ' ' + (profil.nom || '');

  const mots = (profil.tags || []).filter(Boolean);
  if (mots.length) {
    const suite = () => el('div', { class: 'ruban-suite' },
      [1, 2, 3, 4].flatMap(() => mots.flatMap((m) => [el('span', { text: m }), el('i', { class: 'ruban-sep' })])));
    $('#ruban').append(el('div', { class: 'ruban-piste' }, suite(), suite()));
  } else {
    $('#ruban').hidden = true;
  }

  /* ---------- À propos ---------- */
  $('#a-propos-contenu').append(
    el('div', { class: 'ap-texte' }, paragraphes(profil.a_propos).map((t) => el('p', { text: t }))),
    el('div', { class: 'ap-plaque' },
      profil.accroche ? el('p', { class: 'accroche', text: profil.accroche }) : null,
      mots.length ? el('p', { class: 'tags', text: mots.join(' · ') }) : null
    )
  );

  /* ---------- Visionneuse PDF ---------- */
  const pdf = $('#pdf-dialog');
  async function ouvrirDoc(fichier, titre) {
    const url = chemin(fichier);
    if (!/\.pdf$/i.test(url)) { window.open(url, '_blank', 'noopener'); return; }
    const corps = $('#pdf-corps');
    const dl = $('#pdf-telecharger');
    $('#pdf-titre').textContent = titre || '';
    corps.replaceChildren(el('p', { class: 'pdf-message', text: 'Chargement…' }));
    dl.hidden = true;
    pdf.showModal();
    let ok = false;
    try { ok = (await fetch(url, { method: 'HEAD' })).ok; } catch (e) { ok = false; }
    if (!ok) {
      corps.replaceChildren(el('p', { class: 'pdf-message', text: "Ce document n'est pas encore en ligne." }));
      return;
    }
    dl.href = url;
    dl.hidden = false;
    corps.replaceChildren(el('iframe', { class: 'pdf-cadre', src: url, title: titre || 'Document' }));
  }
  $('#pdf-fermer').addEventListener('click', () => pdf.close());
  pdf.addEventListener('click', (e) => { if (e.target === pdf) pdf.close(); });
  pdf.addEventListener('close', () => $('#pdf-corps').replaceChildren());

  /* ---------- Filtres par tampons (projets et parcours) ---------- */
  function creerFiltres(barre, etiquettes, lignes) {
    let actif = '';
    const boutons = [{ cle: '', libelle: 'Tout', couleur: '--papier' }, ...etiquettes].map((e, n) => {
      const b = el('button', {
        type: 'button', class: 'tampon filtre', style: '--c:var(' + e.couleur + ');--r:' + ROT[n % 4],
        'aria-pressed': String(e.cle === ''), 'data-filtre': e.cle, text: e.libelle,
      });
      b.addEventListener('click', () => appliquer(e.cle === actif ? '' : e.cle));
      return b;
    });
    barre.append(el('span', { class: 'filtres-titre', text: 'Filtrer' }), ...boutons);
    function appliquer(k) {
      actif = k;
      boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtre === k)));
      lignes.forEach((l) => {
        const cles = l.cles || [l.cle];
        const att = Boolean(k) && !cles.includes(k);
        // Comme pour Projets, le filtre agit par classe CSS : la plaque extérieure
        // reste dans la liste et se compacte grâce aux transitions de son contenu.
        l.li.classList.toggle('att', att);
        if (att && l.fermer) l.fermer();
      });
    }
    return { appliquer, reset: () => appliquer(''), actif: () => actif };
  }

  /* ---------- Projets ---------- */
  const cibles = [];
  const familles = [];
  const couleurFamille = (f) => COULEURS[familles.indexOf(f) % COULEURS.length];
  projets.forEach((p) => {
    const f = String(p.tampon || '').trim();
    if (f && !familles.includes(f)) familles.push(f);
  });

  const lignesProjets = [];
  projets.forEach((p, i) => {
    const famille = String(p.tampon || '').trim();
    const corpsId = 'projet-corps-' + i;
    const tete = el('button', { type: 'button', class: 'projet-tete', 'aria-expanded': 'false', 'aria-controls': corpsId },
      el('span', { class: 'projet-texte' },
        el('span', { class: 'projet-titre', text: p.titre }),
        p.categorie ? el('span', { class: 'projet-type', text: p.categorie }) : null
      ),
      el('span', { class: 'cel-tampon' },
        famille ? el('span', { class: 'tampon', style: '--c:var(' + couleurFamille(famille) + ');--r:' + ROT[i % 4], text: famille }) : null
      ),
      el('span', { class: 'signe', 'aria-hidden': 'true' })
    );
    const actions = [];
    if (urlSure(p.lien)) {
      actions.push(el('a', { class: 'bouton', href: p.lien, target: '_blank', rel: 'noopener', text: 'Voir le projet' }));
    }
    if (p.fichier) {
      actions.push(el('button', { type: 'button', class: 'bouton', onclick: () => ouvrirDoc(p.fichier, p.titre), text: 'Ouvrir le document' }));
    }
    const corps = el('div', { class: 'projet-corps', id: corpsId },
      el('div', { class: 'projet-corps-in' },
        el('div', { class: 'projet-cadre' },
          p.image ? image(p.image, p.titre, 'projet-image') : null,
          paragraphes(p.description).map((t) => el('p', { text: t })),
          actions.length ? el('div', { class: 'actions' }, actions) : null
        )
      )
    );
    const li = el('li', { class: 'projet wipe' }, tete, corps);
    const basculer = (ouvert) => {
      const o = ouvert === undefined ? !li.classList.contains('ouvert') : ouvert;
      li.classList.toggle('ouvert', o);
      tete.setAttribute('aria-expanded', String(o));
    };
    tete.addEventListener('click', () => {
      if (li.classList.contains('att')) { filtresProjets.reset(); basculer(true); } else basculer();
    });
    $('#projets-liste').append(li);
    cibles.push({ cles: [norm(p.titre)], el: li, ouvrir: () => basculer(true) });
    lignesProjets.push({ li, cle: famille || '__aucun', fermer: () => basculer(false) });
  });
  echelonner($('#projets-liste'));

  const filtresProjets = creerFiltres(
    $('#projets-filtres'),
    familles.map((f) => ({ cle: f, libelle: f, couleur: couleurFamille(f) })),
    lignesProjets
  );
  if (familles.length < 2) $('#projets-filtres').hidden = true;

  /* ---------- Parcours : entrées compactes, détails dépliables et filtre Animation ---------- */
  const cle = (d, defautMois) => (d ? d.a * 12 + (d.m || defautMois) : null);
  const items = parcours.map((p, i) => ({
    p, i, type: norm(p.type), debut: parseDate(p.debut), fin: parseDate(p.fin),
  }));
  items.sort((x, y) => {
    const sx = cle(x.debut, 1) ?? cle(x.fin, 12) ?? -1;
    const sy = cle(y.debut, 1) ?? cle(y.fin, 12) ?? -1;
    if (sx !== sy) return sy - sx;
    const fx = x.p.en_cours ? 1e9 : cle(x.fin, 12) ?? sx;
    const fy = y.p.en_cours ? 1e9 : cle(y.fin, 12) ?? sy;
    if (fx !== fy) return fy - fx;
    return x.i - y.i;
  });

  const lignesParcours = [];
  const plageCourte = (debut, fin, enCours) => {
    const d = parseDate(debut), f = parseDate(fin);
    if (enCours) return d ? 'depuis ' + d.a : 'en cours';
    if (!d && !f) return '';
    if (d && !f) return String(d.a);
    if (!d && f) return String(f.a);
    if (d.a === f.a) return String(d.a);
    return d.a + '–' + f.a;
  };
  items.forEach(({ p, type }, n) => {
    const corpsId = 'etape-detail-' + n;
    const texteAnimation = norm([p.titre, p.structure, p.detail, p.type].filter(Boolean).join(' '));
    const lieAnimation = /animation|animatrice|animateur|animatrice saisonniere|alsh|centre social|accueil de loisirs/.test(texteAnimation);
    const dateComplete = plage(p.debut, p.fin, p.en_cours);
    const dateCourte = plageCourte(p.debut, p.fin, p.en_cours);
    const dateCompressible = Boolean(dateComplete && dateCourte && dateComplete !== dateCourte && /\d{4}/.test(dateComplete));
    const date = el('span', { class: 'date' },
      el('span', { class: 'date-complete' + (dateCompressible ? '' : ' date-identique'), text: dateComplete }),
      dateCompressible ? el('span', { class: 'date-courte', text: dateCourte, 'aria-hidden': 'true' }) : null
    );
    const detail = p.detail ? el('div', { class: 'etape-detail', id: corpsId },
      el('div', { class: 'etape-detail-in' }, paragraphes(p.detail).map((t) => el('p', { text: t })))
    ) : null;
    const tete = el('button', { type: 'button', class: 'etape-tete' + (!detail ? ' sans-detail' : ''), 'aria-expanded': 'false', 'aria-controls': detail ? corpsId : null, disabled: !detail },
      date,
      el('span', { class: 'etape-texte' },
        el('span', { class: 'etape-titre', text: p.titre }),
        p.structure ? el('span', { class: 'etape-structure', text: p.structure }) : null
      ),
      el('span', { class: 'cel-tampon' },
        TYPES[type] ? el('span', { class: 'tampon', style: '--c:var(' + COULEUR_TYPE[type] + ');--r:' + ROT[n % 4], text: TYPES[type] }) : null,
      ),
      detail ? el('span', { class: 'etape-signe', 'aria-hidden': 'true' }) : null
    );
    const li = el('li', { class: 'etape wipe' }, tete, detail);
    const basculer = (ouvert) => {
      if (!detail) return;
      const o = ouvert === undefined ? tete.getAttribute('aria-expanded') !== 'true' : ouvert;
      tete.setAttribute('aria-expanded', String(o));
      li.classList.toggle('ouvert', o);
    };
    tete.addEventListener('click', () => {
      if (li.classList.contains('att')) filtresParcours.reset();
      basculer();
    });
    lignesParcours.push({ li, cles: [type, ...(lieAnimation ? ['animation'] : [])], fermer: () => basculer(false) });
    $('#parcours-liste').append(li);
    cibles.push({ cles: [norm(p.titre), norm(p.structure)], el: li, parcours: true, ouvrir: () => basculer(true) });
  });
  echelonner($('#parcours-liste'), 45, 8);

  const filtresParcours = creerFiltres(
    $('#parcours-filtres'),
    [{ cle: 'animation', libelle: 'Animation', couleur: '--jaune' },
      ...Object.entries(TYPES).map(([k, libelle]) => ({ cle: k, libelle, couleur: COULEUR_TYPE[k] }))],
    lignesParcours
  );

  /* ---------- Compétences (liens vers les projets et le parcours) ---------- */
  function trouver(nom) {
    const n = norm(nom);
    if (!n) return null;
    if (n === 'galerie') return { el: $('#galerie') };
    return cibles.find((c) => c.cles.includes(n))
      || cibles.find((c) => c.cles.some((k) => k && k.startsWith(n)))
      || null;
  }

  function aller(c) {
    const f = c.parcours ? filtresParcours : c.ouvrir ? filtresProjets : null;
    let attente = 0;
    if (f && f.actif()) { f.reset(); attente = DUREE_FILTRE; }
    setTimeout(() => {
      if (c.ouvrir) c.ouvrir();
      c.el.scrollIntoView({ behavior, block: c.parcours || c.ouvrir ? 'center' : 'start' });
      if (c.parcours || c.ouvrir) {
        c.el.classList.add('repere');
        setTimeout(() => c.el.classList.remove('repere'), 2200);
      }
    }, attente);
  }

  $('#competences-liste').append(...comps.map((c) => {
    const noms = c.vu_dans || [];
    let vu = null;
    if (noms.length) {
      vu = el('p', { class: 'vu' }, 'Vu dans : ');
      noms.forEach((nom, k) => {
        if (k) vu.append(', ');
        const t = trouver(nom);
        vu.append(t ? el('button', { type: 'button', class: 'lien-cible', onclick: () => aller(t), text: nom }) : nom);
      });
    }
    return el('li', { class: 'comp reveal' }, el('h3', { class: 'comp-titre', text: c.titre }), vu);
  }));
  echelonner($('#competences-liste'), 60, 5);

  /* ---------- Galerie et visionneuse photo ---------- */
  const photo = $('#photo-dialog');
  let courante = 0;
  function montrer(i) {
    if (!galerie.length) return;
    courante = (i + galerie.length) % galerie.length;
    const g = galerie[courante];
    $('#photo-fig').replaceChildren(
      image(g.image, g.alt || g.legende, 'photo-grande'),
      (g.legende || g.alt) ? el('figcaption', { class: 'photo-legendes' }, g.legende ? el('strong', { class: 'photo-surtitre', text: g.legende }) : null, g.alt && g.alt !== g.legende ? el('span', { class: 'photo-sous-titre', text: g.alt }) : null) : null
    );
    $('#photo-compteur').textContent = (courante + 1) + ' / ' + galerie.length;
  }
  galerie.forEach((g, i) => {
    const b = el('button', { type: 'button', class: 'vignette', 'aria-label': 'Agrandir : ' + (g.legende || 'photo ' + (i + 1)) },
      image(g.image, g.alt || g.legende, 'vignette-img'),
      g.legende ? el('span', { class: 'legende vignette-titre', text: g.legende }) : null,
    );
    b.addEventListener('click', () => { montrer(i); photo.showModal(); });
    $('#galerie-liste').append(el('li', { class: 'reveal' }, b));
  });
  echelonner($('#galerie-liste'), 80, 5);
  $('#photo-precedente').addEventListener('click', () => montrer(courante - 1));
  $('#photo-suivante').addEventListener('click', () => montrer(courante + 1));
  $('#photo-fermer').addEventListener('click', () => photo.close());
  photo.addEventListener('click', (e) => { if (e.target === photo) photo.close(); });
  photo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') montrer(courante - 1);
    if (e.key === 'ArrowRight') montrer(courante + 1);
  });

  /* ---------- Appréciations ---------- */
  $('#appreciations-liste').append(...appr.map((a) =>
    el('li', { class: 'appr reveal' },
      el('span', { class: 'guillemet', 'aria-hidden': 'true', text: '«' }),
      el('blockquote', { class: 'appr-texte' }, paragraphes(a.texte).map((t) => el('p', { text: t }))),
      el('p', { class: 'appr-nom', text: a.nom }),
      a.fonction ? el('p', { class: 'appr-fonction', text: a.fonction }) : null
    )
  ));
  echelonner($('#appreciations-liste'), 120, 3);

  /* ---------- Contact ---------- */
  $('#contact-contenu').append(el('div', { class: 'contact-corps' },
    profil.email ? el('span', { class: 'contact-mail-wrap' }, el('a', { class: 'contact-mail', href: 'mailto:' + profil.email, title: 'Cliquer pour copier l’adresse e-mail', onclick: async (event) => {
      event.preventDefault();
      const lien = event.currentTarget;
      let copie = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(profil.email);
          copie = true;
        }
      } catch (e) { /* Essayer la méthode de secours ci-dessous. */ }
      if (!copie) {
        const champ = document.createElement('textarea');
        champ.value = profil.email;
        champ.setAttribute('readonly', '');
        champ.style.position = 'fixed';
        champ.style.left = '-9999px';
        document.body.append(champ);
        champ.select();
        try { copie = document.execCommand('copy'); } catch (e) { copie = false; }
        champ.remove();
      }
      if (copie) {
        if (window.Sons) Sons.jouer('copie');
        const ancien = $('#email-copie-retour');
        if (ancien) ancien.remove();
        const retour = el('span', { id: 'email-copie-retour', class: 'email-copie-retour', role: 'status', 'aria-live': 'polite', text: 'E-mail copié !' });
        const enveloppe = lien.closest('.contact-mail-wrap');
        if (enveloppe) {
          const ancien = enveloppe.querySelector('.email-copie-retour');
          if (ancien) ancien.remove();
          enveloppe.append(retour);
          retour.addEventListener('animationend', () => retour.remove(), { once: true });
          setTimeout(() => retour.remove(), 2200);
        }
      }
    } }, profil.email)) : null,
    profil.ville ? el('p', { class: 'contact-ville', text: profil.ville }) : null,
    (() => {
      const reseaux = [
        { cle: 'linkedin', nom: 'LinkedIn', dessin: '<path d="M5 9v10M5 5v.1M10 19v-6a3 3 0 0 1 6 0v6M10 10v9"/><circle cx="5" cy="5" r="1"/>' },
        { cle: 'youtube', nom: 'YouTube', dessin: '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>' },
        { cle: 'instagram', nom: 'Instagram', dessin: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>' },
        { cle: 'letterboxd', nom: 'Letterboxd', dessin: '<circle cx="8" cy="12" r="5"/><circle cx="12" cy="12" r="5"/><circle cx="16" cy="12" r="5"/>' },
        { cle: 'discord', nom: 'Discord', dessin: '<path d="M7 7c3-2 7-2 10 0l2 10c-2 2-4 2-5 2l-1-2H11l-1 2c-2 0-4-1-5-2L7 7Z"/><path d="M9 12h.01M15 12h.01"/>' }
      ];
      const liens = reseaux.map((r) => {
        const url = r.cle === 'linkedin' ? profil.linkedin : (profil.reseaux && profil.reseaux[r.cle]);
        if (!url || !String(url).trim()) return null;
        const destination = /^https?:\/\//i.test(url) ? url : 'https://' + String(url).trim().replace(/^\/+/, '');
        if (!/^https?:\/\//i.test(destination)) return null;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
        svg.innerHTML = r.dessin;
        return el('a', { class: 'reseau-bouton', href: destination, target: '_blank', rel: 'noopener noreferrer', 'aria-label': r.nom, title: r.nom }, svg);
      }).filter(Boolean);
      return liens.length ? el('nav', { class: 'reseaux', 'aria-label': 'Réseaux sociaux' }, liens) : null;
    })()
  ));

  /* ---------- Menu « Plus » ---------- */
  const plusListe = $('#plus-liste');
  const plusBouton = $('#plus-bouton');
  function plus(ouvert) {
    plusListe.hidden = !ouvert;
    plusBouton.setAttribute('aria-expanded', String(ouvert));
  }
  if (!menu.length) {
    $('.plus').hidden = true;
  } else {
    menu.forEach((m) => {
      const contenu = [el('span', { text: m.libelle }), el('span', { class: 'plus-type', text: m.page ? 'Page' : 'PDF' })];
      const item = m.page
        ? el('a', { class: 'plus-item', href: m.page }, contenu)
        : el('button', { type: 'button', class: 'plus-item', onclick: () => { plus(false); ouvrirDoc(m.fichier, m.libelle); } }, contenu);
      plusListe.append(el('li', {}, item));
    });
  }
  plusBouton.addEventListener('click', () => plus(plusListe.hidden));
  document.addEventListener('click', (e) => { if (!plusListe.hidden && !e.target.closest('.plus')) plus(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !plusListe.hidden) { plus(false); plusBouton.focus(); }
  });

  /* ---------- Navigation : repli mobile et section courante ---------- */
  const nav = $('.nav');
  const navBouton = $('#nav-bouton');
  function replier(ouvert) {
    nav.classList.toggle('ouvert', ouvert);
    navBouton.setAttribute('aria-expanded', String(ouvert));
  }
  navBouton.addEventListener('click', () => replier(!nav.classList.contains('ouvert')));
  const liens = [...nav.querySelectorAll('.nav-liens a')];
  liens.forEach((a) => a.addEventListener('click', () => replier(false)));
  const sections = liens.map((a) => $(a.getAttribute('href')));

  let prevu = false;
  function espion() {
    prevu = false;
    let courant = null;
    for (const s of sections) if (s.getBoundingClientRect().top <= 140) courant = s;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) courant = sections[sections.length - 1];
    liens.forEach((a) => {
      if (courant && a.getAttribute('href') === '#' + courant.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => { if (!prevu) { prevu = true; requestAnimationFrame(espion); } }, { passive: true });
  espion();

  /* ---------- On déclenche les apparitions sur ce qui vient d'être construit ---------- */
  voir($('main'));
})();
