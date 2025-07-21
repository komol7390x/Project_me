import BaseController from './index.js';
import {Todo} from '../models/todo.model.js'

class TodoController extends BaseController{
    constructor(){
        super(Todo)
    }
}