import { Request, Response } from "express";
import { ReminderService } from "../services/reminder.service";

const service = new ReminderService();

export class ReminderController {
  static async create(req: Request, res: Response) {
    const data = await service.create(req.user!.uid, req.body);
    res.status(201).json(data);
  }

  static async getAll(req: Request, res: Response) {
    const data = await service.getAll(req.user!.uid);
    res.status(200).json(data);
  }

  static async getById(req: Request, res: Response) {
    const data = await service.getById(req.params.id);
    res.status(200).json(data);
  }

  static async update(req: Request, res: Response) {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json(data);
  }

  static async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }
}