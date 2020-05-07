import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { Test } from '@nestjs/testing';
import { Gpio } from 'onoff';
import { LightService } from './light.service';

jest.mock('onoff');
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
    expect(Gpio).not.toHaveBeenCalled();
    expect(lightService.on('tree')).toBeUndefined();
    expect(Gpio).toHaveBeenCalledTimes(1);
    expect(Gpio).toHaveBeenCalledWith(14, 'high');
  });

  it('sets the light off', () => {
    expect(Gpio).not.toHaveBeenCalled();
    expect(lightService.off('tree')).toBeUndefined();
    expect(Gpio).toHaveBeenCalledTimes(1);
    expect(Gpio).toHaveBeenCalledWith(14, 'low');
  });

  it('reads the light', () => {
    (Gpio.prototype.readSync as jest.Mock<any>).mockReturnValue(1);
    expect(Gpio).not.toHaveBeenCalled();
    expect(lightService.read('tree')).toEqual(1);
    expect(Gpio).toHaveBeenCalledTimes(1);
    expect(Gpio).toHaveBeenCalledWith(14, '');
    expect(
      (Gpio as jest.Mocked<any>).mock.instances[0].readSync,
    ).toHaveBeenCalledTimes(1);
    expect(
      (Gpio as jest.Mocked<any>).mock.instances[0].readSync,
    ).toHaveBeenCalledWith();
  });

  it('returns 0 when reading the light fails', () => {
    (Gpio.prototype.readSync as jest.Mock<any>).mockImplementation(() => {
      throw new Error('FAKE');
    });
    expect(Gpio).not.toHaveBeenCalled();
    expect(lightService.read('tree')).toEqual(0);
    expect(Gpio).toHaveBeenCalledTimes(1);
    expect(Gpio).toHaveBeenCalledWith(14, '');
    expect(
      (Gpio as jest.Mocked<any>).mock.instances[0].readSync,
    ).toHaveBeenCalledTimes(1);
    expect(
      (Gpio as jest.Mocked<any>).mock.instances[0].readSync,
    ).toHaveBeenCalledWith();
  });
});
