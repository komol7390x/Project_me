import { Schema, model } from "mongoose";

const adminSchema = new Schema({
    username: { type: String, unique: true, required: true, minlength: 3, maxlength: 100 },
    email: { type: String, unique: true, required: true, minlength: 3, maxlength: 100 },
    hashPassword: { type: String, required: true, minlength: 8, maxlength: 100 },
    isActive: { type: Boolean, default: false },
    role: { type: String, enum: ['SUPERADMIN', 'ADMIN'], default: 'ADMIN' }
}, { timestamps: true, versionKey: false })

export const Admin = model('admins', adminSchema)