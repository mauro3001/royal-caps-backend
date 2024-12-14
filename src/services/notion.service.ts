import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class NotionService {
  private notion: Client;
  private databaseId: string;

  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_TOKEN,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID;
  }

  /**
   * Function to get connection with DataBase
   */
  async getConnection() {
    return this.notion.databases.retrieve({
      database_id: this.databaseId,
    });
  }

  /**
   * Method to get Data Base elements
   * This fuction is to map attributes from databse
   * After that we can delete it
   */
  async getDatabase() {
    try {
      const response = await this.getConnection();
      console.log(response);
      return response;
    } catch (error) {
      throw new NotFoundException(
        `Error to get information from database: ${error}`,
      );
    }
  }

  /**
   * Function to map all properties from database attributes
   */
  async getDatabaseProperties() {
    try {
      const response = await this.getConnection();
      const properties = this.getNotionPropertiesById(response.properties);
      console.log(properties);

      return properties;
    } catch (error) {
      throw new NotFoundException(
        `Error to get properties from database: ${error}`,
      );
    }
  }

  /**
   * Method to get all the values from properties
   * Remapping to this form
   * 'asdfasddf': {
    name: 'Tags',
    type: 'multi_select',
    multi_select: { options: [Array] }
    },
   *
   * {
    Tags: {
      id: 'asdfasd',
      name: 'Tags',
      type: 'multi_select',
      multi_select: { options: [Array] }
    },
    CreatedTime: {
      id: 'asdfaq',
      name: 'CreatedTime',
      type: 'created_time',
      created_time: {}
    },
    Image: { id: 'asdfasdf', name: 'Image', type: 'files', files: {} },
    }
  */
  getNotionPropertiesById(properties: object) {
    // Object to save result
    const result = {};

    for (const property of Object.values(properties)) {
      const { id, ...rest } = property;
      result[id] = rest;
    }

    return result;
  }

  /**
   * Function to get tags for mi project
   * to use in the future for post method
   */
  async getTags() {
    const response = await this.getConnection();
    return this.getNotionPropertiesById(response.properties)[
      process.env.NOTION_TAGS_ID
    ].multi_select.options.map((option) => {
      return {
        id: option.id,
        name: option.name,
      };
    });
  }

  /**
   * Method to get caps information
   */
  async getCapsInformation() {
    try {
      const notionResult = await this.notion.databases.query({
        database_id: this.databaseId,
        sorts: [
          {
            property: process.env.NOTION_NAME_ID,
            direction: 'ascending',
          },
        ],
      });

      return notionResult.results.map((page: any) => {
        const {
          Name,
          Description,
          Price,
          Image,
          CreatedTime,
          LastEdited,
          Tags,
        } = page.properties;

        return {
          name: Name.title[0].plain_text,
          description: Description.rich_text[0].plain_text,
          price: Price.number,
          imageUrl: Image.files[0].external.url,
          tags: Tags.multi_select.map((tag) => tag.name),
          createdTime: CreatedTime.last_edited_time,
          lastEdited: LastEdited.last_edited_time,
        };
      });
    } catch (error) {
      throw new NotFoundException(`Error to get about caps: ${error}`);
    }
  }

  /**
   * Method to post information in royal caps dataBase
   */
  createRecordCap(information: Product) {
    this.notion.pages.create({
      parent: {
        database_id: this.databaseId,
      },
      properties: {
        [process.env.NOTION_NAME_ID]: {
          title: [
            {
              type: 'text',
              text: {
                content: information.title,
              },
            },
          ],
        },
        [process.env.NOTION_PRICE_ID]: {
          number: information.price,
        },
        [process.env.NOTION_DESCRIPTION_ID]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: information.description,
              },
            },
          ],
        },
        [process.env.NOTION_IMAGE_ID]: {
          files: information.image
            ? [
                {
                  type: 'external',
                  name: 'image',
                  external: { url: information.image },
                },
              ]
            : [],
        },
        [process.env.NOTION_TAGS_ID]: {
          multi_select: information.tags.map((tag) => {
            return { id: tag.id };
          }),
        },
      },
    });
  }
}
