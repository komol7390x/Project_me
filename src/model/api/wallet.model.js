import { Schema, model } from "mongoose";
import { modelConfig } from "../../config/model.config.js";

const walletSchema = new Schema({
    cardNumber: { type: Number, required: true, length: 16, unique: true },
    balance: { type: Number, min: 0, default: 0 },
    customerID: { type: Schema.Types.ObjectId, ref: modelConfig.TABLES.CUSTOMERS },
    sallerID: { type: Schema.Types.ObjectId, ref: modelConfig.TABLES.SALLERS }
}, { timestamps: true, versionKey: false })

export const Wallet = model(modelConfig.TABLES.WALLETS, walletSchema)