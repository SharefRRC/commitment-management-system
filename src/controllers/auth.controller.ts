import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const service = new AuthService();

type IdParams = {
  id: string;
};

export class AuthController {
  static async register(req: Request, res: Response) {
    const user = await service.register(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  }

  static async getMe(req: Request, res: Response) {
    const user = await service.getCurrentUser(req.user!.uid);

    res.status(200).json({
      success: true,
      data: user
    });
  }

  static async promoteToAdmin(req: Request<IdParams>, res: Response) {
    await service.promoteToAdmin(req.user?.role, req.params.id);

    res.status(200).json({
      success: true,
      message: "User role updated to admin"
    });
  }

  static async logout(_req: Request, res: Response) {
    res.status(200).json({
      success: true,
      message: "Logout handled on client side by removing token"
    });
  }
}