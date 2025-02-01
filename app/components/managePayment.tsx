"use client";
import { useState } from "react";
import UsersPage from "./users";
// import NotificationForm from "./notification";
import SendBulkSMS from "./sendSms";

const PaymentManagement: React.FC = () => {
  const [currentSection, setCurrentSection] = useState("Users Details");

  const renderSection = () => {
    switch (currentSection) {
      case "Data":
        return <UsersPage />;
      case "Airtime":
        return <UsersPage />;
      case "Cable Subscription":
        return "payment";
      case "Electricity":
        return <SendBulkSMS />;
      case "Bulk SMS":
        return <SendBulkSMS />;
      default:
        return null;
    }
  };

  return (
    <div className="tab">
      <div className="tab-navigation">
        <button
          className={`tablinks ${
            currentSection === "Users Details" ? "active" : ""
          }`}
          onClick={() => setCurrentSection("Users Details")}
        >
          Users Details
        </button>
        <button
          className={`tablinks ${
            currentSection === "Manage User Role" ? "active" : ""
          }`}
          onClick={() => setCurrentSection("Manage User Role")}
        >
          Manage User Role
        </button>
        <button
          className={`tablinks ${
            currentSection === "Notify User(s)" ? "active" : ""
          }`}
          onClick={() => setCurrentSection("Notify User(s)")}
        >
          Notify User(s)
        </button>
        <button
          className={`tablinks ${
            currentSection === "Send SMS to User(s)" ? "active" : ""
          }`}
          onClick={() => setCurrentSection("Send SMS to User(s)")}
        >
          Send SMS to User(s)
        </button>
      </div>

      <div className="tabcontent">{renderSection()}</div>

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
  );
};

export default PaymentManagement;
