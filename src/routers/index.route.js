import { Router } from "express";

import adminRouter from './users/admin.route.js'
import customerRouter from './users/customer.route.js'
import categoryRouter from './object/category.route.js'
import imageRouter from './object/image.route.js'
import orderRouter from './object/order.route.js'
import productRouter from './object/product.route.js'
import { pageError } from "../errors/page-not-found.js";
const router = Router()

router
    .use('/admin', adminRouter)
    .use('/customer', customerRouter)
    .use('/category', categoryRouter)
    .use('/image', imageRouter)
    .use('/order', orderRouter)
    .use('/product', productRouter)

    .use(pageError)

export default router
