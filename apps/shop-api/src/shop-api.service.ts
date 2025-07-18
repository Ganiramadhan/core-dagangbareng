import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopApiService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async findAll(): Promise<Shop[]> {
    return this.shopRepository.find();
  }

  async findOne(id: number): Promise<Shop> {
    const shop = await this.shopRepository.findOneBy({ id });
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }
    return shop;
  }

  async createShop(createShopDto: CreateShopDto): Promise<Shop> {
    const existing = await this.shopRepository.findOneBy({
      subdomain: createShopDto.subdomain,
    });

    if (existing) {
      throw new BadRequestException(
        `Subdomain '${createShopDto.subdomain}' is already in use.`,
      );
    }

    const shop = this.shopRepository.create(createShopDto);
    return this.shopRepository.save(shop);
  }

  async updateShop(id: number, updateDto: UpdateShopDto): Promise<Shop> {
    const shop = await this.findOne(id);

    if (updateDto.subdomain && updateDto.subdomain !== shop.subdomain) {
      const existing = await this.shopRepository.findOneBy({
        subdomain: updateDto.subdomain,
      });

      if (existing) {
        throw new BadRequestException(
          `Subdomain '${updateDto.subdomain}' is already in use.`,
        );
      }
    }

    const updatedShop = this.shopRepository.merge(shop, updateDto);
    return this.shopRepository.save(updatedShop);
  }

  async deleteShop(id: number): Promise<{ message: string }> {
    const result = await this.shopRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }
    return { message: 'Shop deleted successfully' };
  }
}
