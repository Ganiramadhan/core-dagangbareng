import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ShopApiService } from './shop-api.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Shop } from './entities/shop.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Shops')
@Controller('shops')
export class ShopApiController {
  constructor(private readonly shopService: ShopApiService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shops (public)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved shops.' })
  getShops(): Promise<Shop[]> {
    return this.shopService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shop by ID' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiResponse({ status: 200, description: 'Shop found' })
  getShop(@Param('id', ParseIntPipe) id: number): Promise<Shop> {
    return this.shopService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new shop' })
  @ApiResponse({ status: 201, description: 'Shop successfully created.' })
  createShop(@Body() dto: CreateShopDto): Promise<Shop> {
    return this.shopService.createShop(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing shop' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiResponse({ status: 200, description: 'Shop successfully updated.' })
  updateShop(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShopDto,
  ): Promise<Shop> {
    return this.shopService.updateShop(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a shop by ID' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiResponse({
    status: 200,
    description: 'Shop successfully deleted.',
    schema: {
      example: { message: 'Shop deleted successfully' },
    },
  })
  async deleteShop(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.shopService.deleteShop(id);
  }
}
