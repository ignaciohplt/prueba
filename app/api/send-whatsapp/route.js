import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function GET() {
  return NextResponse.json({ error: 'Only POST allowed' }, { status: 405 });
}

export async function POST(request) {
  let client;
  try {
    // Inicializa Twilio dentro del handler
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (e) {
    console.error('Twilio init error:', e);
    return NextResponse.json({ error: 'Twilio init failed' }, { status: 500 });
  }

  const { to, body } = await request.json();
  try {
    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to:   `whatsapp:${to}`,
      body,
    });
    return NextResponse.json({ sid: msg.sid });
  } catch (err) {
    console.error('Twilio send error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
