import type { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export declare const createAPMCUpdate: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAPMCUpdates: (req: Request, res: Response) => Promise<void>;
export declare const getAPMCUpdateById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAPMCUpdate: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAPMCUpdate: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyAPMCUpdates: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=apmcUpdateController.d.ts.map