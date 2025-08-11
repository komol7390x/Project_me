import { Schema, model } from "mongoose";
import { modelConfig } from "../../config/model.config.js";

const paymentSchema = new Schema({
    productName: { type: String, required: true },
    price: { type: String, required: true, min: 0 },
    totalPrice: { type: String, required: true },
    status: { type: Boolean, default: false },
    access: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false })

export const Payment = model(modelConfig.TABLES.PAYMENTS, paymentSchema)