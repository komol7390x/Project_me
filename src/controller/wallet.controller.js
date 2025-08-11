import Transaction from "../utils/Transaction.js";

import { BaseController } from "./base.controller.js";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/successRes.js";
import { modelConfig } from "../config/model.config.js";

export class WalletController extends BaseController {
    constructor(walletModel, UserModel, populateFields) {
        super(walletModel, populateFields)
        this.populateFields = populateFields
        this.walletModel = walletModel
        this.UserModel = UserModel
    }
    // ================================ CREATE ================================
    createWallet = async (req, res, next) => {
        try {
            const { customerID, sallerID, cardNumber } = req.body
            const Userid = customerID ?? sallerID
            const exist = await this.walletModel.findOne({ cardNumber })
            if (exist) {
                throw new AppError(`this ${cardNumber} already added :(`)
            }
            await BaseController.checkById(Userid, this.UserModel)
            const result = await this.walletModel.create(req.body);
            successRes(res, result, 201)
        } catch (error) {
            next(error)
        }
    }
    // ================================ UPDATE ================================

    updateWallet = async (req, res, next) => {
        try {
            const id = req.params.id
            await BaseController.checkById(id)
            const { customerID, sallerID, cardNumber } = req.body
            const userId = customerID ?? sallerID
            const exist = await this.walletModel.findOne({ cardNumber })
            if (exist) {
                throw new AppError(`this ${cardNumber} already added :(`)
            }
            await BaseController.checkById(userId, this.UserModel)
            const result = await this.walletModel.findByIdAndUpdate(id, req.body);
            successRes(res, result, 201)
        } catch (error) {
            next(error)
        }
    }
    // ================================ WALLET TO USER BALANCE ================================
    WalletToUser = async (req, res, next) => {
        try {
            const { customerID, sallerID, cash, cardNumber } = req.body
            const userId = customerID ?? sallerID

            const user = await BaseController.checkById(userId, this.UserModel)

            const cards = await this.UserModel.findById(user._id).populate(modelConfig.REFERENS.WALLET)
            const card = cards.WalletRef.find(val => val.cardNumber == cardNumber)

            if (!card) {
                throw new AppError(`not found this card ${cardNumber}`)
            }

            const money = + cash
            const result = await Transaction.transferMoney(next, card._id, this.walletModel, userId, this.UserModel, money)
            if (!result) {
                throw new AppError('Transfer error', 409)
            }
            successRes(res, result)
        } catch (error) {
            next(error)
        }
    }
    // ================================ USER BALANCE TO WALLET ================================
    userToWallet = async (req, res, next) => {
        try {
            const { customerID, sallerID, cash, cardNumber } = req.body
            const userId = customerID ?? sallerID

            const user = await BaseController.checkById(userId, this.UserModel)

            const cards = await this.UserModel.findById(user._id).populate(modelConfig.REFERENS.WALLET)
            const card = cards.WalletRef.find(val => val.cardNumber == cardNumber)

            if (!card) {
                throw new AppError(`not found this card ${cardNumber}`)
            }

            const money = + cash
            const result = await Transaction.transferMoney(next, userId, this.UserModel, card._id, this.walletModel, money)
            if (!result) {
                throw new AppError('Transfer error', 409)
            }
            successRes(res, result)
        } catch (error) {
            next(error)
        }
    }
    // ================================ GET ALL WALLET ================================
    getAllWallet = async (_req, res, next) => {
        try {
            const result = await this.walletModel.
                find({ [this.populateFields]: { $exists: true } }).
                populate(this.populateFields);

            successRes(res, result);
        } catch (error) {
            next(error)
        }
    }
}