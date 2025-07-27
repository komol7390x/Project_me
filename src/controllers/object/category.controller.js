import { Category } from '../../models/index.schema.js'
import { BaseController } from '../base/base.controller.js';

class CategoryController extends BaseController {
    constructor() {
        super(Category)
    }
}

export default new CategoryController();