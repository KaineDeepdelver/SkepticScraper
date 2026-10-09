import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { SourcesService } from './sources.service';

@Controller('sources')
export class SourcesController {
    constructor(private readonly sourcesService: SourcesService) {}

    @Get()
    findAll() {
        return this.sourcesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        const source = this.sourcesService.findOne(id);
        
        if (!source) {
            throw new NotFoundException(`Source with ID ${id} not found`);
        }
        return source;
    }
}
