import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

export const sendConfirmationEmail = (
  email: string,
  confirmationLink: string
): void => {
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.MAILER_EMAIL,
    to: email,
    subject: "Підтвердження адреси електронної пошти",
    html: `<p>Будь ласка, перейдіть за <a href="${confirmationLink}">посиланням</a>, щоб підтвердити свою адресу електронної пошти.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Помилка під час відправлення електронного листа:", error);
    } else {
      console.log(
        "Електронний лист для підтвердження було відправлено:",
        info.response
      );
    }
  });
};
