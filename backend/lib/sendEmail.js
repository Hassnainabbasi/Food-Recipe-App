// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendVerificationEmail(to, code) {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: "Recipe App <onboarding@resend.dev>",
//       to,
//       subject: "Your Verification Code",
//       html: `<p>Your verification code is: <strong>${code}</strong></p>`,
//     });

//     if (error) {
//       console.error("Resend Email Error:", error);
//     } else {
//       console.log("Email sent successfully:", data.id);
//     }
//   } catch (err) {
//     console.error("Unexpected error sending email:", err.message);
//   }
// }
import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, code) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Recipe App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Verification Code",
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
}
