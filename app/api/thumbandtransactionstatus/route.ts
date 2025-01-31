import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import dbConnect from '@/lib/connectdb';
import { getServerSession } from 'next-auth';

// Fetch all data plans or a specific one by `planSize`
export async function GET(req: NextRequest) {
    const session = await getServerSession();
    const email = session?.user?.email;
    
  try {
    if (email) {
      const user = await User.findOne({ email });
      
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      const {
          thumbprintStatus,
          transactionStatus,
      } = user;
      const status = {
          thumbprintStatus,
          transactionStatus,
      };
      return NextResponse.json(status, { status: 200 });
    } 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error retrieving status', error: errorMessage }, { status: 500 });
  }
}

// Save new data plans
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { thumbprintStatus, transactionStatus } = await req.json();
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    await User.updateOne(
      { email: session.user.email },
      { $set: { thumbprintStatus, transactionStatus } },
      { upsert: true }
    );
    
    return NextResponse.json({ message: "Authentication settings updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update authentication status" }, { status: 500 });
  }
}