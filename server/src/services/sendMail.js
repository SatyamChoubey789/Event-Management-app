const nodemailer = require("nodemailer");
const { google } = require("googleapis"); // Google OAuth2 library
const process = require("node:process");

// Set up OAuth2 credentials (you will replace these with your own values)
const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID, // Your OAuth Client ID from Google
  process.env.OAUTH_CLIENT_SECRET, // Your OAuth Client Secret from Google
  process.env.OAUTH_REDIRECT_URI // Your OAuth Redirect URI from Google
);

// Use your refresh token to get an access token (you can get a refresh token manually using the OAuth playground or through the Google API)
oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN, // Use the refresh token you obtained
});

// Create Nodemailer transporter using OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail as the email provider
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER, // Your Gmail address
    clientId: process.env.OAUTH_CLIENT_ID, // OAuth client ID
    clientSecret: process.env.OAUTH_CLIENT_SECRET, // OAuth client secret
    refreshToken: process.env.OAUTH_REFRESH_TOKEN, // OAuth refresh token
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

// Function to send OTP email to the user
const sendOTPEmail = async (email, otp) => {
  const message = {
    from: `"Event System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Email Verification",
    html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            padding: 20px;
          }
          .container {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 500px;
            margin: 0 auto;
          }
          h2 {
            color: #333;
            text-align: center;
          }
          .otp {
            font-size: 30px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
          }
          .footer {
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Email Verification</h2>
          <p>Hi there,</p>
          <p>Your OTP for email verification is:</p>
          <div class="otp">${otp}</div>
          <p>The OTP is valid for 10 minutes. Please use it to verify your email.</p>
          <p>If you did not create an account with us, please ignore this email.</p>
          <div class="footer">
            <p>Thank you,<br>Event System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const response = await transporter.sendMail(message);
    console.log("OTP email sent successfully:", response);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Error sending OTP email");
  }
};

// Function to send success verification email
const sendSuccessMail = async (email, verificationUrl) => {
  const message = {
    from: `"Event System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Please Verify Your Email Address",
    html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fc;
            padding: 40px 0;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            width: 600px;
            margin: 0 auto;
            padding: 30px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .cta-button {
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 5px;
            display: inline-block;
            font-size: 16px;
            margin: 20px auto;
            text-align: center;
            transition: background-color 0.3s ease;
          }
          .cta-button:hover {
            background-color: #45a049;
          }
          .footer {
            font-size: 14px;
            color: #777;
            text-align: center;
            margin-top: 40px;
          }
          .footer p {
            margin: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Email Verification</h1>
          <p>Thank you for registering with Event System!</p>
          <p>To complete your registration, please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" class="cta-button">Verify My Email</a>
          <p>If you did not create an account with us, please ignore this email.</p>
          <div class="footer">
            <p>Event System Team</p>
            <p>Have a great day!</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const response = await transporter.sendMail(message);
    console.log("Verification success email sent successfully:", response);
  } catch (error) {
    console.error("Error sending verification success email:", error);
    throw new Error("Error sending verification success email");
  }
};

module.exports = {
  sendOTPEmail,
  sendSuccessMail, // Renamed function
};
