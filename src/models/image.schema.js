import { Schema, model } from "mongoose";

const imageSchema = new Schema({
    url: { type: String, required: true },
    productID: { type: Schema.Types.ObjectId, ref: 'products', required: true },
}, { timestamps: true, versionKey: false })

export const Image = model('images', imageSchema)