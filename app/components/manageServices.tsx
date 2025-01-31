"use client";
import { useState } from "react";
import AirtimePage from "./airtimepage";
import CablePage from "./cablepage";
import BillPage from "./billpage";
import Data from "./data";
import ServiceAvailability from "./plantypes";

const ServiceManagement: React.FC = () => {
  const [currentSection, setCurrentSection] = useState("Users Details");

  const renderSection = () => {
    switch (currentSection) {
      case "Data":
        return <Data />;
      case "Airtime":
        return <AirtimePage />;
      case "Cable Subscriptions":
        return <CablePage />;
      case "Bill":
        return <BillPage />;
      case "Services":
        return <ServiceAvailability />;
      default:
        return  <Data />;
    }
  };

  return (
    <div className="p-4 shadow rounded-md container mx-auto h-screen flex flex-col">
    <div className="tab">
      <div className="tab-navigation">
        <button
          className={`tablinks ${currentSection === "Data" ? "active" : ""}`}
          onClick={() => setCurrentSection("Data")}
        >
          Data
        </button>
        <button
          className={`tablinks ${currentSection === "Airtime" ? "active" : ""}`}
          onClick={() => setCurrentSection("Airtime")}
        >
          Airtime
        </button>
        <button
          className={`tablinks ${currentSection === "Cable Subscriptions" ? "active" : ""}`}
          onClick={() => setCurrentSection("Cable Subscriptions")}
        >
          Cable
        </button>
        <button
          className={`tablinks ${currentSection === "Bill" ? "active" : ""}`}
          onClick={() => setCurrentSection("Bill")}
        >
          Bill
        </button>
        <button
          className={`tablinks ${currentSection === "Services" ? "active" : ""}`}
          onClick={() => setCurrentSection("Services")}
        >
          Availability
        </button>
      </div>

      <div className="tabcontent">
        {renderSection()}
      </div>

      <style jsx>{`
        .tab {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }

        .tab-navigation {
          display: flex;
          border-bottom: 1px solid #ccc;
          margin-bottom: 16px;
        }

        .tablinks {
          flex: 1;
          padding: 14px 16px;
          background-color: #f1f1f1;
          border: none;
          outline: none;
          cursor: pointer;
          text-align: center;
          transition: background-color 0.3s;
        }

        .tablinks.active {
          background-color: #007bff;
          color: white;
        }

        .tabcontent {
          padding: 16px;
          animation: fadeEffect 1s;
        }

        @keyframes fadeEffect {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      </div>
      </div>
  );
};

export default ServiceManagement;
