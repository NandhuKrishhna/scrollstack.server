export interface ArticleQueryOptions {
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
    category?: string;
}
