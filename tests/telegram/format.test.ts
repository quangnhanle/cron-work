import { describe, expect, it } from 'vitest';
import {
  escapeHtml,
  formatHeader,
  formatArticle,
  buildArticleKeyboard,
} from '../../src/telegram/format.ts';
import type { ArticleSummary } from '../../src/fetchers/types.ts';

describe('telegram format', () => {
  it('escapes HTML entities', () => {
    expect(escapeHtml('A <B> & C')).toBe('A &lt;B&gt; &amp; C');
  });

  it('formats header and article payloads', () => {
    const summary: ArticleSummary = {
      skip: false,
      topicTags: ['system-design', 'interview'],
      readingMinutes: 8,
      bullets: ['One <trick>', 'Two', 'Three'],
      keyInsight: 'Trade-offs beat slogans.',
      hook: 'A practical guide to scaling safely.',
      item: {
        id: 'hn:1',
        url: 'https://example.com/a',
        title: 'Design & Scale',
        source: 'hn',
        score: 12,
        points: 128,
        discussionUrl: 'https://news.ycombinator.com/item?id=1',
      },
    };

    const header = formatHeader({
      emoji: '☀️',
      label: 'Morning Digest',
      when: 'Thu 24 Sep, 07:00 ICT',
      count: 1,
    });
    expect(header).toContain('☀️ <b>Morning Digest</b>');
    expect(header).toContain('🗓 Thu 24 Sep, 07:00 ICT');
    expect(header).toContain('📚 <b>1 bài đáng đọc</b> dành cho kỹ sư phần mềm');

    const body = formatArticle(summary, { index: 1, total: 6 });
    expect(body).toContain('📌 <b>1/6 · Design &amp; Scale</b>');
    expect(body).toContain('📰 Hacker News  ·  ⏱ 8 phút đọc  ·  ▲ 128 HN points');
    expect(body).toContain('🏷 #system_design  #interview');
    expect(body).toContain('<i>A practical guide to scaling safely.</i>');
    expect(body).toContain('• One &lt;trick&gt;');
    expect(body).toContain('<b>Điểm chính</b>');
    expect(body).toContain('💡 <b>Vì sao đáng chú ý</b>');

    const keyboard = buildArticleKeyboard(summary);
    expect(keyboard).toEqual({
      inline_keyboard: [
        [
          { text: '📖 Đọc bài', url: 'https://example.com/a' },
          { text: '💬 Thảo luận HN', url: 'https://news.ycombinator.com/item?id=1' },
        ],
      ],
    });
  });
});
