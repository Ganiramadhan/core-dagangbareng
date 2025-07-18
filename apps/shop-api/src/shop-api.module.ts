import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopApiController } from './shop-api.controller';
import { ShopApiService } from './shop-api.service';
import { Shop } from './entities/shop.entity';
import { TypeOrmCustomLogger } from './logger';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../auth-api/src/jwt.strategy';

// 🌱 Setup .env path
const envPath = resolve(
  process.cwd(),
  'apps',
  'shop-api',
  'src',
  'common',
  'envs',
  `${process.env.NODE_ENV || 'development'}.env`,
);

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`✅ ENV Shop Loaded from: ${envPath}`);
} else {
  console.error(`❌ ENV file not found at: ${envPath}`);
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envPath,
      isGlobal: true,
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [Shop],
        autoLoadEntities: true,
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
        logger:
          process.env.NODE_ENV === 'development'
            ? new TypeOrmCustomLogger()
            : 'advanced-console',
      }),
    }),

    TypeOrmModule.forFeature([Shop]),
  ],
  controllers: [ShopApiController],
  providers: [ShopApiService, JwtStrategy],
})
export class ShopApiModule {}
