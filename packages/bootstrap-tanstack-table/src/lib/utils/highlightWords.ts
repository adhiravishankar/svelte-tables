export interface HighlightChunk {
  key: string;
  match: boolean;
  text: string;
}

export interface HighlightWordsOptions {
  /** When true the whole query is one phrase; otherwise any whitespace separated word matches. */
  matchExactly?: boolean;
  query: string;
  text: string;
}

const escapeRegExp = (value: string) =>
  value.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');

/**
 * Splits `text` into chunks flagged as matching or not matching `query`, so matches can be highlighted.
 * Matching is case insensitive.
 */
export const highlightWords = ({
  matchExactly = false,
  query,
  text,
}: HighlightWordsOptions): HighlightChunk[] => {
  const trimmed = query.trim();
  if (!trimmed) return [{ key: '0', match: false, text }];

  const escaped = escapeRegExp(trimmed);
  const pattern = matchExactly ? escaped : escaped.split(/\s+/).join('|');
  const regexp = new RegExp(`(${pattern})`, 'i');

  // With a capture group, split() puts matches at the odd indexes.
  const chunks: HighlightChunk[] = [];
  text.split(regexp).forEach((part, index) => {
    if (part.length > 0) {
      chunks.push({
        key: String(chunks.length),
        match: index % 2 === 1,
        text: part,
      });
    }
  });
  return chunks;
};
