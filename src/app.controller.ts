import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return `Welcome to royal caps API`;
  }

  /**
   * Secret token for work
   * ntn_E58110696846AJV1rFoOgL3uBskLunfVTdJ8CMmm7t8fMN
   * idDatabase
   * 15b15a5de2f4801390fdd05546279f91
   */
}
