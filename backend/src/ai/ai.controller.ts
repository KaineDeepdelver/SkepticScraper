import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { ScrapingService } from '../scraping/scraping.service';

@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly scrapingService: ScrapingService,
    ) {}

    @Get('daily-summary')
    async getDailySummary(
        @Query('language') language?: string,
    ) {
        const selectedLanguage = language === 'ar' ? 'ar' : 'en';

        const articles = await this.scrapingService.fetchAllfeeds();
        const today = new Date().toISOString().slice(0, 10);

        const todaysArticles = articles.filter((article) => {
            if (!article.publishedAt) return false;
            return article.publishedAt.slice(0, 10) === today;
        });

        const articleTexts = todaysArticles.map((article) =>
            `Title: ${article.title}
Source: ${article.source}
Published At: ${article.publishedAt}
Description: ${article.description}
URL: ${article.url}`.trim(),
        );

        if (articleTexts.length === 0) {
            return {
                generatedAt: new Date().toISOString(),
                articlesCount: 0,
                sourcesCount: 0,
                sources: [],
                summary:
                    selectedLanguage === 'ar'
                        ? 'لم يتم العثور على مقالات منشورة اليوم.'
                        : 'No articles published today were found.',
            };
        }

        const summary = await this.aiService.summarizeNews(
            articleTexts,
            selectedLanguage,
        );

        return {
            generatedAt: new Date().toISOString(),
            articlesCount: todaysArticles.length,
            sourcesCount: new Set(
                todaysArticles.map((article) => article.source),
            ).size,
            sources: [
                ...new Set(todaysArticles.map((article) => article.source)),
            ],
            summary,
        };
    }
}