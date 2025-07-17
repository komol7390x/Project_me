import { Router } from "express";

import { TodoController } from "../controllers/index.js";
import { Todo } from "../models/index.js";

const todoController = new TodoController(Todo);
const router = Router();

router.post("/", todoController.createTodo.bind(todoController));
router.get('/delete',todoController.updateTodo.bind(todoController))

export default router;
