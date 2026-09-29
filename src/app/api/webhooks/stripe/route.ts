import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { invoiceId, amount, clientName, clientEmail } = body;

  if (!amount) {
    return NextResponse.json({ error: 'Invoice total is required.' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(Number(amount) * 100),
          product_data: {
            name: `Invoice ${invoiceId || 'J&D Sync'}`
          }
        }
      }
    ],
    customer_email: clientEmail,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices?payment=cancelled`,
    metadata: {
      invoiceId: invoiceId || '',
      clientName: clientName || ''
    }
  });

  return NextResponse.json({ url: session.url });
}
