import {
  getAllNotifications,
  updateNotification,
  deleteNotification,
  saveNotification,
} from "@/models/notification";
import { NextRequest, NextResponse } from "next/server";
import { sendNotification } from "../../../actions";
import dbConnect from "@/lib/connectdb";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  try {
    const notifications = await getAllNotifications();
    return NextResponse.json({
      success: true,
      data: notifications,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch notifications",
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { message, recipient } = body;

  try {
    await saveNotification(message, recipient);
    await sendNotification(message); // Send push notification after saving

    return NextResponse.json({
      success: true,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to create notification",
      details: error,
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const _id = req.nextUrl.searchParams.get("id");
  const body = await req.json();
  const { message, recipient } = body;

  try {
    if (_id) {
      await updateNotification(_id, message, recipient);
    } else {
      throw new Error("Invalid notification ID");
    }
    await sendNotification(`Updated notification: ${message}`); // Send push notification after updating

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to update notification",
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const _id = req.nextUrl.searchParams.get("id");

  try {
    if (_id) {
      await deleteNotification(_id);
      // await sendNotification("A notification was deleted"); // Optionally notify about deletion

      return NextResponse.json({
        success: true,
        message: "Notification deleted successfully",
        status: 200,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid notification ID",
        status: 400,
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to delete notification",
      status: 500,
    });
  }
}
