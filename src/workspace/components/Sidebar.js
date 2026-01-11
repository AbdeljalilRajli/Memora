import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotes } from '../../notes/NotesProvider';
import { NoteCard } from './NoteCard';

export function Sidebar() {
  const { notes, activeId, setActiveId, createNote } = useNotes();
  const [sort, setSort] = useState('newest');
  const [query, setQuery] = useState('');

  const sorted = useMemo(() => {
    const copy = [...notes];
    copy.sort((a, b) => {
      const da = new Date(a.updatedAt).getTime();
      const db = new Date(b.updatedAt).getTime();
      return sort === 'newest' ? db - da : da - db;
    });
    return copy;
  }, [notes, sort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((n) => (n.title || '').toLowerCase().includes(q));
  }, [query, sorted]);

  return (
    <aside className="Sidebar">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="overline" sx={{ letterSpacing: '0.12em', color: 'rgba(30,30,30,0.62)' }}>
          Your notes
        </Typography>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <FormControl size="small" fullWidth>
            <Select value={sort} onChange={(e) => setSort(e.target.value)} displayEmpty>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => createNote()} sx={{ fontWeight: 800, borderRadius: 2, whiteSpace: 'nowrap' }}>
            New
          </Button>
        </Stack>

        <TextField
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes…"
          fullWidth
          InputProps={{
            endAdornment: query.trim() ? (
              <Button size="small" onClick={() => setQuery('')} sx={{ minWidth: 0, px: 1.25 }}>
                Clear
              </Button>
            ) : null,
          }}
        />
      </Box>

      <List sx={{ mt: 2, p: 0, display: 'grid', gap: 1.25 }}>
        {filtered.length === 0 ? (
          <Box sx={{ px: 1, py: 3 }}>
            <Typography fontWeight={800}>No matches</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(30,30,30,0.62)' }}>
              Try a different title.
            </Typography>
          </Box>
        ) : (
          filtered.map((n) => (
            <ListItemButton
              key={n.id}
              selected={n.id === activeId}
              onClick={() => setActiveId(n.id)}
              sx={{
                p: 0,
                borderRadius: 3,
                alignItems: 'stretch',
                transition: 'background-color 140ms ease',
                '&:hover': { backgroundColor: 'rgba(30,30,30,0.03)' },
                '&.Mui-selected': { backgroundColor: 'rgba(255,183,0,0.08)' },
                '&.Mui-selected:hover': { backgroundColor: 'rgba(255,183,0,0.10)' },
              }}
            >
              <NoteCard note={n} highlightQuery={query} selected={n.id === activeId} />
            </ListItemButton>
          ))
        )}
      </List>
    </aside>
  );
}
