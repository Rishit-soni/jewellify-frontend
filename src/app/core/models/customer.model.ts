export interface Customer {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    panNumber?: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerFilters {
    search?: string;
    page?: number;
    limit?: number;
}

export interface CustomersResponse {
    customers: Customer[];
    totalCustomers: number;
    currentPage: number;
    totalPages: number;
}

export interface CreateCustomerRequest {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    panNumber?: string;
    note?: string;
}

export interface CustomerOrder {
    _id: string;
    orderId: string;
    date: string;
    items: string[];
    total: number;
    status: string;
    itemDetails?: CustomerOrderItem[];
}

export interface CustomerOrderItem {
    itemCode: string;
    name: string;
    qty: number;
    price: number;
    weight: number;
}

export interface OutstandingPayment {
    orderId: string;
    amount: number;
    dueDate: string;
    status: string;
}

export interface TransactionEntry {
    _id: string;
    date: string;
    type: 'Payment' | 'Order' | 'Refund';
    description: string;
    amount: number;
    balance: number;
}

export interface CustomerStatistics {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalOrderValue: number;
    averageOrderValue: number;
    lastOrderDate?: string;
}

export interface CustomerDetailsResponse {
    customer: Customer;
    recentOrders: CustomerOrder[];
    outstandingAmount: number;
    outstandingPayments: OutstandingPayment[];
    transactionHistory: TransactionEntry[];
    statistics: CustomerStatistics;
}
