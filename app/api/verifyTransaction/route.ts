import Transaction from "@/models/transaction";
import Property from "@/models/properties";
import User from "@/models/user";
import dbConnect from "@/utils/connectDB";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const {
    amount,
    propertyPrice,
    email,
    reference,
    propertyId,
    propertyType,
    paymentMethod,
    paymentPurpose,
  } = body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({
        message: "User not found",
        status: 404,
        success: false,
      });
    }
    const property = await Property.findOne({ propertyId });
    if (!property) {
      return Response.json({
        message: "Property not found",
        status: 404,
        success: false,
      });
      // } else if (property.rented === true || property.purchased === true) {
      //   return Response.json({
      //     message: "Property Sold/Rented already",
      //     status: 200,
      //     success: false,
      //   });
    }

    const transactionId = uuidv4();
    const referenceId = reference || uuidv4();

    if (propertyPrice) {
      // New transaction
      const transaction = await Transaction.create({
        userName: user?.name,
        email,
        transactionId,
        referenceId,
        userId: user?._id,
        title: property?.title,
        propertyId,
        propertyType,
        paymentMethod,
        propertyPrice,
        paymentPurpose,
        amount,
        status: "pending",
      });

      await transaction.save();

      const propertyUpdate =
        paymentPurpose === "For Renting"
          ? { rented: true }
          : { purchased: true };
      await Property.findByIdAndUpdate(propertyId, propertyUpdate);

      const newTotalPaymentMade = user?.totalPaymentMade + amount;
      const newTotalPaymentToBeMade =
        user?.totalPaymentToBeMade + propertyPrice;

      if (paymentMethod === "payOnce") {
        await User.findByIdAndUpdate(user?._id, {
          $inc: { totalPropertyPurchased: 1 },
          $set: {
            totalPaymentMade: newTotalPaymentMade,
            totalPaymentToBeMade: newTotalPaymentToBeMade,
            remainingBalance: newTotalPaymentToBeMade - newTotalPaymentMade,
          },
          $push: {
            propertyPurOrRented: {
              title: property.title,
              userEmail: email,
              propertyId: propertyId,
              paymentDate: Date.now(),
              propertyType,
              paymentMethod,
              paymentPurpose,
              propertyPrice,
            },
          },
        });
      } else if (paymentMethod === "installment") {
        await User.findByIdAndUpdate(user._id, {
          $inc: { totalPropertyPurchased: 1 },
          $set: {
            totalPaymentMade: newTotalPaymentMade,
            totalPaymentToBeMade: newTotalPaymentToBeMade,
            remainingBalance: newTotalPaymentToBeMade - newTotalPaymentMade,
          },
          $push: {
            propertyUnderPayment: {
              title: property.title,
              userEmail: email,
              propertyId: propertyId,
              propertyType,
              paymentMethod,
              paymentPurpose,
              initialPayment: amount,
              paymentHisotry: [
                {
                  paymentDate: Date.now(),
                  nextPaymentDate: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                  ),
                  amount,
                  propertyPrice,
                  totalPaymentMade: amount,
                  remainingBalance: propertyPrice - amount,
                  paymentCompleted: false,
                },
              ],
            },
          },
        });
      }
    } else {
      // Subsequent payment
      const transaction = await Transaction.create({
        userName: user.name,
        email,
        transactionId,
        referenceId,
        userId: user._id,
        title: property.title,
        propertyId,
        propertyType,
        paymentMethod,
        paymentPurpose,
        amount,
        status: "pending",
      });

      await transaction.save();

      const userProperty = user.propertyUnderPayment.find(
        (p: { propertyId: mongoose.Types.ObjectId }) => p.propertyId.toString() === propertyId
      );

      const totalPaymentMadeForProperty =
        userProperty?.paymentHisotry.reduce(
          (acc: number, payment: { amount: number }) => acc + payment.amount,
          0
        ) + amount;

      const remainingBalanceForProperty =
        userProperty &&
        userProperty.paymentHisotry &&
        userProperty.paymentHisotry[0]
          ? userProperty.paymentHisotry[0].propertyPrice -
            totalPaymentMadeForProperty
          : 0;

      // const remainingBalanceForProperty =
      //   userProperty.paymentHisotry[0].propertyPrice -
      //   totalPaymentMadeForProperty;

      userProperty?.paymentHisotry.push({
        paymentDate: new Date(Date.now()),
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount,
        propertyPrice: userProperty.paymentHisotry[0].propertyPrice,
        totalPaymentMade: totalPaymentMadeForProperty,
        remainingBalance: remainingBalanceForProperty,
        paymentCompleted: remainingBalanceForProperty === 0,
      });

      const newTotalPaymentMade = user.totalPaymentMade + amount;
      const newRemainingBalance =
        user.totalPaymentToBeMade - newTotalPaymentMade;

      await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            totalPaymentMade: newTotalPaymentMade,
            remainingBalance: newRemainingBalance,
            "propertyUnderPayment.$[elem].paymentHisotry":
              userProperty?.paymentHisotry,
            "propertyUnderPayment.$[elem].paymentCompleted":
              remainingBalanceForProperty === 0,
          },
        },
        {
          arrayFilters: [
            { "elem.propertyId": new mongoose.Types.ObjectId(propertyId) },
          ],
        }
      );

      if (remainingBalanceForProperty === 0) {
        await User.findByIdAndUpdate(user._id, {
          $push: {
            propertyPurOrRented: {
              title: property.title,
              propertyId: propertyId,
              paymentDate: Date.now(),
              propertyType,
              paymentMethod,
              paymentPurpose,
              propertyPrice: userProperty?.paymentHisotry[0].propertyPrice,
            },
          },
          $pull: {
            propertyUnderPayment: {
              propertyId: new mongoose.Types.ObjectId(propertyId),
            },
          },
        });
      }
    }

    return Response.json({
      message: "Transaction successful",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error("Error in transaction:", error);
    return Response.json({
      message: "Error in transaction",
      status: 500,
      success: false,
    });
  }
}
