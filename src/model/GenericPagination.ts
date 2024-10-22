export class GenericPagination<T> {

  currentPage: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
  content: T;

  constructor(
    currentPage: number,
    perPage: number,
    totalPages: number,
    totalCount: number,
    content: T
  ) {
    this.currentPage = currentPage;
    this.perPage = perPage;
    this.totalPages = totalPages;
    this.totalCount = totalCount;
    this.content = content;
  }
}
