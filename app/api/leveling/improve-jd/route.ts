import { NextRequest, NextResponse } from 'next/server';
import { ImproveJDRequest, ImproveJDResponse } from '@/lib/types';

const FOUR_PILLARS = `
THE 4 PILLARS (used for performance and career development):

1. PEOPLE - How we interact with others
   - Collaboration & teamwork
   - Communication & influence
   - Leadership & mentoring
   - Client/stakeholder relationships

2. OPERATIONS - How we execute work
   - Efficiency & quality
   - Process improvement
   - Problem-solving
   - Accountability & ownership

3. TECHNICAL - Domain expertise
   - Role-specific skills
   - Industry knowledge
   - Tools & technology proficiency
   - Innovation & best practices

4. COMMERCIAL - Business impact
   - Revenue/cost awareness
   - Strategic thinking
   - Growth mindset
   - Value creation
`;

const CAREER_FRAMEWORK_LEVELS = `
CAREER FRAMEWORK LEVELS:
- C (Core): Routine tasks, close supervision, follows clear instructions
- P (Professional): Works independently, makes decisions within guidelines, owns projects
- SS (Sales Strategist): Commercial roles with revenue accountability
- AP (Advanced Professional): Recognized SME, company-wide influence, no people management
- L (Leader): Manages a team, develops others, translates strategy
- SL (Senior Leader): Manages multiple teams, influences functional strategy
- EL (Executive Leader): Sets strategy, company-wide direction
`;

export async function POST(request: NextRequest) {
  try {
    const body: ImproveJDRequest = await request.json();

    if (!body.title || !body.description || !body.suggestedLevel) {
      return NextResponse.json(
        { error: 'Title, description, and suggested level are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const improvementsList = body.jdImprovements?.length
      ? `\nSUGGESTED IMPROVEMENTS TO INCORPORATE:\n${body.jdImprovements.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}`
      : '';

    const prompt = `You are an expert HR consultant at Welo Global. Your task is to rewrite a job description to be perfectly aligned with the Career Framework level and the 4 Pillars.

${CAREER_FRAMEWORK_LEVELS}

${FOUR_PILLARS}

ORIGINAL JOB PROFILE:
- Title: ${body.title}
- Department: ${body.department || 'Not specified'}
- Target Level: ${body.suggestedLevel}
- Current Description:
${body.description}
${improvementsList}

INSTRUCTIONS:
1. Rewrite the job description to clearly reflect the ${body.suggestedLevel} level characteristics
2. Structure the JD to address all 4 Pillars where relevant to the role
3. Use clear, specific language about scope, autonomy, and impact
4. Include measurable outcomes and success criteria where possible
5. Make the expectations unambiguous for this career level
6. Keep the same overall role purpose but enhance clarity and alignment

RESPOND IN THIS EXACT JSON FORMAT:
{
  "improvedJD": "[The complete rewritten job description as a single string with \\n for line breaks]",
  "changes": ["Summary of change 1", "Summary of change 2", "Summary of change 3"]
}`;

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
        temperature: 0.4,
        max_tokens: 2000
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

    // Parse JSON response
    let jsonContent = content;
    if (content.includes('```')) {
      jsonContent = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    const result: ImproveJDResponse = JSON.parse(jsonContent);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Improve JD API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate improved JD' },
      { status: 500 }
    );
  }
}
