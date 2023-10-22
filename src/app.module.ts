import { AppController } from './app.controller';
import { configService } from './config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ArnService } from './arn.service';
import { Matrix } from './models/matrix';
import { Module } from '@nestjs/common';
import { Row } from './models/row';
import { Col } from './models/col';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Matrix, Col, Row]),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, ArnService],
})
export class AppModule {}
