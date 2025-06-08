import { Types } from "mongoose";

export type TReview = {
  user: Types.ObjectId;
  booking: Types.ObjectId;
  service: Types.ObjectId;
  feedback: string;
  rating: number;
};
