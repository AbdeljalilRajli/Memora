import TurndownService from 'turndown';
import { generateHTML, generateText } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';

const lowlight = createLowlight(common);

function downloadBlob({ blob, filename }) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function getExportExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Typography,
    Underline,
    Link.configure({
      openOnClick: true,
      autolink: true,
      linkOnPaste: true,
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ];
}

function fallbackTextFromJson(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(fallbackTextFromJson).join('');

  if (node.type === 'text') return node.text || '';

  const blockTypes = new Set(['paragraph', 'heading', 'blockquote', 'listItem', 'codeBlock']);
  const needsBreakBefore = blockTypes.has(node.type);

  const inner = node.content ? node.content.map(fallbackTextFromJson).join('') : '';
  if (!inner) return '';

  if (needsBreakBefore) {
    return `${inner}\n`;
  }

  return inner;
}

function ensureHtml(editorContent) {
  if (!editorContent) return '';
  if (typeof editorContent === 'string') return editorContent;
  try {
    return generateHTML(editorContent, getExportExtensions());
  } catch {
    return '';
  }
}

function ensureText(editorContent) {
  if (!editorContent) return '';
  if (typeof editorContent === 'string') {
    const tmp = document.createElement('div');
    tmp.innerHTML = editorContent;
    return tmp.innerText || '';
  }
  try {
    const text = generateText(editorContent, getExportExtensions());
    if (text && text.trim()) return text;
    const fallback = fallbackTextFromJson(editorContent);
    return fallback.replace(/\n{3,}/g, '\n\n').trim();
  } catch {
    const fallback = fallbackTextFromJson(editorContent);
    return fallback.replace(/\n{3,}/g, '\n\n').trim();
  }
}

export function printViaIframe({ html }) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;

  const cleanup = () => {
    try {
      iframe.remove();
    } catch {
      // ignore
    }
  };

  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) {
      cleanup();
      return;
    }

    const afterPrint = () => {
      win.removeEventListener('afterprint', afterPrint);
      cleanup();
    };

    win.addEventListener('afterprint', afterPrint);

    // Allow layout/fonts to settle before print.
    window.setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch {
        cleanup();
      }
    }, 50);
  };

  document.body.appendChild(iframe);
  iframe.srcdoc = html;
}

export function buildStandaloneHtml({ title, bodyHtml, background }) {
  const safeTitle = title?.trim() ? title.trim() : 'Untitled';
  const bg = background?.trim() ? background.trim() : '#ffffff';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(safeTitle)}</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; padding: 40px 18px; background: ${escapeHtml(bg)}; color: #0f172a; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  .Doc { max-width: 820px; margin: 0 auto; }
  .Title { font-size: 30px; font-weight: 900; letter-spacing: -0.02em; margin: 0 0 18px; }
  .ListemEditor { font-size: 1.06rem; line-height: 1.7; letter-spacing: 0.1px; }
  .ListemEditor p { margin: 14px 0; }
  .ListemEditor h1 { font-size: 2rem; line-height: 1.22; margin: 22px 0 12px; }
  .ListemEditor h2 { font-size: 1.55rem; line-height: 1.25; margin: 20px 0 10px; }
  .ListemEditor h3 { font-size: 1.25rem; line-height: 1.3; margin: 18px 0 10px; }
  .ListemEditor ul, .ListemEditor ol { padding-left: 24px; margin: 14px 0; }
  .ListemEditor blockquote { border-left: 3px solid rgba(43, 108, 255, 0.45); padding-left: 14px; color: #475569; margin: 16px 0; }
  .ListemEditor a { color: rgba(43, 108, 255, 0.95); text-decoration: none; border-bottom: 1px solid rgba(43, 108, 255, 0.30); }
  .ListemEditor code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace; background: rgba(15, 23, 42, 0.06); padding: 2px 6px; border-radius: 8px; }
  .ListemEditor pre { margin: 16px 0; padding: 14px 14px; border-radius: 14px; background: rgba(0,0,0,0.06); overflow: auto; }
  .ListemEditor pre code { background: transparent; padding: 0; border-radius: 0; }
  .ListemEditor .task-list-item { list-style: none; }
  .ListemEditor .task-list-item input { margin-right: 10px; }
  @media print {
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { padding: 0; }
    .Doc { max-width: 760px; }
  }
</style>
</head>
<body>
  <main class="Doc">
    <h1 class="Title">${escapeHtml(safeTitle)}</h1>
    <div class="ListemEditor">${bodyHtml || ''}</div>
  </main>
</body>
</html>`;
}

export function exportHtml({ title, editorHtml }) {
  const html = ensureHtml(editorHtml);
  const doc = buildStandaloneHtml({ title, bodyHtml: html });
  downloadBlob({ blob: new Blob([doc], { type: 'text/html;charset=utf-8' }), filename: `${safeFilename(title)}.html` });
}

export function exportMarkdown({ title, editorHtml }) {
  const html = ensureHtml(editorHtml);
  const service = new TurndownService({
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
  });

  const md = service.turndown(html || '');
  downloadBlob({ blob: new Blob([md], { type: 'text/markdown;charset=utf-8' }), filename: `${safeFilename(title)}.md` });
}

export function exportPdfViaPrint({ title, editorHtml, background }) {
  const html = ensureHtml(editorHtml);
  const doc = buildStandaloneHtml({ title, bodyHtml: html, background });
  printViaIframe({ html: doc });
}

export function exportTxt({ title, editorContent }) {
  const text = ensureText(editorContent);
  downloadBlob({ blob: new Blob([text], { type: 'text/plain;charset=utf-8' }), filename: `${safeFilename(title)}.txt` });
}

function safeFilename(title) {
  const base = title?.trim() ? title.trim() : 'Untitled';
  const cleaned = base.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 80);
  return cleaned || 'Untitled';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
