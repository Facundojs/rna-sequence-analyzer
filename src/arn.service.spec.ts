import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArnService } from './arn.service';
import { Matrix } from './models/matrix';
import { Arn } from './entities/arn';
import { Repository } from 'typeorm';
import { jest } from '@jest/globals';

describe('ArnService', () => {
  let matrixRepository: Repository<Matrix>;
  let service: ArnService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArnService,
        {
          provide: getRepositoryToken(Matrix),
          useValue: {
            count: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArnService>(ArnService);
    matrixRepository = module.get<Repository<Matrix>>(
      getRepositoryToken(Matrix),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a matrix', async () => {
      const matrixData = {
        created_at: new Date(),
        is_mutation: false,
        size: 3,
        rows: [
          {
            cols: [
              { value: 'A', index: 0 },
              { value: 'B', index: 1 },
              { value: 'C', index: 2 },
            ],
            index: 0,
          },
          {
            cols: [
              { value: 'D', index: 0 },
              { value: 'B', index: 1 },
              { value: 'F', index: 2 },
            ],
            index: 1,
          },
          {
            cols: [
              { value: 'A', index: 0 },
              { value: 'H', index: 1 },
              { value: 'I', index: 2 },
            ],
            index: 2,
          },
        ],
      };
      await service.create(matrixData);
      expect(matrixRepository.save).toHaveBeenCalledWith(matrixData);
    });
  });

  describe('stats', () => {
    it('should return mutation statistics', async () => {
      const total = 10;
      const mutated = 5;

      jest.spyOn(matrixRepository, 'count').mockResolvedValueOnce(total);
      jest.spyOn(matrixRepository, 'count').mockResolvedValueOnce(mutated);

      const result = await service.stats();
      expect(result).toEqual({
        ratio: mutated / total,
        mutated,
        total,
      });
    });
  });

  describe('isMutationdArn', () => {
    it('should return true for a mutation ARN', () => {
      const arn: Arn = [
        ['A', 'B', 'C'],
        ['D', 'B', 'F'],
        ['C', 'H', 'I'],
      ];
      const result = service.isMutationdArn(arn);
      expect(result).toBe(true);
    });

    it('should return false for a non-mutation ARN', () => {
      const arn: Arn = [
        ['A', 'B', 'C'],
        ['D', 'C', 'F'],
        ['C', 'H', 'I'],
      ];
      const result = service.isMutationdArn(arn);
      expect(result).toBe(false);
    });
  });
});
