import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AuthService } from "../lib/auth.js";
const prisma = new PrismaClient();
// Validation schemas
const updateProfileSchema = z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    avatar: z.string().url().optional(),
});
const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
});
export class UserController {
    static async updateProfile(req, res) {
        try {
            // --- FIX: Use safe access for user ID ---
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const validatedData = updateProfileSchema.parse(req.body);
            if (validatedData.email) {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email: validatedData.email,
                        NOT: { id: userId },
                    },
                });
                if (existingUser) {
                    return res.status(400).json({ error: "Email is already taken by another user" });
                }
            }
            // --- FIX: Build updateData safely to avoid passing `undefined` ---
            const updateData = {};
            if (validatedData.fullName !== undefined)
                updateData.fullName = validatedData.fullName;
            if (validatedData.email !== undefined)
                updateData.email = validatedData.email;
            if (validatedData.phone !== undefined)
                updateData.phone = validatedData.phone;
            if (validatedData.address !== undefined)
                updateData.address = validatedData.address;
            if (validatedData.avatar !== undefined)
                updateData.avatar = validatedData.avatar;
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    address: true,
                    avatar: true,
                    role: true,
                    updatedAt: true,
                },
            });
            res.json({
                message: "Profile updated successfully",
                user: updatedUser,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: "Validation failed", details: error });
            }
            console.error("Update profile error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async changePassword(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const isValidPassword = await AuthService.comparePassword(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }
            const hashedNewPassword = await AuthService.hashPassword(newPassword);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword },
            });
            res.json({ message: "Password changed successfully" });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: "Validation failed", details: error });
            }
            console.error("Change password error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async deleteAccount(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            await prisma.user.delete({
                where: { id: userId },
            });
            res.json({ message: "Account deleted successfully" });
        }
        catch (error) {
            console.error("Delete account error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const { page = "1", limit = "10", role, search } = req.query;
            const pageNum = Number.parseInt(page);
            const limitNum = Number.parseInt(limit);
            const skip = (pageNum - 1) * limitNum;
            const where = {};
            if (role && role !== "ALL") {
                where.role = role;
            }
            if (search) {
                const searchString = search;
                where.OR = [
                    { username: { contains: searchString, mode: "insensitive" } },
                    { fullName: { contains: searchString, mode: "insensitive" } },
                    { email: { contains: searchString, mode: "insensitive" } },
                ];
            }
            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where,
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        fullName: true,
                        phone: true,
                        role: true,
                        createdAt: true,
                        _count: {
                            select: { orders: true, distributorRequests: true },
                        },
                    },
                    skip,
                    take: limitNum,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.user.count({ where }),
            ]);
            res.json({
                users,
                pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
            });
        }
        catch (error) {
            console.error("Get all users error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            // --- FIX: Check for route param ---
            if (!id) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    address: true,
                    avatar: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: { orders: true, distributorRequests: true, sentRequests: true },
                    },
                },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ user });
        }
        catch (error) {
            console.error("Get user by ID error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            // --- FIX: Check for route param ---
            if (!id) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const { role } = z.object({ role: z.enum(["FARMER", "DISTRIBUTOR", "ADMIN"]) }).parse(req.body);
            const updatedUser = await prisma.user.update({
                where: { id },
                data: { role },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    updatedAt: true,
                },
            });
            res.json({
                message: "User role updated successfully",
                user: updatedUser,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ error: "Validation failed", details: error });
            }
            console.error("Update user role error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
//# sourceMappingURL=userController.js.map