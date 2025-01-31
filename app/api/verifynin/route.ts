// app/api/verify-bvn/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyNIN } from '@/utils/monnify';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nin } = body;
    
    if (!nin) {
      return NextResponse.json({ error: 'NIN is required' }, { status: 400 });
    }

    const result = await verifyNIN(nin);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}