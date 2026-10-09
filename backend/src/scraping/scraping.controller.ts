import { Controller, Get } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
    constructor(private readonly scrapingService: ScrapingService) {}

    @Get('bbc')
    fetchBbcNews() {
        return this.scrapingService.fetchFeed('https://feeds.bbci.co.uk/news/rss.xml', 'BBC News');
    }
}