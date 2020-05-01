import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { Test } from '@nestjs/testing';
import rpio from 'rpio';
import { MotorService } from './motor.service';

jest.mock('rpio');
describe('MotorService', () => {
  let motorService: MotorService;
  let app: INestApplication;

  beforeEach(async () => {
    (rpio.read as jest.Mock).mockReturnValue(1);
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
    expect(rpio.open).not.toHaveBeenCalled();
    expect(motorService.on('heating')).toBeUndefined();
    expect(rpio.open).toHaveBeenCalledTimes(1);
    expect(rpio.open).toHaveBeenCalledWith(29, 1, 1);
  });

  it('sets the motor off', () => {
    expect(rpio.open).not.toHaveBeenCalled();
    expect(motorService.off('heating')).toBeUndefined();
    expect(rpio.open).toHaveBeenCalledTimes(1);
    expect(rpio.open).toHaveBeenCalledWith(29, 1, 0);
  });

  it('reads the motor', () => {
    expect(rpio.read).not.toHaveBeenCalled();
    expect(motorService.read('heating')).toEqual(1);
    expect(rpio.read).toHaveBeenCalledTimes(1);
    expect(rpio.read).toHaveBeenCalledWith(29);
  });
  it('returns 0 when reading the motor fails', () => {
    (rpio.read as jest.Mock).mockImplementation(() => {
      throw new Error('FAKE');
    });
    expect(rpio.read).not.toHaveBeenCalled();
    expect(motorService.read('heating')).toEqual(0);
    expect(rpio.read).toHaveBeenCalledTimes(1);
    expect(rpio.read).toHaveBeenCalledWith(29);
  });
});
