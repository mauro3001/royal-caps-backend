import { Controller, Get } from '@nestjs/common';
import { NotionService } from 'src/services/notion.service';

@Controller('caps')
export class RoyalCapsController {
  constructor(private notionService: NotionService) {}

  @Get()
  getRoyalCaps() {
    return this.notionService.getCapsInformation();
  }

  /**
   * Option for the future, to work on the creation of records

  @Get('post')
  postRoyalCap(): any {
    this.notionService
      .getTags()
      .then((tags) => {
        return this.notionService.createRecordCap({
          title: 'prueba',
          price: 25000,
          description: 'gorra bonita',
          image:
            'https://png.pngtree.com/png-vector/20201226/ourmid/pngtree-fashion-baseball-cap-clipart-hat-clipart-png-image_2643791.jpg',
          tags: tags,
        });
      })
      .catch((error) => {
        throw new Error(`Error to do post method: ${error}`);
      });
  }
  */
}
