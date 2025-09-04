import type { Lead } from '@prisma/client';
import { env } from '../env.js';
import nodemailer from 'nodemailer';
import pino from 'pino';

const logger = pino({
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

export async function notifyAll(lead: Lead) {
  const tasks: Promise<unknown>[] = [];
  if (env.WEBHOOK_URL) tasks.push(sendWebhook(lead));
  if (env.SLACK_WEBHOOK_URL) tasks.push(sendSlack(lead));
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM) tasks.push(sendEmail(lead));

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === 'rejected') {
      logger.warn({ err: r.reason }, 'Notifier failed');
    }
  }
}

async function sendWebhook(lead: Lead) {
  try {
    await fetch(env.WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
  } catch (err) {
    logger.warn({ err }, 'Webhook failed');
  }
}

async function sendSlack(lead: Lead) {
  try {
    const text = `New Lead: ${lead.name ?? ''} ${lead.email ?? ''} ${lead.phone ?? ''} | source=${
      lead.source ?? 'n/a'
    } variant=${lead.variant ?? 'n/a'} page=${lead.page ?? 'n/a'}`.trim();
    await fetch(env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    logger.warn({ err }, 'Slack notify failed');
  }
}

async function sendEmail(lead: Lead) {
  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST!,
      port: env.SMTP_PORT ?? 587,
      secure: false,
      auth: { user: env.SMTP_USER!, pass: env.SMTP_PASS! },
    });

    const subject = `New Lead${lead.source ? ` from ${lead.source}` : ''}`;
    const lines = [
      `Name: ${lead.name ?? ''}`,
      `Email: ${lead.email ?? ''}`,
      `Phone: ${lead.phone ?? ''}`,
      `Message: ${lead.message ?? ''}`,
      `Page: ${lead.page ?? ''}`,
      `Variant: ${lead.variant ?? ''}`,
      `Source: ${lead.source ?? ''}`,
      `UTM: ${[lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmTerm, lead.utmContent]
        .filter(Boolean)
        .join(', ')}`,
      `Fingerprint: ${lead.fingerprint ?? ''}`,
      `IP: ${lead.ip ?? ''}`,
      `User-Agent: ${lead.userAgent ?? ''}`,
      `Created At: ${lead.createdAt.toISOString()}`,
    ];

    await transporter.sendMail({
      from: env.SMTP_FROM!,
      to: env.SMTP_USER!,
      subject,
      text: lines.join('\n'),
    });
  } catch (err) {
    logger.warn({ err }, 'Email notify failed');
  }
}

