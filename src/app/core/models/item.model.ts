export interface Item {
  _id: string;
  itemCode: string;
  name: string;
  category: string;
  source: string;
  description?: string;
  grossWeight: number;
  netWeight: number;
  huid: string;
  stockQty: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ItemFilters {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface ItemsResponse {
  items: Item[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface CreateItemRequest {
  name: string;
  category: string;
  source: string;
  description?: string;
  grossWeight: number;
  netWeight: number;
  huid: string;
}
