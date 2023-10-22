import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Matrix } from './models/matrix';
import { Row } from './models/row';
import { Col } from './models/col';
import { config } from 'dotenv';

config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    const isTestingEnv = this.getValue('TS_JEST', false);

    if (isTestingEnv)
      return {
        port: 5434,
        password: 'postgres',
        username: 'postgres',
        database: 'postgres',
        host: 'localhost',
        entities: [Row, Col, Matrix],
        type: 'postgres',
      };

    return {
      port: parseInt(this.getValue('DATABASE_PORT')),
      password: this.getValue('DATABASE_PASSWORD'),
      username: this.getValue('DATABASE_USER'),
      database: this.getValue('DATABASE_NAME'),
      host: this.getValue('DATABASE_HOST'),
      entities: [Row, Col, Matrix],
      type: 'postgres',
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DATABASE_PASSWORD',
  'DATABASE_USER',
  'DATABASE_NAME',
  'DATABASE_PORT',
  'DATABASE_HOST',
]);

export { configService };
