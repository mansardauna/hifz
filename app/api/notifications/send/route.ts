import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, recipient, subject, content, metadata } = body;

    if (!recipient || !content) {
      return NextResponse.json(
        { success: false, message: 'Recipient and content are required' },
        { status: 400 }
      );
    }

    // In production, connect to Resend API (`resend.emails.send`) or Twilio WhatsApp API
    console.log(`[Notification Dispatch] Channel: ${channel} | Recipient: ${recipient}`);
    console.log(`Subject: ${subject || 'N/A'}`);
    console.log(`Content: ${content.substring(0, 100)}...`);

    // Simulate reliable dispatch
    return NextResponse.json({
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      channel: channel || 'email',
      recipient,
      status: 'delivered',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Notification dispatch error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to dispatch notification' },
      { status: 500 }
    );
  }
}
