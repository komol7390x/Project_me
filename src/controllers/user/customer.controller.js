import { Customer } from '../../models/index.schema.js'
import { UserController } from '../base/user.controller.js'

class CustomerController extends UserController {
    constructor() {
        super(Customer)
    }
}

export default new CustomerController()