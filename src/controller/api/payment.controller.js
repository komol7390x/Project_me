import Redis from "../../utils/Redis.js";
import Transaction from '../../utils/Transaction.js'

import { BaseController } from "../base.controller.js";
import { AppError } from "../../error/AppError.js";
import { successRes } from "../../utils/successRes.js";
import { modelConfig } from "../../config/model.config.js";

import { Customers } from "../../model/client/customer.model.js";
import { Saller } from '../../model/client/saller.model.js'
import { Product } from "../../model/api/product.model.js";
import { Payment } from '../../model/api/payment.model.js'
import { Order } from "../../model/api/order.model.js";

class PaymentController extends BaseController {
    constructor() {
        super(Payment)
    }
    createPayment = async (req, res, next) => {
        try {

            const { secretKey, access } = req.body

            if (!access) {
                throw new AppError('sorry try again latter', 409)
            }
            const redis = await Redis.getDate(secretKey);
            if (!redis) {
                throw new AppError('error to secret key :(', 409)
            }
            const order = JSON.parse(redis);
            if (!order) {
                throw new AppError('sorry not found order for product', 409)
            }
            const product = await Product.findById(order?.productID).populate(modelConfig.VIRTUAL.SALLER)

            const sallerId = product?.sallerID?._id
            if (!sallerId) {
                throw new AppError('not found saller sorry :(', 403)
            }

            const result = await Transaction.
                paymentForOrder(next, order.customerID, Customers, sallerId, Saller, order?.totalPrice,
                    product._id, Product, order.orderQuantity
                )
            if (!result) {
                throw new AppError('sorry confilct from Transfer', 409)
            }

            const orderDate = {
                orderQuantity: order.orderQuantity,
                totalPrice: order.totalPrice,
                customerID: order.customerID,
                productID: order.productID,
                status: true
            }

            const orderResult = await Order.create(orderDate)
            if (!orderResult) {
                throw new AppError('error to write order to base', 409)
            }
            const paymentDate = {
                productName: product.name,
                price: product.price,
                totalPrice: order.totalPrice,
                status: true,
                access: true
            }
            const paymnetResult = await Payment.create(paymentDate)
            if (!paymnetResult) {
                throw new AppError('error to write payment to base', 409)
            }
            successRes(res, paymnetResult, 201)

        } catch (error) {
            req.body.status = false
            delete req.body.secretKey
            const result = await Payment.create(req.body)
            if (!result) {
                throw new AppError('error to payment', 409)
            }
            next(error)
        }
    }
}

export default new PaymentController()