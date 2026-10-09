import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { ScrapingService } from '../scraping/scraping.service';

@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly scrapingService: ScrapingService
    ) { }

    @Get('daily-summary')
    async getDailySummary() {
        const articles = await this.scrapingService.fetchFeed
            ('https://feeds.bbci.co.uk/news/rss.xml', 'BBC News');

        const today = new Date().toISOString().slice(0, 10);

        const todaysArticles = articles.filter((article) => {
            if (!article.publishedAt) return false;

            return article.publishedAt.slice(0, 10) === today;
        });

        const articleTexts = todaysArticles.map(
            (article) =>
                `Title: ${article.title}
                Source: ${article.source}
                Published At: ${article.publishedAt}
                Description: ${article.description}
                URL: ${article.url}`,
        );

        if (articleTexts.length === 0) {
            return {
                generatedAt: new Date().toISOString(),
                articlesCount: 0,
                summary: 'No articles published today were found.'
            };
        }

        const summary = await this.aiService.summarizeNews(articleTexts);
        return {
            generatedAt: new Date().toISOString(),
            articlesCount: articles.length,
            summary,
        };
    }
}