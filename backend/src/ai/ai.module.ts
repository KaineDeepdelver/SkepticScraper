import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  providers: [AiService],
  controllers: [AiController],
  imports: [ScrapingModule],
})
export class AiModule {}
