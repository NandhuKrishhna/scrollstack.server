import { createTransport } from "nodemailer";
import { NODEMAILER_PASSWORD, SENDER_EMAIL } from "../constants/env";
type Params = {
    to: string;
    subject: string;
    text: string;
    html: string;
}

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: SENDER_EMAIL,
        pass: NODEMAILER_PASSWORD,
    },
});



export const sendMail = async ({ to, subject, text, html }: Params): Promise<any> => {
    await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        text,
        html,
    })
}