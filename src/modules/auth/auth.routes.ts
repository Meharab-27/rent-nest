import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register",authController.registerUser)
router.post("/login",authController.loginUser)
router.get("/me", authenticate, authController.getMe)

export const authRoutes = router;