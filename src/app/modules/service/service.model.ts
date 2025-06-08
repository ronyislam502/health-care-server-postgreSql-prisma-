import { model, Schema } from "mongoose";
import { ServiceModel, TService } from "./service.interface";
import { CATEGORY } from "./service.const";

const ServiceSchema = new Schema<TService, ServiceModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    image: [
      {
        type: String,
        required: [true, "images is required"],
        default: "",
      },
    ],
    category: {
      type: String,
      enum: Object.keys(CATEGORY),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ServiceSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

ServiceSchema.pre("findOne", function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

ServiceSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

ServiceSchema.statics.isServiceExists = async function (id: string) {
  const existingService = await Service.findOne({ id });
  return existingService;
};

export const Service = model<TService, ServiceModel>("Service", ServiceSchema);
