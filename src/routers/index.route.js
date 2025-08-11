import { Router } from "express";
import { pageError } from "../error/not-found-page.js";

import Admin from './clients/admin.route.js'
import Customer from './clients/customer.route.js'
import Saller from './clients/saller.route.js'

import Customer_Wallet from './api/customer-wallet.route.js'
import Saller_Wallet from './api/saller-wallet.route.js'
import Product from './api/product.route.js'
import Category from './api/category.route.js'
import Delivery from './api/delivery.route.js'
import Payment from './api/payment.route.js'
import Order from './api/order.route.js'

const router = Router()

router
    .use('/admin', Admin)
    .use('/customer',Customer)
    .use('/saller',Saller)

    .use('/product',Product)
    .use('/category',Category)
    .use('/delivery', Delivery)
    .use('/saller-wallet', Saller_Wallet)
    .use('/customer-wallet', Customer_Wallet)

    .use('/payment',Payment)
    .use('/order',Order)

    .use(pageError)

export default router