import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";

const service = new AnalyticsService();

export class AnalyticsController {
  static async getSummary(req: Request, res: Response) {
    const data = await service.getSummary(req.user!.uid);

    res.status(200).json({
      success: true,
      data
    });
  }

  static async getCategories(req: Request, res: Response) {
    const data = await service.getCategoryAnalytics(req.user!.uid);

    res.status(200).json({
      success: true,
      data
    });
  }

  static async getDelays(req: Request, res: Response) {
    const data = await service.getDelayAnalytics(req.user!.uid);

    res.status(200).json({
      success: true,
      data
    });
  }
}