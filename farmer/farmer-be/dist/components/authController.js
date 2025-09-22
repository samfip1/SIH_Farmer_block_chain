import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AuthService } from "../lib/auth.js";
import { randomUUID } from "crypto";
const prisma = new PrismaClient();
// Validation schemas
const signupSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(["FARMER", "DISTRIBUTOR"]).default("FARMER"),
});
const signinSchema = z.object({
    username: z.string(),
    password: z.string(),
});
export class AuthController {
    static async signup(req, res) {
        try {
            const validatedData = signupSchema.parse(req.body);
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [{ username: validatedData.username }, { email: validatedData.email }],
                },
            });
            if (existingUser) {
                return res.status(400).json({
                    error: "User with this username or email already exists",
                });
            }
            const hashedPassword = await AuthService.hashPassword(validatedData.password);
            // --- START FIX ---
            // Destructure the validated data to handle optional fields separately.
            const { fullName, phone, address, ...requiredData } = validatedData;
            const user = await prisma.user.create({
                data: {
                    // Spread the required data that doesn't need conversion
                    ...requiredData,
                    uniqueId: randomUUID(),
                    password: hashedPassword,
                    // Explicitly convert potentially 'undefined' values to 'null' for Prisma
                    fullName: fullName ?? null,
                    phone: phone ?? null,
                    address: address ?? null,
                },
                // --- END FIX ---
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    phone: true,
                    address: true,
                    role: true,
                    createdAt: true,
                },
            });
            const token = AuthService.generateToken({
                userId: user.id,
                username: user.username,
                role: user.role,
            });
            res.status(201).json({
                message: "User created successfully",
                user,
                token,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error,
                });
            }
            console.error("Signup error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async signin(req, res) {
        try {
            const { username, password } = signinSchema.parse(req.body);
            const user = await prisma.user.findUnique({
                where: { username },
            });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const isValidPassword = await AuthService.comparePassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const token = AuthService.generateToken({
                userId: user.id,
                username: user.username,
                role: user.role,
            });
            const { password: _, ...userWithoutPassword } = user;
            res.json({
                message: "Login successful",
                user: userWithoutPassword,
                token,
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error,
                });
            }
            console.error("Signin error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const user = await prisma.user.findUnique({
                where: { id: userId },
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
                    updatedAt: true,
                },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ user });
        }
        catch (error) {
            console.error("Get profile error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async refreshToken(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, username: true, role: true },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const token = AuthService.generateToken({
                userId: user.id,
                username: user.username,
                role: user.role,
            });
            res.json({ token });
        }
        catch (error) {
            console.error("Refresh token error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
//# sourceMappingURL=authController.js.map