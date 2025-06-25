import QueryBuilder from "./queryBuilder";

class HealthQueryBuilder<T> extends QueryBuilder<T> {
  protected addCustomFilters(filters: Record<string, any>) {
    if (filters.doctorEmail) {
      this.where.doctor = {
        ...(this.where.doctor || {}),
        email: {
          contains: filters.doctorEmail,
          mode: "insensitive",
        },
      };
      delete filters.doctorEmail;
    }

    if (filters.startDate) {
      const date = filters.startDate;
      const startTime = filters.startTime || "00:00";
      const endTime = filters.endTime || "23:59";
      const startDateTime = new Date(`${date}T${startTime}:00Z`);
      const endDateTime = new Date(`${date}T${endTime}:00Z`);

      this.where.schedule = {
        ...(this.where.schedule || {}),
        startDateTime: {
          gte: startDateTime,
          lt: endDateTime,
        },
      };

      delete filters.startDate;
      delete filters.startTime;
      delete filters.endTime;
    }
  }
}

export default HealthQueryBuilder;
