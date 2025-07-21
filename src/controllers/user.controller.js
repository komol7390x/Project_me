import BaseController from './basic.controller.js';
import {User} from '../models/user.model.js'

export class UserController extends BaseController{
    constructor(){
        super(User)
    }
}
