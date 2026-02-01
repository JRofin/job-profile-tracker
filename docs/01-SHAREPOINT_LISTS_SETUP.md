# SharePoint Lists Setup

This document describes how to create the SharePoint lists required for the Job Profile Tracker.

## Prerequisites

- Access to a SharePoint site
- Site Owner or Site Collection Administrator permissions

## List 1: JobProfileRequests

### Create the List

1. Go to your SharePoint site
2. Click **Settings (gear icon)** → **Site Contents**
3. Click **New** → **List**
4. Choose **Blank list**
5. Name: `JobProfileRequests`
6. Click **Create**

### Add Columns

Add the following columns in order:

| Column | Type | Required | Additional Configuration |
|--------|------|----------|---------------------------|
| Description | Multiple lines of text | Yes | Rich text disabled |
| Department | Choice | No | Options: Life Sciences, Legal, TME, Welo Data, Adapt, People Operations, Finance, IT, Marketing, Sales, Other |
| ProposedMgmtLevel | Choice | No | Options: C1, C2, C3, P1, P2, P3, SS1, SS2, SS3, AP1, AP2, AP3, L1, L2, L3, SL1, SL2, EL1, EL3, EL4, I don't know / Let the team decide |
| AISuggestedMgmtLevel | Choice | No | Same options as ProposedMgmtLevel |
| AISuggestedRationale | Multiple lines of text | No | Plain text |
| AISuggestedDate | Date and Time | No | Date only |
| AgreedMgmtLevel | Choice | No | Same options as ProposedMgmtLevel (excluding "I don't know") |
| Status | Choice | Yes | Options: New, Awaiting Mgmt Level, Under Review, Grades Pending, Ready for Workday, In Progress, Completed. Default: New |
| RequestedBy | Person or Group | Yes | Single selection |
| AssignedTo | Person or Group | No | Single selection |
| RequestDate | Date and Time | No | Date only. Default: [Today] |
| DueDate | Date and Time | No | Date only |
| CompletedDate | Date and Time | No | Date only |
| TeamsLink | Hyperlink | No | |
| CountriesNeeded | Choice | No | Allow multiple selections. Options: Spain, Mexico, Romania, Greece, India, USA, UK, Germany, France, Japan, China, Brazil, Other |
| WorkdayJobCode | Single line of text | No | |
| Justification | Multiple lines of text | No | Plain text |
| Urgency | Choice | No | Options: Normal, Urgent. Default: Normal |
| Notes | Multiple lines of text | No | Plain text |

### Configure Permissions

1. Go to **List Settings** → **Permissions for this list**
2. Configure:
   - **All users**: Read + Contribute (to create and view requests)
   - **People Operations team**: Edit (to manage)
   - **Site Owners**: Full Control

## List 2: JobProfileGrades

### Create the List

1. Go to your SharePoint site
2. Click **Settings** → **Site Contents**
3. Click **New** → **List**
4. Choose **Blank list**
5. Name: `JobProfileGrades`
6. Click **Create**

### Add Columns

| Column | Type | Required | Additional Configuration |
|--------|------|----------|---------------------------|
| JobProfileId | Lookup | Yes | Lookup to JobProfileRequests, Title column |
| Country | Choice | Yes | Options: Spain, Mexico, Romania, Greece, India, USA, UK, Germany, France, Japan, China, Brazil, Other |
| GradeMin | Single line of text | No | e.g. MX1, ES-A |
| GradeMax | Single line of text | No | e.g. MX6, ES-D |
| SubmittedBy | Person or Group | No | Single selection |
| Approved | Yes/No | No | Default: No |

## Recommended Views

### JobProfileRequests – "Pending" View

1. Go to **List Settings** → **Create view**
2. Name: "Pending"
3. Columns: Title, Status, Department, ProposedMgmtLevel, DueDate, AssignedTo
4. Filter: Status is not equal to "Completed"
5. Sort by: DueDate ascending

### JobProfileRequests – "My Assignments" View

1. Name: "My Assignments"
2. Filter: AssignedTo is equal to [Me]
3. Sort by: DueDate ascending

## Connecting to the App

### Option A: Power Automate HTTP

The app can send requests to a Power Automate flow that creates items in SharePoint. See [02-POWER_AUTOMATE_FLOWS.md](02-POWER_AUTOMATE_FLOWS.md).

### Option B: Microsoft Graph

To connect directly from the app:

1. Register an app in Azure AD
2. Grant permissions `Sites.ReadWrite.All`
3. Configure environment variables:

```
SHAREPOINT_SITE_URL=https://yourtenant.sharepoint.com/sites/yoursite
SHAREPOINT_CLIENT_ID=your-client-id
SHAREPOINT_CLIENT_SECRET=your-client-secret
SHAREPOINT_TENANT_ID=your-tenant-id
```

## Verification

1. Create a test item in JobProfileRequests
2. Verify all columns save correctly
3. Create an item in JobProfileGrades linked to the above
4. Verify the lookup works
