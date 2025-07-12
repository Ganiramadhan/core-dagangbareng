import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the shop that owns the product',
  })
  @IsNotEmpty()
  @IsNumber()
  shopId: number;

  @ApiProperty({
    example: 'Premium Chair',
    description: 'The name of the product',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Ergonomic office chair with lumbar support',
    description: 'A short description of the product',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 750000,
    description: 'The price of the product in IDR (Indonesian Rupiah)',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Number of items available in stock',
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiPropertyOptional({
    example: 'https://example.com/images/product.jpg',
    description: 'URL to the product image',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the product is active or not',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
