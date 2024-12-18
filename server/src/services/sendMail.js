const nodemailer = require("nodemailer");
const process = require("node:process");

// Create a Nodemailer transporter using Outlook's SMTP settings
const transporter = nodemailer.createTransport({
  service: "Outlook365", // Using Outlook's built-in service
  auth: {
    user: process.env.EMAIL_USER, // Your Outlook email address
    pass: process.env.EMAIL_PASS, // Your Outlook password (or app password if 2FA is enabled)
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// Send verification email
const sendVerificationEmail = async (email, verificationUrl) => {
  const message = {
    from: `"Event System" <${process.env.EMAIL_USER}>`, // Sender address
    to: email, // Receiver address
    subject: "Please verify your email",
    html: `
      <p>Hi there,</p>
      <p>Click the button below to verify your email address:</p>
      <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Email</a>
      <p>If you did not create an account with us, please ignore this email.</p>
      <p>Thank you,</p>
      <p>Event System</p>
    `,
  };

  try {
    const response = await transporter.sendMail(message);
    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
  }
};

// Send verification success email
const sendVerificationSuccessEmail = async (email) => {
  const message = {
    from: `"Event System" <${process.env.EMAIL_USER}>`, // Sender address
    to: email, // Receiver address
    subject: "Email Verified Successfully",
    html: `
      <p>Congratulations! Your email has been verified successfully.</p>
      <p>Thank you for confirming your email address.</p>
      <p>Best regards,</p>
      <p>Event System</p>
    `,
  };

  try {
    const response = await transporter.sendMail(message);
    console.log("Verification success email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification success email", error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendVerificationSuccessEmail,
};
