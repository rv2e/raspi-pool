import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { Test } from '@nestjs/testing';
import { VerticalActuatorService } from 'vertical-actuator/vertical-actuator.service';
import rpio from 'rpio';

jest.mock('rpio');
describe('VerticalActuatorService', () => {
  let verticalActuatorService: VerticalActuatorService;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    verticalActuatorService = app.get(VerticalActuatorService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('goes up', () => {
    expect(rpio.open).not.toHaveBeenCalled();
    expect(verticalActuatorService.up()).toBeUndefined();
    expect(rpio.open).toHaveBeenCalledTimes(4);
    expect(rpio.open).toHaveBeenCalledWith(3, 1, 0);
    expect(rpio.open).toHaveBeenCalledWith(5, 1, 1);
    expect(rpio.open).toHaveBeenCalledWith(6, 1, 0);
    expect(rpio.open).toHaveBeenCalledWith(9, 1, 1);
  });

  it('goes down', () => {
    expect(rpio.open).not.toHaveBeenCalled();
    expect(verticalActuatorService.down()).toBeUndefined();
    expect(rpio.open).toHaveBeenCalledTimes(4);
    expect(rpio.open).toHaveBeenCalledWith(3, 1, 1);
    expect(rpio.open).toHaveBeenCalledWith(5, 1, 0);
    expect(rpio.open).toHaveBeenCalledWith(6, 1, 1);
    expect(rpio.open).toHaveBeenCalledWith(9, 1, 0);
  });
  it('goes pause', () => {
    expect(rpio.open).not.toHaveBeenCalled();
    expect(verticalActuatorService.stop()).toBeUndefined();
    expect(rpio.open).toHaveBeenCalledTimes(4);
    expect(rpio.open).toHaveBeenCalledWith(3, 1, 1);
    expect(rpio.open).toHaveBeenCalledWith(5, 1, 1);
    expect(rpio.open).toHaveBeenCalledWith(6, 1, 1);
    expect(rpio.open).toHaveBeenCalledWith(9, 1, 1);
  });
});
