(() => {
  'use strict';
  const body = document.body;
  const root = body.dataset.root || '';
  const active = body.dataset.active || 'course';
  const links = [
    ['course',`${root}index.html`,'Course'],
    ['map',`${root}two-year-map.html`,'Two-year map'],
    ['modules',`${root}index.html#modules`,'Modules'],
    ['videos',`${root}video-learning/index.html`,'Video learning'],
    ['applied',`${root}applied-learning/index.html`,'Applied Learning'],
    ['folio',`${root}folio.html`,'My folio'],
    ['assessment',`${root}assessment.html`,'Assessment'],
    ['teacher',`${root}teacher-resources.html`,'Teacher resources'],
    ['main','https://stevencowell.github.io/Main-Page/','Main Menu']
  ];
  const mount = document.querySelector('[data-site-nav]');
  if (mount) {
    mount.innerHTML = `<div class="site-nav"><div class="wrap nav-inner"><a class="brand" href="${root}index.html"><span class="brand-mark">WS</span><span>Years 11–12 Work Studies</span></a><nav class="nav-links" aria-label="Course navigation">${links.map(([key,url,label]) => `<a href="${url}"${key===active?' aria-current="page"':''}>${label}</a>`).join('')}</nav></div></div>`;
  }
})();
