import nodemailer from "nodemailer";

function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "international.romeo333@gmail.com",
      pass: "ozyk wwyb qhmx irsy",
    },
    secure: true,
  });
  const mailOptions = {
    from: '"My Company" <international.romeo333@gmail.com>',
    to: email,
    subject: `Email Verification`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #007bff;">Email Verification</h2>
        <p style="font-size: 16px;">You requested for email verification, kindly use this Link <a
          style="color: #007bff; text-decoration: none;" href="http://localhost:3000/verify-email?token=${token}">
          Verify your email address</a> to verify your email address.</p>
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

export { sendVerificationEmail };
