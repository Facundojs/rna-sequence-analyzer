import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { configService } from '../src/config.service';
import { AppController } from '../src/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArnService } from '../src/arn.service';
import { AppService } from '../src/app.service';
import { ConfigModule } from '@nestjs/config';
import { Matrix } from '../src/models/matrix';
import { Col } from '../src/models/col';
import { Row } from '../src/models/row';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Matrix, Col, Row]),
        ConfigModule.forRoot(),
      ],
      controllers: [AppController],
      providers: [AppService, ArnService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('App running!');
  });

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({
        arn: [
          ['A', 'B', 'C'],
          ['D', 'B', 'F'],
          ['A', 'H', 'I'],
        ],
      })
      .expect(201)
      .expect((res) => {
        const { created_at, id, is_mutation, size, rows } = res.body;

        expect(created_at).toBeDefined();
        expect(id).toBeDefined();
        expect(is_mutation).toBe(false);
        expect(size).toBe(3);
        expect(rows).toEqual([
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
        ]);
      });
  });

  it('/ (POST) with invalid matrix', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({
        arn: [['D', 'B'], ['A']],
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          message: [
            'arn must be a square matrix of single-character uppercase strings',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
      });
  });

  it('/stats (GET)', () => {
    return request(app.getHttpServer())
      .get('/stats')
      .expect(200)
      .expect((res) => {
        const { ratio, mutated, total } = res.body;
        expect(typeof mutated).toBe('number');
        expect(typeof ratio).toBe('number');
        expect(typeof total).toBe('number');
      });
  });
});
