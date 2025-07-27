import { Saller } from '../../models/index.schema.js'
import { UserController } from '../base/user.controller.js'

class SallerController extends UserController {
    constructor() {
        super(Saller)
    }
}

export default new SallerController()