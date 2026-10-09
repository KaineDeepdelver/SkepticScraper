import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SourcesModule } from './sources/sources.module';
import { ArticlesModule } from './articles/articles.module';
import { ScrapingModule } from './scraping/scraping.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [SourcesModule, ArticlesModule, ScrapingModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
