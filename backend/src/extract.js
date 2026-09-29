import pdfParse from 'pdf-parse';
export function identifyFields(text) {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? '';
  const phone = text.match(/(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?\d{4,5}[\s.-]?\d{4}\b/)?.[0]?.trim() ?? '';
  const candidate = lines.slice(0, 8).map(line => line.replace(/^(nome(?: completo)?|name)\s*:\s*/i, '').trim())
    .find(line => /^[\p{L}][\p{L}'’-]+(?:\s+[\p{L}][\p{L}'’-]+){1,5}$/u.test(line) && !/^(curr[ií]culo|resume|experi[eê]ncia|forma[cç][aã]o)/i.test(line));
  return { nomeCompleto: candidate ?? '', email, telefone: phone };
}
export async function extractPdf(buffer) {
  const parsed = await pdfParse(buffer);
  if (!parsed.text?.trim()) throw new Error('NO_TEXT');
  return identifyFields(parsed.text);
}
