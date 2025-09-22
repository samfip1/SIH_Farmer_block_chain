import type { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}
export declare class AuthController {
    static signup(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static signin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static refreshToken(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export {};
//# sourceMappingURL=authController.d.ts.map