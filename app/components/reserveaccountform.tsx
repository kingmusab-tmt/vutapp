// components/ReserveAccountForm.tsx
import { useState } from 'react';

const ReserveAccountForm = () => {
  const [accountDetails, setAccountDetails] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/reserve-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setAccountDetails(result.responseBody);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="accountReference" placeholder="Account Reference" required />
        <input name="accountName" placeholder="Account Name" required />
        <input name="customerEmail" placeholder="Customer Email" required />
        <input name="customerName" placeholder="Customer Name" required />
        <button type="submit">Create Reserve Account</button>
      </form>

      {accountDetails && (
        <div>
          <h3>Account Details</h3>
          <p>Account Number: {accountDetails.accountNumber}</p>
          <p>Bank Name: {accountDetails.bankName}</p>
        </div>
      )}
    </div>
  );
};

export default ReserveAccountForm;