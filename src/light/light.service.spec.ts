import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { Test } from '@nestjs/testing';
import rpio from 'rpio';
import { LightService } from './light.service';

jest.mock('rpio');
describe('LightService', () => {
  let lightService: LightService;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    lightService = app.get(LightService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('sets the light on', () => {
    expect(rpio.open).not.toHaveBeenCalled();
    expect(lightService.on('tree')).toBeUndefined();
    expect(rpio.open).toHaveBeenCalledTimes(1);
    expect(rpio.open).toHaveBeenCalledWith(14, 1, 1);
  });

  it('sets the light off', () => {
    expect(rpio.open).not.toHaveBeenCalled();
    expect(lightService.off('tree')).toBeUndefined();
    expect(rpio.open).toHaveBeenCalledTimes(1);
    expect(rpio.open).toHaveBeenCalledWith(14, 1, 0);
  });
});
