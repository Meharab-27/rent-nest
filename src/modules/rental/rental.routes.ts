import { Router } from "express";
import { rentalController } from "./rental.controller";
import { authenticate, authorizeRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, authorizeRoles("TENANT"), rentalController.createRentalRequest);
router.get("/", authenticate, authorizeRoles("TENANT"), rentalController.getMyRentalRequests);
router.get("/:id", authenticate, authorizeRoles("TENANT"), rentalController.getRentalRequestById);

export const rentalRoutes = router;
