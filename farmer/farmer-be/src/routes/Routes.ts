import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import produceRoutes from "./produce.js";
import apmcRequestRoutes from "./apmcRequests.js";

const router = Router();

// Mount all the individual route files onto specific paths
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/produce", produceRoutes);
router.use("/apmc-requests", apmcRequestRoutes);


export default router;