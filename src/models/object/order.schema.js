import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    totalPrice: { type: Number, min: 0 },
    quantity: { type: Number, default: 1 },
    customerID: { type: Schema.Types.ObjectId, ref: 'customers', required: true },
    productID: { type: Schema.Types.ObjectId, ref: 'products', required: true },
}, { timestamps: true, versionKey: false })

export const Order = model('orders', orderSchema)