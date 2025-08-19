import React, { useEffect, useState } from 'react';

export default function AdminTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/tenants', { headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json()).then(d => { setTenants(d); setLoading(false); }).catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const updateTenant = async (id, updates) => {
    const res = await fetch('/api/admin/tenants/' + id + '/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (res.ok) {
      setTenants(tenants.map(t => t.id === id ? data : t));
    } else {
      alert(data.message || 'Error');
    }
  };

  const recordPayment = async (id) => {
    const amount = prompt('Amount to record (INR):', '0');
    const note = prompt('Note (optional):', '');
    if (amount === null) return;
    const res = await fetch('/api/admin/tenants/' + id + '/record-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, note })
    });
    if (res.ok) {
      alert('Payment recorded and tenant activated.');
      // refresh tenants
      const t = await (await fetch('/api/admin/tenants')).json();
      setTenants(t);
    } else {
      const d = await res.json();
      alert(d.message || 'Error recording payment');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h2>Platform Admin — Tenants</h2>
      <table cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr style={{ textAlign: 'left' }}>
          <th>Name</th><th>Subdomain</th><th>Status</th><th>Plan</th><th>Limits</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {tenants.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{t.name}</td>
              <td>{t.subdomain || '-'}</td>
              <td>{t.status}</td>
              <td>{t.planName}</td>
              <td>Contacts: {t.contactLimit} / Properties: {t.propertyLimit} / Deals: {t.dealLimit}</td>
              <td>
                <button onClick={() => {
                  const newStatus = prompt('Set status (active, suspended, trial, expired):', t.status);
                  if (!newStatus) return;
                  updateTenant(t.id, { status: newStatus });
                }}>Set Status</button>
                <button onClick={() => {
                  const plan = prompt('Set plan name:', t.planName || 'free');
                  if (plan===null) return;
                  updateTenant(t.id, { plan_name: plan, planName: plan });
                }}>Set Plan</button>
                <button onClick={() => {
                  const cl = prompt('Contact limit:', t.contactLimit || 1000);
                  const pl = prompt('Property limit:', t.propertyLimit || 500);
                  const dl = prompt('Deal limit:', t.dealLimit || 1000);
                  if (cl===null || pl===null || dl===null) return;
                  updateTenant(t.id, { contact_limit: Number(cl), property_limit: Number(pl), deal_limit: Number(dl) });
                }}>Set Limits</button>
                <button onClick={() => recordPayment(t.id)}>Record Payment</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
