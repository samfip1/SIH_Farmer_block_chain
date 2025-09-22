import express from "express"
import {
  createAPMCUpdate,
  getAPMCUpdates,
  getAPMCUpdateById,
  updateAPMCUpdate,
  deleteAPMCUpdate,
  getMyAPMCUpdates,
} from "../components/apmcUpdateController.js"
// import { createAPMCUpdate } from "../components/apmcUpdateController.js"
import { AuthService } from "../lib/auth.js"

const router = express.Router()

// All routes require authentication
router.use(AuthService.authenticateToken)

// APMC Update routes
router.post("/", createAPMCUpdate)
router.get("/", getAPMCUpdates)
router.get("/my-updates", getMyAPMCUpdates)
router.get("/:id", getAPMCUpdateById)
router.put("/:id", updateAPMCUpdate)
router.delete("/:id", deleteAPMCUpdate)

export default router
