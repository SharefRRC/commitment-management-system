# New Component Plan

## Chosen Component
Productivity Analytics

## Why I Chose It
I chose Productivity Analytics because it directly supports the core purpose of my project.
The Commitment Management System API is not only about storing commitments. Its main value is helping users understand when they are starting too late, missing deadlines, or struggling in certain categories.

## Planned Value to the Project
This component adds useful insight on top of the normal CRUD API.
Instead of only managing commitments, users can also review patterns in their productivity and deadline performance.

## Planned Metrics
- Total commitments completed
- Number of late starts
- Number of overdue items
- Most delayed category
- Average delay in days

## Data Sources
This component uses:
- commitment data
- due dates
- must-start-by dates
- completion timestamps
- category associations
- activity log records

## Planned API Endpoints
- GET /api/analytics/summary
- GET /api/analytics/categories
- GET /api/analytics/delays

## Integration Plan
1. Finish core CRUD resources first
2. Ensure commitment status and date fields are consistent
3. Add activity logging for important actions
4. Build analytics calculations in the service layer
5. Expose analytics results through dedicated endpoints
6. Add Swagger documentation
7. Add Jest tests for analytics logic

## Risks and Considerations
- Analytics depends on reliable date and status data
- Incomplete historical data can reduce metric quality
- Some analytics become stronger once more activity tracking is added

## Why It Fits the Course
This component adds meaningful back-end logic without changing the required stack.
It stays manageable while still being more interesting than a basic CRUD-only API.