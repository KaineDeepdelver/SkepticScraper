import { Injectable, Logger } from '@nestjs/common';
import Parser from 'rss-parser';
import { Article } from '../articles/interfaces/article.interface';

@Injectable()
export class ScrapingService {
    private readonly logger = new Logger(ScrapingService.name);
    private readonly parser = new Parser();

    private readonly feeds = [
        {
            name: 'BBC News',
            url: 'https://feeds.bbci.co.uk/news/rss.xml',
        },
        {
            name: 'The Guardian',
            url: 'https://www.theguardian.com/world/rss',
        },
        {
            name: 'Al Jazeera',
            url: 'https://www.aljazeera.com/xml/rss/all.xml',
        },
        {
            name: 'NPR',
            url: 'https://feeds.npr.org/1001/rss.xml',
        },
        {
            name: 'TechCrunch',
            url: 'https://techcrunch.com/feed/',
        },
        {
            name: 'Ars Technica',
            url: 'https://feeds.arstechnica.com/arstechnica/index',
        },
        {
            name: 'The Verge',
            url: 'https://www.theverge.com/rss/index.xml',
        },
    ];

    async fetchFeed(feedUrl: string, sourceName: string): Promise<Article[]> {

        const feed = await this.parser.parseURL(feedUrl)

        return feed.items
            .filter(item => Boolean(item.link))
            .map(item => ({
                title: item.title ?? 'Untitled',
                url: item.link ?? '',
                source: sourceName,
                publishedAt: item.isoDate ?? null,
                description: item.contentSnippet ?? item.content ?? ','
            }));

    }

    async fetchAllfeeds(): Promise<Article[]> {
        const result = await Promise.allSettled(
            this.feeds.map(feed =>
                this.fetchFeed(feed.url, feed.name),
            ),
        );

        const articles: Article[] = [];

        result.forEach((settledResult, index) => {
            if (settledResult.status === 'fulfilled') {
                articles.push(...settledResult.value);
            } else {
                this.logger.warn(
                    `Could not fetch ${this.feeds[index].name}: ${String(settledResult.reason)}`,
                );
            }
        });

        const uniqueArticles = new Map<string, Article>();

        for (const article of articles) {
            const key = article.url.split('#')[0].replace(/\/$/, '');

            if (key && !uniqueArticles.has(key)) {
                uniqueArticles.set(key, article);
            }
        }

        return [...uniqueArticles.values()];
    }



}