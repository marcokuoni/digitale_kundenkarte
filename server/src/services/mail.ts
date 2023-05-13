import { PRODUCTION } from '../lib/const'
import { createTransport } from 'nodemailer'

const from = process.env.FROM_EMAIL_ADDRESS || 'no-reply@localhost'

export const sendMail = async (to: string, subject: string, text: string) => {
  if (process.env.NODE_ENV === PRODUCTION) {
    const transport = createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from,
      to,
      subject,
      text,
    }

    await transport.sendMail(mailOptions)
  } else {
    console.log('sendMail', to, from, subject, text)
  }
}
