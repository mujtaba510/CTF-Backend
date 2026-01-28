// import transporter from "../config/email.ts";

// const EMAIL_TIMEOUT_MS = Number(process.env.EMAIL_TIMEOUT_MS ?? 7000);

// const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
//     let timeoutId: NodeJS.Timeout | undefined;

//     const timeoutPromise = new Promise<T>((_, reject) => {
//         timeoutId = setTimeout(() => reject(new Error("Email send timeout")), timeoutMs);
//     });

//     try {
//         return await Promise.race([promise, timeoutPromise]);
//     } finally {
//         if (timeoutId) clearTimeout(timeoutId);
//     }
// };

// const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         text,
//     };

//     await withTimeout(transporter.sendMail(mailOptions), EMAIL_TIMEOUT_MS);
// };

// export default sendEmail;



import transporter from '../config/email.js';

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
