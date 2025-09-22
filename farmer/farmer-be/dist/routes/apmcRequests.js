import { Router } from "express";
// import { APMCRequestController } from "../controllers/apmcRequestController"
import { AuthService } from "../lib/auth.js";
import { APMCRequestController } from "../components/apmcRequestController.js";
const router = Router();
// All routes require authentication
router.use(AuthService.authenticateToken);
router.post("/", APMCRequestController.createRequest);
router.get("/my-requests", APMCRequestController.getMyRequests);
router.get("/stats", APMCRequestController.getRequestStats);
router.get("/apmcs", APMCRequestController.getAvailableAPMCs);
router.delete("/:id", APMCRequestController.deleteRequest);
export default router;
//# sourceMappingURL=apmcRequests.js.map