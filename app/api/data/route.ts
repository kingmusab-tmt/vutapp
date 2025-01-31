import { NextRequest, NextResponse } from 'next/server';
import { DataPlan } from '@/models/dataAirtimeUtil';
import dbConnect from '@/lib/connectdb';

// Fetch all data plans or a specific one by `planSize`
export async function GET(req: NextRequest) {
    await dbConnect();
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('id');
  const network = searchParams.get('network');
  const planType = searchParams.get('planType');
    

  try {
    if (_id) {
      const plan = await DataPlan.findOne({ _id });
      
      if (!plan) {
        return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
      }
      const {
        affiliatePrice,
        apiPrice,
        network,
        planType,
        smartEarnerPrice,
        topUserPrice,
        vendingMethod,
      } = plan;
      const responsePlan = {
        affiliatePrice,
        apiPrice,
        network,
        planType,
        smartEarnerPrice,
        topUserPrice,
        vendingMethod,
      };
      return NextResponse.json(responsePlan, { status: 200 });
    } else if (network && planType) {
      const plans = await DataPlan.find({ network, planType });

      // Group apiIds by apiName
      const apiDetailsMap = new Map();

      plans.forEach(plan => {
        console.log('Plan API Details:', plan.apiDetails);
        plan.apiDetails.forEach(detail => {
          if (!apiDetailsMap.has(detail.apiName)) {
            apiDetailsMap.set(detail.apiName, []);
          }
          apiDetailsMap.get(detail.apiName).push(detail.apiId);
        });
      });

      const apiInformation = Array.from(apiDetailsMap.entries()).map(([apiName, apiIds]) => ({
        apiName,
        apiIds,
      }));

      if (apiInformation.length === 0) {
        return NextResponse.json({ message: 'No API details found' }, { status: 404 });
      }

      return NextResponse.json(apiInformation, { status: 200 });
    } else {
      const plans = await DataPlan.find();
      return NextResponse.json(plans, { status: 200 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error retrieving plans', error: errorMessage }, { status: 500 });
  }
}

// Save new data plans
export async function POST(req: NextRequest) {
    await dbConnect();
  try {
    const body = await req.json();
    const { plans } = body;

    if (!Array.isArray(plans)) {
      return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }

    const savedPlans = await DataPlan.insertMany(plans);
    return NextResponse.json(savedPlans, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error saving plans', error: errorMessage }, { status: 500 });
  }
}

// Edit an existing data plan by its `planSize`
export async function PUT(req: NextRequest) {
  await dbConnect();

  const { network, planType, available } = await req.json();

  try {
    const filter = { network, planType };
    const update = { $set: { available } };

    const result = await DataPlan.updateMany(filter, update);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "No matching record found." }, { status: 404 });
    }

    return NextResponse.json({ message: `${result.modifiedCount} records updated successfully.` }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


// Delete a data plan by its `id` or by `network` and `planType`
export async function DELETE(req: NextRequest) {
    await dbConnect();  
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('id');
  const network = searchParams.get('network');
  const planType = searchParams.get('planType');

  try {
    if (_id) {
      const deletedPlan = await DataPlan.findOneAndDelete({ _id });
      if (!deletedPlan) {
      return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
    }
    } else if (network && planType) {
      const result = await DataPlan.deleteMany({ network, planType });
      return NextResponse.json({ message: `${result.deletedCount} plans deleted successfully` }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'id or Network and planType are required' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Plan deleted successfully' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting plan', error: errorMessage }, { status: 500 });
  }
}
