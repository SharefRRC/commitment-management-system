import { CategoryService } from "../../../src/services/category.service";

describe("CategoryService", () => {
  it("should create category successfully", async () => {
    const mockRepository = {
      findByName: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: "category-1",
        name: "School"
      })
    } as any;

    const mockCommitmentRepository = {
      findByCategoryId: jest.fn()
    } as any;

    const mockActivityLogService = {
      create: jest.fn()
    } as any;

    const service = new CategoryService(
      mockRepository,
      mockCommitmentRepository,
      mockActivityLogService
    );

    const result = await service.create("user-1", {
      name: "School",
      color: "blue",
      userId: "user-1"
    } as any);

    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockActivityLogService.create).toHaveBeenCalled();
    expect(result.id).toBe("category-1");
  });
});