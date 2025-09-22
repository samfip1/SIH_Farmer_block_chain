import type { Response } from "express";
import { type AuthRequest } from "../lib/auth.js";
export declare class UserController {
    static updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static changePassword(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteAccount(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAllUsers(req: AuthRequest, res: Response): Promise<void>;
    static getUserById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateUserRole(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=userController.d.ts.map