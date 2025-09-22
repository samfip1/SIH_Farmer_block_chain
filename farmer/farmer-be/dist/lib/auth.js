import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export class AuthService {
    static JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
    static JWT_EXPIRES_IN = "7d";
    static async hashPassword(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    static generateToken(payload) {
        return jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        });
    }
    static verifyToken(token) {
        return jwt.verify(token, this.JWT_SECRET);
    }
    static authenticateToken(req, res, next) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ error: "Access token required" });
        }
        try {
            const decoded = AuthService.verifyToken(token);
            req.user = decoded;
            next();
        }
        catch (error) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
    }
    static requireRole(roles) {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ error: "Authentication required" });
            }
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ error: "Insufficient permissions" });
            }
            next();
        };
    }
}
//# sourceMappingURL=auth.js.map