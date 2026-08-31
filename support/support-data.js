(() => {
  'use strict';

  const COURSE_ID = 'years-11-12-work-studies';
  const SUPPORT_VERSION = '1.0.0';
  const SOURCE_MAP_ID = 'work-studies-source-map-v1.0';
  const scriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
  const baseUrl = new URL('.', scriptUrl);

  const manifestFiles = Object.freeze({
    folio: 'folio-manifest.json',
    appliedLearning: 'applied-learning-manifest.json',
    assessment: 'assessment-manifest.json',
    videoLearning: 'video-manifest.json'
  });

  const moduleRoutes = Object.freeze({
    C00: 'modules/module-01.html',
    M01: 'modules/module-02.html',
    M02: 'modules/module-03.html',
    M03: 'modules/module-04.html',
    M04: 'modules/module-05.html',
    M09: 'modules/module-06.html',
    M05: 'modules/module-07.html',
    M06: 'modules/module-08.html',
    M07: 'modules/module-09.html',
    M08: 'modules/module-10.html',
    M10: 'modules/module-11.html'
  });

  const routes = Object.freeze({
    folio: 'folio.html',
    appliedLearning: 'applied-learning/index.html',
    assessment: 'assessment.html',
    videoLearning: 'video-learning/index.html',
    moduleRoutes
  });

  const storage = Object.freeze({
    namespace: 'wwhs-work-studies-stage6:v1',
    schemaVersion: 1,
    folioStudent: 'wwhs-work-studies-stage6:v1:folio:student',
    folioText: 'wwhs-work-studies-stage6:v1:folio:text',
    folioProgress: 'wwhs-work-studies-stage6:v1:folio:progress',
    folioAssetDatabase: 'wwhs-work-studies-stage6-v1',
    folioAssetStore: 'folio-assets',
    activityPattern: 'wwhs-work-studies-stage6:v1:activity:<activity-id>',
    assessmentAcknowledgementPattern: 'wwhs-work-studies-stage6:v1:assessment:ack:<notice-id>:<version>',
    boundary: 'All records are browser-local. They are not cloud submission, teacher records, marks or competence evidence.'
  });

  const privacy = Object.freeze({
    defaultMode: 'de-identified-or-fictional',
    neverRequest: Object.freeze([
      'tax file number',
      'bank or card details',
      'passwords',
      'private home address',
      'personal phone number',
      'unapproved employer, client or peer identifying details',
      'medical details',
      'marks or teacher-only feedback'
    ]),
    submissionBoundary: 'Saving, backing up, exporting or printing does not submit work.',
    competenceBoundary: 'No browser record certifies attendance, teacher observation, safe performance or workplace competence.',
    imageBoundary: 'Imported assets remain browser-local and are excluded from JSON backup. Include an asset in a printable export only after an explicit privacy check.'
  });

  const expectedCounts = Object.freeze({
    modules: 11,
    sections: 33,
    folioCards: 12,
    appliedLearningActivities: 22,
    minimumActivitiesPerModule: 2,
    year11AssessmentTasks: 3,
    currentFullNotifications: 1,
    year12ConfirmedTasks: 0,
    videoRecords: 33,
    verifiedVideoLinks: 0,
    nonVideoAlternatives: 33
  });

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
    return value;
  }

  async function loadJson(name, relativePath) {
    const url = new URL(relativePath, baseUrl);
    const response = await fetch(url, { credentials: 'same-origin', cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Work Studies support manifest failed to load: ${name} (${response.status})`);
    }
    const payload = await response.json();
    if (!payload || payload.course_id !== COURSE_ID) {
      throw new Error(`Work Studies support manifest has the wrong course identity: ${name}`);
    }
    return payload;
  }

  function requireUnique(items, property, label) {
    const values = items.map((item) => item[property]);
    if (values.some((value) => typeof value !== 'string' || value.length === 0)) {
      throw new Error(`${label} contains a missing ${property}`);
    }
    if (new Set(values).size !== values.length) {
      throw new Error(`${label} contains a duplicate ${property}`);
    }
  }

  function validate(manifests) {
    const { folio, appliedLearning, assessment, videoLearning } = manifests;

    if (folio.cards.length !== expectedCounts.folioCards) {
      throw new Error('Unexpected Work Studies folio card count');
    }
    requireUnique(folio.cards, 'id', 'Work Studies folio');
    requireUnique(folio.cards, 'route', 'Work Studies folio');

    if (appliedLearning.activities.length !== expectedCounts.appliedLearningActivities) {
      throw new Error('Unexpected Work Studies applied-learning activity count');
    }
    requireUnique(appliedLearning.activities, 'id', 'Work Studies applied learning');
    requireUnique(appliedLearning.activities, 'bank_route', 'Work Studies applied learning');
    const activityCounts = Object.fromEntries(Object.keys(moduleRoutes).map((id) => [id, 0]));
    appliedLearning.activities.forEach((activity) => {
      if (!(activity.module_id in activityCounts)) {
        throw new Error(`Unknown module in applied-learning manifest: ${activity.module_id}`);
      }
      activityCounts[activity.module_id] += 1;
      if (!activity.durable_evidence_prompt || !activity.printable_option || !activity.accessibility_alternative) {
        throw new Error(`Incomplete applied-learning record: ${activity.id}`);
      }
    });
    if (Object.values(activityCounts).some((count) => count < expectedCounts.minimumActivitiesPerModule)) {
      throw new Error('A Work Studies module has fewer than two applied-learning activities');
    }

    if (assessment.year_11_2026_schedule.tasks.length !== expectedCounts.year11AssessmentTasks) {
      throw new Error('Unexpected Year 11 2026 assessment task count');
    }
    requireUnique(assessment.year_11_2026_schedule.tasks, 'id', 'Year 11 assessment schedule');
    const weightingTotal = assessment.year_11_2026_schedule.tasks.reduce(
      (sum, task) => sum + task.components.total_weighting_percent,
      0
    );
    if (weightingTotal !== 100 || assessment.year_12_2026.tasks.length !== 0) {
      throw new Error('Assessment weighting or Year 12 authority boundary failed');
    }

    if (videoLearning.sections.length !== expectedCounts.videoRecords) {
      throw new Error('Unexpected Work Studies video-learning record count');
    }
    requireUnique(videoLearning.sections, 'id', 'Work Studies video learning');
    requireUnique(videoLearning.sections, 'section_id', 'Work Studies video learning');
    requireUnique(videoLearning.sections, 'library_route', 'Work Studies video learning');
    videoLearning.sections.forEach((record) => {
      if (record.outcome !== 'GAP' || record.video !== null) {
        throw new Error(`Unverified video content entered for ${record.section_id}`);
      }
      if (!record.alternative || !record.alternative.before || !record.alternative.during ||
          !record.alternative.after || !record.alternative.alt_text) {
        throw new Error(`Incomplete non-video alternative for ${record.section_id}`);
      }
    });

    return deepFreeze({
      ...manifests,
      indexes: {
        folioById: Object.fromEntries(folio.cards.map((card) => [card.id, card])),
        activityById: Object.fromEntries(appliedLearning.activities.map((activity) => [activity.id, activity])),
        assessmentById: Object.fromEntries(assessment.year_11_2026_schedule.tasks.map((task) => [task.id, task])),
        videoBySectionId: Object.fromEntries(videoLearning.sections.map((record) => [record.section_id, record]))
      },
      validation: {
        status: 'PASS',
        activityCountsByModule: activityCounts,
        expectedCounts
      }
    });
  }

  async function load() {
    const entries = await Promise.all(
      Object.entries(manifestFiles).map(async ([name, relativePath]) => [name, await loadJson(name, relativePath)])
    );
    return validate(Object.fromEntries(entries));
  }

  const ready = load();

  window.WORK_STUDIES_SUPPORT = Object.freeze({
    courseId: COURSE_ID,
    version: SUPPORT_VERSION,
    sourceMapId: SOURCE_MAP_ID,
    generatedAt: '2026-08-31',
    baseUrl: baseUrl.href,
    manifestFiles,
    routes,
    storage,
    privacy,
    expectedCounts,
    ready,
    load
  });
})();
