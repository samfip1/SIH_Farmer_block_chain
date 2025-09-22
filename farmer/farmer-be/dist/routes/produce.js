import express from "express";
import { createProduce, getProduces, getProduceById, updateProduce, deleteProduce, getFarmerProduces, } from "../components/produceController.js";
import { AuthService } from "../lib/auth.js";
const router = express.Router();
// All routes require authentication
router.use(AuthService.authenticateToken);
// Produce routes
router.post("/", createProduce);
router.get("/", getProduces);
router.get("/my-produces", getFarmerProduces);
router.get("/:id", getProduceById);
router.put("/:id", updateProduce);
router.delete("/:id", deleteProduce);
export default router;
//# sourceMappingURL=produce.js.map