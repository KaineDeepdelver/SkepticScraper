import { Injectable, Logger } from '@nestjs/common';
import Parser from 'rss-parser';
import { Article } from '../articles/interfaces/article.interface';

@Injectable()
export class ScrapingService {
    private readonly logger = new Logger(ScrapingService.name);
    private readonly parser = new Parser();

    async fetchFeed(feedUrl: string, sourceName: string): Promise<Article[]> {
        try {
            const feed = await this.parser.parseURL(feedUrl);

            return feed.items.map(item => ({
                title: item.title ?? 'Untitled',
                url: item.link ?? '',
                source: sourceName,
                publishedAt: item.isoDate ?? null,
                description: item.contentSnippet ?? item.content ?? '',
            
            }));
        } catch (error: unknown) {
            this.logger.error(`Failed to fetch feed from ${feedUrl}: ${ (error as Error).message }`);
            throw error;
        }   
    }
}