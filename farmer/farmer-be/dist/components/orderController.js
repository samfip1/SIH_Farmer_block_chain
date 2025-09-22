import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();
// Validation schemas
const createOrderSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.number().positive(),
        price: z.number().positive(),
        unit: z.string(),
    })),
    notes: z.string().optional(),
});
const updateOrderSchema = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
    items: z
        .array(z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.number().positive(),
        price: z.number().positive(),
        unit: z.string(),
    }))
        .optional(),
    notes: z.string().optional(),
});
export class OrderController {
    static async createOrder(req, res) {
        try {
            // --- FIX: Use safe access for user ID ---
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const validatedData = createOrderSchema.parse(req.body);
            const totalAmount = validatedData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
            const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            const order = await prisma.order.create({
                data: {
                    orderNumber,
                    userId,
                    totalAmount,
                    items: validatedData.items,
                    // --- FIX: Convert 'undefined' from Zod to 'null' for Prisma ---
                    notes: validatedData.notes ?? null,
                },
                include: {
                    user: { select: { id: true, username: true, fullName: true, email: true } },
                },
            });
            res.status(201).json({
                message: "Order created successfully",
                order,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: "Validation failed", details: error });
            }
            console.error("Create order error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getOrders(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { page = "1", limit = "10", status, search } = req.query;
            const pageNum = Number.parseInt(page);
            const limitNum = Number.parseInt(limit);
            const skip = (pageNum - 1) * limitNum;
            // --- FIX: Use Prisma's generated type for better type safety ---
            const where = {};
            if (user.role !== "ADMIN") {
                where.userId = user.userId;
            }
            if (status && status !== "ALL") {
                where.status = status; // Cast because status is a string query param
            }
            if (search) {
                where.OR = [
                    { orderNumber: { contains: search, mode: "insensitive" } },
                    { notes: { contains: search, mode: "insensitive" } },
                ];
            }
            const [orders, total] = await Promise.all([
                prisma.order.findMany({
                    where,
                    include: { user: { select: { id: true, username: true, fullName: true, email: true } } },
                    skip,
                    take: limitNum,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.order.count({ where }),
            ]);
            res.json({
                orders,
                pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
            });
        }
        catch (error) {
            console.error("Get orders error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            // --- FIX: Check for route param and user ---
            if (!id) {
                return res.status(400).json({ error: "Order ID is required" });
            }
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const where = { id };
            if (user.role !== "ADMIN") {
                where.userId = user.userId;
            }
            const order = await prisma.order.findFirst({
                where,
                include: { user: { select: { id: true, username: true, fullName: true, email: true, phone: true, address: true } } },
            });
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json({ order });
        }
        catch (error) {
            console.error("Get order by ID error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async updateOrder(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            const validatedData = updateOrderSchema.parse(req.body);
            // --- FIX: Check for route param and user ---
            if (!id) {
                return res.status(400).json({ error: "Order ID is required" });
            }
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const existingOrder = await prisma.order.findFirst({
                where: { id, ...(user.role !== "ADMIN" ? { userId: user.userId } : {}) },
            });
            if (!existingOrder) {
                return res.status(404).json({ error: "Order not found" });
            }
            if (user.role !== "ADMIN" && existingOrder.status !== "PENDING") {
                return res.status(403).json({ error: "Cannot modify order after it has been confirmed" });
            }
            // --- FIX: Build updateData safely to avoid passing `undefined` to Prisma ---
            const updateData = {};
            if (validatedData.status) {
                updateData.status = validatedData.status;
            }
            if (validatedData.notes) {
                updateData.notes = validatedData.notes;
            }
            if (validatedData.items) {
                updateData.items = validatedData.items;
                updateData.totalAmount = validatedData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
            }
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: updateData,
                include: { user: { select: { id: true, username: true, fullName: true, email: true } } },
            });
            res.json({
                message: "Order updated successfully",
                order: updatedOrder,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: "Validation failed", details: error });
            }
            console.error("Update order error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async deleteOrder(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            // --- FIX: Check for route param and user ---
            if (!id) {
                return res.status(400).json({ error: "Order ID is required" });
            }
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const existingOrder = await prisma.order.findFirst({
                where: { id, ...(user.role !== "ADMIN" ? { userId: user.userId } : {}) },
            });
            if (!existingOrder) {
                return res.status(404).json({ error: "Order not found" });
            }
            if (!["PENDING", "CANCELLED"].includes(existingOrder.status)) {
                return res.status(403).json({ error: "Cannot delete order that is being processed or completed" });
            }
            await prisma.order.delete({
                where: { id },
            });
            res.json({ message: "Order deleted successfully" });
        }
        catch (error) {
            console.error("Delete order error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getOrderStats(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const where = {};
            if (user.role !== "ADMIN") {
                where.userId = user.userId;
            }
            const [totalOrders, pendingOrders, completedOrders, cancelledOrders, totalRevenue] = await Promise.all([
                prisma.order.count({ where }),
                prisma.order.count({ where: { ...where, status: "PENDING" } }),
                prisma.order.count({ where: { ...where, status: "DELIVERED" } }),
                prisma.order.count({ where: { ...where, status: "CANCELLED" } }),
                prisma.order.aggregate({
                    where: { ...where, status: { not: "CANCELLED" } },
                    _sum: { totalAmount: true },
                }),
            ]);
            res.json({
                stats: {
                    totalOrders,
                    pendingOrders,
                    completedOrders,
                    cancelledOrders,
                    totalRevenue: totalRevenue._sum.totalAmount || 0,
                },
            });
        }
        catch (error) {
            console.error("Get order stats error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
//# sourceMappingURL=orderController.js.map