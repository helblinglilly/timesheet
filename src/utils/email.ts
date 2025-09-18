'use server';

import { env } from '~/env';
import log from './log';
import nodemailer from 'nodemailer';

export async function sendEmail({
  to,
  cc,
  bcc,
  subject,
  text,
  html
}: {
  to: string;
  cc?: string | undefined;
  bcc?: string | undefined;
  subject: string;
  text?: string | undefined;
  html?: string | undefined;
}){
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.EMAIL_SENDER){
    throw new Error('Cannot send Email because environment variables are missing');
  }

  log.info(`Sending Email with subject "${subject}" to "${to}"`)

  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      }
    });

    const domain = to.split('@')[1] ?? '';

    if ([
      'example.com',
      'test.com'
    ].includes(domain)){
      return;
    }

    await transporter.sendMail({
      from: env.EMAIL_SENDER,
      to,
      cc,
      bcc,
      subject,
      text,
      html
    })

  } catch(err){
    log.error('Could not send email', err);
    throw new Error('Failed to send Email');
  }
}
