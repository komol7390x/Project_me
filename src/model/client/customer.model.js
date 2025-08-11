import { Schema, model } from "mongoose";
import { Role } from '../../const/Role.js'
import { modelConfig } from "../../config/model.config.js";

const customerSchema = new Schema({
    fullName: { type: String, required: true, unique: true, min: 3, max: 256 },
    email: { type: String, required: true, unique: true, min: 3, max: 256 },
    phoneNumber: { type: Number, required: true, unique: true, length: 12 },
    hashPassword: { type: String, required: true, min: 3 },
    balance: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: false },
    ordersHistory: { type: Array, default: [] },
    role: { type: String, enum: [Role.CUSTOMER], default: Role.CUSTOMER },
    device: { type: Array, default: [] }
}, {
    timestamps: true, versionKey: false, virtuals: true,
    toObject: { virtuals: true }, toJSON: { virtuals: true }
})

customerSchema.virtual(modelConfig.REFERENS.ORDER, {
    ref: modelConfig.TABLES.ORDERS,
    localField: modelConfig.TABLES._ID,
    foreignField: modelConfig.VIRTUAL.CUSTOMER
});

customerSchema.virtual(modelConfig.REFERENS.WALLET, {
    ref: modelConfig.TABLES.WALLETS,
    localField: modelConfig.TABLES._ID,
    foreignField: modelConfig.VIRTUAL.CUSTOMER
});


export const Customers = model(modelConfig.TABLES.CUSTOMERS, customerSchema)



