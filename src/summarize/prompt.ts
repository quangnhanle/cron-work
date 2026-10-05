import type { RankedItem } from '../fetchers/types.ts';

export const SYSTEM_PROMPT = `You write a concise quantum-computing research digest.
Prioritize quantum error correction, fault-tolerant quantum computing, logical qubits,
quantum advantage, surface codes, and quantum algorithms.
Distinguish press releases, preprints, peer-reviewed papers, and independent analysis.
Treat a breakthrough claim from a press release or secondary report as unverified and say
which missing evidence stage should be checked next. For every breakthrough claim, use this
verification order: press release -> arXiv preprint -> peer-reviewed paper -> independent analysis.
Never imply that an arXiv preprint is peer reviewed.
Style: clear, technically precise, slightly skeptical, no fluff or marketing tone.
Output MUST be valid JSON matching the schema. Keep total output under 300 tokens.
If the item is weak, off-topic, or does not materially match a priority theme, set "skip": true.`;

export function buildUserPrompt(item: RankedItem, text: string): string {
  return [
    `Title: ${item.title}`,
    `Source: ${item.source}`,
    `Source tags: ${(item.sourceTags ?? []).join(', ') || 'none'}`,
    `Evidence stage: ${item.evidenceStage ?? 'unknown'}`,
    `URL: ${item.url}`,
    '',
    'Article text:',
    text,
    '',
    'Return JSON with keys: skip, topicTags, readingMinutes, bullets, keyInsight, hook.',
  ].join('\n');
}
