import { Schema, model } from "mongoose";
import { modelConfig } from "../../config/model.config.js";

const productSchema = new Schema({
    name: { type: String, required: true, unique: true, min: 3, max: 256 },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, min: 0, default: 0 },
    image: { type: String },
    sallerID: { type: Schema.Types.ObjectId, ref: modelConfig.TABLES.SALLERS },
    categoryID: { type: Schema.Types.ObjectId, ref: modelConfig.TABLES.CATEGORIES }
}, {
    timestamps: true, versionKey: false, virtuals: true,
    toObject: { virtuals: true }, toJSON: { virtuals: true }
})

productSchema.virtual(modelConfig.REFERENS.ORDER, {
    ref: modelConfig.TABLES.ORDERS,
    localField: modelConfig.TABLES._ID,
    foreignField: modelConfig.VIRTUAL.PRODUCT
});

export const Product = model(modelConfig.TABLES.PRODUCTS, productSchema)

