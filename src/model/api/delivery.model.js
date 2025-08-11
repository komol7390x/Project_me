import { Schema, model } from "mongoose";
import { modelConfig } from "../../config/model.config.js";

const deliverySchema = new Schema({
    address: { type: String, required: true, min: 3, max: 256 },
    deliveryTime: { type: Date, default: () => new Date(Date.now() + 60 * 60 * 1000) },
    orderID: { type: Schema.Types.ObjectId, ref: modelConfig.TABLES.ORDERS },
    access: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false })

export const Delivery = model(modelConfig.TABLES.DELEVIRIES, deliverySchema)