const sgMail = require("@sendgrid/mail");
const sendVerificationEmail = async (email, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: process.env.BUSINESS_EMAIL,
    subject: "Verify your email address",
    html: `<div>
    <strong>Welcome to our community!</strong>
    <p>Please take a moment to verify your email address and unlock the full potential of our platform.</p>
    <a href="${process.env.FRONTEND_URL}/auth/verify-email/${token}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 5px;">Click here to verify</a>
    <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
    <p>${process.env.FRONTEND_URL}/auth/verify-email/${token}</p>
    <p>Thank you for joining us on this exciting journey!</p>
    <p>Sincerely,</p>
    <p>The Mong So Team</p>
</div>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new Error(error);
  }
};

const sendForgotPasswordEmail = async (email, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: process.env.BUSINESS_EMAIL,
    subject: "Reset your password",
    html: `<div>
<strong>Reset your password</strong>
              <a href=${process.env.FRONTEND_URL}/auth/reset-password/${token} target="_blank">Reset Password</a> 
              </div>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new Error(error);
  }
};

const sendContactUsEmail = async (email, name, message) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: process.env.BUSINESS_EMAIL,
    from: process.env.BUSINESS_EMAIL,
    subject: "Contact Us",
    html: `<div>
<strong>Contact Us</strong>

              <p>Name: ${name}</p>
              <p>Email: ${email}</p>
              <p>Message: ${message}</p>
              </div>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new Error(error);
  }
};

const sendNewsletterConfirmationEmail = async (email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: process.env.BUSINESS_EMAIL,
    subject: "Thank you for subscribing to our newsletter",
    html: `<div>
<strong>You are subscribed to our newsletter</strong>
              
              </div>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new Error(error);
  }
};

const sendJobApplicationEmail = async (data) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: process.env.BUSINESS_EMAIL,
    from: process.env.BUSINESS_EMAIL,
    subject: "Job Application",
    html: `<div>
<strong>Job Application</strong>

              <p>Name: ${data.first_name + data.last_name}</p>
              <p>Email: ${data.email}</p>
              <p>Position: ${data.position}</p>
              <p>Message: ${data.message}</p>
              <p>Title: ${data.title}</p>
              <p>Company Name: ${data.companyName}</p>
              <p>Company Website: ${data.companyWebsiteURL}</p>
              <p>Company Location: ${data.companyLocation}</p>
              <p>Position: ${data.position}</p>
              ${"phone" in data && `<p>Phone: ${data.phone}</p>`}
              </div>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendNewsletterConfirmationEmail,
  sendContactUsEmail,
  sendJobApplicationEmail,
};
