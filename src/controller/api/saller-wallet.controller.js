import { WalletController } from "../wallet.controller.js";

import { modelConfig } from "../../config/model.config.js";

import { Saller } from '../../model/client/saller.model.js'
import { Wallet } from "../../model/api/wallet.model.js";

class SallerWalletController extends WalletController {
    constructor() {
        super(Wallet, Saller, [modelConfig.VIRTUAL.SALLER])
    }
}
export default new SallerWalletController()