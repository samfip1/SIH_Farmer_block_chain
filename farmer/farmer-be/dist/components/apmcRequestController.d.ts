import type { Response } from "express";
import type { AuthRequest } from "../lib/auth.js";
export declare class APMCRequestController {
    static createRequest(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getMyRequests(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getRequestStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAvailableAPMCs(req: AuthRequest, res: Response): Promise<void>;
    static deleteRequest(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=apmcRequestController.d.ts.map