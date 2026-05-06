import nodemailer from 'nodemailer'

const createTransporter = () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        throw new Error('Email service is not configured')
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    })
}

const sendPasswordResetEmail = async (email, otp) => {
    const transporter = createTransporter()

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'MediBridge password reset code',
        text: `Your MediBridge password reset code is ${otp}. This code expires in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>Password reset code</h2>
                <p>Use this 6 digit code to reset your MediBridge password:</p>
                <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
                <p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>
            </div>
        `
    })
}

export default sendPasswordResetEmail
