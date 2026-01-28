// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: "gmail", // or your email provider
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
//     // Avoid hanging requests when SMTP is blocked/unreachable
//     connectionTimeout: Number(process.env.EMAIL_CONNECTION_TIMEOUT_MS ?? 5000),
//     greetingTimeout: Number(process.env.EMAIL_GREETING_TIMEOUT_MS ?? 5000),
//     socketTimeout: Number(process.env.EMAIL_SOCKET_TIMEOUT_MS ?? 7000),
// });

// export default transporter;



import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
