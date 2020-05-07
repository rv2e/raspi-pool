import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { Test } from '@nestjs/testing';
import { Gpio } from 'onoff';
import { MotorService } from './motor.service';

jest.mock('onoff');
describe('MotorService', () => {
  let motorService: MotorService;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    motorService = app.get(MotorService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('sets the motor on', () => {
    expect(Gpio).not.toHaveBeenCalled();
    expect(motorService.on('heating')).toBeUndefined();
    expect(Gpio).toHaveBeenCalledTimes(1);
    expect(Gpio).toHaveBeenCalledWith(29, 'high');
  });

  it('sets the motor off', () => {
    expect(Gpio).not.toHaveBeenCalled();
    expect(motorService.off('heating')).toBeUndefined();
    expect(Gpio).toHaveBeenCalledTimes(1);
    expect(Gpio).toHaveBeenCalledWith(29, 'low');
  });

  it('reads the motor', () => {
    (Gpio.prototype.readSync as jest.Mock<any>).mockReturnValue(1);
    expect(Gpio).not.toHaveBeenCalled();
    expect(motorService.read('heating')).toEqual(1);
    expect(Gpio).toHaveBeenCalledTimes(1);
    expect(Gpio).toHaveBeenCalledWith(29, 'in');
    expect(
      (Gpio as jest.Mocked<any>).mock.instances[0].readSync,
    ).toHaveBeenCalledTimes(1);
    expect(
      (Gpio as jest.Mocked<any>).mock.instances[0].readSync,
    ).toHaveBeenCalledWith();
  });

  it('returns 0 when reading the motor fails', () => {
    (Gpio.prototype.readSync as jest.Mock<any>).mockImplementation(() => {
      throw new Error('FAKE');
    });
    expect(Gpio).not.toHaveBeenCalled();
    expect(motorService.read('heating')).toEqual(0);
    expect(Gpio).toHaveBeenCalledTimes(1);
    expect(Gpio).toHaveBeenCalledWith(29, 'in');
    expect(
      (Gpio as jest.Mocked<any>).mock.instances[0].readSync,
    ).toHaveBeenCalledTimes(1);
    expect(
      (Gpio as jest.Mocked<any>).mock.instances[0].readSync,
    ).toHaveBeenCalledWith();
  });
});
