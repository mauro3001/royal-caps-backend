export class Product {
  title: string;
  price: number;
  description: string;
  image: string;
  tags: Tags[];
  lastEdited?: string;
  createdTime?: string;
}

export class Tags {
  id: string;
  name: string;
}
