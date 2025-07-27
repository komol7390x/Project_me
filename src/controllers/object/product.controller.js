import { Product } from '../../models/index.schema.js'
import { BaseController } from '../base/base.controller.js';

class ProductController extends BaseController {
    constructor() {
        super(Product)
    }
}

export default new ProductController();