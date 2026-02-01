import { NextRequest, NextResponse } from 'next/server';
import { getLevelingSuggestion } from '@/lib/cf-leveling';
import { LevelingRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: LevelingRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Get leveling suggestion from OpenAI
    const result = await getLevelingSuggestion(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Leveling API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get leveling suggestion' },
      { status: 500 }
    );
  }
}
