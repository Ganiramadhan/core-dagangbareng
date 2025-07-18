import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../../product-api/src/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderApiService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly itemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // 🔹 ORDER MAIN CRUD

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items'], // Include items if needed
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async updateOrder(id: number, updateDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    const updated = this.orderRepository.merge(order, updateDto);
    return this.orderRepository.save(updated);
  }

  async deleteOrder(id: number): Promise<{ message: string }> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return { message: 'Order deleted successfully' };
  }

  // 🔹 ORDER ITEM MANAGEMENT

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    await this.findOne(orderId); // Validasi order
    return this.itemRepository.find({ where: { orderId } });
  }

  async createOrderItem(
    orderId: number,
    dto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    await this.findOne(orderId); // Validasi order

    // Validasi produk
    const product = await this.productRepository.findOneBy({
      id: dto.productId,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    // Validasi stok
    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Insufficient stock for product ID ${dto.productId}`,
      );
    }

    // Kurangi stok
    product.stock -= dto.quantity;
    await this.productRepository.save(product);

    const newItem = this.itemRepository.create({ ...dto, orderId });
    return this.itemRepository.save(newItem);
  }

  async updateOrderItem(
    orderId: number,
    itemId: number,
    dto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    await this.findOne(orderId);
    const item = await this.itemRepository.findOneBy({ id: itemId, orderId });
    if (!item) {
      throw new NotFoundException(`Order item not found`);
    }

    const updated = this.itemRepository.merge(item, dto);
    return this.itemRepository.save(updated);
  }

  async deleteOrderItem(
    orderId: number,
    itemId: number,
  ): Promise<{ message: string }> {
    await this.findOne(orderId);
    const item = await this.itemRepository.findOneBy({ id: itemId, orderId });
    if (!item) {
      throw new NotFoundException(`Order item not found`);
    }

    // Restock produk saat item dihapus
    const product = await this.productRepository.findOneBy({
      id: item.productId,
    });
    if (product) {
      product.stock += item.quantity;
      await this.productRepository.save(product);
    }

    await this.itemRepository.delete({ id: itemId, orderId });

    return { message: 'Order item deleted successfully' };
  }
}
