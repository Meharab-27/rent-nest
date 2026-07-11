import { Router } from "express";
import { paymentController } from "./payment.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/create", authenticate, authorizeRoles("TENANT"), paymentController.createPayment);
router.post("/confirm", authenticate, authorizeRoles("TENANT"), paymentController.confirmPayment);
router.get("/", authenticate, authorizeRoles("TENANT"), paymentController.getMyPayments);
router.get("/:id", authenticate, authorizeRoles("TENANT"), paymentController.getPaymentById);

export const paymentRoutes = router;
