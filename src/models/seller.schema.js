import { Schema, model } from "mongoose";

const sallerSchema = new Schema({
    username: { type: String, unique: true, required: true, minlength: 3, maxlength: 100 },
    email: { type: String, unique: true, required: true, minlength: 3, maxlength: 100 },
    hashPassword: { type: String, required: true, minlength: 8, maxlength: 100 },
    fullName: { type: String, unique: true, required: true, minlength: 3, maxlength: 100 },
    phoneNumber: { type: String, unique: true, required: true, minlength: 10 },
    isActive: { type: Boolean, default: false },
    image: { type: String, required: true, minlength: 3 },
    adress: { type: String, minlength: 3 }
}, { timestamps: true, versionKey: false })

export const Saller = model('sallers', sallerSchema)