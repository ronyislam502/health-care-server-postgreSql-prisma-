import QueryBuilder from "./queryBuilder";

class healthQueryBuilder<T> extends QueryBuilder<T> {
  protected addCustomFilters(filters: Record<string, any>) {
    if (filters.specialties) {
      const specialtiesArray = Array.isArray(filters.specialties)
        ? filters.specialties
        : [filters.specialties];

      this.where.doctorSpecialties = {
        some: {
          specialties: {
            title: {
              in: specialtiesArray,
            },
          },
        },
      };

      delete filters.specialties;
    }

    if (filters.startDateTime) {
      const startDateStr = filters.startDateTime as string;
      const startDate = new Date(startDateStr);
      const nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + 1);

      this.where.startDateTime = {
        gte: startDate,
        lt: nextDate,
      };

      delete filters.startDateTime;
    }

    // endDateTime filter
    if (filters.endDateTime) {
      const endDateStr = filters.endDateTime as string;
      const endDate = new Date(endDateStr);
      const nextDate = new Date(endDate);
      nextDate.setDate(nextDate.getDate() + 1);

      this.where.endDateTime = {
        gte: endDate,
        lt: nextDate,
      };

      delete filters.endDateTime;
    }
  }
}

export default healthQueryBuilder;
