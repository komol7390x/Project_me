import { Schema, model } from "mongoose";
import { Role } from '../../const/Role.js'
import { modelConfig } from "../../config/model.config.js";

const adminSchema = new Schema({
    username: { type: String, required: true, unique: true, min: 3, max: 256 },
    email: { type: String, required: true, unique: true, min: 3, max: 256 },
    hashPassword: { type: String, required: true, min: 3 },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: [Role.SUPERADMIN, Role.ADMIN], default: Role.ADMIN },
    device: { type: Array, default: [] }
}, { timestamps: true, versionKey: false })

export const Admin = model(modelConfig.TABLES.ADMINS, adminSchema)