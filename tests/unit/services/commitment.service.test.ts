import { CommitmentService } from "../../../src/services/commitment.service";
import { ApiError } from "../../../src/utils/api-error";

describe("CommitmentService", () => {
  it("should throw error when mustStartByDate is later than dueDate", async () => {
    const mockRepository = {
      create: jest.fn()
    } as any;

    const mockCategoryRepository = {
      findById: jest.fn().mockResolvedValue(null)
    } as any;

    const mockReminderRepository = {} as any;

    const mockActivityLogService = {
      create: jest.fn()
    } as any;

    const service = new CommitmentService(
      mockRepository,
      mockCategoryRepository,
      mockReminderRepository,
      mockActivityLogService
    );

    await expect(
      service.create("user-1", {
        title: "Finish project",
        description: "Backend capstone",
        dueDate: "2026-07-01T00:00:00.000Z",
        mustStartByDate: "2026-07-02T00:00:00.000Z",
        estimatedHours: 4,
        priority: "high",
        status: "pending",
        categoryId: null,
        userId: "user-1"
      } as any)
    ).rejects.toThrow(ApiError);
  });

  it("should create commitment successfully when dates are valid", async () => {
    const mockRepository = {
      create: jest.fn().mockResolvedValue({
        id: "commitment-1",
        title: "Finish project"
      })
    } as any;

    const mockCategoryRepository = {
      findById: jest.fn().mockResolvedValue(null)
    } as any;

    const mockReminderRepository = {} as any;

    const mockActivityLogService = {
      create: jest.fn()
    } as any;

    const service = new CommitmentService(
      mockRepository,
      mockCategoryRepository,
      mockReminderRepository,
      mockActivityLogService
    );

    const result = await service.create("user-1", {
      title: "Finish project",
      description: "Backend capstone",
      dueDate: "2026-07-02T00:00:00.000Z",
      mustStartByDate: "2026-07-01T00:00:00.000Z",
      estimatedHours: 4,
      priority: "high",
      status: "pending",
      categoryId: null,
      userId: "user-1"
    } as any);

    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockActivityLogService.create).toHaveBeenCalled();
    expect(result.id).toBe("commitment-1");
  });

  it("should throw 404 when commitment does not exist", async () => {
    const mockRepository = {
      findById: jest.fn().mockResolvedValue(null)
    } as any;

    const service = new CommitmentService(
      mockRepository,
      {} as any,
      {} as any,
      {} as any
    );

    await expect(service.getById("user-1", "missing-id")).rejects.toThrow(
      "Commitment not found"
    );
  });
});