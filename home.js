(() => {
  const data = window.WORK_STUDIES;
  const mount = document.getElementById('module-pathway');
  if (!mount) return;
  mount.innerHTML = data.modules.map((module,index) => `<article class="module-card"><span class="module-number">${module.number}</span><p class="eyebrow">${module.year} · ${module.hours} provisional hours</p><h3>${module.title}</h3><p>${module.summary}</p><a class="button secondary" href="modules/module-${String(index+1).padStart(2,'0')}.html">Open ${module.id}</a></article>`).join('');

  const runtime = window.WorkStudiesRuntime;
  const progressText = document.querySelector('[data-course-progress]');
  const resume = document.querySelector('[data-course-resume]');
  if (!runtime || !progressText || !resume) return;

  const modules = data.modules.map((module, moduleIndex) => {
    const firstIncomplete = module.sections.find(([sectionId]) => {
      const state = runtime.read(`module:${module.id}:section:${sectionId}:learning-package`, { answers: {}, response: '' });
      return Object.keys(state.answers || {}).length !== 10 || runtime.wordCount(state.response) < 40;
    });
    return { moduleId: module.id, moduleIndex, complete: !firstIncomplete, resumeSectionId: firstIncomplete?.[0] || module.sections[module.sections.length - 1][0] };
  });
  const firstIncompleteModule = modules.find(item => !item.complete);
  const completedModules = modules.filter(item => item.complete).length;
  const progress = {
    schema: 'wwhs-work-studies-course-progress-v1',
    completedModules,
    totalModules: modules.length,
    modules,
    resume: firstIncompleteModule ? { moduleIndex: firstIncompleteModule.moduleIndex, moduleId: firstIncompleteModule.moduleId, sectionId: firstIncompleteModule.resumeSectionId } : { folio: true },
    updatedAt: new Date().toISOString()
  };
  runtime.write('course:progress', progress);
  progressText.textContent = `${completedModules} of ${modules.length} modules complete on this device.`;
  if (firstIncompleteModule) {
    resume.href = `modules/module-${String(firstIncompleteModule.moduleIndex + 1).padStart(2, '0')}.html#learning-${firstIncompleteModule.resumeSectionId.toLowerCase()}`;
    resume.textContent = completedModules ? `Continue with ${firstIncompleteModule.moduleId}` : 'Start the core';
  } else {
    resume.href = 'folio.html';
    resume.textContent = 'Open My folio';
  }
})();
