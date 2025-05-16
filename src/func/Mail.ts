"use server";
import { oneTime } from "@/components/template/oneTime";
import { verificated } from "@/components/template/verificated";
import { transporter } from "@/lib/mail";

export const sendVerificationEmail = async (
  name: string,
  email: string,
  token: string
) => {
  try {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    const template = verificated
      .replace("%TITLE%", "Confirma tu correo electrónico.")
      .replace("%FROM%", name)
      .replace(
        "%MESSAGE%",
        "<p>Para poder ingresar a GURTI, necesitamos confirmar que este es tu correo.</p>"
      )
      .replace("%URL%", confirmLink)
      .replace("%BUTTON%", "Confirmar correo");

    await transporter.sendMail({
      from: "",
      to: email,
      subject: "GURTI - Confirma tu correo electrónico.",
      html: template,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  token: string
) => {
  try {
    const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`;

    const template = verificated
      .replace("%TITLE%", "Recuperar contraseña.")
      .replace("%FROM%", name)
      .replace(
        "%MESSAGE%",
        `<p>Para restablecer la contraseña tu usuario en GURTI, necesitamos verificar que eres tú quien realiza la accion.</p>
         <p>Has click el siguiente enlace:</p>`
      )
      .replace("%URL%", confirmLink)
      .replace("%BUTTON%", "Recuperar contraseña");

    await transporter.sendMail({
      from: "",
      to: email,
      subject: "GURTI - Confirma tu correo electrónico.",
      html: template,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const sendTwoFactorTokenEmail = async (
  name: string,
  email: string,
  token: string
) => {
  try {
    const template = oneTime
      .replace("%TITLE%", "Contraseña de un solo uso.")
      .replace("%FROM%", name)
      .replace(
        "%MESSAGE%",
        `<p>Tu contraseña de un solo uso es: ${token}.</p>`
      );

    await transporter.sendMail({
      from: "",
      to: email,
      subject: "GURTI - Contraseña de un solo uso.",
      html: template,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const sendNotifications = async (values: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    await transporter.sendMail({
      from: "",
      to: values.to,
      subject: values.subject,
      html: values.html,
    });
  } catch (error) {
    console.log(error);
  }
};
