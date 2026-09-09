import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({ email: z.string().trim().email().max(254) });

export async function POST(request: Request) {
  let parsed: z.infer<typeof requestSchema>;
  try {
    parsed = requestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
  }

  const endpoint = process.env.NEWSLETTER_SUBSCRIBE_WEBHOOK_URL;
  if (!endpoint) {
    return NextResponse.json(
      { message: 'Email subscriptions are not available yet. Please check back soon.' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.NEWSLETTER_SUBSCRIBE_TOKEN
          ? { Authorization: `Bearer ${process.env.NEWSLETTER_SUBSCRIBE_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ email: parsed.email, source: 'house-of-aristocrat-footer' }),
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`Newsletter provider returned ${response.status}`);
    return NextResponse.json({ message: 'Welcome to the House. Your subscription is confirmed.' });
  } catch {
    return NextResponse.json(
      { message: 'We could not complete your subscription. Please try again later.' },
      { status: 502 },
    );
  }
}
