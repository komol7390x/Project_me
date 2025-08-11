import { Schema, model } from "mongoose";
import { modelConfig } from "../../config/model.config.js";


const categorySchema = new Schema({
    name: { type: String, required: true, unique: true, min: 3, max: 256 },
    image: { type: String }
}, {
    timestamps: true, versionKey: false, virtuals: true,
    toObject: { virtuals: true }, toJSON: { virtuals: true }
})

categorySchema.virtual(modelConfig.REFERENS.PRODUCT, {
    ref: modelConfig.TABLES.PRODUCTS,
    localField: modelConfig.TABLES._ID,
    foreignField: modelConfig.VIRTUAL.CATEGORY
});

export const Category = model(modelConfig.TABLES.CATEGORIES, categorySchema)

