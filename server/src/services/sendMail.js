const nodemailer = require("nodemailer");
const process = require("node:process");

// Create a Nodemailer transporter using Outlook's SMTP settings
const transporter = nodemailer.createTransport({});

// Send verification email
const sendVerificationEmail = async () => {};

// Send verification success email
const sendVerificationSuccessEmail = async () => {};

module.exports = {
  sendVerificationEmail,
  sendVerificationSuccessEmail,
};
