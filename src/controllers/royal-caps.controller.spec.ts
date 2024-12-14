import { Test, TestingModule } from '@nestjs/testing';
import { RoyalCapsController } from './royal-caps.controller';

describe('RoyalCapsController', () => {
  let controller: RoyalCapsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoyalCapsController],
    }).compile();

    controller = module.get<RoyalCapsController>(RoyalCapsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
