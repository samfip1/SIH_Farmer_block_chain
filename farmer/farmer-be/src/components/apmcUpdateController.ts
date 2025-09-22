// --- FIX: Import 'Prisma' for type-safe queries ---
import { Prisma, PrismaClient } from "../generated/prisma/index.js"
import type { Request, Response } from "express"
import { z } from "zod"

// --- FIX: Define a custom request type for authenticated routes ---
interface AuthRequest extends Request {
  user?: {
    id: string
  }
}

const prisma = new PrismaClient()

// Validation schemas
const createAPMCUpdateSchema = z.object({
  produceUniqueId: z.string().min(1, "Produce unique ID is required"),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
  commission: z.number().min(0, "Commission cannot be negative"),
})

const updateAPMCUpdateSchema = z.object({
  quantity: z.number().positive().optional(),
  price: z.number().positive().optional(),
  commission: z.number().min(0).optional(),
})

// Create APMC update
export const createAPMCUpdate = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createAPMCUpdateSchema.parse(req.body)
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    // Get APMC user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { uniqueId: true, role: true, fullName: true },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.role !== "APMC") {
      return res.status(403).json({ error: "Only APMC users can create updates" })
    }

    // Check if produce exists
    const produce = await prisma.produce.findUnique({
      where: { produceUniqueId: validatedData.produceUniqueId },
      select: { id: true, cropName: true, isActive: true },
    })

    if (!produce) {
      return res.status(404).json({ error: "Produce not found" })
    }

    if (!produce.isActive) {
      return res.status(400).json({ error: "Produce is not active" })
    }

    // Calculate final APMC price
    const finalAPMCPrice = validatedData.price + validatedData.commission

    const apmcUpdate = await prisma.aPMCUpdate.create({
      data: {
        apmcUniqueId: user.uniqueId,
        produceUniqueId: validatedData.produceUniqueId,
        apmcName: user.fullName || "APMC User",
        quantity: validatedData.quantity,
        price: validatedData.price,
        commission: validatedData.commission,
        finalAPMCPrice,
        // --- FIX: Removed manual 'updatedAt'. Prisma's @updatedAt handles this automatically.
      },
      include: {
        produce: {
          select: {
            id: true,
            produceUniqueId: true,
            cropName: true,
            farmer: {
              select: {
                uniqueId: true,
                fullName: true,
                username: true,
              },
            },
          },
        },
        apmc: {
          select: {
            uniqueId: true,
            name: true,
            location: true,
          },
        },
      },
    })

    res.status(201).json({
      message: "APMC update created successfully",
      update: apmcUpdate,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error })
    }
    console.error("Create APMC update error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get APMC updates with filters
export const getAPMCUpdates = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      produceUniqueId,
      apmcUniqueId,
      sortBy = "updatedAt",
      sortOrder = "desc",
    } = req.query

    const pageNum = Number.parseInt(page as string)
    const limitNum = Number.parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // --- FIX: Use Prisma's generated type for the 'where' clause for better type safety ---
    const where: Prisma.APMCUpdateWhereInput = {}

    if (produceUniqueId) {
      where.produceUniqueId = produceUniqueId as string
    }

    if (apmcUniqueId) {
      where.apmcUniqueId = apmcUniqueId as string
    }

    const [updates, total] = await Promise.all([
      prisma.aPMCUpdate.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          [sortBy as string]: sortOrder as "asc" | "desc",
        },
        include: {
          produce: {
            select: {
              produceUniqueId: true,
              cropName: true,
              qualityGrade: true,
              farmer: {
                select: {
                  uniqueId: true,
                  fullName: true,
                  username: true,
                },
              },
            },
          },
          apmc: {
            select: {
              uniqueId: true,
              name: true,
              location: true,
            },
          },
        },
      }),
      prisma.aPMCUpdate.count({ where }),
    ])

    res.json({
      updates,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error("Get APMC updates error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get APMC update by ID
export const getAPMCUpdateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // --- FIX: Check for 'id' to prevent passing 'undefined' to Prisma ---
    if (!id) {
      return res.status(400).json({ error: "APMC update ID is required" })
    }

    const update = await prisma.aPMCUpdate.findUnique({
      where: { id },
      include: {
        produce: {
          include: {
            farmer: {
              select: {
                uniqueId: true,
                fullName: true,
                username: true,
                phone: true,
                address: true,
              },
            },
          },
        },
        apmc: {
          select: {
            uniqueId: true,
            name: true,
            location: true,
            phone: true,
            email: true,
          },
        },
      },
    })

    if (!update) {
      return res.status(404).json({ error: "APMC update not found" })
    }

    res.json({ update })
  } catch (error) {
    console.error("Get APMC update by ID error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Update APMC update
// Update APMC update
export const updateAPMCUpdate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const validatedData = updateAPMCUpdateSchema.parse(req.body)
    const userId = req.user?.id

    if (!id) {
      return res.status(400).json({ error: "APMC update ID is required" })
    }

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { uniqueId: true, role: true },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.role !== "APMC") {
      return res.status(403).json({ error: "Only APMC users can update APMC updates" })
    }

    const existingUpdate = await prisma.aPMCUpdate.findUnique({
      where: { id },
    })

    if (!existingUpdate) {
      return res.status(404).json({ error: "APMC update not found" })
    }

    if (existingUpdate.apmcUniqueId !== user.uniqueId) {
      return res.status(403).json({ error: "You can only update your own APMC updates" })
    }

    // --- START FIX ---
    // Create an empty object and only add fields that were actually provided in the request.
    // This prevents passing `undefined` values to Prisma.
    const updateData: Prisma.APMCUpdateUpdateInput = {}

    if (validatedData.quantity !== undefined) {
      updateData.quantity = validatedData.quantity
    }
    if (validatedData.price !== undefined) {
      updateData.price = validatedData.price
    }
    if (validatedData.commission !== undefined) {
      updateData.commission = validatedData.commission
    }

    // Calculate new final APMC price if price or commission changed
    if (validatedData.price !== undefined || validatedData.commission !== undefined) {
      const newPrice = validatedData.price ?? existingUpdate.price
      const newCommission = validatedData.commission ?? existingUpdate.commission
      updateData.finalAPMCPrice = newPrice + newCommission
    }
    // --- END FIX ---

    const updatedAPMCUpdate = await prisma.aPMCUpdate.update({
      where: { id },
      data: updateData, // This is now correctly typed
      include: {
        produce: {
          select: {
            produceUniqueId: true,
            cropName: true,
            farmer: {
              select: {
                uniqueId: true,
                fullName: true,
                username: true,
              },
            },
          },
        },
        apmc: {
          select: {
            uniqueId: true,
            name: true,
            location: true,
          },
        },
      },
    })

    res.json({
      message: "APMC update updated successfully",
      update: updatedAPMCUpdate,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error })
    }
    console.error("Update APMC update error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Delete APMC update
export const deleteAPMCUpdate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // --- FIX: Check for 'id' to prevent passing 'undefined' to Prisma ---
    if (!id) {
      return res.status(400).json({ error: "APMC update ID is required" })
    }

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { uniqueId: true, role: true },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check if update exists and user owns it
    const existingUpdate = await prisma.aPMCUpdate.findUnique({
      where: { id },
    })

    if (!existingUpdate) {
      return res.status(444).json({ error: "APMC update not found" })
    }

    if (existingUpdate.apmcUniqueId !== user.uniqueId && user.role !== "ADMIN") {
      return res.status(403).json({ error: "You can only delete your own APMC updates" })
    }

    await prisma.aPMCUpdate.delete({
      where: { id },
    })

    res.json({ message: "APMC update deleted successfully" })
  } catch (error) {
    console.error("Delete APMC update error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get my APMC updates
export const getMyAPMCUpdates = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { uniqueId: true, role: true },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.role !== "APMC") {
      return res.status(403).json({ error: "Only APMC users can access this endpoint" })
    }

    const updates = await prisma.aPMCUpdate.findMany({
      where: {
        apmcUniqueId: user.uniqueId,
      },
      include: {
        produce: {
          select: {
            produceUniqueId: true,
            cropName: true,
            qualityGrade: true,
            farmer: {
              select: {
                uniqueId: true,
                fullName: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    res.json({ updates })
  } catch (error) {
    console.error("Get my APMC updates error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}