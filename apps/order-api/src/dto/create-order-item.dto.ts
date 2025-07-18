import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the order this item belongs to',
  })
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @ApiProperty({
    example: 101,
    description: 'The ID of the product being ordered',
  })
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product ordered',
  })
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty({
    example: 15000,
    description: 'Price per unit of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
