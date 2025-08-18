import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // Use environment variables for email configuration
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Skip sending in development if no email config
  if (process.env.NODE_ENV === "development" && !process.env.SMTP_USER) {
    console.log("Email would be sent:", options);
    return;
  }

  try {
    await transporter.sendMail({
      from: options.from || process.env.SMTP_FROM || "noreply@realestate-crm.com",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
}

export function generateInviteEmail(
  tenantName: string,
  inviterName: string,
  inviteLink: string,
  role: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Team Invitation</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">You're Invited to Join ${tenantName}</h1>
        </div>
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Hello!</p>
            <p><strong>${inviterName}</strong> has invited you to join <strong>${tenantName}</strong> as a <strong>${role}</strong>.</p>
            <p>Click the button below to accept your invitation and set up your account:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invitation</a>
            </div>
            <p style="color: #64748b; font-size: 14px;">This invitation will expire in 7 days. If you have any questions, please contact your team administrator.</p>
        </div>
    </body>
    </html>
  `;
}

export function generateWelcomeEmail(userName: string, tenantName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to RealEstate CRM</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Welcome to RealEstate CRM!</h1>
        </div>
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Hi ${userName}!</p>
            <p>Welcome to <strong>${tenantName}</strong>! Your account has been successfully created.</p>
            <p>You can now:</p>
            <ul>
                <li>Manage your property portfolio</li>
                <li>Track deals through your sales pipeline</li>
                <li>Schedule site visits</li>
                <li>Generate property shortlists</li>
                <li>Collaborate with your team</li>
            </ul>
            <p>Get started by logging into your account and exploring the dashboard.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The RealEstate CRM Team</p>
        </div>
    </body>
    </html>
  `;
}
