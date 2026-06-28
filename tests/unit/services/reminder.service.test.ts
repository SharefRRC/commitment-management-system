import { ReminderService } from "../../../src/services/reminder.service";

describe("ReminderService", () => {
  it("should create reminder successfully", async () => {
    const mockRepository = {
      create: jest.fn().mockResolvedValue({
        id: "reminder-1",
        commitmentId: "commitment-1"
      })
    } as any;

    const mockCommitmentRepository = {
      findById: jest.fn().mockResolvedValue({
        id: "commitment-1",
        userId: "user-1"
      })
    } as any;

    const mockActivityLogService = {
      create: jest.fn()
    } as any;

    const service = new ReminderService(
      mockRepository,
      mockCommitmentRepository,
      mockActivityLogService
    );

    const result = await service.create("user-1", {
      commitmentId: "commitment-1",
      reminderDate: "2026-07-01T00:00:00.000Z",
      type: "system",
      deliveryState: "pending",
      userId: "user-1"
    } as any);

    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockActivityLogService.create).toHaveBeenCalled();
    expect(result.id).toBe("reminder-1");
  });
});