import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the shop placing the order',
  })
  @IsNotEmpty()
  @IsInt()
  shopId: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Customer full name',
  })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({
    example: '6281234567890',
    description: 'Customer phone number',
  })
  @IsNotEmpty()
  @IsString()
  customerPhone: string;

  @ApiProperty({
    example: 'Jl. Merdeka No. 123, Jakarta',
    description: 'Customer address',
  })
  @IsNotEmpty()
  @IsString()
  customerAddress: string;

  @ApiProperty({
    example: 'pending',
    description: 'Order status (e.g., pending, completed)',
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}
