import { Router } from "express";
import {TodoController} from '../controllers/index.js'

const router=Router()
const controller= new TodoController()

router
    .post('/',controller.create)

export default router