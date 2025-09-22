import { Router } from "express";
// import { AuthController } from "../controllers/authController"
import { AuthService } from "../lib/auth.js";
import { AuthController } from "../components/authController.js";
const router = Router();
// Public routes
router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
// Protected routes
router.get("/profile", AuthService.authenticateToken, AuthController.getProfile);
router.post("/refresh", AuthService.authenticateToken, AuthController.refreshToken);
export default router;
//# sourceMappingURL=auth.js.map