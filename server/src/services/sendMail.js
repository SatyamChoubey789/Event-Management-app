const emailjs = require("emailjs-com");
const process = require("node:process");

// send verification email
const sendVerificationEmail = async (email, verificationUrl) => {
  const templateParams = {
    email,
    verificationUrl,
  };

  return emailjs.send(
    process.env.EMAILJS_SERVICE_ID,
    process.env.EMAILJS_SERVICE_TEMPLATE_ID,
    templateParams,
    process.env.EMAILJS_USER_ID
  );
};


// send success email verification email
const sendVerificationSuccessEmail = async(email)=>{
    const templateParams = {
        email,
    };

    return emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        'user_verified_template',
        templateParams,
        process.env.EMAILJS_USER_ID
    );
};



module.exports = {
  sendVerificationEmail,
  sendVerificationSuccessEmail,
};
