import { describe, expect, it } from 'vitest';
import { isRssSourceDue, type RssSourceConfig } from '../src/config.ts';

const source: RssSourceConfig = {
  id: 'weekly',
  url: 'https://example.com/feed',
  weight: 1,
  days: ['sun'],
};

describe('isRssSourceDue', () => {
  it('uses the configured timezone when evaluating weekdays', () => {
    const sundayInSaigon = new Date('2026-10-03T17:30:00.000Z');
    expect(isRssSourceDue(source, 'Asia/Ho_Chi_Minh', sundayInSaigon)).toBe(true);
    expect(isRssSourceDue(source, 'America/Los_Angeles', sundayInSaigon)).toBe(false);
  });

  it('runs sources without an explicit weekday schedule', () => {
    expect(isRssSourceDue({ ...source, days: undefined }, 'Asia/Ho_Chi_Minh')).toBe(true);
  });
});
