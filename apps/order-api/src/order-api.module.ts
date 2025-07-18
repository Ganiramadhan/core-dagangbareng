import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderApiController } from './order-api.controller';
import { OrderApiService } from './order-api.service';
import { TypeOrmCustomLogger } from './logger';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../auth-api/src/jwt.strategy';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../../product-api/src/entities/product.entity';
import { Shop } from '../../shop-api/src/entities/shop.entity'; // ✅ Import Shop entity

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
  console.log(`✅ ENV Order Loaded from: ${envPath}`);
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
        entities: [Order, OrderItem, Product, Shop],
        autoLoadEntities: true,
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
        logger:
          process.env.NODE_ENV === 'development'
            ? new TypeOrmCustomLogger()
            : 'advanced-console',
      }),
    }),

    TypeOrmModule.forFeature([Order, OrderItem, Product, Shop]),
  ],
  controllers: [OrderApiController],
  providers: [OrderApiService, JwtStrategy],
})
export class OrderApiModule {}
