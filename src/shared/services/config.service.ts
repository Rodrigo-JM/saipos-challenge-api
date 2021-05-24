import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class ConfigService {
  constructor() {
    dotenv.config({
      path: `.env`,
    });
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    const entities = [__dirname + '/../../**/*.entity{.ts,.js}'];
    const migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      keepConnectionAlive: true,
      type: 'mysql',
      host: this.get('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT'),
      username: this.get('DATABASE_USERNAME'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_DATABASE'),
      logging: true,
    };
  }
}
