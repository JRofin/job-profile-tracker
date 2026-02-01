/**
 * Career Framework Leveling Logic
 * Adapted from CF/leveling-logic.js for use with Next.js API routes
 */

import { LevelingRequest, LevelingResponse } from './types';

// Career Framework configuration (simplified for API use)
const CAREER_FRAMEWORK = {
  hierarchy: ["C1", "C2", "C3", "P1", "P2", "P3", "SS1", "SS2", "SS3", "AP1", "AP2", "AP3", "L1", "L2", "L3", "SL1", "SL2", "EL1", "EL3", "EL4"],
  levels: {
    C: { name: "Core", description: "Routine tasks with clear instructions and close supervision" },
    P: { name: "Professional", description: "Work independently on projects, make decisions within guidelines" },
    SS: { name: "Sales Strategist", description: "Commercial roles with revenue accountability" },
    AP: { name: "Advanced Professional", description: "Recognized SME with company-wide impact, no team management" },
    L: { name: "Leader", description: "Manage a team or direct the work of others" },
    SL: { name: "Senior Leader", description: "Manage multiple teams and influence functional strategy" },
    EL: { name: "Executive Leader", description: "Set strategy for domains or company-wide direction" }
  }
};

// Title heuristics for initial analysis
const TITLE_HEURISTICS = [
  { keyword: "coordinator", implication: "C3", reasoning: "Coordinator roles typically indicate Core-level execution" },
  { keyword: "associate", implication: "C3/P1", reasoning: "Associate roles are typically Core or entry Professional" },
  { keyword: "specialist", implication: "P2/P3", reasoning: "Specialist roles indicate mid-to-senior Professional" },
  { keyword: "manager", implication: "P3/L1", reasoning: "Manager can be process owner (P3) or people leader (L1+)" },
  { keyword: "lead", implication: "P3/L1", reasoning: "Lead can be senior IC or entry people-leader" },
  { keyword: "leader", implication: "L2/L3", reasoning: "Leader strongly suggests people management" },
  { keyword: "architect", implication: "AP1/AP2", reasoning: "Architect indicates advanced IC influence" },
  { keyword: "advisor", implication: "AP1", reasoning: "Advisor implies SME influence without people management" },
  { keyword: "director", implication: "SL1/SL2", reasoning: "Director typically indicates Senior Leader level" },
  { keyword: "head of", implication: "SL1/SL2", reasoning: "Head of roles typically indicate domain leadership" },
  { keyword: "senior", implication: "+1", reasoning: "Senior prefix typically adds one stage" },
  { keyword: "junior", implication: "-1", reasoning: "Junior prefix typically reduces to Core level" }
];

/**
 * Build the prompt for OpenAI to analyze the job profile
 */
export function buildLevelingPrompt(request: LevelingRequest): string {
  const { title, description, department } = request;
  
  // Analyze title for heuristics
  const titleLower = title.toLowerCase();
  const matchedHeuristics = TITLE_HEURISTICS.filter(h => titleLower.includes(h.keyword));
  
  const heuristicsContext = matchedHeuristics.length > 0
    ? `\nTitle Analysis:\n${matchedHeuristics.map(h => `- "${h.keyword}" suggests ${h.implication}: ${h.reasoning}`).join('\n')}`
    : '';

  return `You are an expert HR consultant specializing in Welocalize's Career Framework. Analyze this job profile and suggest the appropriate management level.

CAREER FRAMEWORK HIERARCHY (from lowest to highest):
${CAREER_FRAMEWORK.hierarchy.join(' → ')}

LEVEL DESCRIPTIONS:
${Object.entries(CAREER_FRAMEWORK.levels).map(([code, info]) => `- ${code}: ${info.name} - ${info.description}`).join('\n')}

JOB PROFILE TO ANALYZE:
- Title: ${title}
- Department: ${department || 'Not specified'}
- Description: ${description}
${heuristicsContext}

ANALYSIS INSTRUCTIONS:
1. Analyze the job title for level indicators (Manager, Lead, Coordinator, etc.)
2. Review the job description for:
   - Autonomy level (routine tasks vs strategic decisions)
   - Problem complexity (simple, moderate, complex, novel)
   - Scope of influence (individual, team, function, company)
   - Team management responsibilities (none, one team, multiple teams)
3. Match characteristics to the appropriate career framework level
4. Consider that "Manager" in title does NOT automatically mean people leadership

RESPOND IN THIS EXACT JSON FORMAT:
{
  "suggestedLevel": "[level code, e.g. P2]",
  "careerStep": "[step name, e.g. Professional]",
  "stage": [stage number, e.g. 2],
  "rationale": "[2-3 sentences explaining why this level was chosen based on the job profile characteristics]",
  "whyNotHigher": "[1-2 sentences explaining why the next higher level was not selected]",
  "whyNotLower": "[1-2 sentences explaining why the next lower level was not selected]",
  "confidence": [0.0 to 1.0 confidence score]
}`;
}

/**
 * Call OpenAI API to get leveling suggestion
 */
export async function getLevelingSuggestion(request: LevelingRequest): Promise<LevelingResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY environment variable.');
  }

  const prompt = buildLevelingPrompt(request);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR consultant. Always respond with valid JSON only, no markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI');
  }

  // Parse JSON response (handle potential markdown code blocks)
  let jsonContent = content;
  if (content.includes('```')) {
    jsonContent = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  }

  try {
    const result = JSON.parse(jsonContent);
    return {
      suggestedLevel: result.suggestedLevel,
      careerStep: result.careerStep,
      stage: result.stage,
      rationale: result.rationale,
      whyNotHigher: result.whyNotHigher,
      whyNotLower: result.whyNotLower,
      confidence: result.confidence
    };
  } catch (e) {
    throw new Error(`Failed to parse OpenAI response: ${content}`);
  }
}
