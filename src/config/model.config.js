import { config } from "dotenv";
config()

export const modelConfig = {
    VIRTUAL: {
        CUSTOMER: process.env.CUSTOMER_ID,
        ORDER: process.env.ORDER_ID,
        PRODUCT: process.env.PRODUCT_ID,
        SALLER: process.env.SALLER_ID,
        CATEGORY: process.env.CATEGORY_ID
    },

    REFERENS: {
        ORDER: process.env.ORDER_REF,
        WALLET: process.env.WALLET_REF,
        PAYMENT: process.env.PAYMENT_REF,
        PRODUCT: process.env.PRODUCT_REF,
        DELEVIRY: process.env.DELEVIRY_REF,
    },

    TABLES: {
        _ID: process.env.ID,

        ADMINS:process.env.ADMINS,
        SALLERS: process.env.SALLER,
        CUSTOMERS: process.env.CUSTOMERS,

        PRODUCTS: process.env.PRODUCTS,
        CATEGORIES: process.env.CATEGORIES,
        ORDERS: process.env.ORDERS,
        DELEVIRIES: process.env.DELEVIRIES,
        PAYMENTS: process.env.PAYMENTS,
        WALLETS: process.env.WALLETS,
    }
}