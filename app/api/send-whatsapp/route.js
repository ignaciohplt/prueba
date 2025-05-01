// app/api/send-whatsapp/route.js

// 1) Forzamos Node.js y desactivamos el Edge Runtime
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Only POST allowed' }, { status: 405 });
}

export async function POST(request) {
  // 2) Cargamos Twilio *sólo* dentro del handler Node.js
  let client;
  try {
    const twilio = require('twilio');
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (e) {
    console.error('Twilio init error:', e);
    return NextResponse.json({ error: 'Twilio init failed' }, { status: 500 });
  }

  // 3) Leemos el cuerpo y disparamos el mensaje
  let bodyJson;
  try {
    bodyJson = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { to, body } = bodyJson;
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
