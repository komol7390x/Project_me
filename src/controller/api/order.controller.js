import Redis from '../../utils/Redis.js'

import { BaseController } from "../base.controller.js";

import { AppError } from "../../error/AppError.js";
import { successRes } from "../../utils/successRes.js";
import { configFile } from '../../config/server.config.js'

import { Order } from '../../model/api/order.model.js'
import { Product } from '../../model/api/product.model.js'
import { Customers } from "../../model/client/customer.model.js";

class OrderController extends BaseController {
    constructor() {
        super(Order)
    }
    // ========================= CREATE =========================
    createOrder = async (req, res, next) => {
        try {
            const { orderQuantity, customerID, productID } = req.body;

            const product = await BaseController.checkById(productID, Product);
            const customer = await BaseController.checkById(customerID, Customers);

            if (product.stockQuantity < orderQuantity) {
                throw new AppError(`this ${product.name} ${orderQuantity} amount not enough :(`)
            }
            const totalPrice = orderQuantity * product.price
            if (totalPrice > customer.balance) {
                throw new AppError('not enough money for buy')
            }
            const date = new Date().getTime()
            const secretKey = `${date}${configFile.PAYMENT.CONFIRM_PASSWORD}`
            req.body.totalPrice = totalPrice
            await Redis.setDate(secretKey, JSON.stringify(req.body), 600)

            successRes(res, {
                url: configFile.PAYMENT.CONFIRM_URL,
                message: 'you have 10 minut for payment to order',
                secretKey
            })
        } catch (error) {
            next(error)
        }
    }
    // ========================= UPDATE =========================
    updateOrder = async (req, res, next) => {
        try {
            const id = req.params.id
            const { orderQuantity, customerID, productID } = req.body;

            const product = await BaseController.checkById(productID, Product);
            await BaseController.checkById(customerID, Customers);
            await BaseController.checkById(id, Order)

            if (product.stockQuantity < orderQuantity) {
                throw new AppError(`this ${product.name} ${orderQuantity} amount not enough :(`)
            }

            req.body.totalPrice = orderQuantity * product.price
            const result = await Order.findByIdAndUpdate(id, req.body, { new: true })
            successRes(res, result, 200)
        } catch (error) {
            next(error)
        }
    }
}

export default new OrderController()