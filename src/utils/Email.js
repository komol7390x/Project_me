import { createTransport } from 'nodemailer'
import { configFile } from '../config/server.config.js'

export const sendOTPToMail =async (mail, otp) => {
    const transport = createTransport({
        service: 'gmail',
        auth: {
            user: configFile.GMAIL.USER,
            pass: configFile.GMAIL.PASSWORD
        },
        secure: true
    });
    const mailOption = {
        from: configFile.GMAIL.USER,
        to: mail,
        subject: 'Flowers market',
        text: `${otp} sizning OTP kodingiz 
        Muddat: 5 daqiqa.`
    };

    transport.sendMail(mailOption, (err, info) => {
        if (err) {
            console.error('❌ Email yuborilmadi:', err);
        } else {
            console.log('✅ Email yuborildi:', info.response);
        }
    })
}