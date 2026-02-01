# Copilot Agent in Teams

This document describes how to create a Copilot Studio agent to manage Job Profile requests from Teams.

## Overview

The agent allows users to:
- **Create requests** for job profiles via chat
- **Get level suggestions** using the leveling API
- **Check status** of existing requests

## Prerequisites

- Access to [Copilot Studio](https://copilotstudio.microsoft.com/)
- Leveling API deployed (Azure Function or public URL)
- Power Automate flows configured

## Create the Agent

### 1. New Agent

1. Go to Copilot Studio
2. Click **Create** → **New copilot**
3. Name: "Job Profile Assistant"
4. Description: "Helps create and manage Job Profile requests"
5. Language: English

### 2. Configure Topics

#### Topic: Create Request

**Trigger phrases:**
- "I want to create a job profile"
- "New job request"
- "I need to create a job profile"
- "New job profile"

**Flow:**

1. **Question**: "What is the job title?"
   - Variable: `jobTitle`
   - Type: Text

2. **Question**: "Briefly describe the main responsibilities:"
   - Variable: `jobDescription`
   - Type: Text (multiple lines)

3. **Question**: "For which countries are grade ranges needed?"
   - Variable: `countries`
   - Type: Multiple choice
   - Options: Spain, Mexico, Romania, Greece, India, USA, UK, Germany, Other

4. **Question**: "Would you like me to suggest the management level with AI?"
   - Variable: `wantsAI`
   - Type: Boolean (Yes/No)

5. **Condition**: If `wantsAI` = true
   - **Call an action**: Leveling API
     - URL: `https://your-api.com/api/leveling`
     - Method: POST
     - Body: `{ "title": "{jobTitle}", "description": "{jobDescription}" }`
   - **Message**: "Based on the Career Framework, I suggest level **{response.suggestedLevel}** ({response.careerStep} Stage {response.stage}). {response.rationale}"
   - **Question**: "Do you accept this level or would you like to change it?"
     - Variable: `acceptLevel`
     - Options: Accept, Change it, I don't know / Let the team decide

6. **Condition**: If `acceptLevel` = "Change it"
   - **Question**: "Which level do you prefer?"
     - Variable: `proposedLevel`
     - Options: C1-C3, P1-P3, SS1-SS3, AP1-AP3, L1-L3, SL1-SL2, EL1-EL4

7. **Call an action**: Power Automate – Create request
   - Input: jobTitle, jobDescription, countries, proposedLevel (or aiSuggestedLevel)
   - Output: requestId, sharePointLink

8. **Message**: "Done! I've created the request **{jobTitle}** with ID {requestId}. The team will receive a notification in Teams. [View in SharePoint]({sharePointLink})"

#### Topic: Check Status

**Trigger phrases:**
- "Status of my request"
- "How is my job profile going?"
- "View my requests"

**Flow:**

1. **Call an action**: Power Automate – Get user requests
2. **Adaptive card**: Show list of requests with status

#### Topic: Suggest Level

**Trigger phrases:**
- "What level should this role have"
- "Suggest management level"
- "Analyze level for a role"

**Flow:**

1. **Question**: "What is the job title?"
2. **Question**: "Describe the responsibilities:"
3. **Call an action**: Leveling API
4. **Message**: Show result with rationale

## Actions (Connectors)

### Action: Suggest Level (REST API)

1. In Copilot Studio, go to **Actions** → **Add an action**
2. Select **Create a new connector**
3. Type: **REST API**
4. Configuration:
   - URL: `https://your-api.azurewebsites.net/api/leveling`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body schema:
   ```json
   {
     "title": "string",
     "description": "string"
   }
   ```
   - Response schema:
   ```json
   {
     "suggestedLevel": "string",
     "careerStep": "string",
     "stage": "number",
     "rationale": "string"
   }
   ```

### Action: Create Request (Power Automate)

1. Go to **Actions** → **Add an action** → **Call a flow**
2. Select the flow "Create request from Copilot"
3. Map topic variables to the flow inputs

## Publish to Teams

1. In Copilot Studio, go to **Channels**
2. Select **Microsoft Teams**
3. Click **Turn on Teams**
4. Customize:
   - Icon
   - Short description
   - Developer info
5. Distribution options:
   - **Install for me**: Personal testing
   - **Share link**: Share with the team
   - **Submit for admin approval**: Publish to the org

## Test the Agent

1. Click **Test** in Copilot Studio
2. Try the trigger phrases
3. Verify that actions run correctly
4. Adjust prompts and flows as needed

## Maintenance

- **Analytics**: Review in Copilot Studio which topics are used most and any failures
- **Continuous improvement**: Add trigger phrases based on how users speak
- **Versioning**: Export the agent as backup before major changes

## Sample Conversation

```
User: I want to create a job profile

Bot: What is the job title?

User: Cloud Platform Engineer II

Bot: Briefly describe the main responsibilities:

User: Designs and implements cloud infrastructure solutions. 
      Works independently on complex technical problems.
      Participates in architecture reviews and mentors junior engineers.

Bot: For which countries are grade ranges needed?

User: Spain, Mexico, Romania

Bot: Would you like me to suggest the management level with AI?

User: Yes

Bot: Based on the Career Framework, I suggest level **P2** 
     (Professional Stage 2). 
     
     The role involves independent work on moderately complex 
     problems with team-level influence, which is characteristic 
     of P2. Mention of mentoring junior engineers suggests some 
     influence without formal people management.
     
     Do you accept this level or would you like to change it?

User: Accept

Bot: Done! I've created the request **Cloud Platform Engineer II** 
     with ID SP-2024-0042. The team will receive a notification 
     in the Job Profiles channel.
     
     [View in SharePoint](https://...)
```

## Resources

- [Copilot Studio Documentation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/)
- [Create REST API actions](https://learn.microsoft.com/en-us/power-platform/release-plan/2024wave2/microsoft-copilot-studio/create-rest-api-copilot-connectors-copilot-studio)
- [Extend with Power Automate](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-flow)
