import nodeMailer from "nodemailer"
import { SMPT_HOST, SMPT_PORT, SMPT_SERVICE, SMPT_MAIL, SMPT_PASSWORD } from "../config";

export const sendEmail = async ({to, OTP, subject}) => {
  try {
    const transporter = nodeMailer.createTransport({
        host: SMPT_HOST,
        port: SMPT_PORT,
        service: SMPT_SERVICE,
        auth: {
          user: SMPT_MAIL,
          pass: SMPT_PASSWORD,
        },
      });
    
      const mailOptions = {
        from: {
          name : "My Company Name",
          address : SMPT_MAIL
        },
        to,
        subject: subject,
        html: `<div> Verify Email OTP is</div> <div><b>${OTP}</b></div> `,
      };
    
      const send = await transporter.sendMail(mailOptions);
      console.log(send);

  } catch (error) {
    return Promise.reject(error)
  }
};
