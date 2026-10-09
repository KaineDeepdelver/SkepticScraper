import { Injectable } from '@nestjs/common';

export interface NewsSource {
    id: number;
    name: string;
    url: string;
    category: string;
}

@Injectable()
export class SourcesService {
    private readonly sources: NewsSource[] = [
        { id: 1, name: 'BBC News', url: 'https://www.bbc.com/news', category: 'General' },
        { id: 2, name: 'CNN', url: 'https://www.cnn.com', category: 'General' },
        { id: 3, name: 'TechCrunch', url: 'https://techcrunch.com', category: 'Technology' },
        { id: 4, name: 'ESPN', url: 'https://www.espn.com', category: 'Sports' },
        { id: 5, name: 'The Verge', url: 'https://www.theverge.com', category: 'Technology' },
        { id: 6, name: 'CoinDesk', url: 'https://www.coindesk.com', category: 'Finance' },
    ];

    findAll(): NewsSource[] {
        return this.sources;
    }

    findOne(id: number): NewsSource | undefined {
        return this.sources.find(source => source.id === id);
    }
}
