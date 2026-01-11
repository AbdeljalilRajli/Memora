import React, { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuth } from '../auth/AuthProvider';
import { NotesProvider } from '../notes/NotesProvider';
import { useNotes } from '../notes/NotesProvider';
import { TopNav } from './components/TopNav';
import { DashboardPane } from './components/DashboardPane';
import { EditorPane } from './components/EditorPane';
import { exportMarkdown, exportPdfViaPrint, exportTxt, buildStandaloneHtml, printViaIframe } from '../utils/noteExport';
import { useToast } from '../ui/ToastProvider';
import { normalizeHexColor } from '../ui/useCustomNoteColor';

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M9 7h6" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m8 7 4-4 4 4" />
      <path d="M5 21h14" />
    </svg>
  );
}

function NotesWorkspaceInner({ userEmail, onLogout, loggingOut, supabaseHost }) {
  const { push } = useToast();
  const { getActiveNote, getNoteContent, saveNote, saveStatus } = useNotes();
  const [editorOpen, setEditorOpen] = useState(false);
  const [lastSaveError, setLastSaveError] = useState('');

  const note = getActiveNote();

  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const exportOpen = Boolean(exportAnchorEl);

  const resolvePrintBackground = useMemo(() => {
    const raw = note?.colorId || '';
    const hex = normalizeHexColor(raw);
    if (hex) return hex;

    const root = document.documentElement;
    const styles = window.getComputedStyle(root);
    const map = {
      cream: '--note-cream',
      sun: '--note-sun',
      pink: '--note-pink',
      white: '--note-white',
      sky: '--note-skybrand',
      mint: '--note-mintbrand',
      lavender: '--note-lavenderbrand',
    };
    const key = map[note?.colorId] || '--note-cream';
    const value = styles.getPropertyValue(key);
    return (value || '').trim() || '#ffffff';
  }, [note?.colorId]);

  const withFreshContent = async (fn) => {
    if (!note) return;
    try {
      const noteContent = await getNoteContent(note.id);
      await fn(noteContent?.content);
    } catch (err) {
      push(err?.message || 'Export failed');
    } finally {
      setExportAnchorEl(null);
    }
  };

  const canSave = Boolean((note?.title || '').trim() && (note?.description || '').trim());

  const statusLabel = useMemo(() => {
    if (lastSaveError) return supabaseHost ? `${lastSaveError} (${supabaseHost})` : lastSaveError;
    if (saveStatus === 'saving') return 'Saving…';
    if (saveStatus === 'dirty') return 'Unsaved changes';
    return 'Saved ✓';
  }, [lastSaveError, saveStatus, supabaseHost]);

  return (
    <div className="AppShell">
      <TopNav userEmail={userEmail} onLogout={onLogout} loggingOut={loggingOut} />
      <div className="AppBody">
        <aside className="NavRail" aria-label="Primary navigation">
          <button className="NavRailButton isActive" type="button" aria-current="page" title="Notes">
            <span className="NavRailIcon" aria-hidden="true"><NotesIcon /></span>
          </button>
          <button className="NavRailButton" type="button" title="Calendar" disabled>
            <span className="NavRailIcon" aria-hidden="true"><CalendarIcon /></span>
          </button>
          <button className="NavRailButton" type="button" title="Favorites" disabled>
            <span className="NavRailIcon" aria-hidden="true"><StarIcon /></span>
          </button>
          <button className="NavRailButton" type="button" title="Trash" disabled>
            <span className="NavRailIcon" aria-hidden="true"><TrashIcon /></span>
          </button>
        </aside>

        <main className="WorkspaceMain">
          <DashboardPane onOpenEditor={() => setEditorOpen(true)} />
        </main>

        <div className={editorOpen ? 'EditorSheet isOpen' : 'EditorSheet'} role="dialog" aria-label="Note editor">
          <div className="EditorSheetHeader">
            <div className="EditorSheetHeaderLeft">
              <Typography
                variant="body2"
                className={saveStatus === 'saving' ? 'SaveStatus isSaving' : 'SaveStatus isSaved'}
                aria-live="polite"
                sx={{ m: 0 }}
              >
                {statusLabel}
              </Typography>
            </div>

            <div className="EditorSheetHeaderRight">
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    if (!note) return;
                    setLastSaveError('');
                    push(supabaseHost ? `Saving… (${supabaseHost})` : 'Saving…', { durationMs: 1600 });
                    saveNote(note.id)
                      .then(() => {
                        setLastSaveError('');
                        push(supabaseHost ? `Saved (${supabaseHost})` : 'Saved', { durationMs: 2200 });
                      })
                      .catch((err) => {
                        const msg = err?.message || 'Save failed';
                        setLastSaveError(msg);
                        push(supabaseHost ? `${msg} (${supabaseHost})` : msg, { durationMs: 8000 });
                      });
                  }}
                  disabled={!note || !canSave || saveStatus === 'saving'}
                  sx={{ fontWeight: 900, borderRadius: 3, textTransform: 'none' }}
                >
                  Save
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  className="EditorSheetIconButton"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExportAnchorEl(e.currentTarget);
                  }}
                  disabled={!note}
                  aria-label="Export"
                >
                  <ExportIcon />
                </Button>

                <button className="EditorSheetIconButton" type="button" onClick={() => setEditorOpen(false)} aria-label="Close editor">
                  <CloseIcon />
                </button>
              </Stack>
            </div>
          </div>

          <Menu
            anchorEl={exportAnchorEl}
            open={exportOpen}
            onClose={() => setExportAnchorEl(null)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                border: '1px solid rgba(30,30,30,0.12)',
                boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
                minWidth: 220,
              },
            }}
          >
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                withFreshContent((content) =>
                  exportPdfViaPrint({
                    title: note?.title || 'Untitled',
                    editorHtml: content,
                    background: resolvePrintBackground,
                  })
                );
              }}
              disabled={!note}
            >
              PDF
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                withFreshContent((content) => exportMarkdown({ title: note?.title || 'Untitled', editorHtml: content }));
              }}
              disabled={!note}
            >
              Markdown (MD)
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                withFreshContent((content) => exportTxt({ title: note?.title || 'Untitled', editorContent: content }));
              }}
              disabled={!note}
            >
              Text (TXT)
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                withFreshContent((content) => {
                  const doc = buildStandaloneHtml({
                    title: note?.title || 'Untitled',
                    bodyHtml: typeof content === 'string' ? content : '',
                    background: resolvePrintBackground,
                  });
                  printViaIframe({ html: doc });
                });
              }}
              disabled={!note}
            >
              Print…
            </MenuItem>
          </Menu>

          <EditorPane />
        </div>

        {editorOpen ? (
          <button className="EditorSheetOverlay" type="button" aria-label="Close editor" onClick={() => setEditorOpen(false)} />
        ) : null}
      </div>
    </div>
  );
}

export function NotesWorkspace() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const userId = useMemo(() => user?.id || 'anonymous', [user?.id]);

  const supabaseHost = useMemo(() => {
    const raw = process.env.REACT_APP_SUPABASE_URL;
    if (!raw) return '';
    try {
      return new URL(raw).host;
    } catch {
      return String(raw);
    }
  }, []);

  const onLogout = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <NotesProvider userId={userId}>
      <NotesWorkspaceInner userEmail={user?.email || ''} onLogout={onLogout} loggingOut={signingOut} supabaseHost={supabaseHost} />
    </NotesProvider>
  );
}
