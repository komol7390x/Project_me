import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: { type: String, unique: true, required: true, trim: true, minlength: 2, maxlength: 100 },
    price: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1, default: 0 },
    description: { type: Text, trim: true },
    sallerID: { type: Schema.Types.ObjectId, ref: 'sallers', required: true },
    categoryID: { type: Schema.Types.ObjectId, ref: 'categories', required: true }
}, { timestamps: true, versionKey: false })

export const Product = model('products', productSchema)