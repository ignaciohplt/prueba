// pages/api/send-whatsapp.js
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }
  const { to, body } = req.body;
  try {
    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,   // e.g. "whatsapp:+14155238886"
      to:   `whatsapp:${to}`,                    // e.g. "whatsapp:+5493415481010"
      body,
    });
    return res.status(200).json({ sid: msg.sid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
