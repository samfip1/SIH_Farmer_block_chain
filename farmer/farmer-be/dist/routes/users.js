import { Router } from "express";
import { UserController } from "../components/userController.js";
import { AuthService } from "../lib/auth.js";
const router = Router();
// All routes require authentication
router.use(AuthService.authenticateToken);
// Profile management routes
router.put("/profile", UserController.updateProfile);
router.put("/password", UserController.changePassword);
router.delete("/account", UserController.deleteAccount);
// User listing and search (admin/distributor access)
router.get("/", AuthService.requireRole(["ADMIN", "DISTRIBUTOR"]), UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
// Admin only routes
router.put("/:id/role", AuthService.requireRole(["ADMIN"]), UserController.updateUserRole);
export default router;
//# sourceMappingURL=users.js.map