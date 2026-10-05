import Parser from 'rss-parser';
import type { RssSourceConfig } from '../config.ts';
import type { RawItem } from './types.ts';
import { stableHash } from '../util/hash.ts';

const parser = new Parser({
  timeout: 12_000,
  headers: {
    'user-agent': 'news-bot/0.1 (+https://github.com/binhvc/news-bot)',
    accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
  },
});

export async function fetchRssSource(source: RssSourceConfig): Promise<RawItem[]> {
  if (source.enabled === false) return [];
  const feed = await parser.parseURL(source.url);
  return (feed.items ?? [])
    .map((entry) => {
      const url = entry.link?.trim();
      if (!url) return null;
      const guid = entry.guid?.trim() || stableHash(url);
      const snippet = (entry.contentSnippet || entry.summary || entry.content || '')
        .toString()
        .slice(0, 5_000);
      const rawContent = (entry['content:encoded'] || entry.content || entry.summary || '')
        .toString();
      const item: RawItem = {
        id: `rss:${source.id}:${guid}`,
        url,
        title: entry.title?.trim() || url,
        source: `rss:${source.id}`,
        publishedAt: entry.isoDate || entry.pubDate,
        snippet,
        rawContent,
        contentMode: source.contentMode,
        sourceTags: source.tags,
        evidenceStage: source.evidenceStage,
      };
      return item;
    })
    .filter((x): x is RawItem => x !== null);
}

export async function fetchAllRss(sources: RssSourceConfig[]): Promise<RawItem[]> {
  const settled = await Promise.allSettled(sources.map((s) => fetchRssSource(s)));
  const items: RawItem[] = [];
  for (const result of settled) {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    } else {
      console.warn('RSS source failed:', result.reason);
    }
  }
  return items;
}
