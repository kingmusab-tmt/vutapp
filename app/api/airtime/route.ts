import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import { AirtimePlan } from '@/models/dataAirtimeUtil';
import { ObjectId } from 'mongodb';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('id');
  try {
    await dbConnect();
    if (_id) {
      const plan = await AirtimePlan.findOne({ _id });
      if (!plan) {
        return NextResponse.json({ message: 'Airtime Plan not found' }, { status: 404 });
      } else {
        return NextResponse.json(plan, { status: 200 });
      }
    } else
    {
      const plans = await AirtimePlan.find({});
    return NextResponse.json(
      { message: 'Airtime Plans fetched successfully', data: plans },
      { status: 200 }
      );
    }

    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error fetching airtime plans', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();


    const body = await req.json();

    if (!body.network || !body.airtimeType) {
      return NextResponse.json(
        { message: 'Network and Airtime Type are required' },
        { status: 400 }
      );
    }

    const result = await AirtimePlan.create(body);

    return NextResponse.json(
      { message: 'Airtime Plan created', data: result },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error creating plan', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // Extract the `id` from the URL query parameters
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get('id');

    // Parse the request body
    const updatedPlan = await req.json();

    // Extract `network`, `airtimeType`, and `available` from the request body
    const { network, airtimeType, available } = updatedPlan;

    // Determine the update logic based on the provided parameters
    if (_id) {
      // Validate the ID
      if (!ObjectId.isValid(_id)) {
        return NextResponse.json(
          { message: 'A valid ID is required for updates' },
          { status: 400 }
        );
      }

      // Perform the update operation for the specific Airtime Plan by ID
      const result = await AirtimePlan.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updatedPlan }
      );

      // Handle the case where no matching document was found
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { message: 'Airtime Plan not found' },
          { status: 404 }
        );
      }

      // Respond with success
      return NextResponse.json(
        { message: 'Airtime Plan updated successfully by ID', details: result },
        { status: 200 }
      );
    } else if (network && airtimeType) {
      // Perform the update operation for the specific network and airtimeType
      const availabilityUpdate = await AirtimePlan.updateMany(
        { network, airtimeType },
        { $set: { available } }
      );

      // Handle the case where no matching documents were found
      if (availabilityUpdate.matchedCount === 0) {
        return NextResponse.json(
          { message: 'No matching network and airtime type found to update availability' },
          { status: 404 }
        );
      }

      // Respond with success
      return NextResponse.json(
        { 
          message: 'Availability updated successfully for network and airtimeType', 
          details: availabilityUpdate 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Either a valid ID or both network and airtimeType are required for updates' },
        { status: 400 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Error updating Airtime Plan', error: errorMessage },
      { status: 500 }
    );
  }
}



export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get('id');
    console.log(_id);

    if (_id) {
      const deletedAirtime = await AirtimePlan.findOneAndDelete({ _id });
      if (!deletedAirtime) {
        return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
      } else {
        return NextResponse.json({ message: 'Airtime Plan deleted successfully' }, { status: 200 });
      }
    } else {
      return NextResponse.json({ message: 'id or Network and planType are required' }, { status: 400 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}