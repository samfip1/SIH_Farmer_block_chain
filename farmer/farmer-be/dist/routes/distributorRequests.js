import { Router } from "express";
// import { DistributorRequestController } from "../controllers/distributorRequestController"
import { AuthService } from "../lib/auth.js";
import { DistributorRequestController } from "../components/distributorRequestController.js";
const router = Router();
// All routes require authentication
router.use(AuthService.authenticateToken);
// Request management routes
router.post("/", DistributorRequestController.createRequest);
router.get("/received", DistributorRequestController.getReceivedRequests);
router.get("/sent", DistributorRequestController.getSentRequests);
router.get("/stats", DistributorRequestController.getRequestStats);
router.get("/distributors", DistributorRequestController.getAvailableDistributors);
router.put("/:id", DistributorRequestController.updateRequestStatus);
router.delete("/:id", DistributorRequestController.deleteRequest);
export default router;
//# sourceMappingURL=distributorRequests.js.map