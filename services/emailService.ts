import transporter from "../config/email.js";

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
