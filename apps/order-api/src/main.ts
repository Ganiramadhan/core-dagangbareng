import { NestFactory } from '@nestjs/core';
import { OrderApiModule } from './order-api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(OrderApiModule);
  const logger = new Logger('Bootstrap');

  // ✅ Safely retrieve environment variables
  const configService = app.get(ConfigService);
  const port: number = parseInt(configService.get('PORT') || '3001', 10);
  const nodeEnv: string =
    configService.get<string>('NODE_ENV') || 'development';

  // ✅ Enable CORS for frontend integration
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // ✅ Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Setup Swagger docs in development only
  if (nodeEnv === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Order API')
      .setDescription('API for managing orders and order items')
      .setVersion('1.0')
      .addTag('Orders')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);
  }

  // ✅ Start the server
  await app.listen(port);
  logger.log(`🚀 Order API is running at: http://localhost:${port}`);
  if (nodeEnv === 'development') {
    logger.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
  }
}

void bootstrap();
