export interface Cart {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    product?: Product; // Optional for queries that include the product relation
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    priceWithDiscount?: number | null;
    slug: string;
    isActive: boolean;
    isFavourite: boolean;
    createdDate: Date;
    categoryId: string;
    brandId?: string | null;
    colorId?: string | null;
    storageId?: string | null;
    connectivityId?: string | null;
    simSlotId?: string | null;
    batteryHealthId?: string | null;
    ramId?: string | null;
    cpuId?: string | null;
    screenSizeId?: string | null;
    typeId?: string | null;
    statusId: string;
    images?: Image[];
    category?: Category;
    brand?: Brand;
    color?: Color;
    storage?: Storage;
    connectivity?: Connectivity;
    simSlot?: SimSlot;
    batteryHealth?: BatteryHealth;
    ram?: Ram;
    cpu?: Cpu;
    screenSize?: ScreenSize;
    type?: Type;
    status?: Status;
    promotions?: Promotion[];
}

export interface Image {
    id: string;
    url: string;
    createdDate: Date;
    productId?: string | null;
    categoryId?: string | null;
    brandId?: string | null;
}

export interface Category {
    id: string;
    name: string;
    description?: string | null;
    slug: string;
    createdDate: Date;
    images?: Image[];
}

export interface Brand {
    id: string;
    name: string;
    createdDate: Date;
    images?: Image[];
}

export interface Color {
    id: string;
    name: string;
    hex: string;
    createdDate: Date;
}

export interface Storage {
    id: string;
    name: string;
    createdDate: Date;
}

export interface Connectivity {
    id: string;
    name: string;
    createdDate: Date;
}

export interface SimSlot {
    id: string;
    title: string;
    createdDate: Date;
}

export interface BatteryHealth {
    id: string;
    title: string;
    createdDate: Date;
}

export interface Ram {
    id: string;
    title: string;
    createdDate: Date;
}

export interface Cpu {
    id: string;
    name: string;
    createdDate: Date;
}

export interface ScreenSize {
    id: string;
    name: string;
    createdDate: Date;
}

export interface Type {
    id: string;
    name: string;
    createdDate: Date;
}

export interface Status {
    id: string;
    name: string;
    createdDate: Date;
}

export interface Promotion {
    id: string;
    name: string;
    percentageNumber: number;
    percentageSave: number;
    durationType: string;
    startDate?: Date | null;
    endDate?: Date | null;
    startHours?: number | null;
    endHours?: number | null;
    startMinutes?: number | null;
    endMinutes?: number | null;
    startSeconds?: number | null;
    endSeconds?: number | null;
    remainingTime?: number | null;
    isActive: boolean;
    createdDate: Date;
    statusId: string;
    products?: Product[];
    categories?: Category[];
}

export interface Order {
    id: string;
    createdDate: Date;
    userId: string;
    productId: string;
    quantity: number;
    statusId: string;
    product?: Product;
    status?: Status;
    deliveryInfo?: Delivery[];
    user?: User;
}

export interface Delivery {
    id: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    country: string;
    phone: string;
    userId: string;
    orderId: string;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    createdDate: Date;
    roleId: string;
    role?: Role;
}

export interface Favourite {
    id: string;
    userId: string;
    productId: string;
    product?: Product;
}

export interface Role {
    id: string;
    name: string;
    createdDate: Date;
}

export interface VerificationCode {
    id: string;
    code: string;
    userId: string;
    expiresAt: Date;
}
