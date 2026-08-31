(() => {
  'use strict';

  const supportApi = window.WORK_STUDIES_SUPPORT;
  if (!supportApi || !supportApi.ready) {
    console.warn('Work Studies support runtime could not start because support-data.js is missing.');
    return;
  }

  const VERSION = '1.0.0';
  const FOLIO_SCOPE = 'support:folio';
  const BACKUP_SCHEMA = 'wwhs-work-studies-support-folio-backup-v1';
  const MAX_FIELD_LENGTH = 20000;
  const MAX_BACKUP_BYTES = 1024 * 1024;
  const sharedRuntime = window.WorkStudiesRuntime || null;

  function createStorageAdapter() {
    const fallbackPrefix = `${supportApi.storage.namespace}:support:`;

    const read = (scope, fallback = {}) => {
      if (sharedRuntime && typeof sharedRuntime.read === 'function') {
        return sharedRuntime.read(scope, fallback);
      }
      try {
        const raw = localStorage.getItem(`${fallbackPrefix}${scope}`);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        console.warn('Work Studies support record could not be read.', error);
        return fallback;
      }
    };

    const write = (scope, value) => {
      if (sharedRuntime && typeof sharedRuntime.write === 'function') {
        return sharedRuntime.write(scope, value);
      }
      try {
        localStorage.setItem(`${fallbackPrefix}${scope}`, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn('Work Studies support record could not be saved.', error);
        return false;
      }
    };

    const remove = scope => {
      if (sharedRuntime && typeof sharedRuntime.remove === 'function') {
        return sharedRuntime.remove(scope);
      }
      try {
        localStorage.removeItem(`${fallbackPrefix}${scope}`);
        return true;
      } catch (error) {
        console.warn('Work Studies support record could not be reset.', error);
        return false;
      }
    };

    const wordCount = value => sharedRuntime && typeof sharedRuntime.wordCount === 'function'
      ? sharedRuntime.wordCount(value)
      : String(value || '').trim().split(/\s+/).filter(Boolean).length;

    return { read, write, remove, wordCount };
  }

  const storage = createStorageAdapter();

  function element(tag, options = {}, children = []) {
    const result = document.createElement(tag);
    if (options.id) result.id = options.id;
    if (options.className) result.className = options.className;
    if (options.text !== undefined) result.textContent = String(options.text);
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([name, value]) => {
        if (value !== null && value !== undefined) result.setAttribute(name, String(value));
      });
    }
    const childList = Array.isArray(children) ? children : [children];
    childList.filter(Boolean).forEach(child => result.append(child));
    return result;
  }

  function button(label, className = 'button quiet') {
    return element('button', { className, text: label, attrs: { type: 'button' } });
  }

  function textParagraph(label, value, className = '') {
    const paragraph = element('p', { className });
    if (label) paragraph.append(element('strong', { text: `${label}: ` }));
    paragraph.append(document.createTextNode(String(value || '')));
    return paragraph;
  }

  function list(items, ordered = false, className = '') {
    const result = element(ordered ? 'ol' : 'ul', { className });
    items.forEach(item => result.append(element('li', { text: item })));
    return result;
  }

  function anchorId(route, fallback) {
    const hash = String(route || '').split('#')[1];
    return hash || fallback;
  }

  function siteHref(path) {
    const value = String(path || '');
    if (/^(?:[a-z]+:|#|\/)/i.test(value)) return value;
    return `${document.body.dataset.root || ''}${value}`;
  }

  function moduleLabel(moduleId) {
    const module = window.WORK_STUDIES?.modules?.find(item => item.id === moduleId);
    return module ? `${module.id} - ${module.title}` : moduleId;
  }

  function safeString(value, maximum = MAX_FIELD_LENGTH) {
    return typeof value === 'string' ? value.slice(0, maximum) : '';
  }

  function timestampLabel(value) {
    if (!value) return 'Not saved yet';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? 'Saved on this browser'
      : `Saved on this browser ${parsed.toLocaleString('en-AU')}`;
  }

  function downloadBlob(filename, contents, type) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const link = element('a', { attrs: { href: url, download: filename } });
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadJson(filename, payload) {
    if (sharedRuntime && typeof sharedRuntime.downloadJson === 'function') {
      sharedRuntime.downloadJson(filename, payload);
      return;
    }
    downloadBlob(filename, JSON.stringify(payload, null, 2), 'application/json');
  }

  function printTextRecord(title, sections) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return false;
    printWindow.opener = null;
    const printDocument = printWindow.document;
    printDocument.title = title;
    const style = printDocument.createElement('style');
    style.textContent = 'body{max-width:780px;margin:32px auto;padding:0 24px;color:#14232d;font:16px/1.55 Arial,sans-serif}h1{font-size:28px}h2{margin-top:24px;font-size:19px}p{white-space:pre-wrap}small{color:#52616a}@media print{body{margin:0;max-width:none}}';
    printDocument.head.append(style);
    const titleHeading = printDocument.createElement('h1');
    titleHeading.textContent = title;
    printDocument.body.append(titleHeading);
    sections.forEach(section => {
      const heading = printDocument.createElement('h2');
      heading.textContent = section.heading;
      const body = printDocument.createElement('p');
      body.textContent = String(section.body || '');
      printDocument.body.append(heading, body);
    });
    const boundary = printDocument.createElement('small');
    boundary.textContent = 'Printed from browser-local Work Studies support. Printing does not submit this work.';
    printDocument.body.append(boundary);
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 60);
    return true;
  }

  function showHostError(host, error) {
    const note = element('div', { className: 'status-note caution' }, [
      element('strong', { text: 'This support section could not load.' }),
      element('p', { text: 'Refresh the page. If the problem remains, tell your teacher which page you opened.' })
    ]);
    host.replaceChildren(note);
    console.error('Work Studies support runtime failed.', error);
  }

  function normaliseFolioState(value, cards) {
    const allowedIds = new Set(cards.map(card => card.id));
    const result = { schemaVersion: 1, cards: {} };
    const records = value && typeof value === 'object' && value.cards && typeof value.cards === 'object'
      ? value.cards
      : {};
    Object.entries(records).forEach(([cardId, record]) => {
      if (!allowedIds.has(cardId) || !record || typeof record !== 'object') return;
      result.cards[cardId] = {
        response: safeString(record.response),
        caption: safeString(record.caption),
        sourceNotes: safeString(record.sourceNotes),
        ready: record.ready === true,
        updatedAt: safeString(record.updatedAt, 80)
      };
    });
    return result;
  }

  function folioCardText(card, state) {
    return [
      'Years 11-12 Work Studies - Career and Workplace Evidence Folio',
      `Card: ${card.id} - ${card.title}`,
      `Action: ${card.action}`,
      `Evidence: ${card.evidence}`,
      `Prompt: ${card.prompt}`,
      '',
      'Student evidence and reasoning',
      state.response || '',
      '',
      'What this evidence proves',
      state.caption || '',
      '',
      'Sources or context',
      state.sourceNotes || '',
      '',
      `Ready for teacher review: ${state.ready ? 'Yes' : 'No'}`,
      'Boundary: This text-only export is not an official submission, mark, attendance record, teacher observation or competence decision.'
    ].join('\n');
  }

  function mountFolio(host, data) {
    const manifest = data.folio;
    let folioState = normaliseFolioState(storage.read(FOLIO_SCOPE, {}), manifest.cards);
    host.replaceChildren();

    const status = element('p', { className: 'save-status', text: 'Writing saves only in this browser.', attrs: { role: 'status', 'aria-live': 'polite' } });
    const progress = element('p', { text: '' });
    const nextLink = element('a', { className: 'button secondary', text: 'Go to my next card', attrs: { href: '#evidence-fol-ws-01' } });
    const backupButton = button('Download text-only backup', 'button');
    const restoreLabel = element('label', { className: 'button quiet', text: 'Restore text-only backup', attrs: { for: 'work-studies-folio-restore' } });
    const restoreInput = element('input', {
      id: 'work-studies-folio-restore',
      className: 'visually-hidden',
      attrs: { type: 'file', accept: 'application/json,.json' }
    });
    const orientation = element('section', { className: 'panel', attrs: { 'aria-labelledby': 'folio-support-heading' } }, [
      element('p', { className: 'eyebrow', text: 'Text-only browser-local evidence' }),
      element('h2', { id: 'folio-support-heading', text: manifest.orientation.heading }),
      element('p', { text: manifest.orientation.student_copy }),
      element('div', { className: 'status-note' }, [
        element('strong', { text: 'No photo or evidence-file upload' }),
        element('p', { text: 'This runtime saves text only. A backup contains no photos or files, and creating an export or printout does not submit it.' })
      ]),
      progress,
      element('div', { className: 'folio-actions' }, [nextLink, backupButton, restoreLabel, restoreInput]),
      status
    ]);
    host.append(orientation);

    const cardElements = new Map();
    const saveTimers = new Map();

    const updateProgress = () => {
      const readyCount = manifest.cards.filter(card => folioState.cards[card.id]?.ready).length;
      const nextCard = manifest.cards.find(card => !folioState.cards[card.id]?.ready) || manifest.cards[manifest.cards.length - 1];
      progress.textContent = `${readyCount} of ${manifest.cards.length} cards marked ready for teacher review. This is a progress cue, not a mark or submission status.`;
      nextLink.href = `#${anchorId(nextCard.route, nextCard.id.toLowerCase())}`;
      nextLink.textContent = readyCount === manifest.cards.length ? 'Review my final card' : 'Go to my next card';
    };

    const saveState = (cardId, liveStatus) => {
      const record = folioState.cards[cardId];
      if (record) record.updatedAt = new Date().toISOString();
      const saved = storage.write(FOLIO_SCOPE, folioState);
      liveStatus.textContent = saved ? timestampLabel(record?.updatedAt) : 'Could not save - export or copy this text now.';
      status.textContent = saved ? 'Folio changes saved on this browser.' : 'A folio change could not be saved.';
      updateProgress();
    };

    manifest.cards.forEach((card, cardIndex) => {
      const cardId = anchorId(card.route, card.id.toLowerCase());
      const record = folioState.cards[card.id] || { response: '', caption: '', sourceNotes: '', ready: false, updatedAt: '' };
      folioState.cards[card.id] = record;

      const responseId = `${cardId}-response`;
      const captionId = `${cardId}-caption`;
      const sourceId = `${cardId}-sources`;
      const readyId = `${cardId}-ready`;
      const response = element('textarea', { id: responseId, attrs: { maxlength: MAX_FIELD_LENGTH, rows: 8 } });
      const caption = element('textarea', { id: captionId, attrs: { maxlength: MAX_FIELD_LENGTH, rows: 4 } });
      const sourceNotes = element('textarea', { id: sourceId, attrs: { maxlength: MAX_FIELD_LENGTH, rows: 3 } });
      response.value = record.response;
      caption.value = record.caption;
      sourceNotes.value = record.sourceNotes;
      const liveStatus = element('span', { className: 'save-status', text: timestampLabel(record.updatedAt), attrs: { role: 'status', 'aria-live': 'polite' } });
      const wordCount = element('span', { className: 'save-status', text: `${storage.wordCount(record.response)} words` });
      const ready = element('input', { id: readyId, attrs: { type: 'checkbox' } });
      ready.checked = record.ready;

      const supportDetails = element('details', {}, [
        element('summary', { text: 'Sentence starters and support' }),
        list(card.support)
      ]);
      const activityLinks = element('p');
      activityLinks.append(element('strong', { text: 'Related practice: ' }));
      card.activity_ids.forEach((activityId, index) => {
        const activity = data.indexes.activityById[activityId];
        if (!activity) return;
        if (index > 0) activityLinks.append(document.createTextNode(' | '));
        activityLinks.append(element('a', { text: activity.title, attrs: { href: siteHref(activity.bank_route) } }));
      });

      const exportButton = button('Export this card');
      const printButton = button('Print this card');
      const resetButton = button('Reset this card', 'button danger');
      const article = element('article', { id: cardId, className: 'evidence-card', attrs: { 'aria-labelledby': `${cardId}-heading` } }, [
        element('p', { className: 'eyebrow', text: `Card ${cardIndex + 1} of ${manifest.cards.length} - ${card.id}` }),
        element('h2', { id: `${cardId}-heading`, text: card.title }),
        element('div', { className: 'evidence-meta' }, card.module_ids.map(moduleId => element('span', { className: 'chip', text: moduleLabel(moduleId) }))),
        textParagraph('Do', card.action),
        textParagraph('Why', card.why),
        textParagraph('Keep', card.evidence),
        textParagraph('Think about', card.prompt),
        supportDetails,
        activityLinks,
        element('div', { className: 'field-group' }, [
          element('label', { text: 'Your evidence and reasoning', attrs: { for: responseId } }),
          response
        ]),
        element('div', { className: 'field-group' }, [
          element('label', { text: card.caption, attrs: { for: captionId } }),
          caption
        ]),
        element('div', { className: 'field-group' }, [
          element('label', { text: 'Sources or context - keep private details out', attrs: { for: sourceId } }),
          sourceNotes
        ]),
        element('label', { className: 'option', attrs: { for: readyId } }, [
          ready,
          element('span', { text: 'I have reviewed this text and marked it ready for my teacher to look at. This does not submit it.' })
        ]),
        textParagraph('Assessment boundary', card.assessment_relationship, 'fine'),
        textParagraph('Privacy', card.attachment_policy, 'fine'),
        element('div', { className: 'folio-actions' }, [exportButton, printButton, resetButton, liveStatus, wordCount])
      ]);

      const scheduleSave = () => {
        record.response = response.value;
        record.caption = caption.value;
        record.sourceNotes = sourceNotes.value;
        liveStatus.textContent = 'Saving...';
        wordCount.textContent = `${storage.wordCount(record.response)} words`;
        clearTimeout(saveTimers.get(card.id));
        saveTimers.set(card.id, setTimeout(() => saveState(card.id, liveStatus), 350));
      };
      [response, caption, sourceNotes].forEach(control => control.addEventListener('input', scheduleSave));
      ready.addEventListener('change', () => {
        record.ready = ready.checked;
        saveState(card.id, liveStatus);
      });
      exportButton.addEventListener('click', () => {
        downloadBlob(`${card.id.toLowerCase()}-work-studies-folio.txt`, folioCardText(card, record), 'text/plain;charset=utf-8');
        liveStatus.textContent = 'Text-only card export created. It has not been submitted.';
      });
      printButton.addEventListener('click', () => {
        const opened = printTextRecord(`${card.id} - ${card.title}`, [
          { heading: 'Action and evidence', body: `${card.action}\n\n${card.evidence}` },
          { heading: 'Prompt', body: card.prompt },
          { heading: 'Student evidence and reasoning', body: record.response },
          { heading: 'What this evidence proves', body: record.caption },
          { heading: 'Sources or context', body: record.sourceNotes },
          { heading: 'Boundary', body: card.assessment_relationship }
        ]);
        liveStatus.textContent = opened ? 'Print view opened. Printing does not submit this card.' : 'Pop-up blocked - allow pop-ups to print this card.';
      });
      resetButton.addEventListener('click', () => {
        if (!window.confirm(`Reset the saved text for "${card.title}" on this browser?`)) return;
        saveTimers.forEach(timer => clearTimeout(timer));
        delete folioState.cards[card.id];
        storage.write(FOLIO_SCOPE, folioState);
        mountFolio(host, data);
      });

      cardElements.set(card.id, article);
      host.append(article);
    });

    backupButton.addEventListener('click', () => {
      const current = normaliseFolioState(folioState, manifest.cards);
      downloadJson('work-studies-folio-text-backup.json', {
        schema: BACKUP_SCHEMA,
        courseId: supportApi.courseId,
        supportVersion: VERSION,
        exportedAt: new Date().toISOString(),
        includesPhotos: false,
        includesFiles: false,
        boundary: 'Text-only editable backup. It is not an official submission.',
        records: current.cards
      });
      status.textContent = 'Text-only folio backup downloaded. It contains no photos or files.';
    });

    restoreInput.addEventListener('change', async () => {
      const file = restoreInput.files?.[0];
      restoreInput.value = '';
      if (!file) return;
      try {
        if (file.size > MAX_BACKUP_BYTES) throw new Error('This backup is larger than the one-megabyte text-only limit.');
        const payload = JSON.parse(await file.text());
        if (payload.schema !== BACKUP_SCHEMA || payload.courseId !== supportApi.courseId || !payload.records ||
            payload.includesPhotos !== false || payload.includesFiles !== false) {
          throw new Error('This is not a valid text-only Work Studies folio backup.');
        }
        if (!window.confirm('Restore this text-only folio backup on this browser? Current saved folio text will be replaced.')) return;
        folioState = normaliseFolioState({ cards: payload.records }, manifest.cards);
        if (!storage.write(FOLIO_SCOPE, folioState)) throw new Error('The restored text could not be saved in this browser.');
        saveTimers.forEach(timer => clearTimeout(timer));
        mountFolio(host, data);
      } catch (error) {
        status.textContent = `Backup not restored: ${error.message}`;
      }
    });

    updateProgress();
  }

  function activityScope(activityId) {
    return `support:activity:${activityId}`;
  }

  function normaliseActivityState(value) {
    return {
      response: safeString(value?.response),
      selfCheck: safeString(value?.selfCheck),
      updatedAt: safeString(value?.updatedAt, 80)
    };
  }

  function mountAppliedLearning(host, data) {
    const manifest = data.appliedLearning;
    host.replaceChildren();
    const heading = element('section', { className: 'panel', attrs: { 'aria-labelledby': 'applied-support-heading' } }, [
      element('p', { className: 'eyebrow', text: 'Formative practice only' }),
      element('h2', { id: 'applied-support-heading', text: 'Choose a useful activity' }),
      element('p', { text: manifest.purpose }),
      element('p', { className: 'fine', text: manifest.boundary })
    ]);
    const moduleFilter = element('select', { id: 'applied-module-filter' });
    moduleFilter.append(element('option', { text: 'All modules', attrs: { value: 'all' } }));
    Object.keys(data.validation.activityCountsByModule).forEach(moduleId => {
      moduleFilter.append(element('option', { text: moduleLabel(moduleId), attrs: { value: moduleId } }));
    });
    const typeFilter = element('select', { id: 'applied-type-filter' });
    typeFilter.append(element('option', { text: 'All activity types', attrs: { value: 'all' } }));
    [...new Set(manifest.activities.map(activity => activity.format))].sort().forEach(type => {
      typeFilter.append(element('option', { text: type.replaceAll('-', ' '), attrs: { value: type } }));
    });
    const resultCount = element('p', { className: 'save-status', attrs: { role: 'status', 'aria-live': 'polite' } });
    const filters = element('div', { className: 'filter-row', attrs: { 'aria-label': 'Filter Applied Learning activities' } }, [
      element('label', { text: 'Module', attrs: { for: 'applied-module-filter' } }),
      moduleFilter,
      element('label', { text: 'Activity type', attrs: { for: 'applied-type-filter' } }),
      typeFilter,
      resultCount
    ]);
    host.append(heading, filters);

    const cards = [];
    manifest.activities.forEach((activity, index) => {
      const cardId = anchorId(activity.bank_route, activity.id.toLowerCase());
      const state = normaliseActivityState(storage.read(activityScope(activity.id), {}));
      const responseId = `${cardId}-response`;
      const checkId = `${cardId}-self-check`;
      const response = element('textarea', { id: responseId, attrs: { maxlength: MAX_FIELD_LENGTH, rows: 6 } });
      const selfCheck = element('textarea', { id: checkId, attrs: { maxlength: MAX_FIELD_LENGTH, rows: 3 } });
      response.value = state.response;
      selfCheck.value = state.selfCheck;
      const saveStatus = element('span', { className: 'save-status', text: timestampLabel(state.updatedAt), attrs: { role: 'status', 'aria-live': 'polite' } });
      const printButton = button('Print activity');
      const resetButton = button('Reset response', 'button danger');
      const lessonLink = element('a', { text: 'Return to the linked learning section', attrs: { href: siteHref(activity.lesson_route) } });
      const card = element('article', { id: cardId, className: 'activity-card', attrs: { 'aria-labelledby': `${cardId}-heading`, 'data-module-id': activity.module_id, 'data-activity-type': activity.format } }, [
        element('p', { className: 'eyebrow', text: `Activity ${index + 1} of ${manifest.activities.length} - ${activity.id}` }),
        element('h2', { id: `${cardId}-heading`, text: activity.title }),
        element('div', { className: 'evidence-meta' }, [
          element('span', { className: 'chip', text: moduleLabel(activity.module_id) }),
          element('span', { className: 'chip', text: activity.participation }),
          element('span', { className: 'chip', text: activity.format.replaceAll('-', ' ') })
        ]),
        textParagraph('Practise', activity.practice),
        textParagraph('Instructions', activity.instructions),
        textParagraph('Keep this evidence', activity.durable_evidence_prompt),
        textParagraph('Useful feedback', activity.feedback),
        element('details', {}, [
          element('summary', { text: 'Low-tech and accessibility options' }),
          textParagraph('Printable', activity.printable_option),
          textParagraph('Accessible alternative', activity.accessibility_alternative),
          textParagraph('Alternative text', activity.alt_text)
        ]),
        element('div', { className: 'field-group' }, [
          element('label', { text: 'Your durable evidence response', attrs: { for: responseId } }),
          response
        ]),
        element('div', { className: 'field-group' }, [
          element('label', { text: 'Self-check - what is strong and what will you improve?', attrs: { for: checkId } }),
          selfCheck
        ]),
        lessonLink,
        element('div', { className: 'folio-actions' }, [printButton, resetButton, saveStatus])
      ]);

      let saveTimer;
      const save = () => {
        saveStatus.textContent = 'Saving...';
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          state.response = response.value;
          state.selfCheck = selfCheck.value;
          state.updatedAt = new Date().toISOString();
          const saved = storage.write(activityScope(activity.id), state);
          saveStatus.textContent = saved ? timestampLabel(state.updatedAt) : 'Could not save - copy or print your response now.';
        }, 350);
      };
      response.addEventListener('input', save);
      selfCheck.addEventListener('input', save);
      printButton.addEventListener('click', () => {
        const opened = printTextRecord(`${activity.id} - ${activity.title}`, [
          { heading: 'Instructions', body: activity.instructions },
          { heading: 'Durable evidence prompt', body: activity.durable_evidence_prompt },
          { heading: 'Student response', body: response.value },
          { heading: 'Self-check', body: selfCheck.value },
          { heading: 'Feedback', body: activity.feedback }
        ]);
        saveStatus.textContent = opened ? 'Print view opened. This remains formative practice.' : 'Pop-up blocked - allow pop-ups to print this activity.';
      });
      resetButton.addEventListener('click', () => {
        if (!window.confirm(`Reset the saved response for "${activity.title}" on this browser?`)) return;
        clearTimeout(saveTimer);
        storage.remove(activityScope(activity.id));
        response.value = '';
        selfCheck.value = '';
        state.response = '';
        state.selfCheck = '';
        state.updatedAt = '';
        saveStatus.textContent = 'Not saved yet';
      });
      cards.push(card);
      host.append(card);
    });

    const applyFilters = () => {
      let visible = 0;
      cards.forEach(card => {
        const matchesModule = moduleFilter.value === 'all' || card.dataset.moduleId === moduleFilter.value;
        const matchesType = typeFilter.value === 'all' || card.dataset.activityType === typeFilter.value;
        card.hidden = !(matchesModule && matchesType);
        if (!card.hidden) visible += 1;
      });
      resultCount.textContent = `${visible} of ${cards.length} activities shown.`;
    };
    moduleFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    applyFilters();
  }

  function acknowledgementScope(task) {
    return `support:assessment:ack:${task.notice_id}:${task.notification_version}`;
  }

  function descriptionList(entries) {
    const result = element('dl', { className: 'key-vocabulary' });
    entries.forEach(([term, description]) => {
      result.append(element('div', { className: 'vocab-item' }, [
        element('dt', { text: term }),
        element('dd', { text: description })
      ]));
    });
    return result;
  }

  function mountAssessment(host, data) {
    const manifest = data.assessment;
    host.replaceChildren();
    const intro = element('section', { className: 'panel', attrs: { 'aria-labelledby': 'assessment-support-heading' } }, [
      element('p', { className: 'eyebrow', text: 'Use the right cohort and year' }),
      element('h2', { id: 'assessment-support-heading', text: 'Assessment orientation' }),
      element('p', { text: manifest.course_assessment_context.student_copy }),
      descriptionList([
        ['Course', manifest.course_assessment_context.course_type],
        ['Assessment', `${manifest.course_assessment_context.assessment_mode}; no external examination`],
        ['Components', 'Knowledge and Understanding 30%; Skills 70%']
      ])
    ]);
    host.append(intro);

    const year11 = element('section', { id: manifest.orientation.confirmed_panel.id, attrs: { 'aria-labelledby': 'assessment-y11-heading' } }, [
      element('p', { className: 'eyebrow', text: manifest.orientation.confirmed_panel.status_label }),
      element('h2', { id: 'assessment-y11-heading', text: manifest.orientation.confirmed_panel.heading }),
      element('p', { className: 'fine', text: 'Source: 2026 Year 11 Assessment Booklet, Work Studies schedule page 37.' })
    ]);
    host.append(year11);

    manifest.year_11_2026_schedule.tasks.forEach(task => {
      const noticeAnchor = anchorId(task.notice_route, task.id.toLowerCase());
      const dueText = task.exact_due ? `${task.due} - ${task.exact_due}` : `${task.due}; exact date: check your teacher’s current instructions`;
      const card = element('article', { id: noticeAnchor, className: 'assessment-card', attrs: { 'aria-labelledby': `${noticeAnchor}-heading` } }, [
        element('p', { className: 'eyebrow', text: `Task ${task.task_number} - ${task.notice_status}` }),
        element('h2', { id: `${noticeAnchor}-heading`, text: task.nature }),
        descriptionList([
          ['Due', dueText],
          ['Knowledge and Understanding', `${task.components.knowledge_and_understanding_percent}%`],
          ['Skills', `${task.components.skills_percent}%`],
          ['Total weighting', `${task.components.total_weighting_percent}%`],
          ['Notification version', task.notification_version]
        ]),
        textParagraph('Task detail', task.task_detail_status),
        textParagraph('Criteria', task.criteria_status),
        textParagraph('Template', task.template_status)
      ]);

      if (task.assessment_instrument) {
        card.append(textParagraph('Student orientation', task.assessment_instrument));
      }
      if (task.staff_confirm_items?.length) {
        card.append(element('div', { className: 'status-note caution' }, [
          element('strong', { text: 'Staff confirmation pending - page remains usable' }),
          list(task.staff_confirm_items)
        ]));
      }

      if (task.notice_status === 'Formal assessment - current notification') {
        const stored = storage.read(acknowledgementScope(task), {});
        const acknowledgementId = `${noticeAnchor}-acknowledgement`;
        const acknowledgement = element('input', { id: acknowledgementId, attrs: { type: 'checkbox' } });
        acknowledgement.checked = stored.acknowledged === true && stored.version === task.notification_version;
        const acknowledgementStatus = element('p', {
          className: 'save-status',
          text: acknowledgement.checked ? timestampLabel(stored.localTimestamp) : 'No local read receipt saved.',
          attrs: { role: 'status', 'aria-live': 'polite' }
        });
        const clearButton = button('Clear local read receipt', 'button quiet');
        acknowledgement.addEventListener('change', () => {
          if (acknowledgement.checked) {
            const localTimestamp = new Date().toISOString();
            storage.write(acknowledgementScope(task), {
              noticeId: task.notice_id,
              version: task.notification_version,
              acknowledged: true,
              localTimestamp
            });
            acknowledgementStatus.textContent = timestampLabel(localTimestamp);
          } else {
            storage.remove(acknowledgementScope(task));
            acknowledgementStatus.textContent = 'No local read receipt saved.';
          }
        });
        clearButton.addEventListener('click', () => {
          storage.remove(acknowledgementScope(task));
          acknowledgement.checked = false;
          acknowledgementStatus.textContent = 'No local read receipt saved.';
        });
        card.append(
          element('label', { className: 'option', attrs: { for: acknowledgementId } }, [
            acknowledgement,
            element('span', { text: manifest.acknowledgement.student_label })
          ]),
          acknowledgementStatus,
          element('p', { className: 'fine', text: manifest.acknowledgement.boundary }),
          clearButton
        );
      }
      year11.append(card);
    });

    const year12 = element('section', { id: manifest.orientation.unconfirmed_panel.id, className: 'panel', attrs: { 'aria-labelledby': 'assessment-y12-heading' } }, [
      element('p', { className: 'eyebrow', text: manifest.orientation.unconfirmed_panel.status_label }),
      element('h2', { id: 'assessment-y12-heading', text: manifest.orientation.unconfirmed_panel.heading }),
      element('div', { className: 'status-note caution' }, [
        element('strong', { text: 'Check your teacher’s current instructions' }),
        element('p', { text: manifest.orientation.unconfirmed_panel.student_copy })
      ]),
      element('p', { text: manifest.year_12_2026.smallest_next_action }),
      element('details', {}, [
        element('summary', { text: 'Facts that cannot be inferred' }),
        list(manifest.year_12_2026.facts_that_must_not_be_inferred)
      ])
    ]);
    const historical = element('section', { id: manifest.orientation.historical_panel.id, className: 'source-boundary', attrs: { 'aria-labelledby': 'assessment-history-heading' } }, [
      element('p', { className: 'eyebrow', text: manifest.orientation.historical_panel.status_label }),
      element('h2', { id: 'assessment-history-heading', text: manifest.orientation.historical_panel.heading }),
      element('p', { text: manifest.orientation.historical_panel.student_copy }),
      textParagraph('Permitted use', manifest.historical_2025_boundary.permitted_use),
      textParagraph('Prohibited use', manifest.historical_2025_boundary.prohibited_use)
    ]);
    host.append(year12, historical, element('p', { className: 'fine', text: manifest.policy_and_privacy.policy_rule }));
  }

  function mountVideoLearning(host, data) {
    const manifest = data.videoLearning;
    host.replaceChildren();
    const intro = element('section', { className: 'panel', attrs: { 'aria-labelledby': 'video-support-heading' } }, [
      element('p', { className: 'eyebrow', text: '33 section-linked source-safe alternatives' }),
      element('h2', { id: 'video-support-heading', text: 'Learn without an unverified video' }),
      element('p', { text: manifest.selection_boundary }),
      element('p', { className: 'fine', text: 'Each card keeps the video gap visible and gives an equivalent before, during and after learning route.' })
    ]);
    const moduleFilter = element('select', { id: 'video-module-filter' });
    moduleFilter.append(element('option', { text: 'All modules', attrs: { value: 'all' } }));
    [...new Set(manifest.sections.map(record => record.module_id))].forEach(moduleId => {
      moduleFilter.append(element('option', { text: moduleLabel(moduleId), attrs: { value: moduleId } }));
    });
    const resultCount = element('p', { className: 'save-status', attrs: { role: 'status', 'aria-live': 'polite' } });
    const filters = element('div', { className: 'filter-row' }, [
      element('label', { text: 'Module', attrs: { for: 'video-module-filter' } }),
      moduleFilter,
      resultCount
    ]);
    host.append(intro, filters);

    const cards = [];
    manifest.sections.forEach((record, index) => {
      const cardId = anchorId(record.library_route, record.id.toLowerCase());
      const alternative = record.alternative;
      const article = element('article', { id: cardId, className: 'resource-card', attrs: { 'aria-labelledby': `${cardId}-heading`, 'data-module-id': record.module_id } }, [
        element('p', { className: 'eyebrow', text: `Section ${index + 1} of ${manifest.sections.length} - ${record.section_id}` }),
        element('h2', { id: `${cardId}-heading`, text: record.section_title }),
        element('div', { className: 'status-note' }, [
          element('strong', { text: 'No verified video - source-safe alternative' }),
          element('p', { text: manifest.common_gap_reason })
        ]),
        textParagraph('Learning purpose', record.learning_purpose),
        textParagraph('Watch for', record.watch_for),
        element('ol', { className: 'timeline' }, [
          element('li', { className: 'timeline-item' }, [element('strong', { text: 'Before' }), element('span', { text: alternative.before })]),
          element('li', { className: 'timeline-item' }, [element('strong', { text: 'During' }), element('span', { text: alternative.during })]),
          element('li', { className: 'timeline-item' }, [element('strong', { text: 'After' }), element('span', { text: alternative.after })])
        ]),
        textParagraph('Keep this evidence', alternative.evidence_prompt),
        textParagraph('Accessible alternative text', alternative.alt_text, 'fine'),
        element('p', {}, [element('a', { text: 'Open the linked theory section', attrs: { href: siteHref(record.theory_route) } })])
      ]);
      cards.push(article);
      host.append(article);
    });

    const applyFilter = () => {
      let visible = 0;
      cards.forEach(card => {
        card.hidden = moduleFilter.value !== 'all' && card.dataset.moduleId !== moduleFilter.value;
        if (!card.hidden) visible += 1;
      });
      resultCount.textContent = `${visible} of ${cards.length} section alternatives shown.`;
    };
    moduleFilter.addEventListener('change', applyFilter);
    applyFilter();
  }

  async function mount() {
    const data = await supportApi.ready;
    const mounts = [
      ['[data-folio-host]', mountFolio],
      ['[data-applied-host]', mountAppliedLearning],
      ['[data-assessment-host]', mountAssessment],
      ['[data-video-host]', mountVideoLearning]
    ];
    mounts.forEach(([selector, renderer]) => {
      document.querySelectorAll(selector).forEach(host => {
        try {
          renderer(host, data);
        } catch (error) {
          showHostError(host, error);
        }
      });
    });
    return data;
  }

  function start() {
    mount().catch(error => {
      document.querySelectorAll('[data-folio-host],[data-applied-host],[data-assessment-host],[data-video-host]')
        .forEach(host => showHostError(host, error));
    });
  }

  window.WorkStudiesSupportRuntime = Object.freeze({
    version: VERSION,
    mount
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
