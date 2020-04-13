import { Controller, Get } from '@nestjs/common';

@Controller()
export class MetaController {
  @Get('/local_health')
  healthCheck(): string {
    return 'OK';
  }
}

export default MetaController;
