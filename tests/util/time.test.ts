import { describe, expect, it } from 'vitest';
import { formatDigestHeading } from '../../src/util/time.ts';

describe('formatDigestHeading', () => {
  it('uses a Vietnamese digest label', () => {
    const heading = formatDigestHeading(
      new Date('2026-10-05T00:00:00.000Z'),
      'Asia/Ho_Chi_Minh',
    );

    expect(heading.label).toBe('Bản tin sáng');
    expect(heading.when).toContain('ICT');
  });
});
