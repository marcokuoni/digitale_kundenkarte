import { MAIL_TEMPLATES, PATHS, PRODUCTION } from '../lib/const'
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

interface MailTemplateData {
  name?: string
  resetToken?: string
  hasOldValidToken?: boolean
  ipAddress?: string
  userAgent?: string
  validateToken?: string
  transfercode?: string
}

export const sendMailWithTemplate = async (
  to: string,
  template: string,
  data?: MailTemplateData
) => {
  const { subject, text } = _getMailTemplate(template, data)
  await sendMail(to, subject, text)
}

const _getMailTemplate = (template: string, data?: MailTemplateData) => {
  let mailContent = {
    subject: '',
    text: '',
  }
  switch (template) {
    case MAIL_TEMPLATES.RESEND_TRANSFERCODE:
      mailContent = {
        subject: 'Transfercode',
        text: `
                Hallo ${data?.name},
              
                Dein Transfercode ist wie folgt: ${data?.transfercode}
                
                Falls du nicht einen Transfercode angefordert hast, melde dich über die App von allen Geräten ab und ändere bitte dein Passwort.

                Von Geräten abmelden: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.CONNECTED}
                Passwort ändern: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.PROFILE}
              
                Viele Grüße,
                Dein Karte Team`,
      }
      break
    case MAIL_TEMPLATES.RESET_PASSWORD:
      mailContent = {
        subject: 'Passwort zurücksetzen',
        text: `
                Hallo ${data?.name},
              
                ${
                  data?.hasOldValidToken &&
                  'Du hattest bereits eine Anfrage zum Rücksetzen deines Passworts gestellt. Falls nicht wechsle umbedingt auch das Passwort von deinem E-Mailkonto um sicher zu gehen, dass niemand anderes dein Passwort zurücksetzen kann.'
                }
              
                Um dein Passwort zurückzusetzen, klicke bitte auf folgenden Link:
                ${process.env.CLIENT_URL}/${PATHS.RESET_PASSWORD}/${
          data?.resetToken
        }
              
                Falls du dein Passwort nicht zurücksetzen möchtest, ignoriere diese E-Mail.
              
                Viele Grüße,
                Dein Karte Team`,
      }
      break
    case MAIL_TEMPLATES.TOKEN_USED_TWICE:
      mailContent = {
        subject: 'Deine Verbindung wurde doppelt verwendet',
        text: `
                Hallo ${data?.name},

                Dein Verbindung wurde doppelt verwendet. Bitte melde dich über die App von allen Geräten ab und ändere dein Passwort.

                Von Geräten abmelden: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.CONNECTED}
                Passwort ändern: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.PROFILE}

                Viele Grüße,
                Dein Karte Team`,
      }
      break

    case MAIL_TEMPLATES.DIFFERENT_DEVICE:
      mailContent = {
        subject: 'Deine Verbindung wurde von einem anderen Gerät verwendet',
        text: `
                Hallo ${data?.name},

                Deine Verbindung wurde von einem anderen Gerät verwendet als diese Verbindung zuletzt verwendet wurde. Falls das dein Gerät ist kannst du diese E-Mail ignorieren. Falls nicht, melde dich über die App von allen Geräten ab und ändere bitte dein Passwort.

                IP Addresse: ${data?.ipAddress}
                Browser: ${data?.userAgent}

                Von Geräten abmelden: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.CONNECTED}
                Passwort ändern: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.PROFILE}

                Viele Grüße,
                Dein Karte Team`,
      }
      break
    case MAIL_TEMPLATES.CREATED_FROM_UNKNOWN_DEVICE:
      mailContent = {
        subject: 'Deine Verbindung wurde von einem unbekannten Gerät erstellt',
        text: `
                Hallo ${data?.name},

                Deine Verbindung wurde von einem unbekannten Gerät erstellt. Falls das dein Gerät ist kannst du diese E-Mail ignorieren. Falls nicht, melde dich über die App von allen Geräten ab und ändere bitte dein Passwort.

                IP Addresse: ${data?.ipAddress}
                Browser: ${data?.userAgent}

                Von Geräten abmelden: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.CONNECTED}
                Passwort ändern: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.PROFILE}

                Viele Grüße,
                Dein Karte Team`,
      }
      break
    case MAIL_TEMPLATES.MORE_THEN_ALLOWED_CONNECTED_DEVICES:
      mailContent = {
        subject: `Du hast mehr als ${process.env.MAX_REFRESH_TOKENS} Geräte mit deinem Konto verbunden`,
        text: `
                Hallo ${data?.name},

                Du hast mehr als ${process.env.MAX_REFRESH_TOKENS} Geräte mit deinem Konto verbunden. Bitte melde dich laufend über die App von unnötigen Geräten ab. Deine älteste Verbindung wird nun automatisch geschlossen.

                Von Geräten abmelden: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.CONNECTED}

                Viele Grüße,
                Dein Karte Team`,
      }
      break
    case MAIL_TEMPLATES.VERIFY_EMAIL:
      mailContent = {
        subject: `Bitte bestätige deine E-Mail Adresse`,
        text: `
                Hallo ${data?.name},
              
                ${
                  data?.hasOldValidToken &&
                  `Du hattest bereits eine Anfrage zum Validieren deiner E-Mailadresse gestellt. Falls nicht wechsle umbedingt auch das Passwort von deinem Konto um sicher zu gehen, dass niemand anderes deine E-Mailadresse validieren wollte.
                  
                  Passwort ändern: ${process.env.CLIENT_URL}/${PATHS.SETTINGS}/${PATHS.PROFILE}`
                }

                Bitte bestätige deine E-Mail Adresse in dem du auf folgenden Link klickst:

                ${process.env.CLIENT_URL}/${PATHS.VERIFY_EMAIL}/${data?.validateToken}

                Viele Grüße,
                Dein Karte Team`,
      }
      break
  }
  return mailContent
}
