// Manual translations (src/data/manual.<lang>.json) are keyed by the plain text of a Notion rich-text
// array, so they survive block reordering; text that has no translation yet is shown in the original.

export function richTextKey(runs = []) {
  return runs.map((run) => run.text).join("").trim();
}

export function translateRichText(runs = [], dictionary) {
  const translation = dictionary?.[richTextKey(runs)];
  if (!translation) return runs;
  if (typeof translation !== "string") return translation;
  return [runs.length === 1 ? { ...runs[0], text: translation } : { text: translation }];
}

// Every rich-text array the manual page renders: block text, image captions and table cells.
export function collectRichTexts(blocks = []) {
  return blocks.flatMap((block) => [
    block.richText,
    block.caption,
    ...(block.rows || []).flatMap((row) => row.cells),
    ...collectRichTexts(block.children),
  ]).filter((runs) => runs?.length);
}
