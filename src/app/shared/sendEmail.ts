import nodemailer from "nodemailer";
import config from "../config";

const sendEmail = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: config.node_env === "production",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.email,
      pass: config.app_pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Health-Care" <ronyislam502@gmail.com>', // sender address
    to: email,
    subject: "Reset your password Link!", // Subject line
    text: "", // plain text body
    html, // html body
  });
};

export default sendEmail;
