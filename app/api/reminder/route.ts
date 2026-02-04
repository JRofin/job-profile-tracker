import { NextResponse } from 'next/server';

/**
 * POST /api/reminder
 * Sends a manual reminder to the People Partner (Owner and Co-Lead) for a pending Job Profile.
 * In production: call Power Automate HTTP trigger with this payload to send Teams/email to owner.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestId, title, owner, ownerCoLead, status } = body;

    if (!title || (!owner && !ownerCoLead)) {
      return NextResponse.json(
        { error: 'Missing required fields: title, and at least one of owner or ownerCoLead' },
        { status: 400 }
      );
    }

    // In production: call Power Automate flow, e.g.:
    // await fetch(process.env.POWER_AUTOMATE_REMINDER_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ requestId, title, owner, ownerCoLead, status }),
    // });

    return NextResponse.json({
      success: true,
      message: `Reminder would be sent to ${[owner, ownerCoLead].filter(Boolean).join(' and ')}`,
    });
  } catch (e) {
    console.error('Reminder API error:', e);
    return NextResponse.json({ error: 'Failed to send reminder' }, { status: 500 });
  }
}
