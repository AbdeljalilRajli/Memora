import { useEffect, useMemo } from 'react';

function sanitizeSegment(v) {
  return String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '_');
}

function normalizeHex(raw) {
  const v = String(raw || '').trim();
  if (!v) return '';
  const withHash = v.startsWith('#') ? v : `#${v}`;
  const m = withHash.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return '';
  let hex = m[0].toUpperCase();
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

function getStyleEl() {
  const id = 'listem-custom-note-colors';
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  return el;
}

function readRules() {
  const el = getStyleEl();
  const raw = el.textContent || '';
  const map = new Map();
  raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const m = line.match(/^\.([a-z0-9-_]+)\s*\{\s*--note-custom:\s*([^;]+);\s*\}$/i);
      if (!m) return;
      map.set(m[1], m[2].trim());
    });
  return map;
}

function writeRules(map) {
  const el = getStyleEl();
  const lines = Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([cls, hex]) => `.${cls} { --note-custom: ${hex}; }`);
  el.textContent = lines.join('\n');
}

export function useCustomNoteColor(noteKey, rawHex) {
  const className = useMemo(() => {
    const seg = sanitizeSegment(noteKey);
    return seg ? `note-custom-${seg}` : '';
  }, [noteKey]);

  const hex = useMemo(() => normalizeHex(rawHex), [rawHex]);

  useEffect(() => {
    if (!className || !hex) return;
    const map = readRules();
    if (map.get(className) === hex) return;
    map.set(className, hex);
    writeRules(map);
  }, [className, hex]);

  return { className, hex, isCustom: Boolean(className && hex) };
}

export function normalizeHexColor(raw) {
  return normalizeHex(raw);
}
