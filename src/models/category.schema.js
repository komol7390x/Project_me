import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, min: 3 },
    url: { type: String, required: true },
}, { timestamps: true, versionKey: false })

export const category = model('categories', categorySchema)