// => <, >, &, ", ', 
// ↵ => <br>
export function useUnescapeHTML (text) { 
  return String(text)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/↵/g, '<br>')
}