export type PaginationResult<T, K extends string> = {
  prev: number | null;
  current: number;
  next: number | null;
  perPage: number | undefined;
  pages: number;
  items: number;
} & {
  [key in K]: T[];
};
