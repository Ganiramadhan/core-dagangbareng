import { Test, TestingModule } from '@nestjs/testing';
import { ShopApiController } from './shop-api.controller';
import { ShopApiService } from './shop-api.service';

describe('ShopApiController', () => {
  let shopApiController: ShopApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopApiController],
      providers: [ShopApiService],
    }).compile();

    shopApiController = module.get<ShopApiController>(ShopApiController);
  });

  it('should be defined', () => {
    expect(shopApiController).toBeDefined();
  });

  // Tambahan contoh test method jika kamu punya endpoint spesifik
  // it('should return all shops', async () => {
  //   const result = []; // bisa mock hasilnya nanti
  //   jest.spyOn(shopApiController, 'getShops').mockResolvedValue(result);
  //   expect(await shopApiController.getShops()).toBe(result);
  // });
});
