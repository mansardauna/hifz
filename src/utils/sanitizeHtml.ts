/**
 * Fast, zero-dependency HTML sanitizer for GrapesJS published layouts.
 * Removes executable script tags, dangerous embed objects, inline JS event handlers,
 * and malicious URI schemes while preserving layout markup, CSS, forms, and SVG icons.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  let clean = dirtyHtml;

  // 1. Remove script tags and contents
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, '');

  // 2. Remove iframe, object, embed, and applet elements
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe\s*>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object\s*>/gi, '');
  clean = clean.replace(/<embed\b[^>]*>/gi, '');
  clean = clean.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet\s*>/gi, '');

  // 3. Remove javascript: and vbscript: URIs in href, src, or action attributes
  clean = clean.replace(/(href|src|action)\s*=\s*(['"])\s*(javascript|vbscript|data:text\/html):/gi, '$1=$2#blocked:');

  // 4. Remove all inline DOM event handlers (on\w+=...) e.g. onload, onerror, onclick, onmouseover
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '');

  return clean;
}
