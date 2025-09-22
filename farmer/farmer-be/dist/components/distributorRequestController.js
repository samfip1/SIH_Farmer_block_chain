import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();
// --- FIX: Updated Zod schema to match the new optional fields in schema.prisma ---
const createRequestSchema = z.object({
    toUserId: z.string(),
    productName: z.string().optional(),
    quantity: z.number().positive().optional(),
    unit: z.string().optional(),
    priceOffered: z.number().positive().optional(),
    qualityRequired: z.string().optional(),
    deliveryDate: z.string().transform((str) => new Date(str)).optional(),
    imageUrl: z.string().url().optional(),
    location: z.string().optional(),
    message: z.string().optional(),
});
const updateRequestSchema = z.object({
    status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
    message: z.string().optional(),
});
export class DistributorRequestController {
    static async createRequest(req, res) {
        try {
            // --- FIX: Use safe access for user ID ---
            const fromUserId = req.user?.userId;
            if (!fromUserId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const validatedData = createRequestSchema.parse(req.body);
            const targetUser = await prisma.user.findUnique({
                where: { id: validatedData.toUserId },
                select: { id: true },
            });
            if (!targetUser) {
                return res.status(404).json({ error: "Target user not found" });
            }
            if (fromUserId === validatedData.toUserId) {
                return res.status(400).json({ error: "Cannot send request to yourself" });
            }
            const existingRequest = await prisma.distributorRequest.findUnique({
                where: {
                    fromUserId_toUserId: {
                        fromUserId,
                        toUserId: validatedData.toUserId,
                    },
                },
            });
            if (existingRequest) {
                return res.status(400).json({
                    error: "Request already exists",
                    status: existingRequest.status,
                });
            }
            // --- FIX: Pass all new optional fields to the create call ---
            const request = await prisma.distributorRequest.create({
                data: {
                    fromUserId,
                    toUserId: validatedData.toUserId,
                    productName: validatedData.productName ?? null,
                    quantity: validatedData.quantity ?? null,
                    unit: validatedData.unit ?? null,
                    priceOffered: validatedData.priceOffered ?? null,
                    qualityRequired: validatedData.qualityRequired ?? null,
                    deliveryDate: validatedData.deliveryDate ?? null,
                    imageUrl: validatedData.imageUrl ?? null,
                    location: validatedData.location ?? null,
                    message: validatedData.message ?? null,
                },
                include: {
                    fromUser: { select: { id: true, username: true, fullName: true, role: true } },
                    toUser: { select: { id: true, username: true, fullName: true, role: true } },
                },
            });
            res.status(201).json({
                message: "Distributor request sent successfully",
                request,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error,
                });
            }
            console.error("Create request error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getReceivedRequests(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { page = "1", limit = "10", status } = req.query;
            const pageNum = Number.parseInt(page);
            const limitNum = Number.parseInt(limit);
            const skip = (pageNum - 1) * limitNum;
            const where = { toUserId: userId };
            if (status && status !== "ALL") {
                where.status = status;
            }
            const [requests, total] = await Promise.all([
                prisma.distributorRequest.findMany({
                    where,
                    include: { fromUser: { select: { id: true, username: true, fullName: true, email: true, phone: true, role: true, avatar: true } } },
                    skip,
                    take: limitNum,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.distributorRequest.count({ where }),
            ]);
            res.json({
                requests,
                pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
            });
        }
        catch (error) {
            console.error("Get received requests error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getSentRequests(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { page = "1", limit = "10", status } = req.query;
            const pageNum = Number.parseInt(page);
            const limitNum = Number.parseInt(limit);
            const skip = (pageNum - 1) * limitNum;
            const where = { fromUserId: userId };
            if (status && status !== "ALL") {
                where.status = status;
            }
            const [requests, total] = await Promise.all([
                prisma.distributorRequest.findMany({
                    where,
                    include: { toUser: { select: { id: true, username: true, fullName: true, email: true, phone: true, role: true, avatar: true } } },
                    skip,
                    take: limitNum,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.distributorRequest.count({ where }),
            ]);
            res.json({
                requests,
                pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
            });
        }
        catch (error) {
            console.error("Get sent requests error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async updateRequestStatus(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const validatedData = updateRequestSchema.parse(req.body);
            // --- FIX: Check for route param and user ID ---
            if (!id) {
                return res.status(400).json({ error: "Request ID is required" });
            }
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const request = await prisma.distributorRequest.findFirst({
                where: { id, toUserId: userId }, // Only the recipient can update status
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found or you do not have permission to update it" });
            }
            if (request.status !== "PENDING") {
                return res.status(400).json({ error: "Request has already been processed" });
            }
            const updatedRequest = await prisma.distributorRequest.update({
                where: { id },
                data: {
                    status: validatedData.status,
                    // --- FIX: Convert undefined to null ---
                    message: validatedData.message ?? null,
                },
                include: {
                    fromUser: { select: { id: true, username: true, fullName: true, role: true } },
                    toUser: { select: { id: true, username: true, fullName: true, role: true } },
                },
            });
            res.json({
                message: `Request ${validatedData.status.toLowerCase()} successfully`,
                request: updatedRequest,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error,
                });
            }
            console.error("Update request status error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async deleteRequest(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            // --- FIX: Check for route param and user ID ---
            if (!id) {
                return res.status(400).json({ error: "Request ID is required" });
            }
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const request = await prisma.distributorRequest.findFirst({
                where: {
                    id,
                    OR: [{ fromUserId: userId }, { toUserId: userId }],
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found or you do not have permission to delete it" });
            }
            await prisma.distributorRequest.delete({
                where: { id },
            });
            res.json({ message: "Request deleted successfully" });
        }
        catch (error) {
            console.error("Delete request error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getRequestStats(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const [receivedPending, receivedAccepted, receivedRejected, sentPending, sentAccepted, sentRejected] = await Promise.all([
                prisma.distributorRequest.count({ where: { toUserId: userId, status: "PENDING" } }),
                prisma.distributorRequest.count({ where: { toUserId: userId, status: "ACCEPTED" } }),
                prisma.distributorRequest.count({ where: { toUserId: userId, status: "REJECTED" } }),
                prisma.distributorRequest.count({ where: { fromUserId: userId, status: "PENDING" } }),
                prisma.distributorRequest.count({ where: { fromUserId: userId, status: "ACCEPTED" } }),
                prisma.distributorRequest.count({ where: { fromUserId: userId, status: "REJECTED" } }),
            ]);
            res.json({
                stats: {
                    received: {
                        pending: receivedPending,
                        accepted: receivedAccepted,
                        rejected: receivedRejected,
                        total: receivedPending + receivedAccepted + receivedRejected,
                    },
                    sent: {
                        pending: sentPending,
                        accepted: sentAccepted,
                        rejected: sentRejected,
                        total: sentPending + sentAccepted + sentRejected,
                    },
                },
            });
        }
        catch (error) {
            console.error("Get request stats error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getAvailableDistributors(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { search } = req.query;
            const where = {
                role: "DISTRIBUTOR",
                NOT: { id: userId }, // Exclude current user
            };
            if (search) {
                where.OR = [
                    { username: { contains: search, mode: "insensitive" } },
                    { fullName: { contains: search, mode: "insensitive" } },
                ];
            }
            const distributors = await prisma.user.findMany({
                where,
                select: { id: true, username: true, fullName: true, email: true, phone: true, avatar: true, createdAt: true },
                orderBy: { fullName: "asc" },
                take: 50,
            });
            res.json({ distributors });
        }
        catch (error) {
            console.error("Get available distributors error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
//# sourceMappingURL=distributorRequestController.js.map