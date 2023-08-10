import { ApiEmailSubRoutes, ApiRoutes } from '../../common/enums/api-routes';
import { uniteServerApiRoutes } from '@/utils/uniteRoute';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

// const TOKEN_EXPIRATION = 60 * 60 * 1000; // 1 hour
const TOKEN = '123456789';
// const STORED_EMAIL = 'test@test.com';
const TOKEN_EXPIRATION_TIME = 1689753099000;

// async function getStoredVerificationToken(email: string) {
//   //FIXME: implement get stored verification token
//   const user = await getUser(email);
//   if (user) {
//     return {
//       token: user.verificationToken,
//       expirationTime: user.verificationTokenExpirationTime,
//     };
//   }
//   return null;
// }

export async function verifyEmailToken(email: string, token: string) {
  try {
    //FIXME: implement verify email token
    //const storedTokenData = await getStoredVerificationToken(email);
    console.log(token, 'token');
    if (token === TOKEN) {
      console.log('token is valid');
      const currentTimestamp = Date.now();
      if (currentTimestamp < TOKEN_EXPIRATION_TIME) {
        console.log('token is not expired');
        return true;
      }
    }
    // Token is invalid or expired
    return false;
  } catch (error) {
    throw new Error('Failed to verify the email token');
  }
}

const emailVerificationTextData = {
  en: {
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link:`,
  },
  ru: {
    subject: 'Подтверждение почты',
    text: `Пожалуйста, подтвердите свой адрес электронной почты, нажав на следующую ссылку:`,
  },
  ua: {
    subject: 'Підтвердження пошти',
    text: `Будь ласка, підтвердіть свою адресу електронної пошти, натиснувши на наступне посилання:`,
  },
  cs: {
    subject: 'Ověření e-mailu',
    text: `Ověřte svou e-mailovou adresu kliknutím na následující odkaz:`,
  },
  pl: {
    subject: 'Weryfikacja e-maila',
    text: `Zweryfikuj swój adres e-mail, klikając następujący link:`,
  },
  de: {
    subject: 'E-Mail-Verifizierung',
    text: `Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Link klicken:`,
  },
};

interface sendVerificationEmailProps {
  email: string;
  token: string;
  emailSubRoute: ApiEmailSubRoutes;
  lang?: string;
  client?: boolean;
}

export async function sendVerificationEmail({
  email,
  token,
  emailSubRoute,
  lang = 'en',
  client = false,
}: sendVerificationEmailProps) {
  console.log(lang);
  const link = uniteServerApiRoutes([ApiRoutes.EMAIL, emailSubRoute], {
    token,
    client: client ? 'true' : 'false',
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const emailText = emailVerificationTextData[lang];

  const msg = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: emailText.subject,
    text: `${emailText.text}
           ${link}`,
    html: `<p>${emailText.text}</p>
           <a href="${link}" target="_blank">${emailText.subject}</a>`,
  };

  transporter.sendMail(msg, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

export function getToken(): string {
  return uuidv4();
}
