(async function () {
  'use strict';
  const { el, charger, paragraphes, image } = U;
  const racine = document.querySelector('#qui-contenu');

  let d, profil;
  try {
    [d, profil] = await Promise.all([charger('qui-suis-je'), charger('profil')]);
  } catch (e) {
    console.error(e);
    racine.replaceChildren(el('p', { class: 'erreur', text: "Le contenu n'a pas pu être chargé. Réessayez dans un instant." }));
    return;
  }

  document.title = 'Qui suis-je ? · ' + (profil.nom || '');
  document.querySelector('#pied-texte').textContent = '© ' + new Date().getFullYear() + ' ' + (profil.nom || '');

  const titre = (t) => el('h2', { class: 'plaque-titre', text: t });
  const sections = [];

  /* Photo + phrase */
  sections.push(el('section', { class: 'qui-tete' },
    el('figure', { class: 'qui-photo' },
      image(d.photo, d.legende || 'Photo', 'qui-photo-img'),
      d.legende ? el('figcaption', { class: 'legende', text: d.legende }) : null
    ),
    d.phrase ? el('div', null, el('p', { class: 'etiquette', text: 'En une phrase' }), el('p', { class: 'phrase', text: d.phrase })) : null
  ));

  if (paragraphes(d.histoire).length) {
    sections.push(el('section', null,
      titre('Mon histoire'),
      el('div', { class: 'qui-texte' }, paragraphes(d.histoire).map((t) => el('p', { text: t })))
    ));
  }

  if ((d.passions || []).length) {
    sections.push(el('section', null,
      titre('Mes passions'),
      el('ul', { class: 'passions' }, d.passions.map((p) =>
        el('li', null,
          p.image ? image(p.image, p.titre, 'passion-img') : null,
          el('h3', { class: 'comp-titre', text: p.titre }),
          paragraphes(p.texte).map((t) => el('p', { class: 'passion-texte', text: t }))
        )
      ))
    ));
  }

  if ((d.en_vrac || []).length) {
    sections.push(el('section', null,
      titre('En vrac'),
      el('ul', { class: 'vrac' }, d.en_vrac.map((q) =>
        el('li', null, el('span', { class: 'vrac-q', text: q.question }), el('span', { class: 'vrac-r', text: q.reponse }))
      ))
    ));
  }

  racine.replaceChildren(...sections);
})();
