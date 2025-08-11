import { Schema, model } from "mongoose";
import { Role } from '../../const/Role.js'
import { modelConfig } from "../../config/model.config.js";

const sallerSchema = new Schema({
    fullName: { type: String, required: true, unique: true, min: 3, max: 256 },
    email: { type: String, required: true, unique: true, min: 3, max: 256 },
    phoneNumber: { type: Number, required: true, unique: true, length: 12 },
    hashPassword: { type: String, required: true, min: 3 },
    isActive: { type: Boolean, default: false },
    balance: { type: Number, default: 0, min: 0 },
    role: { type: String, enum: [Role.SALLER], default: Role.SALLER },
    device: { type: Array, default: [] }
}, {
    timestamps: true, versionKey: false, virtuals: true,
    toObject: { virtuals: true }, toJSON: { virtuals: true }
})

sallerSchema.virtual(modelConfig.REFERENS.PAYMENT, {
    ref: modelConfig.TABLES.PAYMENTS,
    localField: modelConfig.TABLES._ID,
    foreignField: modelConfig.VIRTUAL.SALLER,
});

sallerSchema.virtual(modelConfig.REFERENS.WALLET, {
    ref: modelConfig.TABLES.WALLETS,
    localField: modelConfig.TABLES._ID,
    foreignField: modelConfig.VIRTUAL.SALLER,
});

sallerSchema.virtual(modelConfig.REFERENS.PRODUCT, {
    ref: modelConfig.TABLES.PRODUCTS,
    localField: modelConfig.TABLES._ID,
    foreignField: modelConfig.VIRTUAL.SALLER,
});

export const Saller = model(modelConfig.TABLES.SALLERS, sallerSchema)