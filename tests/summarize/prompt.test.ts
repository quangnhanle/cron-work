import { describe, expect, it } from 'vitest';
import { SYSTEM_PROMPT, buildUserPrompt } from '../../src/summarize/prompt.ts';

describe('digest prompt language', () => {
  it('keeps the source title in English and requests Vietnamese summary fields', () => {
    const prompt = buildUserPrompt(
      {
        id: 'article:1',
        url: 'https://example.com/article',
        title: 'Designing Reliable Distributed Systems',
        source: 'rss:engineering',
        score: 17,
      },
      'English article text.',
    );

    expect(prompt).toContain('Title: Designing Reliable Distributed Systems');
    expect(prompt).toContain('hook, bullets, and keyInsight must be in Vietnamese');
    expect(SYSTEM_PROMPT).toContain('never translate or rewrite it');
    expect(SYSTEM_PROMPT).toContain('natural Vietnamese');
  });
});
