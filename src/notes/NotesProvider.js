import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabaseClient';
import { normalizeHexColor } from '../ui/useCustomNoteColor';

const NotesContext = createContext(null);

const DEFAULT_COLORS = [
  { id: 'cream', label: 'Cream', bg: 'var(--note-cream)', chip: 'var(--chip-cream)' },
  { id: 'sun', label: 'Sun', bg: 'var(--note-sun)', chip: 'var(--chip-sun)' },
  { id: 'pink', label: 'Pink', bg: 'var(--note-pink)', chip: 'var(--chip-pink)' },
  { id: 'red', label: 'Red', bg: 'var(--note-red)', chip: 'var(--chip-red)' },
  { id: 'orange', label: 'Orange', bg: 'var(--note-orange)', chip: 'var(--chip-orange)' },
  { id: 'white', label: 'White', bg: 'var(--note-white)', chip: 'var(--chip-white)' },
  { id: 'sky', label: 'Sky', bg: 'var(--note-skybrand)', chip: 'var(--chip-skybrand)' },
  { id: 'cyan', label: 'Cyan', bg: 'var(--note-cyan)', chip: 'var(--chip-cyan)' },
  { id: 'teal', label: 'Teal', bg: 'var(--note-teal)', chip: 'var(--chip-teal)' },
  { id: 'mint', label: 'Mint', bg: 'var(--note-mintbrand)', chip: 'var(--chip-mintbrand)' },
  { id: 'green', label: 'Green', bg: 'var(--note-green)', chip: 'var(--chip-green)' },
  { id: 'lavender', label: 'Lavender', bg: 'var(--note-lavenderbrand)', chip: 'var(--chip-lavenderbrand)' },
  { id: 'indigo', label: 'Indigo', bg: 'var(--note-indigo)', chip: 'var(--chip-indigo)' },
];

function normalizeColorId(raw) {
  const v = (raw || '').trim();
  if (!v) return 'cream';

  const hex = normalizeHexColor(v);
  if (hex) return hex;

  const allowed = new Set(['cream', 'sun', 'pink', 'red', 'orange', 'white', 'sky', 'cyan', 'teal', 'mint', 'green', 'lavender', 'indigo']);
  if (allowed.has(v)) return v;

  // Legacy ids
  if (v === 'default') return 'cream';
  if (v === 'mist') return 'cream';
  if (v === 'sand') return 'sun';
  if (v === 'lilac') return 'lavender';
  if (v === 'lavender') return 'lavender';
  if (v === 'peach') return 'pink';
  if (v === 'graphite') return 'white';

  return 'cream';
}

function normalizeDbColor(raw) {
  const v = (raw || '').trim();
  if (!v) return 'default';
  const hex = normalizeHexColor(v);
  if (hex) return 'default';

  // DB constraint: CHECK (color IN ('default','peach','mint','sky','lilac','sand'))
  const dbAllowed = new Set(['default', 'peach', 'mint', 'sky', 'lilac', 'sand']);
  if (dbAllowed.has(v)) return v;

  // Map current UI ids to legacy DB values.
  if (v === 'cream') return 'default';
  if (v === 'white') return 'default';
  if (v === 'sun') return 'sand';
  if (v === 'pink') return 'peach';
  if (v === 'lavender') return 'lilac';

  // Map other legacy ids if they appear.
  if (v === 'mist') return 'default';
  if (v === 'graphite') return 'default';

  return 'default';
}

function customColorsStorageKey(userId) {
  return `listem.notes.customColors.${userId || 'anonymous'}`;
}

function trashStorageKey(userId) {
  return `listem.notes.trash.${userId || 'anonymous'}`;
}

function readTrash(userId) {
  try {
    const raw = window.localStorage.getItem(trashStorageKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeTrash(userId, map) {
  try {
    window.localStorage.setItem(trashStorageKey(userId), JSON.stringify(map || {}));
  } catch {
    // ignore
  }
}

function pinsStorageKey(userId) {
  return `listem.notes.pins.${userId || 'anonymous'}`;
}

function readPins(userId) {
  try {
    const raw = window.localStorage.getItem(pinsStorageKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

function writePins(userId, map) {
  try {
    window.localStorage.setItem(pinsStorageKey(userId), JSON.stringify(map || {}));
  } catch {
    // ignore
  }
}

function readCustomColors(userId) {
  try {
    const raw = window.localStorage.getItem(customColorsStorageKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeCustomColors(userId, map) {
  try {
    window.localStorage.setItem(customColorsStorageKey(userId), JSON.stringify(map || {}));
  } catch {
    // ignore
  }
}

function setCustomColorForNote(userId, noteId, hex) {
  const normalized = normalizeHexColor(hex);
  const map = readCustomColors(userId);
  if (!normalized) {
    if (map && Object.prototype.hasOwnProperty.call(map, noteId)) {
      delete map[noteId];
      writeCustomColors(userId, map);
    }
    return;
  }
  map[noteId] = normalized;
  writeCustomColors(userId, map);
}

function getCustomColorForNote(userId, noteId) {
  const map = readCustomColors(userId);
  const raw = map?.[noteId];
  return normalizeHexColor(raw);
}

function extractTextFromJSON(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractTextFromJSON).join(' ');
  if (node.type === 'text') return node.text || '';
  if (node.content) return node.content.map(extractTextFromJSON).join(' ');
  return '';
}

function derivePreview(contentJSON) {
  const text = extractTextFromJSON(contentJSON).replace(/\s+/g, ' ').trim();
  const preview = text ? text.slice(0, 120) : '';
  return preview;
}

function deriveDescription(note) {
  const existing = (note?.description || '').trim();
  if (existing) return existing;
  const fromPreview = (note?.preview || '').trim();
  if (fromPreview) return fromPreview;
  return derivePreview(note?.content).trim();
}

function deriveSearchText(note) {
  const title = (note?.title || '').trim();
  const description = (note?.description || '').trim();
  const preview = (note?.preview || '').trim();
  const contentText = extractTextFromJSON(note?.content);
  const combined = `${title} ${description} ${preview} ${contentText}`;
  return combined.replace(/\s+/g, ' ').trim().toLowerCase();
}

const EMPTY_DOC = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '' }],
    },
  ],
};

function cloneDoc(doc) {
  return JSON.parse(JSON.stringify(doc));
}

function fromDbNote(row) {
  const content = row?.content ?? cloneDoc(EMPTY_DOC);
  const note = {
    id: row.id,
    title: row.title ?? '',
    description: row.description ?? '',
    preview: derivePreview(content),
    content,
    colorId: normalizeColorId(row.color),
    folderId: row?.folder_id ?? null,
    pinned: false,
    isTrashed: false,
    trashedAt: null,
    isDraft: false,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };

  note.searchText = deriveSearchText(note);
  return note;
}

function fromDbFolder(row) {
  return {
    id: row.id,
    name: row.name ?? 'Untitled',
    color: row.color ?? 'blue',
    pinned: Boolean(row?.pinned),
    sortOrder: typeof row?.sort_order === 'number' ? row.sort_order : row?.sort_order ?? null,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function sortFoldersForUi(list) {
  const copy = Array.isArray(list) ? [...list] : [];
  copy.sort((a, b) => {
    const ap = Boolean(a?.pinned);
    const bp = Boolean(b?.pinned);
    if (ap !== bp) return ap ? -1 : 1;

    const ao = typeof a?.sortOrder === 'number' ? a.sortOrder : new Date(a?.updatedAt || 0).getTime();
    const bo = typeof b?.sortOrder === 'number' ? b.sortOrder : new Date(b?.updatedAt || 0).getTime();
    if (ao !== bo) return bo - ao;

    const au = new Date(a?.updatedAt || 0).getTime();
    const bu = new Date(b?.updatedAt || 0).getTime();
    if (au !== bu) return bu - au;
    return String(a?.name || '').localeCompare(String(b?.name || ''));
  });
  return copy;
}

export function NotesProvider({ userId, children }) {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeId, setActiveId] = useState(() => {
    const saved = window.localStorage.getItem(`listem.notes.active.${userId}`);
    return saved || null;
  });
  const [lastCreatedId, setLastCreatedId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  const latestRef = useRef({ userId, notes, folders });
  const dirtyIdsRef = useRef(new Set());
  const foldersTableRef = useRef('folders');

  const isMissingTableError = useCallback((error) => {
    const msg = (error?.message || '').toLowerCase();
    return msg.includes("could not find table") && msg.includes('schema cache');
  }, []);

  const isMissingColumnError = useCallback((error) => {
    const msg = (error?.message || '').toLowerCase();
    return msg.includes('column') && msg.includes('does not exist');
  }, []);

  const canPersistNote = useCallback((note) => {
    if (!note) return false;
    if (!(note.title || '').trim()) return false;
    if (!deriveDescription(note)) return false;
    return true;
  }, []);

  const flushSave = useCallback(
    async ({ onlyIds } = {}) => {
      if (!userId || userId === 'anonymous') {
        setSaveStatus('dirty');
        throw new Error('Sign in to save notes.');
      }

      const dirtyIds = Array.from(dirtyIdsRef.current);
      const idsToSave = Array.isArray(onlyIds) && onlyIds.length ? dirtyIds.filter((id) => onlyIds.includes(id)) : dirtyIds;
      if (!idsToSave.length) {
        setSaveStatus('saved');
        return;
      }

      const snapshotNotes = latestRef.current.notes || [];
      const notesById = new Map(snapshotNotes.map((n) => [n.id, n]));
      const candidates = idsToSave.map((id) => notesById.get(id)).filter(Boolean);
      const rows = candidates
        .filter(canPersistNote)
        .map((n) => ({
          id: n.id,
          user_id: userId,
          title: n.title.trim(),
          description: deriveDescription(n),
          content: n.content ?? cloneDoc(EMPTY_DOC),
          color: normalizeDbColor(n.colorId),
          folder_id: n.folderId || null,
        }));

      if (!rows.length) {
        setSaveStatus('dirty');
        if (!candidates.length) {
          throw new Error('Save failed: note not found in memory. Please try again.');
        }
        throw new Error('Please fill in a Title and start writing before saving.');
      }

      setSaveStatus('saving');
      const { data, error } = await supabase.from('notes').upsert(rows, { onConflict: 'id' }).select('id');
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to save notes to Supabase:', error);
        setSaveStatus('dirty');
        throw error;
      }

      const returnedIds = Array.isArray(data) ? data.map((r) => r.id).filter(Boolean) : [];
      if (!returnedIds.length) {
        setSaveStatus('dirty');
        throw new Error('Save failed: no rows were returned. Check Supabase RLS/policies and table schema.');
      }

      // Verify persistence (helps diagnose RLS/project/schema mismatch).
      try {
        const verifyId = returnedIds[0];
        const verify = await supabase.from('notes').select('id').eq('id', verifyId).eq('user_id', userId).maybeSingle();
        if (verify.error) throw verify.error;
        if (!verify.data?.id) {
          throw new Error('Save failed: note was not readable after saving (check RLS select policy).');
        }
      } catch (err) {
        setSaveStatus('dirty');
        throw err;
      }

      returnedIds.forEach((id) => dirtyIdsRef.current.delete(id));

      setNotes((prev) => prev.map((n) => (returnedIds.includes(n.id) ? { ...n, isDraft: false } : n)));
      setSaveStatus(dirtyIdsRef.current.size ? 'dirty' : 'saved');

      return { savedIds: returnedIds };
    },
    [canPersistNote, userId]
  );

  useEffect(() => {
    dirtyIdsRef.current = new Set();
    setSaveStatus('saved');

    const saved = window.localStorage.getItem(`listem.notes.active.${userId}`);
    setActiveId(saved || null);
    setLastCreatedId(null);

    let cancelled = false;

    const load = async () => {
      if (!userId || userId === 'anonymous') {
        setNotes([]);
        setFolders([]);
        return;
      }

      const fetchFolders = async () => {
        const first = foldersTableRef.current || 'folders';

        const queryWithColumns = (table, columns) =>
          supabase
            .from(table)
            .select(columns)
            .eq('user_id', userId);

        const columnsV2 = 'id, user_id, name, color, pinned, sort_order, created_at, updated_at';
        const columnsV1 = 'id, user_id, name, color, created_at, updated_at';

        const run = async (table) => {
          let res = await queryWithColumns(table, columnsV2).order('pinned', { ascending: false }).order('sort_order', { ascending: false }).order('updated_at', { ascending: false });
          if (res.error && isMissingColumnError(res.error)) {
            res = await queryWithColumns(table, columnsV1).order('updated_at', { ascending: false });
          }
          return res;
        };

        let res = await run(first);
        if (res.error && isMissingTableError(res.error)) {
          const other = first === 'folders' ? 'folder' : 'folders';
          const retry = await run(other);
          if (!retry.error) {
            foldersTableRef.current = other;
            res = retry;
          }
        }
        return res;
      };

      const [notesRes, foldersRes] = await Promise.all([
        supabase
          .from('notes')
          .select('id, user_id, title, description, content, color, folder_id, created_at, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false }),
        fetchFolders(),
      ]);

      if (cancelled) return;

      let loadedFolders = [];

      if (foldersRes.error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load folders from Supabase:', foldersRes.error);
        setFolders([]);
      } else {
        loadedFolders = sortFoldersForUi((foldersRes.data || []).map(fromDbFolder));
        setFolders(loadedFolders);
      }

      if (notesRes.error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load notes from Supabase:', notesRes.error);
        setNotes([]);
      } else {
        const base = (notesRes.data || []).map(fromDbNote);
        const withCustom = base.map((n) => {
          const customHex = getCustomColorForNote(userId, n.id);
          if (!customHex) return n;
          return { ...n, colorId: customHex };
        });
        const trash = readTrash(userId);
        const pins = readPins(userId);
        const withTrash = withCustom.map((n) => {
          const trashedAt = trash?.[n.id] || null;
          const pinned = Boolean(pins?.[n.id]);
          const baseNote = pinned !== n.pinned ? { ...n, pinned } : n;
          return trashedAt
            ? { ...baseNote, isTrashed: true, trashedAt }
            : { ...baseNote, isTrashed: false, trashedAt: null };
        });

        const folderIds = new Set(loadedFolders.map((f) => f.id));
        const withOrphansFixed = withTrash.map((n) => {
          if (!n.folderId) return n;
          if (folderIds.has(n.folderId)) return n;
          return { ...n, folderId: null };
        });

        setNotes(withOrphansFixed);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [flushSave, isMissingColumnError, isMissingTableError, userId]);

  useEffect(() => {
    latestRef.current = { userId, notes, folders };
  }, [folders, notes, userId]);

  useEffect(() => {
    const key = `listem.notes.active.${userId}`;
    if (activeId) {
      window.localStorage.setItem(key, activeId);
    } else {
      window.localStorage.removeItem(key);
    }
  }, [activeId, userId]);

  useEffect(() => {
    if (notes.length === 0) {
      if (activeId) setActiveId(null);
      return;
    }

    if (!activeId) return;
    if (notes.some((n) => n.id === activeId)) return;
    setActiveId(notes[0]?.id || null);
  }, [activeId, notes]);

  const createNote = useCallback(
    (overrides = {}) => {
      const now = new Date().toISOString();
      const id = uuidv4();
      const base = {
        id,
        title: '',
        description: '',
        preview: '',
        content: cloneDoc(EMPTY_DOC),
        searchText: '',
        colorId: 'cream',
        folderId: null,
        pinned: false,
        isTrashed: false,
        trashedAt: null,
        isDraft: true,
        createdAt: now,
        updatedAt: now,
      };

      const next = [{ ...base, ...overrides }, ...(latestRef.current.notes || [])];
      latestRef.current = { ...latestRef.current, notes: next };
      setNotes(next);
      setActiveId(id);
      setLastCreatedId(id);
      dirtyIdsRef.current.add(id);
      setSaveStatus('dirty');
      return id;
    },
    []
  );

  const updateNote = useCallback(
    (id, patch) => {
      const now = new Date().toISOString();
      const prev = latestRef.current.notes || [];
      const next = prev.map((n) => {
        if (n.id !== id) return n;
        const updated = { ...n, ...patch, updatedAt: now };
        if (Object.prototype.hasOwnProperty.call(patch, 'colorId')) {
          const normalized = normalizeColorId(patch.colorId);
          updated.colorId = normalized;
          const asHex = normalizeHexColor(normalized);
          if (asHex) {
            setCustomColorForNote(userId, id, asHex);
          } else {
            setCustomColorForNote(userId, id, '');
          }
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'folderId')) {
          updated.folderId = patch.folderId || null;
        }

        updated.searchText = deriveSearchText(updated);
        return updated;
      });
      latestRef.current = { ...latestRef.current, notes: next };
      setNotes(next);
      dirtyIdsRef.current.add(id);
      setSaveStatus('dirty');
    },
    [userId]
  );

  const trashNote = useCallback(
    (id) => {
      const now = new Date().toISOString();
      setNotes((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, isTrashed: true, trashedAt: now } : n));
        const active = next.find((n) => n.id === id);
        if (active?.id === activeId) {
          const candidate = next.find((n) => !n.isTrashed) || null;
          setActiveId(candidate?.id || null);
        }
        return next;
      });

      const trash = readTrash(userId);
      trash[id] = now;
      writeTrash(userId, trash);
      dirtyIdsRef.current.delete(id);
    },
    [activeId, userId]
  );

  const restoreNote = useCallback(
    (id) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isTrashed: false, trashedAt: null } : n)));

      const trash = readTrash(userId);
      if (trash && Object.prototype.hasOwnProperty.call(trash, id)) {
        delete trash[id];
        writeTrash(userId, trash);
      }
    },
    [userId]
  );

  const createFolder = useCallback(
    async ({ name, color } = {}) => {
      const now = new Date().toISOString();
      const sortOrder = Date.now();
      const id = uuidv4();
      const folder = {
        id,
        name: (name || '').trim() || 'Untitled',
        color: (color || '').trim() || 'blue',
        pinned: false,
        sortOrder,
        createdAt: now,
        updatedAt: now,
      };

      setFolders((prev) => sortFoldersForUi([folder, ...prev]));

      if (!userId || userId === 'anonymous') {
        return id;
      }

      const insertInto = async (table) => {
        const payloadV2 = {
          id,
          user_id: userId,
          name: folder.name,
          color: folder.color,
          pinned: false,
          sort_order: sortOrder,
        };
        let res = await supabase.from(table).insert(payloadV2);
        if (res.error && isMissingColumnError(res.error)) {
          res = await supabase.from(table).insert({ id, user_id: userId, name: folder.name, color: folder.color });
        }
        return res;
      };

      const first = foldersTableRef.current || 'folders';
      let res = await insertInto(first);
      if (res.error && isMissingTableError(res.error)) {
        const other = first === 'folders' ? 'folder' : 'folders';
        const retry = await insertInto(other);
        if (!retry.error) {
          foldersTableRef.current = other;
          res = retry;
        }
      }

      if (res.error) {
        setFolders((prev) => prev.filter((f) => f.id !== id));
        // eslint-disable-next-line no-console
        console.error('Failed to create folder in Supabase:', res.error);
        throw new Error(res.error?.message || 'Failed to create folder. Please check your Supabase policies/permissions.');
      }

      return id;
    },
    [isMissingColumnError, isMissingTableError, userId]
  );

  const updateFolder = useCallback(
    async (id, patch = {}) => {
      const now = new Date().toISOString();
      setFolders((prev) => sortFoldersForUi(prev.map((f) => (f.id === id ? { ...f, ...patch, updatedAt: now } : f))));

      if (!userId || userId === 'anonymous') return;

      const payload = {};
      if (Object.prototype.hasOwnProperty.call(patch, 'name')) payload.name = (patch.name || '').trim() || 'Untitled';
      if (Object.prototype.hasOwnProperty.call(patch, 'color')) payload.color = (patch.color || '').trim() || 'blue';
      if (Object.prototype.hasOwnProperty.call(patch, 'pinned')) payload.pinned = Boolean(patch.pinned);
      if (Object.prototype.hasOwnProperty.call(patch, 'sortOrder')) payload.sort_order = patch.sortOrder;
      if (!Object.keys(payload).length) return;

      const runUpdate = async (table) => {
        let res = await supabase.from(table).update(payload).eq('id', id).eq('user_id', userId);
        if (res.error && isMissingColumnError(res.error)) {
          const fallback = {};
          if (Object.prototype.hasOwnProperty.call(payload, 'name')) fallback.name = payload.name;
          if (Object.prototype.hasOwnProperty.call(payload, 'color')) fallback.color = payload.color;
          res = await supabase.from(table).update(fallback).eq('id', id).eq('user_id', userId);
        }
        return res;
      };
      const first = foldersTableRef.current || 'folders';
      let res = await runUpdate(first);
      if (res.error && isMissingTableError(res.error)) {
        const other = first === 'folders' ? 'folder' : 'folders';
        const retry = await runUpdate(other);
        if (!retry.error) {
          foldersTableRef.current = other;
          res = retry;
        }
      }

      if (res.error) {
        // eslint-disable-next-line no-console
        console.error('Failed to update folder in Supabase:', res.error);
      }
    },
    [isMissingColumnError, isMissingTableError, userId]
  );

  const reorderFolders = useCallback(
    async ({ sourceId, targetId } = {}) => {
      if (!sourceId || !targetId || sourceId === targetId) return;

      const currentFolders = sortFoldersForUi(folders);
      const fromIndex = currentFolders.findIndex((f) => f.id === sourceId);
      const toIndex = currentFolders.findIndex((f) => f.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return;

      const copy = [...currentFolders];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);

      const total = copy.length;
      const updates = copy.map((f, idx) => ({ id: f.id, sortOrder: total - idx }));

      setFolders(sortFoldersForUi(copy.map((f, idx) => ({ ...f, sortOrder: total - idx }))));

      if (!userId || userId === 'anonymous') return;

      const runUpdate = async (table, id, sortOrder) => {
        let res = await supabase.from(table).update({ sort_order: sortOrder }).eq('id', id).eq('user_id', userId);
        if (res.error && isMissingColumnError(res.error)) {
          res = { ...res, error: null };
        }
        return res;
      };

      const table = foldersTableRef.current || 'folders';
      const results = await Promise.all(updates.map((u) => runUpdate(table, u.id, u.sortOrder)));
      const firstError = results.find((r) => r?.error)?.error;
      if (firstError && isMissingTableError(firstError)) {
        const other = table === 'folders' ? 'folder' : 'folders';
        const retryResults = await Promise.all(updates.map((u) => runUpdate(other, u.id, u.sortOrder)));
        const retryError = retryResults.find((r) => r?.error)?.error;
        if (!retryError) foldersTableRef.current = other;
      }
    },
    [folders, isMissingColumnError, isMissingTableError, userId]
  );

  const deleteFolder = useCallback(
    async (id, { moveToFolderId = null } = {}) => {
      const toId = moveToFolderId || null;

      setFolders((prev) => prev.filter((f) => f.id !== id));
      setNotes((prev) => prev.map((n) => (n.folderId === id ? { ...n, folderId: toId } : n)));

      if (!userId || userId === 'anonymous') return;

      await supabase
        .from('notes')
        .update({ folder_id: toId })
        .eq('user_id', userId)
        .eq('folder_id', id);

      const runDelete = async (table) => await supabase.from(table).delete().eq('id', id).eq('user_id', userId);
      const first = foldersTableRef.current || 'folders';
      let res = await runDelete(first);
      if (res.error && isMissingTableError(res.error)) {
        const other = first === 'folders' ? 'folder' : 'folders';
        const retry = await runDelete(other);
        if (!retry.error) {
          foldersTableRef.current = other;
          res = retry;
        }
      }

      if (res.error) {
        // eslint-disable-next-line no-console
        console.error('Failed to delete folder in Supabase:', res.error);
      }
    },
    [isMissingTableError, userId]
  );

  const updateNoteContent = useCallback(
    (id, contentJSON) => {
      const preview = derivePreview(contentJSON);

      const snapshotNotes = latestRef.current.notes || [];
      const existing = snapshotNotes.find((n) => n.id === id);
      const patch = { content: contentJSON, preview };

      if (existing) {
        const currentDesc = (existing.description || '').trim();
        const currentPreview = (existing.preview || derivePreview(existing.content) || '').trim();
        const shouldUpdateDesc = !currentDesc || currentDesc === currentPreview;
        if (shouldUpdateDesc) {
          patch.description = preview;
        }
      }

      updateNote(id, patch);
    },
    [updateNote]
  );

  const setNoteFolder = useCallback(
    async (id, folderId) => {
      const now = new Date().toISOString();
      const nextFolderId = folderId || null;

      const prevNotes = latestRef.current.notes || [];
      const prevNote = prevNotes.find((n) => n.id === id) || null;

      const nextNotes = prevNotes.map((n) => {
        if (n.id !== id) return n;
        const updated = { ...n, folderId: nextFolderId, updatedAt: now };
        updated.searchText = deriveSearchText(updated);
        return updated;
      });

      latestRef.current = { ...latestRef.current, notes: nextNotes };
      setNotes(nextNotes);

      if (!userId || userId === 'anonymous') return;

      const { error } = await supabase
        .from('notes')
        .update({ folder_id: nextFolderId })
        .eq('id', id)
        .eq('user_id', userId);

      if (!error) return;

      if (prevNote) {
        const rolledBack = nextNotes.map((n) => {
          if (n.id !== id) return n;
          const updated = { ...n, folderId: prevNote.folderId || null, updatedAt: now };
          updated.searchText = deriveSearchText(updated);
          return updated;
        });
        latestRef.current = { ...latestRef.current, notes: rolledBack };
        setNotes(rolledBack);
      }

      throw error;
    },
    [userId]
  );

  const saveNote = useCallback(
    async (id) => {
      return await flushSave({ onlyIds: [id] });
    },
    [flushSave]
  );

  const saveAll = useCallback(async () => {
    return await flushSave();
  }, [flushSave]);

  const deleteNote = useCallback(
    async (id) => {
      const snapshot = latestRef.current.notes || [];
      const removedIndex = snapshot.findIndex((n) => n.id === id);
      const removedNote = removedIndex >= 0 ? snapshot[removedIndex] : null;

      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === id);
        if (idx === -1) return prev;

        const next = prev.filter((n) => n.id !== id);

        setActiveId((prevActive) => {
          if (prevActive !== id) return prevActive;
          const candidate = next[idx] || next[idx - 1] || next[0] || null;
          return candidate?.id || null;
        });

        return next;
      });

      dirtyIdsRef.current.delete(id);

      setCustomColorForNote(userId, id, '');
      const trash = readTrash(userId);
      if (trash && Object.prototype.hasOwnProperty.call(trash, id)) {
        delete trash[id];
        writeTrash(userId, trash);
      }
      const pins = readPins(userId);
      if (pins && Object.prototype.hasOwnProperty.call(pins, id)) {
        delete pins[id];
        writePins(userId, pins);
      }
      if (!userId || userId === 'anonymous') return;

      const { error } = await supabase.from('notes').delete().eq('id', id).eq('user_id', userId);
      if (!error) return;

      if (removedNote) {
        setNotes((prev) => {
          if (prev.some((n) => n.id === id)) return prev;
          const next = [...prev];
          const insertAt = Math.max(0, Math.min(removedIndex, next.length));
          next.splice(insertAt, 0, removedNote);
          return next;
        });
      }

      // eslint-disable-next-line no-console
      console.error('Failed to delete note from Supabase:', error);
      throw error;
    },
    [userId]
  );

  const togglePin = useCallback(
    (id) => {
      setNotes((prev) => {
      const now = new Date().toISOString();
      const next = prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: now } : n));
      next.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      return next;
      });

      const pins = readPins(userId);
      const nextPinned = !Boolean(pins?.[id]);
      if (nextPinned) {
        pins[id] = true;
      } else {
        delete pins[id];
      }
      writePins(userId, pins);
    },
    [userId]
  );

  const getNoteContent = useCallback(async (id) => {
    // First check if note exists in local state
    const localNote = notes.find((n) => n.id === id);
    if (localNote) {
      return { content: localNote.content };
    }

    // If not in local state, fetch from Supabase
    if (!userId || userId === 'anonymous') {
      return { content: cloneDoc(EMPTY_DOC) };
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('content')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { content: data?.content ?? cloneDoc(EMPTY_DOC) };
    } catch (error) {
      console.error('Failed to fetch note content:', error);
      return { content: cloneDoc(EMPTY_DOC) };
    }
  }, [notes, userId]);

  const value = useMemo(
    () => ({
      notes,
      folders,
      activeId,
      setActiveId,
      createNote,
      updateNote,
      setNoteFolder,
      updateNoteContent,
      deleteNote,
      trashNote,
      restoreNote,
      togglePin,
      getNoteContent,
      createFolder,
      updateFolder,
      deleteFolder,
      reorderFolders,
      colors: DEFAULT_COLORS,
      saveStatus,
      saveNote,
      saveAll,
      lastCreatedId,
      clearLastCreatedId: () => setLastCreatedId(null),
      getActiveNote: () => notes.find((n) => n.id === activeId) || null,
    }),
    [
      activeId,
      createFolder,
      createNote,
      deleteFolder,
      deleteNote,
      folders,
      getNoteContent,
      lastCreatedId,
      notes,
      restoreNote,
      saveAll,
      saveNote,
      saveStatus,
      trashNote,
      togglePin,
      reorderFolders,
      updateFolder,
      updateNote,
      setNoteFolder,
      updateNoteContent,
    ]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
