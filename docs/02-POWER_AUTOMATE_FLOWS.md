# Power Automate Flows

This document describes the Power Automate flows needed to automate the Job Profile Tracker.

## Flow 1: New Request

### Purpose
When a new request is created (from the app or directly in SharePoint), post to Teams and set automatic fields.

### Trigger
**When an item is created** on the `JobProfileRequests` list

### Actions

1. **Initialize variable** – `varDueDate`
   - Type: String
   - Value: `addDays(utcNow(), 10)` (or use expression for working days)

2. **Condition** – Status empty or ProposedMgmtLevel is "I don't know / Let the team decide"
   - If yes: Status = "Awaiting Mgmt Level"
   - If no: Status = "Under Review"

3. **Update item** in SharePoint
   - DueDate: `varDueDate`
   - Status: (per condition above)

4. **Post message in a chat or channel** (Microsoft Teams)
   - Channel: [Your Job Profiles channel]
   - Message format:

```
📋 **New Job Profile Request**

**Title:** @{triggerBody()?['Title']}
**Department:** @{triggerBody()?['Department']}
**Countries:** @{join(triggerBody()?['CountriesNeeded'], ', ')}
**Urgency:** @{triggerBody()?['Urgency']}

📝 **Description:**
@{triggerBody()?['Description']}

@{if(empty(triggerBody()?['AISuggestedMgmtLevel']), '', concat('🤖 **AI Assessment:** ', triggerBody()?['AISuggestedMgmtLevel'], ' - ', triggerBody()?['AISuggestedRationale']))}

@{if(equals(triggerBody()?['ProposedMgmtLevel'], 'I don''t know / Let the team decide'), '⚠️ **Team input requested to define the management level.**', '')}

👉 Please:
1. Suggest management level if not yet defined
2. Add grade ranges for your country

[View in SharePoint](@{triggerBody()?['@odata.editLink']})
```

5. **Update item** – Save the Teams message link
   - TeamsLink: URL of the posted message

6. **Send an email** (optional) – Confirmation to requester
   - To: `@{triggerBody()?['RequestedBy']?['Email']}`
   - Subject: `Job Profile request created: @{triggerBody()?['Title']}`

## Flow 2: Reminders

### Purpose
Send daily reminders for requests pending grades or management level.

### Trigger
**Recurrence** – Every day at 9:00 AM

### Actions

1. **Get items** – Requests "Awaiting Mgmt Level" for more than 3 days
   - List: JobProfileRequests
   - Filter: `Status eq 'Awaiting Mgmt Level' and RequestDate lt '@{addDays(utcNow(), -3)}'`

2. **Apply to each** (if items exist)
   - **Post message in Teams**:
   ```
   ⏰ **Reminder: Management Level Needed**
   
   The job profile **@{items('Apply_to_each')?['Title']}** has been pending management level for more than 3 days.
   
   Please review and propose a management level.
   ```

3. **Get items** – Requests "Grades Pending" for more than 3 days
   - List: JobProfileRequests
   - Filter: `Status eq 'Grades Pending' and DueDate lt '@{utcNow()}'`

4. **Apply to each** (if items exist)
   - **Post message in Teams** mentioning pending countries

## Flow 3: Auto-Assignment

### Purpose
Automatically assign an owner when status changes to "Ready for Workday".

### Trigger
**When an item is created or modified** on `JobProfileRequests`

### Condition
`Status eq 'Ready for Workday' and AssignedTo eq null`

### Actions

1. **Get items** – Get assignment queue (round-robin)
   - List: Configuration or variable with list of owners

2. **Update item** – Assign owner
   - AssignedTo: (next person in queue)

3. **Post message in Teams** – Notify assignee
   ```
   📌 **You have a new assignment**
   
   Job Profile: **@{triggerBody()?['Title']}**
   Agreed level: **@{triggerBody()?['AgreedMgmtLevel']}**
   
   Please create in Workday and update the status when ready.
   ```

4. **Send an email** to assignee

## Flow 4: Escalation

### Purpose
Escalate requests that are past their due date.

### Trigger
**Recurrence** – Every day at 10:00 AM

### Actions

1. **Get items** – Requests past DueDate and not completed
   - Filter: `DueDate lt '@{utcNow()}' and Status ne 'Completed'`

2. **Apply to each**
   - **Post message in Teams** to managers' channel:
   ```
   🚨 **Escalation: Request Overdue**
   
   The job profile **@{items('Apply_to_each')?['Title']}** is past its due date.
   
   - Due date: @{items('Apply_to_each')?['DueDate']}
   - Current status: @{items('Apply_to_each')?['Status']}
   - Assigned to: @{items('Apply_to_each')?['AssignedTo']?['DisplayName']}
   
   Please take action.
   ```

## Flow 5: Receive Request from App (HTTP)

### Purpose
Allow the app to send requests to SharePoint without connecting directly to Graph.

### Trigger
**When a HTTP request is received**

### Request Body Schema
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "description": { "type": "string" },
    "department": { "type": "string" },
    "proposedMgmtLevel": { "type": "string" },
    "aiSuggestedMgmtLevel": { "type": "string" },
    "aiSuggestedRationale": { "type": "string" },
    "countriesNeeded": { "type": "array", "items": { "type": "string" } },
    "urgency": { "type": "string" },
    "requestedByEmail": { "type": "string" }
  }
}
```

### Actions

1. **Create item** in SharePoint
   - Map body fields to SharePoint item

2. **Response** – Return the ID of the created item

## Implementation Notes

- Flows should be shared with the People Operations team
- Configure SharePoint and Teams connections with a service account
- Export flows as backup (Settings → Export)
- Test each flow before enabling in production
