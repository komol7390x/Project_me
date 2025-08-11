import { WalletController } from "../wallet.controller.js";
import { modelConfig } from "../../config/model.config.js";

import { Wallet } from "../../model/api/wallet.model.js";
import { Customers } from '../../model/client/customer.model.js'


class CustomerWalletController extends WalletController {
    constructor() {
        super(Wallet, Customers, [modelConfig.VIRTUAL.CUSTOMER])
    }
}
export default new CustomerWalletController()