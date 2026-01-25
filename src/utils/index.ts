import { ArticleFilters } from "../types/news";

export const parseCursor = async (cursor?: string) => {
  if (!cursor) {
    return null;
  }

  const [createdAt, id] = cursor.split("|");
  return {
    createdAt: new Date(createdAt),
    id,
  };
};

export function getNextCursor(items: any[]) {
  if (!items.length) return null;

  const last = items[items.length - 1];

  return `${last.createdAt.toISOString()}|${last.id}`;
}

export const dynamicQueryBuilder = async (filters: ArticleFilters) => {
  const {
    category,
    region,
    cursor,
    limit,
    search,
    drafted,
    fromDate,
    toDate,
    published,
  } = filters;

  const parsedCursor = await parseCursor(cursor);

  const whereClause = {
    ...(published !== undefined && { isPublished: published }),
    ...(drafted !== undefined && { isDrafted: drafted }),
    ...(category !== undefined && { category: category }),
    ...(region !== undefined && { region: region }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(fromDate || toDate
      ? {
          publishedAt: {
            ...(fromDate && { gte: new Date(fromDate) }),
            ...(toDate && { lte: new Date(toDate) }),
          },
        }
      : {}),
  };

  const pagination = parsedCursor
    ? {
        skip: 1,
        cursor: {
          createdAt_id: {
            createdAt: parsedCursor.createdAt,
            id: parsedCursor.id,
          },
        },
      }
    : {};

    const query = {
    where: whereClause,
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: limit,
    ...pagination,
  };

  return query
};

export function parseBoolean(value?: string | undefined) {
    if(!value){
        return undefined
    }
  if (value === "true") return true;
  if (value === "false") return false;
}