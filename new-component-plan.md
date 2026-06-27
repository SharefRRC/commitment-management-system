# New Component Plan

## Chosen Component
Productivity Analytics for the Commitment Management System API.

## Why I chose it
This component aligns strongly with the main purpose of the project: helping me or anyone who uses it to not only track commitments, but also understand their work patterns and late-start habits.

## Planned Features
- Total commitments completed
- Number of late starts
- Number of overdue commitments
- Most delayed category
- Average delay in days

## Why it adds value
I dont want the project to be a task API. Its unique value is deadline awareness and better planning. Analytics supports that goal by turning commitment history into useful feedback.

## Planned Integration
- Use commitments and later activity-log data as data sources
- Add analytics service layer
- Add analytics endpoints such as:
  - GET /analytics/summary
  - GET /analytics/categories
  - GET /analytics/delays

## Implementation Plan
1. Finalize commitment status and date fields in Milestone 1.
2. Add activity logs in Milestone 2.
3. Build analytics calculations in the service layer.
4. Expose analytics endpoints with Swagger documentation.
5. Add tests for analytics calculations.

## Risks / Constraints
- Analytics depends on consistent date and status data.
- Some metrics are stronger once activity logs are implemented.
- To keep Milestone 1 manageable, this component will be planned now and implemented in later milestones.