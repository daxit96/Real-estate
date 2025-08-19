import React from 'react';

export default function BillingCancel() {
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Payment Cancelled</h2>
      <p>Your payment was not completed. You can try again from the Billing page.</p>
      <p><a href="/billing">Back to billing</a></p>
    </div>
  );
}
