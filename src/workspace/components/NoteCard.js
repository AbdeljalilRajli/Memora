import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNotes } from '../../notes/NotesProvider';
import { useAuth } from '../../auth/AuthProvider';
import { enableShareForNote } from '../../sharing/noteShareService';
import { exportMarkdown, exportPdfViaPrint, exportTxt, printViaIframe, buildStandaloneHtml } from '../../utils/noteExport';
import { useToast } from '../../ui/ToastProvider';
import { normalizeHexColor, useCustomNoteColor } from '../../ui/useCustomNoteColor';

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v14" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2.5v9.2m0 0 3-3m-3 3-3-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 12.2v2.4A2.9 2.9 0 0 0 7.4 17.5h5.2a2.9 2.9 0 0 0 2.9-2.9v-2.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isDarkHex(hex) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return false;
  const raw = normalized.replace('#', '');
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.42;
}

async function copyToClipboardText(text) {
  if (!text) return;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function highlightText(text, query) {
  const t = text || '';
  const q = (query || '').trim();
  if (!q) return t;

  const idx = t.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return t;

  const before = t.slice(0, idx);
  const match = t.slice(idx, idx + q.length);
  const after = t.slice(idx + q.length);

  return (
    <>
      {before}
      <mark className="MatchMark">{match}</mark>
      {after}
    </>
  );
}

export function NoteCard({ note, highlightQuery = '', selected = false }) {
  const { colors, togglePin, deleteNote, getNoteContent } = useNotes();
  const { user } = useAuth();
  const { push } = useToast();
  const cardRef = useRef(null);

  const userId = user?.id || null;

  const [exportOpen, setExportOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const exportWrapRef = useRef(null);
  const exportButtonRef = useRef(null);
  const exportMenuRef = useRef(null);
  const [exportMenuReady, setExportMenuReady] = useState(false);

  const color = useMemo(() => {
    const raw = note.colorId || 'cream';
    const hex = normalizeHexColor(raw);
    if (hex) return { id: 'custom', label: 'Custom', chip: hex };
    return colors.find((c) => c.id === raw) || colors[0];
  }, [colors, note.colorId]);

  const noteColorClass = useMemo(() => (color.id === 'custom' ? 'is-custom' : `is-${color.id}`), [color.id]);

  const custom = useCustomNoteColor(note.id, color.id === 'custom' ? color.chip : '');

  const isDarkBackground = useMemo(() => {
    if (custom.isCustom) return isDarkHex(custom.hex);
    return false;
  }, [custom.hex, custom.isCustom]);

  useEffect(() => {
    const onPointerDown = (e) => {
      const target = e.target;
      if (exportWrapRef.current && exportWrapRef.current.contains(target)) return;
      if (exportMenuRef.current && exportMenuRef.current.contains(target)) return;
      setExportOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setExportOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!exportOpen) return;

    const update = () => {
      if (!exportButtonRef.current) return;
      const rect = exportButtonRef.current.getBoundingClientRect();
      const top = rect.bottom + 10;
      const menuWidth = 280;
      const minLeft = 12;
      const maxLeft = Math.max(minLeft, window.innerWidth - minLeft - menuWidth);
      const idealLeft = rect.right - menuWidth;
      const left = Math.min(maxLeft, Math.max(minLeft, idealLeft));
      const root = document.documentElement;
      root.style.setProperty('--portal-menu-top', `${Math.round(top)}px`);
      root.style.setProperty('--portal-menu-left', `${Math.round(left)}px`);
      setExportMenuReady(true);
    };

    setExportMenuReady(false);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [exportOpen]);

  const resolvePrintBackground = useCallback(() => {
    if (custom.isCustom) return custom.hex;
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
    const key = map[color.id] || '--note-cream';
    const value = styles.getPropertyValue(key);
    return (value || '').trim() || '#ffffff';
  }, [color.id, custom.hex, custom.isCustom]);

  const onShare = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!userId) {
        push('Sign in to share');
        return;
      }

      setShareLoading(true);
      try {
        const row = await enableShareForNote({ userId, noteId: note.id });
        const url = `${window.location.origin}/share/${row.share_id}`;
        await copyToClipboardText(url);
        push('Link copied');
      } catch (err) {
        const message =
          err?.message ||
          err?.error_description ||
          err?.error?.message ||
          'Failed to share';
        push(message);
      } finally {
        setShareLoading(false);
      }
    },
    [note.id, push, userId]
  );

  const withEditorContent = async (e, fn) => {
    e.preventDefault();
    e.stopPropagation();
    setExportLoading(true);
    try {
      const noteContent = await getNoteContent(note.id);
      if (!noteContent) {
        push('Failed to fetch note content');
        return;
      }
      await fn(noteContent.content);
    } catch (err) {
      push('Failed to fetch note content');
    } finally {
      setExportLoading(false);
      setExportOpen(false);
    }
  };

  return (
    <Box ref={cardRef} sx={{ width: '100%' }}>
      <Card
        elevation={0}
        className={`NoteCard ${noteColorClass}${custom.isCustom ? ` ${custom.className}` : ''}${isDarkBackground ? ' is-dark-bg' : ''}${exportOpen ? ' is-menu-open' : ''}`}
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 3,
          border: selected ? '1px solid rgba(255,183,0,0.65)' : '1px solid rgba(30,30,30,0.12)',
          boxShadow: selected ? '0 18px 50px rgba(15, 23, 42, 0.10)' : '0 14px 34px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          transition: 'transform 140ms ease, border-color 140ms ease, background-color 140ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            borderColor: selected ? 'rgba(255,183,0,0.85)' : 'rgba(30,30,30,0.18)',
            boxShadow: selected ? '0 20px 55px rgba(15, 23, 42, 0.12)' : '0 20px 55px rgba(15, 23, 42, 0.12)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }}
      >
        <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.5 }, height: '100%', display: 'flex', flexDirection: 'column', minHeight: 180 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }} noWrap>
                {highlightText(note.title?.trim() ? note.title : 'Untitled', highlightQuery)}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5} alignItems="center" onMouseDown={(e) => e.stopPropagation()}>
              <IconButton
                size="small"
                onClick={onShare}
                disabled={shareLoading}
                aria-label="Share"
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2.5,
                  border: '1px solid rgba(30,30,30,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.72)',
                  color: 'rgba(30,30,30,0.88)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: 'rgba(30,30,30,0.16)' },
                }}
              >
                <ShareIcon />
              </IconButton>

              <Box ref={exportWrapRef}>
                <IconButton
                  ref={exportButtonRef}
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExportOpen((prev) => !prev);
                  }}
                  aria-label="Export"
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 2.5,
                    border: '1px solid rgba(30,30,30,0.12)',
                    backgroundColor: 'rgba(255,255,255,0.72)',
                    color: 'rgba(30,30,30,0.88)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: 'rgba(30,30,30,0.16)' },
                  }}
                >
                  <ExportIcon />
                </IconButton>
              </Box>
            </Stack>
          </Stack>

          <Box sx={{ flex: 1, minHeight: 0 }}>
            {note.description?.trim() || note.preview ? (
              <Typography
                variant="body2"
                sx={{ mt: 0.75, color: 'rgba(30,30,30,0.62)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {note.description?.trim() ? note.description : note.preview}
              </Typography>
            ) : null}
          </Box>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.1 }}>
            <span className="Dot" aria-hidden="true" />
            <Typography variant="caption" sx={{ color: 'rgba(30,30,30,0.58)', fontWeight: 700 }}>
              {new Date(note.updatedAt).toLocaleString()}
            </Typography>
          </Stack>

          {exportOpen && exportMenuReady
            ? createPortal(
                <div
                  ref={exportMenuRef}
                  className="NoteCardDropdown isPortal"
                  role="dialog"
                  aria-label="Export note"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="NoteCardDropdownTitle">Export</div>
                  <div className="NoteCardDropdownDesc">PDF, Markdown, TXT or Print.</div>
                  <div className="NoteCardDropdownRow">
                    <button
                      className="MiniIconButton"
                      type="button"
                      onClick={(e) =>
                        withEditorContent(e, (content) =>
                          exportPdfViaPrint({
                            title: note.title || 'Untitled',
                            editorHtml: content,
                            background: resolvePrintBackground(),
                          })
                        )
                      }
                      disabled={exportLoading}
                      title="Export PDF"
                    >
                      {exportLoading ? '…' : 'PDF'}
                    </button>
                    <button
                      className="MiniIconButton"
                      type="button"
                      onClick={(e) => withEditorContent(e, (content) => exportMarkdown({ title: note.title || 'Untitled', editorHtml: content }))}
                      disabled={exportLoading}
                      title="Export Markdown"
                    >
                      {exportLoading ? '…' : 'MD'}
                    </button>
                    <button
                      className="MiniIconButton"
                      type="button"
                      onClick={(e) => withEditorContent(e, (content) => exportTxt({ title: note.title || 'Untitled', editorContent: content }))}
                      disabled={exportLoading}
                      title="Export Text"
                    >
                      {exportLoading ? '…' : 'TXT'}
                    </button>
                    <button
                      className="MiniIconButton"
                      type="button"
                      onClick={(e) =>
                        withEditorContent(e, (content) => {
                          const doc = buildStandaloneHtml({
                            title: note.title || 'Untitled',
                            bodyHtml: typeof content === 'string' ? content : '',
                            background: resolvePrintBackground(),
                          });
                          printViaIframe({ html: doc });
                        })
                      }
                      disabled={exportLoading}
                      title="Print"
                    >
                      {exportLoading ? '…' : 'Print'}
                    </button>
                  </div>
                </div>,
                document.body
              )
            : null}

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.0 }} onMouseDown={(e) => e.stopPropagation()}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePin(note.id);
              }}
              aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
              title={note.pinned ? 'Pinned' : 'Pin'}
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2.5,
                border: '1px solid rgba(30,30,30,0.12)',
                backgroundColor: 'rgba(255,255,255,0.72)',
                color: 'rgba(30,30,30,0.88)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: 'rgba(30,30,30,0.16)' },
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M9 3h6l1 6 3 3v2H5v-2l3-3 1-6Zm3 11v7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const ok = window.confirm('Delete this note permanently?');
                if (!ok) return;
                Promise.resolve(deleteNote(note.id)).catch((err) => {
                  const msg = err?.message || 'Failed to delete note';
                  push(msg);
                });
              }}
              aria-label="Delete note"
              title="Delete"
              color="error"
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2.5,
                border: '1px solid rgba(30,30,30,0.12)',
                backgroundColor: 'rgba(255,255,255,0.72)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: 'rgba(30,30,30,0.16)' },
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M4 7h16M10 11v7M14 11v7M9 7l1-2h4l1 2M6 7l1 14h10l1-14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
