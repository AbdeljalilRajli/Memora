import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useNotes } from '../../notes/NotesProvider';
import { NoteEditor } from '../../editor/NoteEditor';
import { useToast } from '../../ui/ToastProvider';
import { normalizeHexColor } from '../../ui/useCustomNoteColor';

export function EditorPane() {
  const {
    getActiveNote,
    createNote,
    colors,
    folders,
    updateNote,
    lastCreatedId,
    clearLastCreatedId,
  } = useNotes();
  const { push } = useToast();
  const note = getActiveNote();
  const noteId = note?.id ?? null;
  const noteTitle = note?.title ?? '';
  const [titleDraft, setTitleDraft] = useState('');
  const titleRef = useRef(null);

  const color = useMemo(() => {
    if (!note) return colors[0];
    const raw = note.colorId || colors[0]?.id;
    const hex = normalizeHexColor(raw);
    if (hex) return { id: 'custom', label: 'Custom', chip: hex };
    return colors.find((c) => c.id === raw) || colors[0];
  }, [colors, note]);

  const [colorOpen, setColorOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState('');
  const colorButtonRef = useRef(null);
  const colorMenuRef = useRef(null);
  const [colorMenuReady, setColorMenuReady] = useState(false);

  useEffect(() => {
    if (!colorOpen) return;

    const update = () => {
      if (!colorButtonRef.current) return;
      const rect = colorButtonRef.current.getBoundingClientRect();
      const menuWidth = 300;
      const minLeft = 12;
      const maxLeft = Math.max(minLeft, window.innerWidth - minLeft - menuWidth);
      const idealLeft = rect.left;
      const left = Math.min(maxLeft, Math.max(minLeft, idealLeft));
      const top = rect.bottom + 10;
      const root = document.documentElement;
      root.style.setProperty('--portal-color-top', `${Math.round(top)}px`);
      root.style.setProperty('--portal-color-left', `${Math.round(left)}px`);
      setColorMenuReady(true);
    };

    setColorMenuReady(false);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [colorOpen]);

  useEffect(() => {
    if (!note) return;

    const isNewUntitled = noteId === lastCreatedId && noteTitle === 'Untitled';
    setTitleDraft(isNewUntitled ? '' : noteTitle);
  }, [lastCreatedId, note, noteId, noteTitle]);

  useEffect(() => {
    if (!note) return;
    if (noteId !== lastCreatedId) return;

    const raf = window.requestAnimationFrame(() => {
      titleRef.current?.focus();
      titleRef.current?.select();
      clearLastCreatedId();
    });

    return () => window.cancelAnimationFrame(raf);
  }, [clearLastCreatedId, lastCreatedId, note, noteId]);

  const onTitleChange = (e) => {
    const next = e.target.value;
    setTitleDraft(next);

    if (!note) return;
    updateNote(note.id, { title: next });
  };

  const onDescriptionChange = (e) => {
    const next = e.target.value;
    if (!note) return;
    updateNote(note.id, { description: next });
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setColorOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (e) => {
      const target = e.target;
      if (colorButtonRef.current && colorButtonRef.current.contains(target)) return;
      if (colorMenuRef.current && colorMenuRef.current.contains(target)) return;
      setColorOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  if (!note) {
    return (
      <section className="EditorPane is-empty">
        <div className="EmptyState">
          <div className="EmptyStateTitle">No note selected</div>
          <div className="EmptyStateDesc">Create a new note to start writing.</div>
          <button className="PrimaryButton" type="button" onClick={() => createNote()}>
            + New note
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="EditorPane"
      onMouseDown={() => {
        setColorOpen(false);
      }}
    >
      <div className="EditorContainer">
        <Box className="EditorHeader" onMouseDown={(e) => e.stopPropagation()} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
              <Button
                ref={colorButtonRef}
                variant="outlined"
                size="small"
                onClick={() => {
                  setHexDraft(color?.id === 'custom' ? color?.chip : '');
                  setColorOpen((v) => !v);
                }}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 800,
                  borderColor: 'rgba(30,30,30,0.18)',
                  color: 'rgba(30,30,30,0.92)',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  '&:hover': { borderColor: 'rgba(30,30,30,0.26)', backgroundColor: 'rgba(255,255,255,1)' },
                }}
              >
                <span className={color?.id === 'custom' ? 'ColorChip is-custom' : `ColorChip is-${color?.id}`} aria-hidden="true" style={{ marginRight: 10 }} />
                <span style={{ marginRight: 10 }}>Color note</span>
                <span style={{ opacity: 0.72, fontWeight: 700 }}>{color?.id === 'custom' ? 'Custom' : color?.label || 'Cream'}</span>
              </Button>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select
                  value={note.folderId || ''}
                  displayEmpty
                  onChange={(e) => {
                    const next = e.target.value;
                    updateNote(note.id, { folderId: next || null });
                  }}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 850,
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(30,30,30,0.18)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(30,30,30,0.26)' },
                  }}
                >
                  <MenuItem value="">No folder</MenuItem>
                  {folders.map((f) => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Box>

        {colorOpen && colorMenuReady
          ? createPortal(
              <div
                ref={colorMenuRef}
                className="ColorPopover isPortal"
                role="dialog"
                aria-label="Note color"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="ColorPopoverHeader">
                  <div className="ColorPopoverTitle">Color</div>
                  <div className="ColorPopoverHint">Choose a preset or enter a hex.</div>
                </div>

                <div className="ColorPresetRow" role="radiogroup" aria-label="Preset colors">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={c.id === note.colorId ? 'ColorDotButton isActive' : 'ColorDotButton'}
                      onClick={() => {
                        updateNote(note.id, { colorId: c.id });
                        setColorOpen(false);
                      }}
                      aria-label={c.label}
                      aria-checked={c.id === note.colorId}
                      role="radio"
                    >
                      <span className={`ColorDot is-${c.id}`} aria-hidden="true" />
                    </button>
                  ))}
                </div>

                <div className="ColorCustomBlock">
                  <div className="ColorCustomLabel">Custom hex</div>
                  <div className="ColorCustomRow">
                    <input
                      className="ColorHexInput"
                      value={hexDraft}
                      onChange={(e) => setHexDraft(e.target.value)}
                      placeholder="#7C3AED"
                      inputMode="text"
                      spellCheck={false}
                      aria-label="Custom hex color"
                    />
                    <button
                      className="ColorApplyButton"
                      type="button"
                      onClick={() => {
                        const hex = normalizeHexColor(hexDraft);
                        if (!hex) {
                          push('Invalid hex');
                          return;
                        }
                        updateNote(note.id, { colorId: hex });
                        setColorOpen(false);
                      }}
                      title="Apply custom color"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )
          : null}

        <Box sx={{ mb: 1.5 }}>
          <TextField
            inputRef={titleRef}
            value={titleDraft}
            placeholder="Title (required)"
            onChange={onTitleChange}
            fullWidth
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 3,
                fontSize: '1.25rem',
                fontWeight: 850,
                lineHeight: 1.3,
                letterSpacing: '-0.03em',
                backgroundColor: 'rgba(255,255,255,0.98)',
                '& .MuiInputBase-input': { padding: '14px 14px' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(30,30,30,0.14)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(30,30,30,0.20)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,183,0,0.85)', borderWidth: 2 },
              },
            }}
            aria-label="Note title"
          />
        </Box>

        <Box sx={{ mb: 1.75 }}>
          <TextField
            value={note.description || ''}
            placeholder="Description (required)"
            onChange={onDescriptionChange}
            fullWidth
            variant="outlined"
            multiline
            minRows={5}
            InputProps={{
              sx: {
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.6,
                backgroundColor: 'rgba(255,255,255,0.98)',
                '& textarea': { padding: '14px 14px' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(30,30,30,0.14)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(30,30,30,0.20)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,183,0,0.85)', borderWidth: 2 },
              },
            }}
            aria-label="Note description"
          />
        </Box>

        <div className="TitleContentDivider" aria-hidden="true" />
        <NoteEditor key={note.id} noteId={note.id} noteTitle={titleDraft || noteTitle} initialContent={note.content} />
      </div>
    </section>
  );
}
