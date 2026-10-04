import { Resend } from "resend"
import { RESEND_API_KEY, EMAIL_FROM } from "../config/index.js";

const resend = new Resend(RESEND_API_KEY)

export const sendEmail = async ({to, OTP, subject, html}) => {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html: html || `<div> Verify Email OTP is</div> <div><b>${OTP}</b></div> `,
  })

  if (error) throw new Error(error.message)
};
