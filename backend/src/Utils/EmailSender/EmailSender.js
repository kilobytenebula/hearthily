const nodemailer = require('nodemailer');
const { response } = require('../ResponseHandler/ResponseHandler');

class EmailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'qwwerrrty11@gmail.com',
                pass: 'zjkdenbxdgndzpix',
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }
    sendVerificationEmail(user, token, emailTemplateFunction, subject, saveOrUpdate, res) {
        const message = {
            from: "qwwerrrty11@gmail.com",
            to: user.email,
            subject: subject,
            html: emailTemplateFunction,
        };
        this.transporter.sendMail(message, (err, info) => {
            if (err)
                this.handleEmailError(res, err)
            else
                this.handleEmailSuccess(res, user, saveOrUpdate)
        })
    }
    async handleEmailSuccess(res, user, saveOrUpdate) {
        saveOrUpdate()
        return response(res,200,{ message: "Email Sent to " + user.email })
        // return res.status(200).json({ message: "Email Sent to " + user.email })
    }
    handleEmailError(res, err) {
        console.log(err)
        return res.status(404).json({ message: err })
    }
}

module.exports = new EmailSender();