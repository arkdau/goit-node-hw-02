// const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

// used https://app.sendgrid.com/guide/integrate/langs/smtp

// const transporter = nodemailer.createTransport({
//   host: "smtp.sendgrid.net",
//   port: 587,
//   auth: {
//     user: "apikey",
//     pass: process.env.SEND_GRID_API_KEY,
//   },
// });
//
// function sendMailNodeMailer({ to, from, subject, text, html }) {
//   // transporter.verify()
//   //   .then((data) => {
//   //     debugger;
//   //     console.log("verify ok");
//   //   })
//   //   .catch((data) => {
//   //     debugger;
//   //     console.log("verify error");
//   //   });
//
//   return transporter.sendMail({ to, from, subject, text, html });
// }

// sendMail({
//   to: "arkadiusz.daugielewicz@gmail.com",
//   from: "akson_control@o2.pl",
//   subject: "Sample Topic",
//   // text: "This is a sample message",
//   html: "This is <b>a sample message</b>",
// })
//   .then((data) => console.log("The mail has been sent: ", data))
//   .catch((err) => console.log(`Cannot send the mail: ${err.message}`));

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const msg = {
  to: "test@example.com", // Change to your recipient
  from: "test@example.com", // Change to your verified sender
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

function sendMailSendGrid({ to, from, subject, text, html }) {
  return sgMail.send({ to, from, subject, text, html });
}

module.exports = {
  sendMailSendGrid,
  // sendMailNodeMailer,
};
