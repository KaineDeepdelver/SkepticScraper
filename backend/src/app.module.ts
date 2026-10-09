import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SourcesModule } from './sources/sources.module';
import { ArticlesModule } from './articles/articles.module';
import { ScrapingModule } from './scraping/scraping.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true, }),
    SourcesModule,
    ArticlesModule,
    ScrapingModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
  export class AppModule {}