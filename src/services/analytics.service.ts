import { Commitment } from "../models/commitment.model";
import { CommitmentRepository } from "../repositories/commitment.repository";
import { CategoryRepository } from "../repositories/category.repository";

export class AnalyticsService {
  constructor(
    private commitmentRepository = new CommitmentRepository(),
    private categoryRepository = new CategoryRepository()
  ) {}

  private daysBetween(laterDate: string, earlierDate: string): number {
    const later = new Date(laterDate).getTime();
    const earlier = new Date(earlierDate).getTime();
    const diff = later - earlier;

    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  private isLateStart(commitment: Commitment): boolean {
    return commitment.status === "completed" &&
      !!commitment.completedAt &&
      new Date(commitment.mustStartByDate) < new Date(commitment.completedAt);
  }

  async getSummary(userId: string) {
    const commitments = await this.commitmentRepository.findAllByUser(userId);

    const completed = commitments.filter((item) => item.status === "completed");
    const overdue = commitments.filter((item) => item.status === "overdue");
    const lateStarts = completed.filter((item) => this.isLateStart(item));

    const averageDelayInDays =
      completed.length === 0
        ? 0
        : Number(
            (
              completed.reduce((sum, item) => {
                if (!item.completedAt) {
                  return sum;
                }

                return sum + this.daysBetween(item.completedAt, item.dueDate);
              }, 0) / completed.length
            ).toFixed(2)
          );

    return {
      totalCommitments: commitments.length,
      completedCommitments: completed.length,
      overdueCommitments: overdue.length,
      lateStarts: lateStarts.length,
      averageDelayInDays
    };
  }

  async getCategoryAnalytics(userId: string) {
    const categories = await this.categoryRepository.findAllByUser(userId);
    const commitments = await this.commitmentRepository.findAllByUser(userId);

    const results = categories.map((category) => {
      const items = commitments.filter((c) => c.categoryId === category.id);
      const delayedItems = items.filter(
        (c) =>
          c.status === "overdue" ||
          (c.status === "completed" &&
            c.completedAt &&
            new Date(c.completedAt) > new Date(c.dueDate))
      );

      return {
        categoryId: category.id,
        categoryName: category.name,
        totalCommitments: items.length,
        delayedCommitments: delayedItems.length
      };
    });

    return results.sort((a, b) => b.delayedCommitments - a.delayedCommitments);
  }

  async getDelayAnalytics(userId: string) {
    const commitments = await this.commitmentRepository.findAllByUser(userId);

    const delayedCommitments = commitments
      .filter(
        (item) =>
          item.status === "overdue" ||
          (item.status === "completed" &&
            item.completedAt &&
            new Date(item.completedAt) > new Date(item.dueDate))
      )
      .map((item) => {
        const referenceDate =
          item.status === "completed" && item.completedAt
            ? item.completedAt
            : new Date().toISOString();

        return {
          commitmentId: item.id,
          title: item.title,
          status: item.status,
          delayInDays: this.daysBetween(referenceDate, item.dueDate)
        };
      })
      .sort((a, b) => b.delayInDays - a.delayInDays);

    return delayedCommitments;
  }
}