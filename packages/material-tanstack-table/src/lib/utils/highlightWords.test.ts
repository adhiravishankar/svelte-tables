import { describe, expect, it } from 'vitest';
import { highlightWords } from './highlightWords';

const parts = (options: Parameters<typeof highlightWords>[0]) =>
  highlightWords(options).map(({ match, text }) => [text, match]);

describe('highlightWords', () => {
  it('returns a single non-match chunk for an empty query', () => {
    expect(parts({ query: '  ', text: 'hello world' })).toEqual([
      ['hello world', false],
    ]);
  });

  it('matches case insensitively and keeps original casing', () => {
    expect(parts({ query: 'WOR', text: 'hello World' })).toEqual([
      ['hello ', false],
      ['Wor', true],
      ['ld', false],
    ]);
  });

  it('matches any word of a multi word query by default', () => {
    expect(parts({ query: 'brown  fox', text: 'the brown cute fox' })).toEqual([
      ['the ', false],
      ['brown', true],
      [' cute ', false],
      ['fox', true],
    ]);
  });

  it('treats the query as one phrase when matchExactly is set', () => {
    expect(
      parts({
        matchExactly: true,
        query: 'brown fox',
        text: 'the brown cute fox',
      }),
    ).toEqual([['the brown cute fox', false]]);
    expect(
      parts({ matchExactly: true, query: 'brown fox', text: 'a brown fox' }),
    ).toEqual([
      ['a ', false],
      ['brown fox', true],
    ]);
  });

  it('escapes regular expression characters in the query', () => {
    expect(parts({ query: 'a.b(', text: 'xa.b(y' })).toEqual([
      ['x', false],
      ['a.b(', true],
      ['y', false],
    ]);
    expect(parts({ query: '/foo/i', text: 'x' })).toEqual([['x', false]]);
  });

  it('gives chunks unique stable keys', () => {
    const keys = highlightWords({ query: 'a', text: 'banana' }).map(
      (chunk) => chunk.key,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });
});
