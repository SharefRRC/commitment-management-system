import { AnalyticsService } from "../../../src/services/analytics.service";

describe("AnalyticsService", () => {
  it("should return summary analytics", async () => {
    const mockCommitmentRepository = {
      findAllByUser: jest.fn().mockResolvedValue([
        {
          id: "1",
          title: "Assignment 1",
          status: "completed",
          dueDate: "2026-06-01T00:00:00.000Z",
          mustStartByDate: "2026-05-28T00:00:00.000Z",
          completedAt: "2026-06-02T00:00:00.000Z"
        },
        {
          id: "2",
          title: "Assignment 2",
          status: "overdue",
          dueDate: "2026-06-10T00:00:00.000Z",
          mustStartByDate: "2026-06-05T00:00:00.000Z",
          completedAt: null
        }
      ])
    } as any;

    const mockCategoryRepository = {
      findAllByUser: jest.fn().mockResolvedValue([])
    } as any;

    const service = new AnalyticsService(
      mockCommitmentRepository,
      mockCategoryRepository
    );

    const result = await service.getSummary("user-1");

    expect(result.totalCommitments).toBe(2);
    expect(result.completedCommitments).toBe(1);
    expect(result.overdueCommitments).toBe(1);
  });
});