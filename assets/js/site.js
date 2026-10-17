(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.site-nav');
  if (toggle && navigation) {
    toggle.hidden = false;
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
      toggle.querySelector('.nav-toggle-label').textContent = 'Menu';
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
      toggle.querySelector('.nav-toggle-label').textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); }
    });
    navigation.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  }
  const tools = document.querySelector('.publication-tools');
  if (!tools) return;
  const search = document.getElementById('publication-search');
  const topic = document.getElementById('publication-topic');
  const year = document.getElementById('publication-year');
  const count = document.getElementById('publication-count');
  const empty = document.getElementById('publication-empty');
  const reset = document.querySelector('.reset-filters');
  const groups = [...document.querySelectorAll('[data-publication-section]')];
  const papers = [...document.querySelectorAll('[data-publication]')];
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase().trim();
  const searchIndex = new Map(papers.map(paper => [paper, normalize(paper.dataset.search)]));
  [...new Set(papers.map(paper => paper.dataset.year))].sort().reverse().forEach(value => {
    const option = document.createElement('option'); option.value = value; option.textContent = value; year.append(option);
  });
  const filter = () => {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    groups.forEach(group => {
      let matches = 0;
      group.querySelectorAll('[data-publication]').forEach(paper => {
        const matchesTopic = topic.value === 'all' || topic.value === group.dataset.publicationSection;
        const matchesYear = year.value === 'all' || year.value === paper.dataset.year;
        const matchesText = terms.every(term => searchIndex.get(paper).includes(term));
        paper.hidden = !(matchesTopic && matchesYear && matchesText);
        if (!paper.hidden) matches++;
      });
      const sectionCount = group.querySelector('.section-count');
      if (sectionCount) sectionCount.textContent = `${matches} ${matches === 1 ? 'paper' : 'papers'}`;
      group.hidden = matches === 0; visible += matches;
    });
    count.textContent = `${visible} of ${papers.length} publications`;
    empty.hidden = visible !== 0;
    reset.hidden = !search.value && topic.value === 'all' && year.value === 'all';
  };
  tools.hidden = false;
  search.addEventListener('input', filter); topic.addEventListener('change', filter); year.addEventListener('change', filter);
  reset.addEventListener('click', () => { search.value = ''; topic.value = year.value = 'all'; filter(); search.focus(); });
  filter();
})();
