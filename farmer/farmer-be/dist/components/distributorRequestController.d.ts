import type { Response } from "express";
import type { AuthRequest } from "../lib/auth.js";
export declare class DistributorRequestController {
    static createRequest(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getReceivedRequests(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getSentRequests(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateRequestStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteRequest(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getRequestStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAvailableDistributors(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=distributorRequestController.d.ts.map