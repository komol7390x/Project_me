import { Admin } from '../../models/index.schema.js'
import { UserController } from '../base/user.controller.js'

class AdminController extends UserController {
    constructor() {
        super(Admin)
    }
}

export default new AdminController()