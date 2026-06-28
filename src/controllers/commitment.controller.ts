import { Request, Response } from "express";
import { CommitmentService } from "../services/commitment.service";

const service = new CommitmentService();

export class CommitmentController {
  static async create(req: Request, res: Response) {
    const data = await service.create(req.user!.uid, req.body);

    res.status(201).json({
      success: true,
      data
    });
  }

  static async getAll(req: Request, res: Response) {
    const data = await service.getAll(req.user!.uid);

    res.status(200).json({
      success: true,
      data
    });
  }

  static async getById(req: Request, res: Response) {
    const data = await service.getById(req.user!.uid, req.params.id);

    res.status(200).json({
      success: true,
      data
    });
  }

  static async update(req: Request, res: Response) {
    const data = await service.update(req.user!.uid, req.params.id, req.body);

    res.status(200).json({
      success: true,
      data
    });
  }

  static async updateStatus(req: Request, res: Response) {
    const data = await service.updateStatus(
      req.user!.uid,
      req.params.id,
      req.body.status,
      req.body.completedAt
    );

    res.status(200).json({
      success: true,
      data
    });
  }

  static async delete(req: Request, res: Response) {
    await service.delete(req.user!.uid, req.params.id);

    res.status(204).send();
  }
}