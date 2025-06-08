import { Model } from "mongoose";
import { CATEGORY } from "./service.const";

export type TService = {
  title: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category: keyof typeof CATEGORY;
  isDeleted: boolean;
};

export interface ServiceModel extends Model<TService> {
  isServiceExists(id: string): Promise<TService | null>;
}
