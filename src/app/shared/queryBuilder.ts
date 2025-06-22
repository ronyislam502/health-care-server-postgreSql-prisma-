import { Prisma } from "@prisma/client";

class QueryBuilder<T> {
  private modelQuery: any;
  private query: Record<string, unknown>;

  private where: Record<string, unknown> = {};
  private orderBy: Prisma.Enumerable<
    Prisma.Enumerable<Record<string, "asc" | "desc">>
  > = [{ createdAt: "desc" }];
  private select?: Record<string, boolean>;
  private include?: Record<string, any>;
  private take = 10;
  private skip = 0;

  constructor(modelQuery: any, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Search by searchable fields with Prisma's 'contains' and insensitive mode

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm;

    if (typeof searchTerm !== "string" || searchableFields.length === 0) {
      return this;
    }

    this.where.OR = searchableFields.map((field) => {
      return {
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      };
    });

    return this;
  }

  // Filtering logic that supports operators like gte, lte, etc.
  // filter() {
  //   const { AND, OR, NOT, searchTerm, sort, page, limit, fields, ...filters } =
  //     this.query;

  //   for (const key in filters) {
  //     const value = filters[key];

  //     if (
  //       typeof value === "object" &&
  //       value !== null &&
  //       !Array.isArray(value)
  //     ) {
  //       this.where[key] = {};
  //       for (const operator in value) {
  //         const operatorValue = (value as Record<string, unknown>)[operator];

  //         if (
  //           typeof operatorValue === "string" &&
  //           !isNaN(Number(operatorValue))
  //         ) {
  //           (this.where[key] as Record<string, any>)[operator] =
  //             Number(operatorValue);
  //         } else if (typeof operatorValue === "number") {
  //           (this.where[key] as Record<string, any>)[operator] = operatorValue;
  //         } else {
  //           (this.where[key] as Record<string, any>)[operator] = operatorValue;
  //         }
  //       }
  //     } else {
  //       if (typeof value === "string" && !isNaN(Number(value))) {
  //         this.where[key] = { equals: Number(value) };
  //       } else if (typeof value === "number") {
  //         this.where[key] = { equals: value };
  //       } else {
  //         this.where[key] = { equals: value };
  //       }
  //     }
  //   }

  //   if (AND) this.where.AND = AND;
  //   if (OR)
  //     this.where.OR = [...((this.where.OR as any[]) || []), ...(OR as any[])];
  //   if (NOT) this.where.NOT = NOT;

  //   return this;
  // }

  filter() {
    const { AND, OR, NOT, searchTerm, sort, page, limit, fields, ...filters } =
      this.query;

    //Custom logic: filter by specialties.title
    if (filters.specialties) {
      const specialtiesArray = Array.isArray(filters.specialties)
        ? filters.specialties
        : [filters.specialties];

      this.where.doctorSpecialties = {
        some: {
          specialties: {
            title: {
              in: specialtiesArray as string[],
            },
          },
        },
      };

      delete filters.specialties; // prevent double-processing
    }

    // Generic filter logic for flat fields
    for (const key in filters) {
      const value = filters[key];

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        this.where[key] = {};
        for (const operator in value) {
          const operatorValue = (value as Record<string, unknown>)[operator];
          (this.where[key] as Record<string, any>)[operator] =
            typeof operatorValue === "string" && !isNaN(Number(operatorValue))
              ? Number(operatorValue)
              : operatorValue;
        }
      } else {
        this.where[key] =
          typeof value === "string" && !isNaN(Number(value))
            ? { equals: Number(value) }
            : { equals: value };
      }
    }

    if (AND) this.where.AND = AND;
    if (OR)
      this.where.OR = [...((this.where.OR as any[]) || []), ...(OR as any[])];
    if (NOT) this.where.NOT = NOT;

    return this;
  }

  // Custom handling for specialties filtering

  // Sorting logic for fields with '-' prefix for descending
  sort() {
    if (typeof this.query.sort === "string") {
      this.orderBy = this.query.sort.split(",").map((field) => {
        if (field.startsWith("-")) {
          return { [field.substring(1)]: "desc" as const };
        } else {
          return { [field]: "asc" as const };
        }
      });
    } else {
      this.orderBy = [{ createdAt: "desc" }];
    }
    return this;
  }

  // Selecting specific fields
  fields() {
    const fields = this.query.fields;
    if (typeof fields === "string") {
      const fieldArr = fields.split(",").map((f) => f.trim());
      this.select = Object.fromEntries(fieldArr.map((f) => [f, true]));
    }
    return this;
  }

  // Pagination: page and limit -> skip & take
  paginate() {
    const pageRaw = this.query.page;
    const limitRaw = this.query.limit;

    const page = typeof pageRaw === "string" ? parseInt(pageRaw) : 1;
    const limit = typeof limitRaw === "string" ? parseInt(limitRaw) : 10;

    this.skip = (page - 1) * limit;
    this.take = limit;
    return this;
  }

  // Optional: get total count and pagination meta
  async countTotal() {
    const total = await this.modelQuery.count({ where: this.where });
    const page =
      typeof this.query.page === "string" ? parseInt(this.query.page) : 1;
    const limit =
      typeof this.query.limit === "string" ? parseInt(this.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }

  setSelect(fields: Record<string, boolean>) {
    this.select = fields;
    return this;
  }

  setInclude(include: Record<string, any>) {
    this.include = include;
    return this;
  }

  // Final execution method returning Prisma results
  async execute() {
    return this.modelQuery.findMany({
      where: this.where,
      orderBy: this.orderBy,
      select: this.select,
      include: this.include,
      skip: this.skip,
      take: this.take,
    });
  }
}

export default QueryBuilder;
