const emailjs = require("emailjs-com");
const process = require("node:process");

// send verification email
const sendVerificationEmail = async (email, verificationUrl) => {
  const message = {
    to: email,
    from_name: "Event System",
    subject: "Please verify your email",
    verification_url: verificationUrl,
  };

  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID_VERIFICATION,
      message,
      process.env.EMAILJS_USER_ID
    );
    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
  }
};

const sendVerificationSuccessEmail = async (email) => {
  const message = {
    to: email,
    from_name: "Event System",
    subject: "Email Verified Successfully",
  };

  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID_SUCCESS,
      message,
    );
    console.log("Verification success email sent successfully", response);
  } catch (error) {
    console.error("Error sending success email", error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendVerificationSuccessEmail,
};
