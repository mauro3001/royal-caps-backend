import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoyalCapsController } from './controllers/royal-caps.controller';
import { NotionService } from './services/notion.service';

@Module({
  imports: [],
  controllers: [AppController, RoyalCapsController],
  providers: [AppService, NotionService],
})
export class AppModule {}
