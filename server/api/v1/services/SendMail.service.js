const nodemailer = require("nodemailer");
const fs = require("fs");
const { EMAIL_USERNAME, EMAIL_PASSWORD } = require("../../../config");

const resetPasswordTemplate = fs.readFileSync(`${__publicdir}/views/resetPasswordMail.template.html`).toString();

class SendMail {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });
  }

  async sendMail(options) {
    const mailOptions = {
      from: EMAIL_USERNAME,
      to: options.email,
      subject: options.subject,
      html: resetPasswordTemplate.replace(`http://localhost:3000/reset-password/${options.token}`),
    };
    await this.transporter.sendMail(mailOptions);
  }
}

const mailSender = new SendMail();

module.exports = mailSender;
