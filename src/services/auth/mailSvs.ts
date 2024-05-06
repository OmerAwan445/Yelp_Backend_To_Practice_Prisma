import { AppError } from "@src/errors/AppError";
import { getEnv } from "@src/utils/getEnv";
import { formatTimeInWordsWithUnit } from "@src/utils/verificationTokenUtils";
import nodemailer from "nodemailer";

const url = getEnv("FRONTEND_URL");

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "international.romeo333@gmail.com",
      pass: "ozyk wwyb qhmx irsy",
    },
    secure: true,
  });
  return transporter;
};

function sendVerificationEmail(email: string, token: string) {
  const transporter = createTransporter();
  const mailOptions = {
    from: '"My Company" <international.romeo333@gmail.com>',
    to: email,
    subject: `Email Verification`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #007bff;">Email Verification</h2>
        <p style="font-size: 16px;">You requested for email verification, kindly use this Link <a
          style="color: #007bff; text-decoration: none;" href=${url}/verify-email?token=${encodeURIComponent(token)}">
          Verify your email address</a> to verify your email address.</p>
    <b>Note that this link will expire in the next ${
  formatTimeInWordsWithUnit(getEnv("tokenExpiry.EMAIL_VERIFICATION"))}</b>
          </div>
    `,
  };
  // await for the email to be sent (which is slow )
  /* try {
    await transporter.sendMail(mailOptions);
    return "Verification email sent successfully";
  } catch (error) {
    return "Error in sending email";
  } */
  // non async is used to avoid the slow email sending process
  transporter.sendMail(mailOptions);
  return "Verification email sent successfully";
}

const sendForgotPasswordEmail = async (email: string, token: string) => {
  try {
    const message = {
      to: email,
      subject: "Forgot Password",
      html: `
          <p>To reset your password, please click the link below.
            <a
              href="${url}/reset-password?token=${encodeURIComponent(token)}"
            >
            <br/>
            Reset Password
            </a></p>
          <p>
            <b>Note that this link will expire in the next ${
  formatTimeInWordsWithUnit(getEnv("tokenExpiry.PASSWORD_RESET"))}</b>
          </p>`,
    };

    const emailTransporter = createTransporter();
    await emailTransporter.sendMail(message);
    return "Password reset email sent successfully";
  } catch (error:any) {
    throw new AppError(error.message, 500);
  }
};

export { sendForgotPasswordEmail, sendVerificationEmail };

