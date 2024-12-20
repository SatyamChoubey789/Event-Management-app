const nodemailer = require("nodemailer");
const { google } = require("googleapis"); // Google OAuth2 library
const process = require("node:process");

// Validate required environment variables
const requiredEnvVars = [
  "OAUTH_CLIENT_ID",
  "OAUTH_CLIENT_SECRET",
  "OAUTH_REFRESH_TOKEN",
  "EMAIL_USER",
];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

// Set up OAuth2 credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET
);
oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

// Create Nodemailer transporter using OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: async () => {
      try {
        const { token } = await oauth2Client.getAccessToken();
        return token;
      } catch (error) {
        console.error("Error obtaining access token:", error);
        throw new Error("Failed to get access token");
      }
    },
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const message = {
    from: `"Event System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f2f2f2; text-align: center;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your OTP is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</div>
          <p>The OTP is valid for 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  };

  try {
    const response = await transporter.sendMail(message);
    console.log("OTP email sent successfully:", response);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

// Function to send email verification success
const sendSuccessMail = async (email) => {
  const message = {
    from: `"Event System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Email Has Been Successfully Verified",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f7fc; text-align: center;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333;">Email Successfully Verified</h1>
          <p>Hi there,</p>
          <p>We are pleased to confirm that your email address has been successfully verified!</p>
          <p>You can now enjoy all the features of <b>Event System</b> and stay updated on the latest events and activities.</p>
          <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
          <p>Thank you for being a part of our community!</p>
          <div style="margin-top: 30px; color: #777; font-size: 14px;">
            <p>Best Regards,</p>
            <p>The Event System Team</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const response = await transporter.sendMail(message);
    console.log(
      "Email verification success email sent successfully:",
      response
    );
  } catch (error) {
    console.error("Error sending email verification success email:", error);
    throw new Error("Error sending email verification success email");
  }
};


module.exports = {
  sendOTPEmail,
  sendSuccessMail,
};
