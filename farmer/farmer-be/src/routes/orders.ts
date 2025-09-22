import { Router } from "express"
// import { OrderController } from "../controllers/orderController"
import { AuthService } from "../lib/auth.js"
import { OrderController } from "../components/orderController.js"

const router = Router()

// All routes require authentication
router.use(AuthService.authenticateToken)

// Order management routes
router.post("/", OrderController.createOrder)
router.get("/", OrderController.getOrders)
router.get("/stats", OrderController.getOrderStats)
router.get("/:id", OrderController.getOrderById)
router.put("/:id", OrderController.updateOrder)
router.delete("/:id", OrderController.deleteOrder)

export default router
