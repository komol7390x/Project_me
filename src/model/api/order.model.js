import { Schema, model } from "mongoose";
import { modelConfig } from "../../config/model.config.js";

const orderSchema = new Schema({
    orderQuantity: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, min: 0, default: 0 },
    status: { type: Boolean, default: false },
    customerID: { type: Schema.Types.ObjectId, ref: modelConfig.TABLES.CUSTOMERS },
    productID: { type: Schema.Types.ObjectId, ref: modelConfig.TABLES.PRODUCTS }
}, { timestamps: true, versionKey: false })

orderSchema.virtual(modelConfig.REFERENS.DELEVIRY, {
    ref: modelConfig.TABLES.DELEVIRIES,
    localField: modelConfig.TABLES._ID,
    foreignField: modelConfig.VIRTUAL.ORDER,
});

orderSchema.virtual(modelConfig.REFERENS.PAYMENT, {
    ref: modelConfig.TABLES.PAYMENTS,
    localField: modelConfig.TABLES._ID,
    foreignField: modelConfig.VIRTUAL.ORDER,
});

orderSchema.set('toObject', { virtuals: true });
orderSchema.set('toJSON', { virtuals: true });

export const Order = model(modelConfig.TABLES.ORDERS, orderSchema)