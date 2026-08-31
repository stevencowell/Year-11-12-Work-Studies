(() => {
  const data = window.WORK_STUDIES;
  const mount = document.getElementById('module-pathway');
  if (!mount) return;
  mount.innerHTML = data.modules.map((module,index) => `<article class="module-card"><span class="module-number">${module.number}</span><p class="eyebrow">${module.year} · ${module.hours} provisional hours</p><h3>${module.title}</h3><p>${module.summary}</p><a class="button secondary" href="modules/module-${String(index+1).padStart(2,'0')}.html">Open ${module.id}</a></article>`).join('');
})();
