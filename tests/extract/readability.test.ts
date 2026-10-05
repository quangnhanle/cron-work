import { describe, expect, it } from 'vitest';
import { extractArticle } from '../../src/extract/readability.ts';

describe('extractArticle feed mode', () => {
  it('uses feed text without requesting the article page', async () => {
    const abstract = Array.from({ length: 30 }, (_, index) => `word${index}`).join(' ');
    const result = await extractArticle(
      {
        id: 'arxiv:1',
        title: 'Logical qubits with a surface code',
        url: 'https://invalid.example/paper',
        source: 'rss:arxiv-quant-ph',
        contentMode: 'feed',
        rawContent: `<p>${abstract}</p>`,
      },
      5_000,
    );

    expect(result.ok).toBe(true);
    expect(result.wordCount).toBe(30);
    expect(result.text).not.toContain('<p>');
  });
});
