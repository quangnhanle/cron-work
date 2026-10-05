import { describe, expect, it } from 'vitest';
import { SYSTEM_PROMPT, buildUserPrompt } from '../../src/summarize/prompt.ts';

describe('quantum digest prompt language', () => {
  it('keeps the source title in English and requests Vietnamese summary fields', () => {
    const prompt = buildUserPrompt(
      {
        id: 'paper:1',
        url: 'https://example.com/paper',
        title: 'A Fault-Tolerant Logical Qubit',
        source: 'rss:arxiv-quant-ph',
        score: 17,
      },
      'English abstract text.',
    );

    expect(prompt).toContain('Title: A Fault-Tolerant Logical Qubit');
    expect(prompt).toContain('hook, bullets, and keyInsight must be in Vietnamese');
    expect(SYSTEM_PROMPT).toContain('never translate or rewrite it');
    expect(SYSTEM_PROMPT).toContain('natural Vietnamese');
  });
});
