import React, { useEffect, useState } from 'react';

export default function BillingSuccess() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    setInfo({ sessionId });
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Payment Successful</h2>
      <p>Thank you. Your payment was successful. If the tenant was inactive, it should be activated shortly after webhook processing.</p>
      <p>Checkout Session ID: {info?.sessionId}</p>
      <p><a href="/">Return to dashboard</a></p>
    </div>
  );
}
