import { Booking } from "../booking/booking.model";

const getServiceAndCategoryStatistics = async () => {
  // Service-wise aggregation
  const serviceAggregation = await Booking.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
      },
    },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceInfo",
      },
    },
    { $unwind: "$serviceInfo" },
    {
      $set: {
        serviceId: "$serviceInfo._id",
        serviceTitle: "$serviceInfo.title",
        servicePrice: "$serviceInfo.price",
      },
    },
    {
      $group: {
        _id: "$serviceId",
        serviceTitle: { $first: "$serviceTitle" },
        totalRevenue: { $sum: "$servicePrice" },
        totalTax: { $sum: "$tax" },
      },
    },
    {
      $project: {
        _id: 0,
        serviceId: "$_id",
        serviceTitle: 1,
        totalRevenue: 1,
        totalTax: 1,
      },
    },
  ]);

  // Category-wise aggregation
  const categoryAggregation = await Booking.aggregate([
    {
      $match: { paymentStatus: "Paid" },
    },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceInfo",
      },
    },
    {
      $unwind: "$serviceInfo",
    },
    {
      $set: {
        servicePrice: "$serviceInfo.price",
        serviceCategory: "$serviceInfo.category",
      },
    },
    {
      $group: {
        _id: "$serviceCategory",
        totalRevenue: { $sum: "$servicePrice" },
        totalTax: { $sum: "$tax" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalRevenue: 1,
        totalTax: 1,
      },
    },
  ]);

  const revenue = categoryAggregation.reduce(
    (acc, curr) => {
      acc.totalRevenue += curr.totalRevenue;
      acc.totalTax += curr.totalTax;
      return acc;
    },
    { totalRevenue: 0, totalTax: 0 }
  );

  return {
    serviceAggregation,
    categoryAggregation,
    revenue,
  };
};

const getPopularServices = async (limit = 5) => {
  const popular = await Booking.aggregate([
    {
      $group: {
        _id: "$service",
        totalBookings: { $sum: 1 },
      },
    },
    {
      $sort: { totalBookings: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "services",
        localField: "_id",
        foreignField: "_id",
        as: "serviceDetails",
      },
    },
    {
      $unwind: "$serviceDetails",
    },
    {
      $project: {
        id: 0,
        serviceId: "$_id",
        totalBookings: 1,
        service: "$serviceDetails",
      },
    },
  ]);

  return popular;
};

export const StatisticsServices = {
  getServiceAndCategoryStatistics,
  getPopularServices,
};
