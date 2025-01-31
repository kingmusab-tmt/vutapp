// components/PaymentForm.tsx
import { useState } from 'react';

const PaymentForm = () => {
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/init-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setPaymentLink(result.responseBody.checkoutUrl);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="amount" placeholder="Amount" required />
        <input name="customerName" placeholder="Customer Name" required />
        <input name="customerEmail" placeholder="Customer Email" required />
        <input name="paymentReference" placeholder="Payment Reference" required />
        <button type="submit">Initiate Payment</button>
      </form>

      {paymentLink && (
        <div>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            Proceed to Payment
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;