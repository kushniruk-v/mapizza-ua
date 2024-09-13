import { ICategoryResponse } from '../category/category-interface';
export interface ITovaryRequest {
  category: ICategoryResponse;
  name: string;
  path: string;
  description: string;
  weight: string;
  price: number;
  bonus: number;
  imagePath: string;
  imagePathCategory: string;
  categoryTovary: string;
  categoryTovarPath: string;
  count: number;
  countFound: number;
  isActive: boolean;
  id: number | string;
  filter: string;
  additionalProducts?: Array<{ name: string; index: number; price: number }>;
}

export interface ITovaryResponse extends ITovaryRequest {
  id: number | string;
}
