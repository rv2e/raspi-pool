import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { Test } from '@nestjs/testing';
import { VerticalActuatorService } from 'vertical-actuator/vertical-actuator.service';
import { Gpio } from 'onoff';

jest.mock('onoff');
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

  it('goes down', () => {
    expect(Gpio).not.toHaveBeenCalled();
    expect(verticalActuatorService.down()).toBeUndefined();
    expect(Gpio).toHaveBeenCalledTimes(4);
    expect(Gpio).toHaveBeenCalledWith(3, 'low');
    expect(Gpio).toHaveBeenCalledWith(5, 'high');
    expect(Gpio).toHaveBeenCalledWith(6, 'low');
    expect(Gpio).toHaveBeenCalledWith(9, 'high');
  });

  it('goes up', () => {
    expect(Gpio).not.toHaveBeenCalled();
    expect(verticalActuatorService.up()).toBeUndefined();
    expect(Gpio).toHaveBeenCalledTimes(4);
    expect(Gpio).toHaveBeenCalledWith(3, 'high');
    expect(Gpio).toHaveBeenCalledWith(5, 'low');
    expect(Gpio).toHaveBeenCalledWith(6, 'high');
    expect(Gpio).toHaveBeenCalledWith(9, 'low');
  });
  it('goes pause', () => {
    expect(Gpio).not.toHaveBeenCalled();
    expect(verticalActuatorService.stop()).toBeUndefined();
    expect(Gpio).toHaveBeenCalledTimes(4);
    expect(Gpio).toHaveBeenCalledWith(3, 'low');
    expect(Gpio).toHaveBeenCalledWith(5, 'low');
    expect(Gpio).toHaveBeenCalledWith(6, 'low');
    expect(Gpio).toHaveBeenCalledWith(9, 'low');
  });
});
