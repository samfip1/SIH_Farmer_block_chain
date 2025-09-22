import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { Request, Response, NextFunction } from "express"

export interface JWTPayload {
  userId: string
  username: string
  role: string
}

export interface AuthRequest extends Request {
  user?: JWTPayload
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"
  private static readonly JWT_EXPIRES_IN = "7d"

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    })
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.JWT_SECRET) as JWTPayload
  }

  static authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }

    try {
      const decoded = AuthService.verifyToken(token)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(403).json({ error: "Invalid or expired token" })
    }
  }

  static requireRole(roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" })
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Insufficient permissions" })
      }

      next()
    }
  }
}
