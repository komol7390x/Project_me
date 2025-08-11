import mongoose from 'mongoose'
import { AppError } from '../error/AppError.js'

class TransactionToUser {
    transferMoney = async (next, fromId, fromModel, toId, toModel, amount = 0) => {
        if (amount <= 0) {
            throw new AppError('amount upper to 0', 400)
        }

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const from = await fromModel.findById(fromId).session(session)
            const to = await toModel.findById(toId).session(session)

            if (!from || !to) {
                throw new AppError('not found user', 404)
            }

            if (from.balance < amount) {
                throw new AppError('not enough money', 400)
            }

            const fromResult = await fromModel.findByIdAndUpdate(
                fromId,
                { $inc: { balance: -amount } },
                { new: true, session }
            )

            const toResult = await toModel.findByIdAndUpdate(
                toId,
                { $inc: { balance: amount } },
                { new: true, session }
            )

            await session.commitTransaction()
            session.endSession()

            return {
                statusCode: 200,
                message: 'success',
                fromResult,
                toResult,
                amount
            }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            next(error)
        }
    }

    paymentForOrder = async (next, fromId, fromModel, toId, toModel, money = 0,
        productId, productModel, quantity
    ) => {

        if (money <= 0) {
            throw new AppError('money upper to 0', 400)
        }

        const session = await mongoose.startSession()
        session.startTransaction()

        try {

            const from = await fromModel.findById(fromId).session(session)
            const to = await toModel.findById(toId).session(session)
            const product = await productModel.findById(productId).session(session)

            if (!from || !to || !product) {
                throw new AppError('not found user or product', 404)
            }

            if (from.balance < money) {
                throw new AppError('not enough money', 400)
            }

            if (product.stockQuantity < quantity) {
                throw new AppError('not enough product quantity sorry :(', 409)
            }

            const fromResult = await fromModel.findByIdAndUpdate(
                fromId,
                { $inc: { balance: -money } },
                { new: true, session }
            )

            const toResult = await toModel.findByIdAndUpdate(
                toId,
                { $inc: { balance: money } },
                { new: true, session }
            )

            const productResult = await productModel.findByIdAndUpdate(
                productId,
                { $inc: { stockQuantity: -quantity } },
                { new: true, session }
            )

            await session.commitTransaction()
            session.endSession()

            return {
                statusCode: 200,
                message: 'success',
                productResult,
                fromResult,
                toResult,
                money
            }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            next(error)
        }
    }
}

export default new TransactionToUser()