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
import { OrderApiService } from './order-api.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Orders')
@Controller('orders')
export class OrderApiController {
  constructor(private readonly orderService: OrderApiService) {}

  // 🔹 Get all orders
  @Get()
  @ApiOperation({ summary: 'Get all orders (public)' })
  @ApiResponse({ status: 200, type: [Order] })
  getOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  // 🔹 Get specific order
  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiResponse({ status: 200, type: Order })
  getOrder(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  // 🔹 Create new order
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, type: Order })
  createOrder(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(dto);
  }

  // 🔹 Update order
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiResponse({ status: 200, type: Order })
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.updateOrder(id, dto);
  }

  // 🔹 Delete order
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({ name: 'id', type: 'integer' })
  @ApiResponse({
    status: 200,
    description: 'Order successfully deleted',
    schema: {
      example: { message: 'Order deleted successfully' },
    },
  })
  deleteOrder(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.orderService.deleteOrder(id);
  }

  // 🔹 Get all items for an order
  @Get(':orderId/items')
  @ApiOperation({ summary: 'Get all items in an order' })
  @ApiParam({ name: 'orderId', type: 'integer' })
  @ApiResponse({ status: 200, type: [OrderItem] })
  getOrderItems(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderItem[]> {
    return this.orderService.getOrderItems(orderId);
  }

  // 🔹 Add new item to order
  @Post(':orderId/items')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new item to an order' })
  @ApiParam({ name: 'orderId', type: 'integer' })
  @ApiResponse({ status: 201, type: OrderItem })
  createOrderItem(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    return this.orderService.createOrderItem(orderId, dto);
  }

  // 🔹 Update item in order
  @Patch(':orderId/items/:itemId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an order item' })
  @ApiParam({ name: 'orderId', type: 'integer' })
  @ApiParam({ name: 'itemId', type: 'integer' })
  @ApiResponse({ status: 200, type: OrderItem })
  updateOrderItem(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    return this.orderService.updateOrderItem(orderId, itemId, dto);
  }

  // 🔹 Delete item from order
  @Delete(':orderId/items/:itemId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiParam({ name: 'orderId', type: 'integer' })
  @ApiParam({ name: 'itemId', type: 'integer' })
  @ApiResponse({
    status: 200,
    description: 'Order item deleted',
    schema: {
      example: { message: 'Order item deleted successfully' },
    },
  })
  deleteOrderItem(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<{ message: string }> {
    return this.orderService.deleteOrderItem(orderId, itemId);
  }
}
