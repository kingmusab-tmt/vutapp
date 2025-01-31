// pages/api/cableplans.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import { CableSubscription } from '@/models/dataAirtimeUtil';

// GET: Fetch all plans or a specific plan by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('id');

  try {
    await dbConnect();
    if (_id) {
      const plan = await CableSubscription.findById(_id);
      if (!plan) {
        return NextResponse.json({ message: 'Cable Plan not found' }, { status: 404 });
      }
      return NextResponse.json(plan, { status: 200 });
    } else {
      const plans = await CableSubscription.find();
      return NextResponse.json(plans, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching cable plans', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST: Create a new cable plan
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newPlan = await CableSubscription.create(body);
    return NextResponse.json({ message: 'Cable Plan created', plan: newPlan }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating cable plan', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing cable plan by ID
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('id');

  try {
    await dbConnect();
    const body = await req.json();

    if (!_id) {
      return NextResponse.json({ message: 'ID is required for updates' }, { status: 400 });
    }

    const updatedPlan = await CableSubscription.findByIdAndUpdate(_id, body, { new: true });
    if (!updatedPlan) {
      return NextResponse.json({ message: 'Cable Plan not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cable Plan updated', plan: updatedPlan }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating cable plan', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a cable plan by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('id');

  try {
    await dbConnect();

    if (!_id) {
      return NextResponse.json({ message: 'ID is required for deletion' }, { status: 400 });
    }

    const deletedPlan = await CableSubscription.findByIdAndDelete(_id);
    if (!deletedPlan) {
      return NextResponse.json({ message: 'Cable Plan not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cable Plan deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting cable plan', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
