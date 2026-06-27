import { CommitmentService } from "../../../src/services/commitment.service";
import { ApiError } from "../../../src/utils/api-error";

describe("CommitmentService", () => {
  it("should throw error if mustStartByDate is later than dueDate", async () => {
    const mockRepo = {
      create: jest.fn()
    } as any;

    const service = new CommitmentService(mockRepo);

    await expect(
      service.create("user-1", {
        userId: "user-1",
        title: "Assignment",
        dueDate: "2026-06-20T00:00:00.000Z",
        mustStartByDate: "2026-06-21T00:00:00.000Z",
        estimatedHours: 5,
        priority: "high",
        status: "pending"
      })
    ).rejects.toThrow(ApiError);
  });

  it("should create commitment when dates are valid", async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({
        id: "abc123",
        title: "Assignment"
      })
    } as any;

    const service = new CommitmentService(mockRepo);

    const result = await service.create("user-1", {
      userId: "user-1",
      title: "Assignment",
      dueDate: "2026-06-21T00:00:00.000Z",
      mustStartByDate: "2026-06-20T00:00:00.000Z",
      estimatedHours: 5,
      priority: "high",
      status: "pending"
    });

    expect(mockRepo.create).toHaveBeenCalled();
    expect(result.id).toBe("abc123");
  });
});