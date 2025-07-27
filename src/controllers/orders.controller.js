import { Order } from '../models/index.schema.js'
import { BaseController } from './base.controller.js';

class OrderController extends BaseController {
    constructor() {
        super(Order)
    }
}

export default new OrderController();