import QueryBuilder from "./queryBuilder";

class HealthQueryBuilder<T> extends QueryBuilder<T> {
  protected addCustomFilters(filters: Record<string, any>) {
    // specialties filter
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

    // Combined startDate + time filter
    if (filters.startDate) {
      const date = filters.startDate; // e.g., "2025-06-23"
      const startTime = filters.startTime || "00:00"; // fallback if not provided
      const endTime = filters.endTime || "23:59";

      const startDateTime = new Date(`${date}T${startTime}:00Z`);
      const endDateTime = new Date(`${date}T${endTime}:00Z`);

      this.where.startDateTime = {
        gte: startDateTime,
        lt: endDateTime,
      };

      // Remove all filter inputs after use
      delete filters.startDate;
      delete filters.startTime;
      delete filters.endTime;
    }

    // Optional: endDateTime range if provided
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const nextDate = new Date(endDate);
      nextDate.setDate(nextDate.getDate() + 1);

      this.where.endDateTime = {
        gte: endDate,
        lt: nextDate,
      };

      delete filters.endDate;
    }
  }
}

export default HealthQueryBuilder;
