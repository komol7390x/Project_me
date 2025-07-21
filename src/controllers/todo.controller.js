import BaseController from './basic.controller.js';
import {Todo} from '../models/todo.model.js'

export class TodoController extends BaseController{
    constructor(){
        super(Todo)
    }
}

