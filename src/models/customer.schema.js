import { Schema, model } from "mongoose";

const CustomerSchema = new Schema({
    username: { type: String, unique: true, required: true, minlength: 3, maxlength: 100 },
    email: { type: String, unique: true, required: true, minlength: 3, maxlength: 100 },
    hashPassword: { type: String, required: true, minlength: 8, maxlength: 100 },
    fullName: { type: String, unique: true, required: true, minlength: 3, maxlength: 100 },
    phoneNumber: { type: String, unique: true, required: true, minlength: 10 },
    isActive: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false })

export const Customer = model('customers', CustomerSchema)