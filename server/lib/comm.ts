import nodemailer from "nodemailer";
import axios from "axios";

const sendGridKey = process.env.SENDGRID_API_KEY;
const twilioSid = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;

export async function sendEmail(to: string, subject: string, html: string) {
  if (sendGridKey) {
    await axios.post("https://api.sendgrid.com/v3/mail/send", {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: process.env.SEND_FROM || "noreply@yourdomain.com" },
      subject,
      content: [{ type: "text/html", value: html }],
    }, {
      headers: { Authorization: `Bearer ${sendGridKey}`, "Content-Type": "application/json" }
    });
  } else {
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });
    const info = await transporter.sendMail({
      from: process.env.SEND_FROM || "noreply@yourdomain.com",
      to,
      subject,
      html
    });
    console.log("===EMAIL Fallback ===\n", info.message.toString());
  }
}

export async function sendWhatsApp(toNumber: string, message: string) {
  if (twilioSid && twilioToken && twilioNumber) {
    const payload = {
      body: message,
      from: `whatsapp:${twilioNumber}`,
      to: `whatsapp:${toNumber}`
    };
    await axios.post(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      new URLSearchParams(payload), {
      auth: { username: twilioSid, password: twilioToken }
    });
  } else {
    console.log(`[WhatsApp Fallback] to=${toNumber} message=${message}`);
  }
}
