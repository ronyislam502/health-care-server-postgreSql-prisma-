import { Types } from "mongoose";

export type TVehicleType =
  | "car"
  | "truck"
  | "SUV"
  | "van"
  | "motorcycle"
  | "bus"
  | "electricVehicle"
  | "hybridVehicle"
  | "tractor";

export type TBooking = {
  user: Types.ObjectId;
  service: Types.ObjectId;
  slot: Types.ObjectId;
  vehicleType: TVehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingYear: number;
  registrationPlate: string;
  tax: number;
  grandAmount: number;
  status: "Pending" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  transactionId: string;
};
