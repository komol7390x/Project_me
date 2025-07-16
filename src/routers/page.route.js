import { Router } from "express";

import { PageController } from "../controllers/index.js";

const pageController = new PageController();
const router = Router();

router.get("/", pageController.mainPage);
router.get("/login", pageController.loginPage);
router.get("/register", pageController.registerPage);
router.get("/home", pageController.homePage);

export default router;
