import BaseController from './index.js';
import {User} from '../models/user.model.js'

class UserController extends BaseController{
    constructor(){
        super(User)
    }
}