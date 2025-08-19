import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { verifyRazorpaySignature } from "../utils/razorpay-util";
import { storage } from "../storage";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET || "", { apiVersion: "2022-11-15" });

router.post("/create-checkout-session", async (req, res) => {
  const { tenant_id, plan } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PREMIUM || "", quantity: 1 }],
      metadata: { tenant_id },
      success_url: `${process.env.FRONTEND_URL}/billing/success`,
      cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'stripe error' });
  }
});

router.post("/stripe", bodyParser.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    // handle event types
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const tenantId = session.metadata?.tenant_id;
      // TODO: update subscription in DB
    }
    res.status(200).send("ok");
  } catch (err) {
    console.error("Stripe webhook error", err);
    res.status(400).send(`Webhook Error: ${err}`);
  }
});

router.post("/razorpay", express.json(), (req, res) => {
  const body = req.body;
  const signature = req.headers["x-razorpay-signature"] as string;
  if (!verifyRazorpaySignature(process.env.RAZORPAY_SECRET || "", JSON.stringify(body), signature)) {
    return res.status(400).send("invalid signature");
  }
  // handle razorpay events: payment.captured etc
  res.sendStatus(200);
});

export default router;


// Stripe webhook endpoint to handle subscription lifecycle
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  if (!webhookSecret) {
    console.warn('Stripe webhook secret not set');
    return res.status(500).send('webhook secret not configured');
  }
  let event;
  try {
    event = (new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2022-11-15' })).webhooks.constructEvent(req.body, sig || '', webhookSecret);
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event types we care about
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      // For subscriptions, session.mode === 'subscription'
      const tenantId = session?.metadata?.tenant_id;
      if (tenantId) {
        await storage.updateTenantStatus(tenantId, 'active', session.subscription || null);
        console.log('Tenant activated via Stripe checkout for', tenantId);
      }
    } else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as any;
      const subscriptionId = invoice?.subscription;
      // Find tenant by subscription_id (if stored), else you may use metadata mapping
      if (subscriptionId) {
        const tenant = await storage.getTenantBySubscriptionId(subscriptionId);
        if (tenant) {
          await storage.updateTenantStatus(tenant.id, 'active', subscriptionId);
          console.log('Tenant re-activated by invoice payment:', tenant.id);
        }
      }
    } else if (event.type === 'customer.subscription.deleted' || event.type === 'invoice.payment_failed') {
      const data = event.data.object as any;
      const subscriptionId = data?.id || data?.subscription;
      const tenant = subscriptionId ? await storage.getTenantBySubscriptionId(subscriptionId) : null;
      if (tenant) {
        await storage.updateTenantStatus(tenant.id, 'suspended', subscriptionId);
        console.log('Tenant suspended due to subscription end/failure:', tenant.id);
      }
    }
  } catch (err) {
    console.error('Error handling stripe webhook', err);
  }

  res.json({ received: true });
});

module.exports = router;
