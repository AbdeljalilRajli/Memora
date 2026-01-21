import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotes } from '../../notes/NotesProvider';
import { NoteCard } from './NoteCard';
import { useToast } from '../../ui/ToastProvider';

function folderColorClass(color) {
  const v = String(color || 'blue').toLowerCase().trim();
  if (v === 'mint') return 'isMint';
  if (v === 'lavender') return 'isLavender';
  if (v === 'peach') return 'isPeach';
  if (v === 'yellow') return 'isYellow';
  return 'isBlue';
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek() {
  const d = startOfToday();
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

function startOfMonth() {
  const d = startOfToday();
  d.setDate(1);
  return d;
}

function isAfter(dateStr, minDate) {
  const t = new Date(dateStr).getTime();
  return Number.isFinite(t) && t >= minDate.getTime();
}

export function DashboardPane({ view = 'notes', onOpenEditor }) {
  const { notes, folders, activeId, setActiveId, createNote, updateNote, createFolder, updateFolder, deleteFolder } = useNotes();
  const { push } = useToast();
  const [tab, setTab] = useState('today');
  const [query, setQuery] = useState('');
  const [folderFilter, setFolderFilter] = useState({ type: 'all' });

  const primaryGradientSx = useMemo(
    () => ({
      fontWeight: 900,
      borderRadius: 3,
      whiteSpace: 'nowrap',
      textTransform: 'none',
      background: 'linear-gradient(135deg, rgba(249, 110, 91, 1), rgba(255, 152, 106, 1))',
      boxShadow: '0 12px 26px rgba(249, 110, 91, 0.22)',
      '&:hover': {
        background: 'linear-gradient(135deg, rgba(249, 110, 91, 1), rgba(255, 152, 106, 1))',
        boxShadow: '0 16px 34px rgba(249, 110, 91, 0.30)',
        transform: 'translateY(-1px)',
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: '0 10px 22px rgba(249, 110, 91, 0.22)',
      },
    }),
    []
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('blue');

  const [folderMenuAnchor, setFolderMenuAnchor] = useState(null);
  const [folderMenuId, setFolderMenuId] = useState(null);
  const folderMenuOpen = Boolean(folderMenuAnchor);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('blue');

  const timeMin = useMemo(() => {
    if (view === 'trash' || view === 'favorites') return new Date(0);
    if (tab === 'today') return startOfToday();
    if (tab === 'week') return startOfWeek();
    if (tab === 'month') return startOfMonth();
    return new Date(0);
  }, [tab, view]);

  const viewScopedNotes = useMemo(() => {
    const base = notes.filter((n) => !n.isDraft);
    if (view === 'trash') return base.filter((n) => Boolean(n.isTrashed));
    const active = base.filter((n) => !n.isTrashed);
    if (view === 'favorites') return active.filter((n) => Boolean(n.pinned));
    return active;
  }, [notes, view]);

  const timeScopedNotes = useMemo(() => {
    return viewScopedNotes.filter((n) => isAfter(n.updatedAt, timeMin));
  }, [timeMin, viewScopedNotes]);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return timeScopedNotes
      .filter((n) => {
        if (view === 'trash' || view === 'favorites') return true;
        if (folderFilter.type === 'pinned') return Boolean(n.pinned);
        if (folderFilter.type === 'unfiled') return !n.folderId;
        if (folderFilter.type === 'folder') return n.folderId === folderFilter.id;
        return true;
      })
      .filter((n) => {
        if (!q) return true;
        const title = (n.title || '').toLowerCase();
        const preview = (n.preview || '').toLowerCase();
        return title.includes(q) || preview.includes(q);
      });
  }, [folderFilter, query, timeScopedNotes, view]);

  const pinnedCount = useMemo(() => timeScopedNotes.filter((n) => n.pinned).length, [timeScopedNotes]);
  const unfiledCount = useMemo(() => timeScopedNotes.filter((n) => !n.folderId).length, [timeScopedNotes]);
  const allCount = useMemo(() => timeScopedNotes.length, [timeScopedNotes]);

  const folderCounts = useMemo(() => {
    const map = new Map();
    timeScopedNotes.forEach((n) => {
      if (!n.folderId) return;
      map.set(n.folderId, (map.get(n.folderId) || 0) + 1);
    });
    return map;
  }, [timeScopedNotes]);

  const recentFolders = useMemo(() => {
    const copy = [...folders];
    copy.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return copy.slice(0, 6);
  }, [folders]);

  const onNewNote = () => {
    createNote();
    if (onOpenEditor) onOpenEditor();
  };

  const openFolderMenu = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFolderMenuId(id);
    setFolderMenuAnchor(e.currentTarget);
  };

  const closeFolderMenu = () => {
    setFolderMenuAnchor(null);
    setFolderMenuId(null);
  };

  const openEditFolder = (id) => {
    const f = folders.find((x) => x.id === id);
    if (!f) return;
    setEditId(id);
    setEditName(f.name || 'Untitled');
    setEditColor(f.color || 'blue');
    setEditOpen(true);
    closeFolderMenu();
  };

  const onApplyEditFolder = async () => {
    if (!editId) return;
    await updateFolder(editId, { name: editName, color: editColor });
    setEditOpen(false);
  };

  const onDeleteFolder = async (id) => {
    closeFolderMenu();
    const ok = window.confirm('Delete this folder? Notes inside will become Unfiled.');
    if (!ok) return;
    await deleteFolder(id);
    setFolderFilter((prev) => (prev.type === 'folder' && prev.id === id ? { type: 'unfiled' } : prev));
  };

  const onDropToFolder = (e, targetFolderId) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('text/plain');
    if (!noteId) return;
    updateNote(noteId, { folderId: targetFolderId || null });
  };

  const onDragOverFolder = (e) => {
    e.preventDefault();
  };

  const openCreateFolder = () => {
    setFolderName('');
    setFolderColor('blue');
    setCreateOpen(true);
  };

  const onCreateFolder = async () => {
    try {
      const id = await createFolder({ name: folderName, color: folderColor });
      setCreateOpen(false);
      if (id) setFolderFilter({ type: 'folder', id });
    } catch (err) {
      push(err?.message || 'Failed to create folder');
    }
  };

  const onSelectNote = (id) => {
    setActiveId(id);
    if (onOpenEditor) onOpenEditor();
  };

  const shouldIgnoreCardClick = (target) => {
    const el = target instanceof Element ? target : null;
    if (!el) return false;
    return Boolean(el.closest('button, a, input, textarea, select'));
  };

  return (
    <div className="DashboardPane">
      <div className="DashboardTop">
        <div className="DashboardTitleBlock">
          <div className="DashboardTitle">
            {view === 'calendar' ? 'Calendar' : view === 'favorites' ? 'Favorites' : view === 'trash' ? 'Trash' : 'My Notes'}
          </div>
          <div className="DashboardSubtitle">
            {view === 'calendar'
              ? 'Notes updated recently.'
              : view === 'favorites'
                ? 'Pinned notes you revise often.'
                : view === 'trash'
                  ? 'Recently removed notes.'
                  : 'Folders and recent notes for quick studying.'}
          </div>
        </div>

        <div className="DashboardActions">
          <div className="DashboardSearch">
            <TextField
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              fullWidth
              InputProps={{
                endAdornment: query.trim() ? (
                  <Button size="small" onClick={() => setQuery('')} sx={{ minWidth: 0, px: 1.25, fontWeight: 800 }}>
                    Clear
                  </Button>
                ) : null,
              }}
            />
          </div>

          <Button variant="contained" onClick={onNewNote} sx={primaryGradientSx}>
            New note
          </Button>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="DashboardSection">
          <div className="SectionHeader">
            <div className="SectionTitle">Time range</div>
            <div className="SectionTabs">
              <button type="button" className={tab === 'today' ? 'TabButton isActive' : 'TabButton'} onClick={() => setTab('today')}>
                Today
              </button>
              <button type="button" className={tab === 'week' ? 'TabButton isActive' : 'TabButton'} onClick={() => setTab('week')}>
                This week
              </button>
              <button type="button" className={tab === 'month' ? 'TabButton isActive' : 'TabButton'} onClick={() => setTab('month')}>
                This month
              </button>
              <button type="button" className={tab === 'all' ? 'TabButton isActive' : 'TabButton'} onClick={() => setTab('all')}>
                All
              </button>
            </div>
          </div>
        </div>
      ) : view === 'notes' ? (
        <div className="DashboardSection">
          <div className="SectionHeader">
            <div className="SectionTitle">Recent folders</div>
            <div className="SectionTabs">
              <button type="button" className={tab === 'today' ? 'TabButton isActive' : 'TabButton'} onClick={() => setTab('today')}>
                Today
              </button>
              <button type="button" className={tab === 'week' ? 'TabButton isActive' : 'TabButton'} onClick={() => setTab('week')}>
                This week
              </button>
              <button type="button" className={tab === 'month' ? 'TabButton isActive' : 'TabButton'} onClick={() => setTab('month')}>
                This month
              </button>
              <button type="button" className={tab === 'all' ? 'TabButton isActive' : 'TabButton'} onClick={() => setTab('all')}>
                All
              </button>
            </div>
          </div>

          <div className="FolderRow">
          <div
            className={folderFilter.type === 'all' ? 'FolderCard isActive isBlue' : 'FolderCard isBlue'}
            onClick={() => setFolderFilter({ type: 'all' })}
            role="button"
            tabIndex={0}
          >
            <div className="FolderCardTop">
              <div className="FolderBadge" aria-hidden="true" />
              <div className="FolderMenu" aria-hidden="true">…</div>
            </div>
            <div className="FolderCardTitle">All Notes</div>
            <div className="FolderCardMeta">{allCount} notes</div>
          </div>

          <div
            className={folderFilter.type === 'pinned' ? 'FolderCard isActive isPeach' : 'FolderCard isPeach'}
            onClick={() => setFolderFilter({ type: 'pinned' })}
            role="button"
            tabIndex={0}
          >
            <div className="FolderCardTop">
              <div className="FolderBadge" aria-hidden="true" />
              <div className="FolderMenu" aria-hidden="true">…</div>
            </div>
            <div className="FolderCardTitle">Pinned</div>
            <div className="FolderCardMeta">{pinnedCount} notes</div>
          </div>

          <div
            className={folderFilter.type === 'unfiled' ? 'FolderCard isActive isYellow' : 'FolderCard isYellow'}
            onClick={() => setFolderFilter({ type: 'unfiled' })}
            onDrop={(e) => onDropToFolder(e, null)}
            onDragOver={onDragOverFolder}
            role="button"
            tabIndex={0}
          >
            <div className="FolderCardTop">
              <div className="FolderBadge" aria-hidden="true" />
              <div className="FolderMenu" aria-hidden="true">…</div>
            </div>
            <div className="FolderCardTitle">Unfiled</div>
            <div className="FolderCardMeta">{unfiledCount} notes</div>
          </div>

          {recentFolders.map((f) => (
            <div
              key={f.id}
              className={
                folderFilter.type === 'folder' && folderFilter.id === f.id
                  ? `FolderCard isActive ${folderColorClass(f.color)}`
                  : `FolderCard ${folderColorClass(f.color)}`
              }
              onClick={() => setFolderFilter({ type: 'folder', id: f.id })}
              onDrop={(e) => onDropToFolder(e, f.id)}
              onDragOver={onDragOverFolder}
              title={f.name}
              role="button"
              tabIndex={0}
            >
              <div className="FolderCardTop">
                <div className="FolderBadge" aria-hidden="true" />
                <span className="FolderMenuButton" role="button" tabIndex={0} aria-label="Folder menu" onClick={(e) => openFolderMenu(e, f.id)}>
                  …
                </span>
              </div>
              <div className="FolderCardTitle">{f.name}</div>
              <div className="FolderCardMeta">{folderCounts.get(f.id) || 0} notes</div>
            </div>
          ))}

          <div className="FolderCard isNew" onClick={openCreateFolder} role="button" tabIndex={0}>
            <div className="FolderNewInner">
              <div className="FolderNewPlus">+</div>
              <div className="FolderNewLabel">New folder</div>
            </div>
          </div>
          </div>
        </div>
      ) : null}

      <Menu anchorEl={folderMenuAnchor} open={folderMenuOpen} onClose={closeFolderMenu}>
        <MenuItem onClick={() => openEditFolder(folderMenuId)}>Edit</MenuItem>
        <MenuItem onClick={() => onDeleteFolder(folderMenuId)}>Delete</MenuItem>
      </Menu>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit folder</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField value={editName} onChange={(e) => setEditName(e.target.value)} label="Folder name" />
            <FormControl>
              <Select value={editColor} onChange={(e) => setEditColor(e.target.value)}>
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="peach">Peach</MenuItem>
                <MenuItem value="yellow">Yellow</MenuItem>
                <MenuItem value="mint">Mint</MenuItem>
                <MenuItem value="lavender">Lavender</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setEditOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onApplyEditFolder} sx={primaryGradientSx}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Create folder</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              label="Folder name"
              placeholder="e.g. Biology"
              autoFocus
            />
            <FormControl>
              <Select value={folderColor} onChange={(e) => setFolderColor(e.target.value)}>
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="peach">Peach</MenuItem>
                <MenuItem value="yellow">Yellow</MenuItem>
                <MenuItem value="mint">Mint</MenuItem>
                <MenuItem value="lavender">Lavender</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setCreateOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onCreateFolder} sx={primaryGradientSx}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <div className="DashboardSection">
        <div className="SectionHeader">
          <div className="SectionTitle">
            {view === 'trash' ? 'Trash' : view === 'favorites' ? 'Favorites' : view === 'calendar' ? 'Notes' : 'My Notes'}
          </div>
          <div className="SectionHint">{filteredNotes.length} shown</div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="DashboardEmpty">
            <div className="DashboardEmptyTitle">No notes found</div>
            <div className="DashboardEmptyDesc">
              {view === 'trash'
                ? 'Trash is empty.'
                : view === 'favorites'
                  ? 'Pin notes to see them here.'
                  : view === 'calendar'
                    ? 'No notes in this time range.'
                    : 'Try a different search or create a new note.'}
            </div>
            <div className="DashboardEmptyActions">
              {view === 'trash' ? null : (
                <Button variant="contained" onClick={onNewNote} sx={primaryGradientSx}>
                  Create note
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="NotesGrid">
            {filteredNotes.map((n) => (
              <div
                key={n.id}
                className={n.id === activeId ? 'NoteGridItem isActive' : 'NoteGridItem'}
                onClick={(e) => {
                  if (shouldIgnoreCardClick(e.target)) return;
                  onSelectNote(n.id);
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', n.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectNote(n.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Open note ${n.title || 'Untitled'}`}
              >
                <NoteCard note={n} highlightQuery={query} selected={n.id === activeId} view={view} />
              </div>
            ))}
          </div>
        )}

        <Box sx={{ height: 24 }} />
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'rgba(15,23,42,0.60)' }}>
          <Typography variant="caption" sx={{ fontWeight: 800 }}>
            Tip
          </Typography>
          <Typography variant="caption">Pin the notes you revise often so they’re always one click away.</Typography>
        </Stack>
      </div>
    </div>
  );
}
