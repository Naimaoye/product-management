/* eslint-disable no-console */
const senderEmail = process.env.senderEmail;

const sendEmail = (transport, emailData) => new Promise((resolve, reject) => {
  transport.sendMail({
    from: `"no-reply@product-manager-app"<${senderEmail}>`, // sender address
    to: `${emailData.recipientEmail}`,
    subject: `${emailData.subject}`, // Subject line
    html: `${emailData.body}`
  }, (err, info) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      console.log(info);
      resolve(info);
    }
  });
});

export default sendEmail;
