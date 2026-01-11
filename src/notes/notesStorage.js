export function notesStorageKey(userId) {
  return `listem.notes.v1.${userId}`;
}

export function loadNotes(userId) {
  const raw = window.localStorage.getItem(notesStorageKey(userId));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveNotes(userId, notes) {
  window.localStorage.setItem(notesStorageKey(userId), JSON.stringify(notes));
}
