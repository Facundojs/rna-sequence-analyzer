import { Test, TestingModule } from '@nestjs/testing';
import { ArnService } from './arn.service';

describe('ArnService', () => {
  let service: ArnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArnService],
    }).compile();

    service = module.get<ArnService>(ArnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
