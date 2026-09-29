import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createServerSupabaseClient(cookies());
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ invoices: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { client_id, amount, due_date } = body;

  const supabase = createServerSupabaseClient(cookies());
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!client_id || !amount || !due_date) {
    return NextResponse.json({ error: 'Client, amount, and due date are required.' }, { status: 400 });
  }

  const parsedAmount = Number(amount);
  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return NextResponse.json({ error: 'Amount must be a positive number.' }, { status: 400 });
  }

  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('id, name, email')
    .eq('id', client_id)
    .eq('user_id', user.id)
    .single();

  if (clientError || !clientData) {
    return NextResponse.json({ error: 'Client not found or does not belong to this account.' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('invoices')
    .insert([
      {
        user_id: user.id,
        client_id,
        amount: parsedAmount,
        due_date,
        status: 'Draft'
      }
    ])
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Error creating invoice.' }, { status: 500 });
  }

  const checkoutResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/stripe/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invoiceId: data.id,
      amount: parsedAmount,
      clientName: clientData.name,
      clientEmail: clientData.email
    })
  });

  const checkoutPayload = await checkoutResponse.json();

  if (!checkoutResponse.ok || !checkoutPayload.url) {
    return NextResponse.json({ error: checkoutPayload.error || 'Checkout could not be initialized.' }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from('invoices')
    .update({ stripe_payment_link: checkoutPayload.url })
    .eq('id', data.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      invoice: {
        ...data,
        stripe_payment_link: checkoutPayload.url
      },
      checkout_url: checkoutPayload.url
    },
    { status: 201 }
  );
}
