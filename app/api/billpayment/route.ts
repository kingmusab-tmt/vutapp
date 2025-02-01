import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import { BillPayment } from '@/models/dataAirtimeUtil';

// GET: Fetch all plans or a specific plan by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('id');

  try {
    await dbConnect();
    if (_id) {
      const plan = await BillPayment.findById(_id);
      if (!plan) {
        return NextResponse.json({ message: 'Bill not found' }, { status: 404 });
      }
      return NextResponse.json(plan, { status: 200 });
    } else {
      const plans = await BillPayment.find();
      return NextResponse.json(plans, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching Bills', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST: Create a new Bill
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newPlan = await BillPayment.create(body);
    return NextResponse.json({ message: 'Bill created', plan: newPlan }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating Bill', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing Bill by ID
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('id');

  try {
    await dbConnect();
    const body = await req.json();

    if (!_id) {
      return NextResponse.json({ message: 'ID is required for updates' }, { status: 400 });
    }

    const updatedPlan = await BillPayment.findByIdAndUpdate(_id, body, { new: true });
    if (!updatedPlan) {
      return NextResponse.json({ message: 'Bill not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Bill updated', plan: updatedPlan }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating Bill', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a Bill by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('id');

  try {
    await dbConnect();

    if (!_id) {
      return NextResponse.json({ message: 'ID is required for deletion' }, { status: 400 });
    }

    const deletedPlan = await BillPayment.findByIdAndDelete(_id);
    if (!deletedPlan) {
      return NextResponse.json({ message: 'Bill not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Bill deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting Bill', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
