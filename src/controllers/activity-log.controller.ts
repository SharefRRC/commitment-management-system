import { Request, Response } from "express";
import { ActivityLogService } from "../services/activity-log.service";
import { ApiError } from "../utils/api-error";

const service = new ActivityLogService();

export class ActivityLogController {
  static async getAll(req: Request, res: Response) {
    const data = await service.getAll(req.user!.uid);

    res.status(200).json({
      success: true,
      data
    });
  }

  static async getById(req: Request, res: Response) {
    const data = await service.getById(req.user!.uid, req.params.id);

    if (!data) {
      throw new ApiError(404, "Activity log not found");
    }

    res.status(200).json({
      success: true,
      data
    });
  }

  static async getByCommitmentId(req: Request, res: Response) {
    const data = await service.getByCommitmentId(req.user!.uid, req.params.id);

    res.status(200).json({
      success: true,
      data
    });
  }
}