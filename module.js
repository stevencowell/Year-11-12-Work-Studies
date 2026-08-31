(() => {
  'use strict';

  const index = Number(document.body.dataset.moduleIndex || 0);
  const moduleMeta = window.WORK_STUDIES?.modules?.[index];
  const module = moduleMeta ? window.WORK_STUDIES_CONTENT?.modules?.[moduleMeta.id] : null;
  const runtime = window.WorkStudiesRuntime;
  if (!moduleMeta || !module || !runtime) {
    const main = document.querySelector('[data-module-main]');
    if (main) main.innerHTML = '<div class="status-note caution"><strong>This module could not load.</strong> Refresh the page. If the problem remains, tell your teacher which module you opened.</div>';
    return;
  }

  const escape = runtime.escapeHtml;
  const sectionScope = sectionId => `module:${moduleMeta.id}:section:${sectionId}:learning-package`;
  const reviewScope = `module:${moduleMeta.id}:review`;
  const previous = index > 0 ? `module-${String(index).padStart(2, '0')}.html` : '../index.html#modules';
  const next = index < window.WORK_STUDIES.modules.length - 1 ? `module-${String(index + 2).padStart(2, '0')}.html` : '../folio.html';

  document.title = `${moduleMeta.title} | Years 11–12 Work Studies`;

  const hero = document.querySelector('[data-module-hero]');
  const main = document.querySelector('[data-module-main]');
  const aside = document.querySelector('[data-module-aside]');

  hero.innerHTML = `<p class="eyebrow">${escape(moduleMeta.year)} · ${moduleMeta.hours} provisional hours · ${escape(moduleMeta.id)}</p>
    <h1>${escape(moduleMeta.title)}</h1>
    <p class="lede">${escape(moduleMeta.summary)}</p>
    <div class="module-meta"><span class="chip">3 learning sections</span><span class="chip">Saves on this device</span></div>`;

  const vocabularyMarkup = vocabulary => `<dl class="key-vocabulary">${vocabulary.map(item => `<div class="vocab-item"><dt>${escape(item.term)}</dt><dd>${escape(item.meaning)}</dd></div>`).join('')}</dl>`;

  const questionMarkup = (section, question, questionIndex) => `<fieldset class="question" id="${escape(question.id)}" data-question-index="${questionIndex}">
    <legend>${questionIndex + 1}. ${escape(question.prompt)}</legend>
    <div class="option-list">${question.options.map(option => `<label class="option"><input type="radio" name="${escape(section.id)}-q${questionIndex + 1}" value="${escape(option.id)}"><span>${escape(option.text)}</span></label>`).join('')}</div>
    <p class="question-feedback" data-question-feedback aria-live="polite">Choose one answer, then check the section.</p>
  </fieldset>`;

  const sectionMarkup = (section, sectionIndex) => `<section class="learning-section" id="${section.id.toLowerCase()}" data-section-container="${escape(section.id)}">
    <p class="eyebrow">Section ${sectionIndex + 1} of 3 · ${escape(section.id)}</p>
    <h2>${escape(section.title)}</h2>
    <div id="${section.id.toLowerCase()}-theory" class="theory-block">
      <div class="learning-intention"><h3>Learning intention</h3><p>${escape(section.learningIntention)}</p><h3>Success looks like</h3><ul>${section.successCriteria.map(item => `<li>${escape(item)}</li>`).join('')}</ul></div>
      <div class="theory-body">${section.theoryParagraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</div>
      <div class="worked-example"><h3>${escape(section.workedExample.title)}</h3><p><strong>Situation:</strong> ${escape(section.workedExample.context)}</p><p><strong>How to reason through it:</strong> ${escape(section.workedExample.analysis)}</p></div>
      <h3>Key vocabulary</h3>${vocabularyMarkup(section.vocabulary)}
      <div class="misconception"><h3>A useful correction</h3><p><strong>Easy assumption:</strong> ${escape(section.misconception.claim)}</p><p><strong>Better understanding:</strong> ${escape(section.misconception.correction)}</p></div>
    </div>
    <figure class="teaching-visual" id="${section.id.toLowerCase()}-visual"><img src="../${escape(section.visual.file)}" alt="${escape(window.WORK_STUDIES_VISUALS?.[section.id]?.alt_text || section.visual.alt)}" loading="lazy"><figcaption><span>${escape(window.WORK_STUDIES_VISUALS?.[section.id]?.caption || section.visual.purpose)}</span><span class="visual-notice"><strong>Notice:</strong> ${escape(window.WORK_STUDIES_VISUALS?.[section.id]?.notice_prompt || section.visual.purpose)}</span><a class="visual-open" href="../${escape(section.visual.file)}" target="_blank" rel="noopener">Open larger</a></figcaption></figure>
    <aside class="video-learning" id="${section.id.toLowerCase()}-media"><h3>${escape(section.mediaAlternative.title)}</h3><p><strong>Before:</strong> ${escape(section.mediaAlternative.before)}</p><p><strong>During:</strong> ${escape(section.mediaAlternative.during)}</p><p><strong>After:</strong> ${escape(section.mediaAlternative.after)}</p></aside>
    <details class="learning-package section-learning" id="learning-${section.id.toLowerCase()}">
      <summary><span>Knowledge check and long response</span><strong>10 questions + 1 capstone</strong></summary>
      <div class="package-body" data-check-section="${escape(section.id)}">
        <p><strong>Formative learning evidence.</strong> This is practice with feedback, not a formal mark. Use the theory above when an answer needs another look.</p>
        <div class="question-list">${section.questions.map((question, questionIndex) => questionMarkup(section, question, questionIndex)).join('')}</div>
        <div class="package-actions"><button class="button" type="button" data-check-answers>Check my answers</button><button class="button quiet" type="button" data-clear-choices>Clear choices</button></div>
        <div class="capstone-evidence" data-evidence-section>
          <p class="eyebrow">Higher-order evidence · ${escape(section.longResponse.higherOrderVerb)}</p>
          <h3>${escape(section.longResponse.prompt)}</h3>
          <div class="planning-grid"><div class="planning-card"><strong>Plan your response</strong><ol>${section.longResponse.scaffoldPrompts.map(item => `<li>${escape(item)}</li>`).join('')}</ol></div><div class="planning-card"><strong>Check before saving</strong><ul>${section.longResponse.successCriteria.map(item => `<li>${escape(item)}</li>`).join('')}</ul></div></div>
          <label class="field-group" for="${escape(section.longResponse.id)}"><strong>Your response</strong></label>
          <textarea class="response-field" id="${escape(section.longResponse.id)}" data-evidence-response placeholder="Build your response here. It saves only in this browser."></textarea>
          <div class="package-actions"><span class="save-status" role="status" data-save-status>Not saved yet</span><span class="save-status" data-word-count>0 words</span><button class="button quiet" type="button" data-export-section>Export this section</button><button class="button quiet" type="button" data-print-section>Print</button><button class="button danger" type="button" data-reset-section>Reset this section</button></div>
        </div>
      </div>
    </details>
    <div class="worked-example" id="activity-${section.id.toLowerCase()}"><h3>Apply this section</h3><p><strong>${escape(section.appliedActivity.title)}</strong> — ${escape(section.appliedActivity.prompt)}</p><p><strong>Keep:</strong> ${escape(section.appliedActivity.evidence)}</p><p><a href="../applied-learning/index.html">Open the Applied Learning bank for further practice</a></p></div>
    <span id="${section.id.toLowerCase()}-learning-end" aria-hidden="true"></span>
  </section>`;

  main.innerHTML = `<section class="module-presentation" id="${moduleMeta.id.toLowerCase()}-presentation" data-module-presentation>
      <div><p class="eyebrow">Classroom presentation</p><h2>${escape(moduleMeta.title)} PowerPoint</h2><p>Editable teacher-led slides matched to this module’s three named sections.</p></div>
      <a class="button" id="${moduleMeta.id.toLowerCase()}-presentation-download" href="../presentations/${escape(moduleMeta.slug)}.pptx" aria-label="Download PowerPoint" data-module-presentation-download download>Download PowerPoint</a>
    </section>
    ${module.sections.map(sectionMarkup).join('')}
    <section class="module-review module-review-checklist" id="module-review">
      <p class="eyebrow">Module review</p><h2>Quizzes and long responses</h2><p>Use this list to return to unfinished evidence. Completion is stored only in this browser.</p>
      <div class="progress-meter" aria-hidden="true"><span data-module-progress-bar style="width:0"></span></div><p data-module-progress-text>0 of 3 section packages have saved evidence.</p>
      <ol class="module-review-grid">${module.sections.map(section => `<li><a class="module-review-link" href="#learning-${section.id.toLowerCase()}"><strong>${escape(section.title)}</strong><span data-review-state="${escape(section.id)}">Not started · 10 questions + long response</span></a></li>`).join('')}</ol>
    </section>
    <nav class="module-nav" aria-label="Module sequence"><a class="button secondary" href="${previous}">Previous</a><a class="button" href="${next}">${index === window.WORK_STUDIES.modules.length - 1 ? 'Open My folio' : 'Next module'}</a></nav>`;

  aside.innerHTML = `<div class="panel"><p class="eyebrow">In this module</p><ol>${module.sections.map(section => `<li><a href="#${section.id.toLowerCase()}">${escape(section.title)}</a></li>`).join('')}</ol><a class="button secondary" href="#module-review">Module review</a><a class="button quiet" data-resume href="#learning-${module.sections[0].id.toLowerCase()}">Continue where I left off</a></div><div class="panel" style="margin-top:1rem"><p class="eyebrow">Privacy</p><p class="fine">Writing stays on this device until you export or print it. Do not enter employer-confidential or unnecessary personal details.</p></div>`;

  const sectionState = section => {
    const saved = runtime.read(sectionScope(section.id), { answers: {}, checked: false, response: '', updatedAt: null });
    return { ...saved, evidenceLabel: 'Formative learning evidence' };
  };

  const updateReview = () => {
    let completeCount = 0;
    let lastStarted = module.sections[0];
    module.sections.forEach(section => {
      const state = sectionState(section);
      const answered = Object.keys(state.answers || {}).length;
      const words = runtime.wordCount(state.response);
      const started = answered > 0 || words > 0;
      const complete = answered === 10 && words >= 40;
      if (started) lastStarted = section;
      if (complete) completeCount += 1;
      const label = document.querySelector(`[data-review-state="${section.id}"]`);
      if (label) label.textContent = complete ? 'Evidence saved · 10 questions + long response' : started ? `${answered}/10 answers · ${words} words saved` : 'Not started · 10 questions + long response';
    });
    const percent = Math.round((completeCount / module.sections.length) * 100);
    document.querySelector('[data-module-progress-bar]').style.width = `${percent}%`;
    document.querySelector('[data-module-progress-text]').textContent = `${completeCount} of ${module.sections.length} section packages have saved evidence.`;
    const resume = document.querySelector('[data-resume]');
    resume.href = `#learning-${lastStarted.id.toLowerCase()}`;
    runtime.write(reviewScope, { evidenceLabel: 'Formative learning evidence', completeCount, lastSectionId: lastStarted.id, updatedAt: new Date().toISOString() });
  };

  module.sections.forEach(section => {
    const packageElement = document.getElementById(`learning-${section.id.toLowerCase()}`);
    const state = sectionState(section);
    const response = packageElement.querySelector('[data-evidence-response]');
    const status = packageElement.querySelector('[data-save-status]');
    const count = packageElement.querySelector('[data-word-count]');
    response.value = state.response || '';

    Object.entries(state.answers || {}).forEach(([questionId, optionId]) => {
      const input = packageElement.querySelector(`#${CSS.escape(questionId)} input[value="${CSS.escape(optionId)}"]`);
      if (input) input.checked = true;
    });

    const save = changes => {
      const current = sectionState(section);
      const nextState = { ...current, ...changes, evidenceLabel: 'Formative learning evidence', updatedAt: new Date().toISOString() };
      const saved = runtime.write(sectionScope(section.id), nextState);
      status.textContent = saved ? 'Saved on this device' : 'Could not save — export or copy your work';
      count.textContent = `${runtime.wordCount(response.value)} words`;
      updateReview();
    };

    const showFeedback = () => {
      section.questions.forEach(question => {
        const fieldset = document.getElementById(question.id);
        const selected = fieldset.querySelector('input:checked');
        const feedback = fieldset.querySelector('[data-question-feedback]');
        if (!selected) {
          feedback.className = 'question-feedback review';
          feedback.textContent = 'Choose an answer before checking this question.';
          return;
        }
        const option = question.options.find(item => item.id === selected.value);
        const isCorrect = selected.value === question.correctOptionId;
        feedback.className = `question-feedback ${isCorrect ? 'correct' : 'review'}`;
        const feedbackText = `${isCorrect ? 'Correct. ' : 'Review this idea. '}${option.feedback}${isCorrect && question.rationale ? ` ${question.rationale}` : ''} `;
        const helpLink = document.createElement('a');
        helpLink.href = `#${question.theoryAnchor}`;
        helpLink.textContent = 'Review the matching theory.';
        feedback.replaceChildren(document.createTextNode(feedbackText), helpLink);
      });
    };

    packageElement.addEventListener('change', event => {
      if (!event.target.matches('input[type="radio"]')) return;
      const answers = { ...sectionState(section).answers };
      const fieldset = event.target.closest('.question');
      answers[fieldset.id] = event.target.value;
      save({ answers, checked: false });
    });

    let saveTimer;
    response.addEventListener('input', () => {
      count.textContent = `${runtime.wordCount(response.value)} words`;
      status.textContent = 'Saving…';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => save({ response: response.value }), 350);
    });

    packageElement.querySelector('[data-check-answers]').addEventListener('click', () => {
      showFeedback();
      save({ checked: true });
    });

    packageElement.querySelector('[data-clear-choices]').addEventListener('click', () => {
      packageElement.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
      packageElement.querySelectorAll('[data-question-feedback]').forEach(feedback => { feedback.className = 'question-feedback'; feedback.textContent = 'Choose one answer, then check the section.'; });
      save({ answers: {}, checked: false });
    });

    packageElement.querySelector('[data-export-section]').addEventListener('click', () => {
      runtime.downloadJson(`${section.id.toLowerCase()}-work-studies-evidence.json`, {
        schema: 'wwhs-work-studies-section-evidence-v1',
        courseId: window.WORK_STUDIES.courseId,
        moduleId: moduleMeta.id,
        sectionId: section.id,
        sectionTitle: section.title,
        prompt: section.longResponse.prompt,
        evidenceLabel: 'Formative learning evidence',
        exportedAt: new Date().toISOString(),
        evidence: sectionState(section)
      });
    });

    packageElement.querySelector('[data-print-section]').addEventListener('click', () => {
      packageElement.open = true;
      window.print();
    });

    packageElement.querySelector('[data-reset-section]').addEventListener('click', () => {
      if (!window.confirm(`Reset the saved quiz choices and long response for “${section.title}” on this device?`)) return;
      runtime.remove(sectionScope(section.id));
      window.location.reload();
    });

    if (state.checked) showFeedback();
    status.textContent = state.updatedAt ? 'Saved on this device' : 'Not saved yet';
    count.textContent = `${runtime.wordCount(response.value)} words`;
  });

  const openAndFocusPackage = (href, updateHistory = true) => {
    const packageId = String(href || '').replace(/^.*#/, '');
    if (!packageId.startsWith('learning-')) return false;
    const packageElement = document.getElementById(packageId);
    if (!packageElement) return false;
    packageElement.open = true;
    if (updateHistory) history.pushState(null, '', `#${packageId}`);
    packageElement.scrollIntoView({ block: 'start' });
    requestAnimationFrame(() => packageElement.querySelector('summary')?.focus({ preventScroll: true }));
    return true;
  };

  document.querySelectorAll('.module-review-link, [data-resume]').forEach(link => {
    link.addEventListener('click', event => {
      if (!openAndFocusPackage(link.getAttribute('href'))) return;
      event.preventDefault();
    });
  });

  window.addEventListener('hashchange', () => openAndFocusPackage(window.location.hash, false));
  if (window.location.hash) openAndFocusPackage(window.location.hash, false);

  updateReview();
})();
