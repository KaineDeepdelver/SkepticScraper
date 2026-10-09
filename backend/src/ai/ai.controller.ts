import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { ScrapingService } from '../scraping/scraping.service';

@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly scrapingService: ScrapingService
    ) {}

    @Get('daily-summary')
    async getDailySummary() {
        const articles = await this.scrapingService.fetchFeed
        ('https://feeds.bbci.co.uk/news/rss.xml', 'BBC News');

        const articleTexts = articles.map(
            (article) =>
                `Title: ${article.title}\n
                Source: ${article.source}\n
                Published At: ${article.publishedAt}\n
                Description: ${article.description}\n
                URL: ${article.url}`
        );

        const summary = await this.aiService.summarizeNews(articleTexts);
        return {
            generatedAt: new Date().toISOString(),
            articlesCount: articles.length,
            summary,
        };
    }
}