import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ArnService } from './arn.service';
import { ArnDTO } from './dto/arn.dto';
import { Row } from './models/row';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly arnService: ArnService,
  ) {}

  @Get()
  health(): string {
    return this.appService.health();
  }

  @Post()
  analyzeArn(@Body() { arn }: ArnDTO) {
    const isMutation = this.arnService.isMutationdArn(arn);

    const rows: Row[] = arn.map((row, row_index) => ({
      cols: row.map((value, col_index) => ({ value, index: col_index })),
      index: row_index,
    }));

    return this.arnService.create({
      created_at: new Date(),
      is_mutation: isMutation,
      size: arn.length,
      rows,
    });
  }

  @Get('stats')
  stats() {
    return this.arnService.stats();
  }
}
