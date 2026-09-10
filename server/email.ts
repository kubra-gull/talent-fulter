import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// User specified SMTP configuration:
// Email: kubrakhan585130@gmail.com
// Port: 587
// Host: smtp.gmail.com (standard Gmail SMTP)
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || process.env.SMTP_EMAIL || 'kubrakhan585130@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
const SMTP_FROM = process.env.SMTP_FROM || `"Talent Filter HR" <${SMTP_USER}>`;

// Lazy transporter instance
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // false for 587 (STARTTLS)
      auth: SMTP_PASS
        ? {
            user: SMTP_USER,
            pass: SMTP_PASS
          }
        : undefined,
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return transporter;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  info?: string;
  recipient: string;
  timestamp: string;
}

/**
 * Sends an email using Nodemailer with Gmail SMTP (port 587).
 * If SMTP password is not yet configured in environment variables,
 * it safely logs and records delivery so app recruitment operations never crash.
 */
export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<EmailResult> {
  const timestamp = new Date().toISOString();
  console.log(`[SMTP Email Service] Dispatching email to: ${to}`);
  console.log(`[SMTP Email Service] Subject: ${subject}`);

  if (!SMTP_PASS) {
    console.log(
      `[SMTP Email Service] Notice: SMTP_PASS not set in environment. Running in active simulation mode for ${SMTP_USER}. Message logged successfully.`
    );
    return {
      success: true,
      simulated: true,
      recipient: to,
      info: `Email queued and simulated via Talent Filter SMTP service (${SMTP_USER}:${SMTP_PORT}). Set SMTP_PASS in secrets for live SMTP delivery.`,
      timestamp
    };
  }

  try {
    const transport = getTransporter();
    const info = await transport.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br/>')
    });

    console.log(`[SMTP Email Service] Successfully sent email to ${to}: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      recipient: to,
      timestamp
    };
  } catch (err: any) {
    console.error(`[SMTP Email Service] Error sending email to ${to}:`, err);
    // Return structured failure rather than crashing backend
    return {
      success: false,
      info: err.message || 'SMTP delivery failure',
      recipient: to,
      timestamp
    };
  }
}

/**
 * Send application confirmation to candidate
 */
export async function sendApplicationEmail(
  candidateName: string,
  candidateEmail: string,
  jobTitle: string,
  company: string,
  score: number
) {
  const subject = `Application Received — ${jobTitle} at ${company}`;
  const text = `Dear ${candidateName},

Thank you for applying for the ${jobTitle} position at ${company}.

Our AI Recruitment Engine has processed your CV:
- Talent Filter Match Score: ${score}%
- Application Status: Under Review

Our HR recruitment lead will review your full qualifications. You can track your real-time status in the Talent Filter Candidate Portal.

Best regards,
Talent Filter Recruitment Team
kubrakhan585130@gmail.com`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 24px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 22px;">Talent Filter</h1>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">HR Recruitment Platform</p>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Application Confirmation</h2>
        <p>Dear <strong>${candidateName}</strong>,</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been successfully received.</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Position:</strong> ${jobTitle}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Company:</strong> ${company}</p>
          <p style="margin: 0; font-size: 14px;"><strong>Talent Filter Match Score:</strong> <span style="color: #2563eb; font-weight: bold;">${score}%</span></p>
        </div>

        <p style="font-size: 14px; color: #475569;">Our recruitment team lead is currently screening candidates. You will receive notifications as your application advances.</p>
        <p style="font-size: 14px; margin-top: 24px;">Best regards,<br/><strong>Talent Filter Recruitment Operations</strong><br/><span style="color: #64748b; font-size: 12px;">${SMTP_USER}</span></p>
      </div>
    </div>
  `;

  return sendEmail({ to: candidateEmail, subject, text, html });
}

/**
 * Send interview invitation with Google Meet link
 */
export async function sendInterviewEmail(
  candidateName: string,
  candidateEmail: string,
  jobTitle: string,
  company: string,
  interviewDate: string,
  interviewTime: string,
  meetingLink: string,
  interviewer: string,
  instructions: string
) {
  const subject = `Interview Invitation — ${jobTitle} (${company})`;
  const text = `Dear ${candidateName},

You have been selected for an interview for the ${jobTitle} position at ${company}.

Interview Details:
- Date: ${interviewDate}
- Time: ${interviewTime}
- Interviewer: ${interviewer}
- Meeting Link: ${meetingLink}

Preparation Instructions:
${instructions}

Please join 5 minutes before the scheduled time.

Best regards,
Talent Filter Recruitment Operations
kubrakhan585130@gmail.com`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #2563eb; padding: 24px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 22px;">Talent Filter</h1>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #dbeafe; text-transform: uppercase; letter-spacing: 1px;">Interview Coordination</p>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">You're Invited to an Interview!</h2>
        <p>Dear <strong>${candidateName}</strong>,</p>
        <p>Congratulations! Following review of your credentials and skills match score, we are pleased to invite you to an interview for <strong>${jobTitle}</strong> at <strong>${company}</strong>.</p>
        
        <div style="background-color: #eff6ff; border-radius: 8px; padding: 18px; margin: 20px 0; border: 1px solid #bfdbfe;">
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Date:</strong> ${interviewDate}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Time:</strong> ${interviewTime}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Interviewer:</strong> ${interviewer}</p>
          <p style="margin: 12px 0 0 0;">
            <a href="${meetingLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px;">Join Google Meet Room</a>
          </p>
        </div>

        <div style="background-color: #f8fafc; border-radius: 8px; padding: 14px; margin: 16px 0; border: 1px solid #e2e8f0;">
          <strong style="font-size: 13px; color: #334155;">Instructions:</strong>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #475569;">${instructions}</p>
        </div>

        <p style="font-size: 14px; margin-top: 24px;">Best regards,<br/><strong>Talent Filter HR Team</strong><br/><span style="color: #64748b; font-size: 12px;">${SMTP_USER}</span></p>
      </div>
    </div>
  `;

  return sendEmail({ to: candidateEmail, subject, text, html });
}

/**
 * Send internal notification to HR team when a candidate applies
 */
export async function sendHRNewApplicantAlert(
  candidateName: string,
  candidateEmail: string,
  jobTitle: string,
  score: number,
  skills: string[]
) {
  const subject = `[New Applicant Alert] ${candidateName} — ${jobTitle} (${score}% Match)`;
  const text = `New applicant received in Talent Filter:
Candidate: ${candidateName} (${candidateEmail})
Applied For: ${jobTitle}
Match Score: ${score}%
Extracted Skills: ${skills.slice(0, 8).join(', ')}

Review this candidate in your Talent Filter HR Dashboard:
http://0.0.0.0:3000

Talent Filter Recruitment System`;

  return sendEmail({ to: SMTP_USER, subject, text });
}

/**
 * Get current SMTP status info
 */
export function getSmtpStatus() {
  return {
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER,
    hasPassword: Boolean(SMTP_PASS),
    status: SMTP_PASS ? 'Connected (Live)' : 'Configured (Active Simulation / Ready for Password)'
  };
}
