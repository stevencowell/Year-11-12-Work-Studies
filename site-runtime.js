(() => {
  'use strict';

  const course = window.WORK_STUDIES || { storageKey: 'wwhs-work-studies-stage6-v1' };
  const prefix = `${course.storageKey}:`;

  const keyFor = scope => `${prefix}${scope}`;

  const read = (scope, fallback = {}) => {
    try {
      const stored = localStorage.getItem(keyFor(scope));
      return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
      console.warn('Work Studies local record could not be read.', error);
      return fallback;
    }
  };

  const write = (scope, value) => {
    try {
      localStorage.setItem(keyFor(scope), JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Work Studies local record could not be saved.', error);
      return false;
    }
  };

  const remove = scope => {
    try {
      localStorage.removeItem(keyFor(scope));
      return true;
    } catch (error) {
      console.warn('Work Studies local record could not be reset.', error);
      return false;
    }
  };

  const courseRecords = () => {
    const records = {};
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key && key.startsWith(prefix)) {
        try {
          records[key.slice(prefix.length)] = JSON.parse(localStorage.getItem(key));
        } catch (_error) {
          records[key.slice(prefix.length)] = localStorage.getItem(key);
        }
      }
    }
    return records;
  };

  const downloadJson = (filename, payload) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportCourseBackup = () => downloadJson('work-studies-browser-backup.json', {
    schema: 'wwhs-work-studies-stage6-backup-v1',
    courseId: course.courseId,
    exportedAt: new Date().toISOString(),
    includesPhotos: false,
    records: courseRecords()
  });

  const restoreCourseBackup = async file => {
    const payload = JSON.parse(await file.text());
    if (payload.schema !== 'wwhs-work-studies-stage6-backup-v1' || payload.courseId !== course.courseId || !payload.records) {
      throw new Error('This backup belongs to a different course or schema.');
    }
    Object.entries(payload.records).forEach(([scope, value]) => write(scope, value));
    return Object.keys(payload.records).length;
  };

  const wordCount = value => String(value || '').trim().split(/\s+/).filter(Boolean).length;
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);

  window.WorkStudiesRuntime = {
    prefix,
    keyFor,
    read,
    write,
    remove,
    courseRecords,
    downloadJson,
    exportCourseBackup,
    restoreCourseBackup,
    wordCount,
    escapeHtml
  };
})();
