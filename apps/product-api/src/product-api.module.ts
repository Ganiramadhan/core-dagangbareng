import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductApiController } from './product-api.controller';
import { ProductApiService } from './product-api.service';
import { Product } from './entities/product.entity';
import { TypeOrmCustomLogger } from './logger';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../auth-api/src/jwt.strategy';

// 🌱 Setup .env path
const envPath = resolve(
  process.cwd(),
  'apps',
  'product-api',
  'src',
  'common',
  'envs',
  `${process.env.NODE_ENV || 'development'}.env`,
);

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`✅ ENV Loaded from: ${envPath}`);
} else {
  console.error(`❌ ENV file not found at: ${envPath}`);
}

@Module({
  imports: [
    // ✅ Load env as global config
    ConfigModule.forRoot({
      envFilePath: envPath,
      isGlobal: true,
    }),

    // ✅ Passport & JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
    }),

    // ✅ Database connection
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [Product],
        autoLoadEntities: true,
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
        logger:
          process.env.NODE_ENV === 'development'
            ? new TypeOrmCustomLogger()
            : 'advanced-console',
      }),
    }),

    // ✅ Entity registration
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductApiController],
  providers: [ProductApiService, JwtStrategy],
})
export class ProductApiModule {}
