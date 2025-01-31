"use client";

import { useParams } from "next/navigation";
import BuyData from "@/app/dashboard/buydata/page";
import BuyAirtime from "@/app/dashboard/buyairtime/page";
import UtilityPayments from "@/app/dashboard/utilitypayments/page";
import FundWallet from "@/app/dashboard/fundwallet/page";
import Transactions from "@/app/dashboard/transactions/page";
import Pricing from "@/app/dashboard/pricing/page";
import Referrals from "../referrals/page";
import SettingsSection from "@/app/dashboard/settings/page";
import { Typography } from "@mui/material";

export default function DashboardSection() {
  const { section } = useParams<{ section: string }>();

  const renderContent = () => {
    switch (section) {
      case "buydata":
        return <BuyData />;
      case "buyairtime":
        return <BuyAirtime />;
      case "utilitypayments":
        return <UtilityPayments />;
      case "fundwallet":
        return <FundWallet />;
      case "transactions":
        return <Transactions />;
      case "pricing":
        return <Pricing />;
      case "myreferrals":
        return <Referrals />;
      case "settings":
        return <SettingsSection />;
      default:
        return <Typography variant="h5">Section Not Found</Typography>;
    }
  };

  return <>{renderContent()}</>;
}
