import type { ArticleSummary } from '../fetchers/types.ts';

export interface ArticleFormatOptions {
  index?: number;
  total?: number;
}

export function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function formatSource(source: string): string {
  if (source === 'hn') return 'Hacker News';

  return source
    .replace(/^rss:/, '')
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatTag(tag: string): string {
  return `#${tag.trim().replace(/[\s-]+/g, '_')}`;
}

export function formatHeader(input: {
  emoji: string;
  label: string;
  when: string;
  count: number;
}): string {
  const articleLabel = 'bài đáng đọc';

  return [
    `${input.emoji} <b>${escapeHtml(input.label)}</b>`,
    `🗓 ${escapeHtml(input.when)}`,
    '',
    `📚 <b>${input.count} ${articleLabel}</b> về điện toán lượng tử`,
    '<i>Thông tin mới, cô đọng và tập trung vào bằng chứng.</i>',
  ].join('\n');
}

export function formatArticle(
  summary: ArticleSummary,
  options: ArticleFormatOptions = {},
): string {
  const position =
    options.index && options.total ? `${options.index}/${options.total} · ` : '';
  const tags = summary.topicTags
    .slice(0, 3)
    .map(formatTag)
    .map(escapeHtml)
    .join('  ');
  const bullets = summary.bullets
    .slice(0, 5)
    .map((bullet) => `• ${escapeHtml(bullet)}`)
    .join('\n');
  const metadata = [
    `📰 ${escapeHtml(formatSource(summary.item.source))}`,
    `⏱ ${summary.readingMinutes} phút đọc`,
  ];

  if (summary.item.points) {
    metadata.push(`▲ ${summary.item.points} HN points`);
  }

  const lines = [
    `📌 <b>${position}${escapeHtml(summary.item.title)}</b>`,
    metadata.join('  ·  '),
  ];

  if (tags) lines.push(`🏷 ${tags}`);
  if (summary.hook?.trim()) {
    lines.push('', `<i>${escapeHtml(summary.hook.trim())}</i>`);
  }

  lines.push(
    '',
    '<b>Điểm chính</b>',
    bullets,
    '',
    '💡 <b>Vì sao đáng chú ý</b>',
    `<i>${escapeHtml(summary.keyInsight)}</i>`,
  );

  return lines.join('\n');
}

export function buildArticleKeyboard(summary: ArticleSummary): {
  inline_keyboard: { text: string; url: string }[][];
} {
  const row: { text: string; url: string }[] = [
    { text: '📖 Đọc bài', url: summary.item.url },
  ];
  if (summary.item.discussionUrl) {
    row.push({ text: '💬 Thảo luận HN', url: summary.item.discussionUrl });
  }
  return { inline_keyboard: [row] };
}
