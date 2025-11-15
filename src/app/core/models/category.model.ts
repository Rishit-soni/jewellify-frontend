export interface Category {
    _id: string;
    name: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryRequest {
    name: string;
}

export interface UpdateCategoryRequest {
    name: string;
}

export interface CategoryResponse {
    success: boolean;
    category: Category;
    message?: string;
}

export interface CategoriesResponse {
    success: boolean;
    categories: Category[];
    total: number;
    message?: string;
}
