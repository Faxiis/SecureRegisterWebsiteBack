import type { Request, Response, NextFunction } from "express";

export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || user.role !== role) {
            console.log("User role:", user ? user.role : "undefined");
            return res.status(403).json({ error: "Forbidden: insufficient rights" });
        }
        next();
    };
}