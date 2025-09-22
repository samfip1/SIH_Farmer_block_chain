import type { Response } from "express"
import { PrismaClient } from "../generated/prisma/index.js"
import { z } from "zod"
import type { AuthRequest } from "../lib/auth.js"

const prisma = new PrismaClient()

const createRequestSchema = z.object({
  apmcId: z.string(),
  cropName: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
  priceExpected: z.number().positive(),
  qualityExpected: z.string(),
  harvestDate: z.string().transform((str) => new Date(str)),
  imageUrl: z.string().url().optional(),
  location: z.string(),
  farmLocation: z.string().optional(),
  message: z.string().optional(),
  requestType: z.string().default("APMC"),
})

const updateRequestSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
  message: z.string().optional(),
})

export class APMCRequestController {
  static async createRequest(req: AuthRequest, res: Response) {
    try {
      const fromUserId = req.user!.userId
      const validatedData = createRequestSchema.parse(req.body)

      // Check if APMC yard exists
      const apmc = await prisma.aPMC.findUnique({
        where: { id: validatedData.apmcId },
        select: { id: true, name: true, location: true, isActive: true },
      })

      if (!apmc) {
        return res.status(404).json({ error: "APMC yard not found" })
      }

      if (!apmc.isActive) {
        return res.status(400).json({ error: "APMC yard is not currently active" })
      }

      const request = await prisma.aPMCRequest.create({
        data: {
          fromUserId,
          apmcId: validatedData.apmcId,
          cropName: validatedData.cropName,
          quantity: validatedData.quantity,
          unit: validatedData.unit,
          priceExpected: validatedData.priceExpected,
          qualityExpected: validatedData.qualityExpected,
          harvestDate: validatedData.harvestDate,
          location: validatedData.location,
          requestType: validatedData.requestType,
          // --- FIX 1: Convert 'undefined' from Zod to 'null' for Prisma ---
          imageUrl: validatedData.imageUrl ?? null,
          farmLocation: validatedData.farmLocation ?? null,
          message: validatedData.message ?? null,
        },
        include: {
          fromUser: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
          apmc: {
            select: {
              id: true,
              name: true,
              location: true,
              rating: true,
              speciality: true,
            },
          },
        },
      })

      res.status(201).json({
        message: "APMC request sent successfully",
        request,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error,
        })
      }

      console.error("Create APMC request error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async getMyRequests(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId
      const { page = "1", limit = "10", status } = req.query

      const pageNum = Number.parseInt(page as string)
      const limitNum = Number.parseInt(limit as string)
      const skip = (pageNum - 1) * limitNum

      const where: any = { fromUserId: userId }

      if (status && status !== "ALL") {
        where.status = status
      }

      const [requests, total] = await Promise.all([
        prisma.aPMCRequest.findMany({
          where,
          include: {
            apmc: {
              select: {
                id: true,
                name: true,
                location: true,
                rating: true,
                speciality: true,
              },
            },
          },
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
        }),
        prisma.aPMCRequest.count({ where }),
      ])

      res.json({
        requests,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      })
    } catch (error) {
      console.error("Get APMC requests error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async getRequestStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId

      const [pending, accepted, rejected] = await Promise.all([
        prisma.aPMCRequest.count({
          where: { fromUserId: userId, status: "PENDING" },
        }),
        prisma.aPMCRequest.count({
          where: { fromUserId: userId, status: "ACCEPTED" },
        }),
        prisma.aPMCRequest.count({
          where: { fromUserId: userId, status: "REJECTED" },
        }),
      ])

      // Calculate potential earnings from accepted requests
      const acceptedRequests = await prisma.aPMCRequest.findMany({
        where: { fromUserId: userId, status: "ACCEPTED" },
        select: { quantity: true, priceExpected: true },
      })

      const potentialEarnings = acceptedRequests.reduce((sum, req) => sum + req.quantity * req.priceExpected, 0)

      res.json({
        stats: {
          pending,
          accepted,
          rejected,
          total: pending + accepted + rejected,
          potentialEarnings,
        },
      })
    } catch (error) {
      console.error("Get APMC request stats error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async getAvailableAPMCs(req: AuthRequest, res: Response) {
    try {
      const { search } = req.query

      const where: any = {
        isActive: true,
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { location: { contains: search as string, mode: "insensitive" } },
          { speciality: { contains: search as string, mode: "insensitive" } },
        ]
      }

      const apmcs = await prisma.aPMC.findMany({
        where,
        select: {
          id: true,
          name: true,
          location: true,
          rating: true,
          speciality: true,
          phone: true,
          email: true,
        },
        orderBy: { name: "asc" },
        take: 50,
      })

      res.json({ apmcs })
    } catch (error) {
      console.error("Get available APMCs error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  static async deleteRequest(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user!.userId
      
      // --- FIX 2: Check if 'id' exists before using it ---
      if (!id) {
        return res.status(400).json({ error: "Request ID is required" });
      }

      const request = await prisma.aPMCRequest.findFirst({
        where: {
          id, // Now TypeScript knows 'id' is a string
          fromUserId: userId,
        },
      })

      if (!request) {
        return res.status(404).json({
          error: "Request not found or you do not have permission to delete it",
        })
      }

      await prisma.aPMCRequest.delete({
        where: { id }, // This also works now
      })

      res.json({ message: "Request deleted successfully" })
    } catch (error) {
      console.error("Delete APMC request error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}