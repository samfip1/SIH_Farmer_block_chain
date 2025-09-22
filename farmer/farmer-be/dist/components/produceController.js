import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();
// Validation schemas
const createProduceSchema = z.object({
    produceUniqueId: z.string().min(1, "Produce unique ID is required"),
    cropName: z.string().min(1, "Crop name is required"),
    farmLocation: z.string().min(1, "Farm location is required"),
    qualityGrade: z.string().min(1, "Quality grade is required"),
    harvestDate: z.string().transform((str) => new Date(str)),
    basePrice: z.number().positive("Base price must be positive"),
    quantity: z.number().positive("Quantity must be positive"),
    unit: z.string().min(1, "Unit is required"),
    imageUrl: z.string().url().optional(),
});
const updateProduceSchema = z.object({
    cropName: z.string().min(1).optional(),
    farmLocation: z.string().min(1).optional(),
    qualityGrade: z.string().min(1).optional(),
    harvestDate: z.string().transform((str) => new Date(str)).optional(),
    basePrice: z.number().positive().optional(),
    quantity: z.number().positive().optional(),
    unit: z.string().min(1).optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
});
// Create new produce
export const createProduce = async (req, res) => {
    try {
        const validatedData = createProduceSchema.parse(req.body);
        const userId = req.user?.userId; // Corrected: userId
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { uniqueId: true, role: true },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.role !== "FARMER") {
            return res.status(403).json({ error: "Only farmers can add produce" });
        }
        const existingProduce = await prisma.produce.findUnique({
            where: { produceUniqueId: validatedData.produceUniqueId },
        });
        if (existingProduce) {
            return res.status(400).json({ error: "Produce unique ID already exists" });
        }
        const { imageUrl, ...restOfData } = validatedData;
        const produce = await prisma.produce.create({
            data: {
                ...restOfData,
                farmerUniqueId: user.uniqueId,
                imageUrl: imageUrl ?? null,
            },
            include: {
                farmer: { select: { id: true, uniqueId: true, fullName: true, username: true } },
            },
        });
        res.status(201).json({
            message: "Produce created successfully",
            produce,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation failed", details: error });
        }
        console.error("Create produce error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Get all produces with filters
export const getProduces = async (req, res) => {
    try {
        const { page = "1", limit = "10", cropName, qualityGrade, farmLocation, isActive = "true", sortBy = "createdAt", sortOrder = "desc", } = req.query;
        const pageNum = Number.parseInt(page);
        const limitNum = Number.parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            isActive: isActive === "true",
        };
        if (cropName) {
            where.cropName = { contains: cropName, mode: "insensitive" };
        }
        if (qualityGrade) {
            where.qualityGrade = qualityGrade;
        }
        if (farmLocation) {
            where.farmLocation = { contains: farmLocation, mode: "insensitive" };
        }
        const [produces, total] = await Promise.all([
            prisma.produce.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    farmer: { select: { id: true, uniqueId: true, fullName: true, username: true, phone: true } },
                    apmcUpdates: {
                        include: { apmc: { select: { name: true, location: true } } },
                    },
                },
            }),
            prisma.produce.count({ where }),
        ]);
        res.json({
            produces,
            pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
        });
    }
    catch (error) {
        console.error("Get produces error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Get produce by ID
export const getProduceById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Produce ID is required" });
        }
        const produce = await prisma.produce.findUnique({
            where: { id },
            include: {
                farmer: { select: { id: true, uniqueId: true, fullName: true, username: true, phone: true, address: true } },
                apmcUpdates: {
                    include: { apmc: { select: { uniqueId: true, name: true, location: true } } },
                    orderBy: { updatedAt: "desc" },
                },
            },
        });
        if (!produce) {
            return res.status(404).json({ error: "Produce not found" });
        }
        res.json({ produce });
    }
    catch (error) {
        console.error("Get produce by ID error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Update produce
export const updateProduce = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = updateProduceSchema.parse(req.body);
        const userId = req.user?.userId; // Corrected: userId
        if (!id) {
            return res.status(400).json({ error: "Produce ID is required" });
        }
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const existingProduce = await prisma.produce.findUnique({
            where: { id },
            select: { farmerUniqueId: true },
        });
        if (!existingProduce) {
            return res.status(404).json({ error: "Produce not found" });
        }
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { uniqueId: true } });
        if (existingProduce.farmerUniqueId !== user?.uniqueId) {
            return res.status(403).json({ error: "You can only update your own produce" });
        }
        const updateData = {};
        if (validatedData.cropName !== undefined)
            updateData.cropName = validatedData.cropName;
        if (validatedData.farmLocation !== undefined)
            updateData.farmLocation = validatedData.farmLocation;
        if (validatedData.qualityGrade !== undefined)
            updateData.qualityGrade = validatedData.qualityGrade;
        if (validatedData.harvestDate !== undefined)
            updateData.harvestDate = validatedData.harvestDate;
        if (validatedData.basePrice !== undefined)
            updateData.basePrice = validatedData.basePrice;
        if (validatedData.quantity !== undefined)
            updateData.quantity = validatedData.quantity;
        if (validatedData.unit !== undefined)
            updateData.unit = validatedData.unit;
        if (validatedData.isActive !== undefined)
            updateData.isActive = validatedData.isActive;
        if (validatedData.imageUrl !== undefined) {
            updateData.imageUrl = validatedData.imageUrl;
        }
        const updatedProduce = await prisma.produce.update({
            where: { id },
            data: updateData,
            include: {
                farmer: {
                    select: {
                        id: true,
                        uniqueId: true,
                        fullName: true,
                        username: true,
                    },
                },
            },
        });
        res.json({
            message: "Produce updated successfully",
            produce: updatedProduce,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation failed", details: error });
        }
        console.error("Update produce error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Delete produce
export const deleteProduce = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId; // Corrected: userId
        if (!id) {
            return res.status(400).json({ error: "Produce ID is required" });
        }
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const existingProduce = await prisma.produce.findUnique({
            where: { id },
            select: { farmerUniqueId: true },
        });
        if (!existingProduce) {
            return res.status(404).json({ error: "Produce not found" });
        }
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { uniqueId: true } });
        if (existingProduce.farmerUniqueId !== user?.uniqueId) {
            return res.status(403).json({ error: "You can only delete your own produce" });
        }
        await prisma.produce.delete({
            where: { id },
        });
        res.json({ message: "Produce deleted successfully" });
    }
    catch (error) {
        console.error("Delete produce error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Get farmer's produces
export const getFarmerProduces = async (req, res) => {
    try {
        const userId = req.user?.userId; // Corrected: userId
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { uniqueId: true, role: true },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.role !== "FARMER") {
            return res.status(403).json({ error: "Only farmers can access this endpoint" });
        }
        const produces = await prisma.produce.findMany({
            where: {
                farmerUniqueId: user.uniqueId,
            },
            include: {
                apmcUpdates: {
                    include: {
                        apmc: {
                            select: { name: true, location: true },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json({ produces });
    }
    catch (error) {
        console.error("Get farmer produces error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
//# sourceMappingURL=produceController.js.map