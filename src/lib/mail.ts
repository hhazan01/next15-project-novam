import nodemailer from "nodemailer";

const { SMTP_EMAIL, SMTP_PASSWORD, SMTP_HOST } = process.env;

export const transporter = nodemailer.createTransport({
  service: SMTP_HOST,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});
