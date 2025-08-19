import React, { useState } from 'react';

export default function Billing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create session');
      if (data.url) {
        // redirect user to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Billing & Subscription</h2>
      <p>Plan: <b>Premium</b></p>
      <p>Click Subscribe to open secure Stripe Checkout. After successful payment, Stripe webhooks will mark your tenant as active.</p>
      <button onClick={subscribe} disabled={loading}>{loading ? 'Redirecting...' : 'Subscribe / Upgrade'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
