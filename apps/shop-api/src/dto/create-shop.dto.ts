import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShopDto {
  @ApiProperty({
    example: 'd4da1030-83e6-4238-99cf-b87208e33dec',
    description: 'UUID of the user who owns the shop',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 'Toko Bangunan Sejahtera',
    description: 'The name of the shop',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/logo.jpg',
    description: 'URL to the shop logo image',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: '6281234567890',
    description: 'WhatsApp contact number of the shop',
  })
  @IsOptional()
  @IsString()
  contactWhatsapp?: string;

  @ApiPropertyOptional({
    example: 'Menjual berbagai kebutuhan bangunan dan alat teknik',
    description: 'A short description of the shop',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'tokosejahtera',
    description: 'Subdomain assigned to the shop',
  })
  @IsOptional()
  @IsString()
  subdomain?: string;
}
