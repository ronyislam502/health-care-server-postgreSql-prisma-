import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TImageFile } from "../../interface/image.interface";
import { TService } from "./service.interface";
import { Service } from "./service.model";
import QueryBuilder from "../../builder/queryBuilder";
import { serviceSearchableFields } from "./service.const";

const createServiceIntoDB = async (image: TImageFile, payload: TService) => {
  const file = image;
  payload.image = file?.path;

  const result = await Service.create(payload);
  return result;
};

const getAllServiceFromDB = async (query: Record<string, unknown>) => {
  const serviceQuery = new QueryBuilder(Service.find(), query)
    .search(serviceSearchableFields)
    .fields()
    .paginate()
    .sort()
    .filter();

  const meta = await serviceQuery.countTotal();
  const data = await serviceQuery.modelQuery;

  return {
    meta,
    data,
  };
};

const getSingleServiceFromDB = async (id: string) => {
  const result = await Service.findById(id);
  return result;
};

const updateServiceFromDB = async (
  id: string,
  image: TImageFile,
  payload: Partial<TService>
) => {
  const existingService = await Service.findById(id);

  if (!existingService) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  const file = image;
  payload.image = file?.path;

  const result = await Service.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteServiceFromDB = async (id: string) => {
  const result = await Service.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const ServiceServices = {
  createServiceIntoDB,
  getAllServiceFromDB,
  getSingleServiceFromDB,
  updateServiceFromDB,
  deleteServiceFromDB,
};
