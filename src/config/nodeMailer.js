const nodeMailer = require("nodemailer");

const initializeNodeMailer = () => {
    let configOptions = {
        host: process.env.EMAIL_HOST,
        port: 587,
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        },
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    }
    const transporter = nodeMailer.createTransport(configOptions);
    return transporter
}
const sendVerificationEmail = async ( url, email) => {
    const transporter = initializeNodeMailer()
    const mailOptions = {
        from: `${process.env.APP_NAME}<${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: "Please confirm your account",
        html: `<html>
        <body>
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Welcome to ${process.env.APP_NAME}</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>
        Thank you for choosing ${process.env.APP_NAME}. We're thrilled to have you on board.
        </p>
        <p>Please confirm your account by clicking on the following link: </p>
        <a href="${url}" style="background: #00466a; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px;">Confirm Email</a>
        </div>
        </div>
        </body>
        </html>`,
    }

    await transporter.sendMail(mailOptions)
}

module.exports = { initializeNodeMailer, sendVerificationEmail }