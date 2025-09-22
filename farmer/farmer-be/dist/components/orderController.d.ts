import type { Response, Request } from "express";
interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: "ADMIN" | "FARMER" | "DISTRIBUTOR";
    };
}
export declare class OrderController {
    static createOrder(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getOrders(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getOrderById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateOrder(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteOrder(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getOrderStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export {};
//# sourceMappingURL=orderController.d.ts.map