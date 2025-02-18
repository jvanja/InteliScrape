import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  text: string
  attachments?: {
    filename: string
    content: string
  }[]
}

/**
 * Sends an email using the configured SMTP transporter.
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // Create a transporter using environment variables for SMTP configuration.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g. smtp.example.com
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: process.env.SMTP_FROM, // e.g. "Your App <no-reply@yourapp.com>"
    to: options.to,
    subject: options.subject,
    text: options.text,
    attachments: options.attachments,
  }

  const info = await transporter.sendMail(mailOptions)
  console.log('Email sent:', info.messageId)
}

/**
 * Sends a completion email to the current user, with the results attached as a text file.
 *
 * @param userEmail - The email address of the current user.
 * @param results - The results (as a string) to attach to the email.
 */
export async function sendCompletionEmail(
  userEmail: string,
  results: string
): Promise<void> {
  const subject = 'Your Task Has Completed'
  const text = `Hello,

Your task has been completed. Please find attached the results of your query.

Thank you,
Your App Team`

  const attachments = [
    {
      filename: 'results.txt',
      content: results,
    },
  ]

  await sendEmail({ to: userEmail, subject, text, attachments })
}
