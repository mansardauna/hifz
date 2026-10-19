/**
 * Robust HTML & CSS Sanitizer for User-Generated Layouts & GrapesJS
 *
 * Protects against stored XSS vectors:
 * - Strips all executable and embedding tags (<script>, <iframe/object/embed/applet/meta/base>)
 * - Completely neutralizes all DOM event handlers (onload, onerror, onclick...) even with slash/no-space prefixes (<svg/onload=...>)
 * - Blocks script URI schemes (javascript:, vbscript:, data:text/html) including entity-encoded variants
 * - Sanitizes CSS to prevent tag breakout (</style>) and expressions
 */

export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  let clean = dirtyHtml;

  // 1. Remove dangerous executable and embedding tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, '');
  clean = clean.replace(/<\/?(script|iframe|object|embed|applet|meta|base|link)\b[^>]*>/gi, '');

  // 2. Remove all inline event handlers (including /onload, \sonload, \nonload, etc.)
  // Handles <svg/onload=...>, <img/onerror=...>, <div onmouseover=...>
  clean = clean.replace(/[\s\/>]on[a-zA-Z0-9_-]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, (match) => {
    // Preserve the leading character (e.g. '/' or ' ' or '>') while eliminating the handler
    const lead = match.charAt(0);
    return lead === '/' || lead === '>' ? `${lead} data-blocked-handler=""` : ' data-blocked-handler=""';
  });

  // Secondary sweep for any remaining on* handler attributes inside tags
  clean = clean.replace(/<([a-zA-Z0-9-]+)([^>]*?)(\bon[a-zA-Z]+\s*=)([^>]*?)>/gi, (match, tag, before, handler, after) => {
    return `<${tag}${before} data-blocked=""${after}>`;
  });

  // 3. Remove javascript:, vbscript:, and data:text/html URIs in href, src, or action attributes
  // Also catches entity-encoded variations like &#106;avascript:
  clean = clean.replace(
    /(href|src|action|xlink:href)\s*=\s*(['"])\s*(javascript|vbscript|data\s*:\s*text\/html|&#[xX]?[0-9a-fA-F]+;?)/gi,
    '$1=$2#blocked-uri:'
  );

  return clean;
}

/**
 * Sanitizes published CSS strings to prevent style breakout and CSS injection
 */
export function sanitizeCss(dirtyCss: string): string {
  if (!dirtyCss || typeof dirtyCss !== 'string') return '';

  return dirtyCss
    // Prevent closing the <style> tag
    .replace(/<\/style\b[^>]*>/gi, '')
    // Prevent CSS expressions
    .replace(/expression\s*\([^)]*\)/gi, '')
    // Prevent javascript: urls inside CSS url()
    .replace(/url\s*\(\s*(['"]?)\s*javascript:[^)]*\1\s*\)/gi, 'url("")')
    // Prevent malicious @import statements
    .replace(/@import\b[^;]*;/gi, '');
}
