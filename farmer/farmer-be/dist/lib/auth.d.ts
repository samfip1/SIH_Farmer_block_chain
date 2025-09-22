import type { Request, Response, NextFunction } from "express";
export interface JWTPayload {
    userId: string;
    username: string;
    role: string;
}
export interface AuthRequest extends Request {
    user?: JWTPayload;
}
export declare class AuthService {
    private static readonly JWT_SECRET;
    private static readonly JWT_EXPIRES_IN;
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    static generateToken(payload: JWTPayload): string;
    static verifyToken(token: string): JWTPayload;
    static authenticateToken(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
    static requireRole(roles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=auth.d.ts.map