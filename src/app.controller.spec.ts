import { Test, TestingModule } from '@nestjs/testing';
import { configService } from './config.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ArnService } from './arn.service';
import { Matrix } from './models/matrix';
import { ArnDTO } from './dto/arn.dto';
import { Col } from './models/col';
import { Row } from './models/row';

describe('AppController', () => {
  let appController: AppController;
  let arnService: ArnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Matrix, Col, Row]),
        ConfigModule.forRoot(),
      ],
      controllers: [AppController],
      providers: [AppService, ArnService],
    }).compile();

    appController = module.get<AppController>(AppController);
    arnService = module.get<ArnService>(ArnService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('analyzeArn', () => {
    it('should create and return a Matrix not mutated', async () => {
      const arnDTO: ArnDTO = {
        arn: [
          ['A', 'B', 'C'],
          ['D', 'B', 'F'],
          ['A', 'H', 'I'],
        ],
      };
      const result = await appController.analyzeArn(arnDTO);

      expect(result).toEqual({
        created_at: expect.any(Date),
        id: expect.any(String),
        is_mutation: false,
        size: 3,
        rows: [
          {
            cols: [
              {
                value: 'A',
                index: 0,
              },
              {
                value: 'B',
                index: 1,
              },
              {
                value: 'C',
                index: 2,
              },
            ],
            index: 0,
          },
          {
            cols: [
              {
                value: 'D',
                index: 0,
              },
              {
                value: 'B',
                index: 1,
              },
              {
                value: 'F',
                index: 2,
              },
            ],
            index: 1,
          },
          {
            cols: [
              {
                value: 'A',
                index: 0,
              },
              {
                value: 'H',
                index: 1,
              },
              {
                value: 'I',
                index: 2,
              },
            ],
            index: 2,
          },
        ],
      });
    });

    it('should create and return a Matrix not mutated', async () => {
      const arnDTO: ArnDTO = {
        arn: [
          ['A', 'B', 'C'],
          ['D', 'D', 'F'],
          ['D', 'H', 'I'],
        ],
      };
      const result = await appController.analyzeArn(arnDTO);

      expect(result).toEqual({
        created_at: expect.any(Date),
        id: expect.any(String),
        is_mutation: true,
        size: 3,
        rows: [
          {
            cols: [
              {
                value: 'A',
                index: 0,
              },
              {
                value: 'B',
                index: 1,
              },
              {
                value: 'C',
                index: 2,
              },
            ],
            index: 0,
          },
          {
            cols: [
              {
                value: 'D',
                index: 0,
              },
              {
                value: 'D',
                index: 1,
              },
              {
                value: 'F',
                index: 2,
              },
            ],
            index: 1,
          },
          {
            cols: [
              {
                value: 'D',
                index: 0,
              },
              {
                value: 'H',
                index: 1,
              },
              {
                value: 'I',
                index: 2,
              },
            ],
            index: 2,
          },
        ],
      });
    });
  });

  describe('stats', () => {
    it('should return statistics', async () => {
      const mockStats = {
        ratio: 0.5,
        mutated: 5,
        total: 10,
      };

      jest.spyOn(arnService, 'stats').mockResolvedValue(mockStats);

      const result = await appController.stats();

      expect(result).toEqual(mockStats);
    });
  });
});
