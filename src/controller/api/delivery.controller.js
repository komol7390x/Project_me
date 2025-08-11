import { BaseController } from "../base.controller.js";

import { successRes } from "../../utils/successRes.js";
import { modelConfig } from "../../config/model.config.js";

import { Order } from '../../model/api/order.model.js'
import { Delivery } from '../../model/api/delivery.model.js'
import { AppError } from "../../error/AppError.js";

class DeliveryController extends BaseController {
    constructor() {
        super(Delivery)
    }

    createDelivery = async (req, res, next) => {
        try {
            const { orderID, access } = req.body
            if (!access) {
                throw new AppError('Delivery not access from order')
            }
            await BaseController.checkById(orderID, Order)
            const result = await Delivery.create(req.body)
            return successRes(res, result, 201)
        } catch (error) {
            next(error)
        }
    }

    updateDelivery = async (req, res, next) => {
        try {
            const id = req.params.id
            const { orderID } = req.body
            await BaseController.checkById(orderID, Order)
            const result = await Delivery.findByIdAndUpdate(id, req.body, { new: true })
            return successRes(res, result)
        } catch (error) {
            next(error)
        }
    }
}

export default new DeliveryController()