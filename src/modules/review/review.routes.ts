import { Router } from "express";
import { reviewController } from "./review.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, authorizeRoles("TENANT"), reviewController.createReview);

export const reviewRoutes = router;
