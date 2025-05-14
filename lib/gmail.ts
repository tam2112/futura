import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import MailComposer from 'nodemailer/lib/mail-composer';
import dotenv from 'dotenv';

dotenv.config();

const getGmailService = () => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
    );
    oAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    return google.gmail({ version: 'v1', auth: oAuth2Client });
};

const encodeMessage = (message: Buffer): string => {
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options: nodemailer.SendMailOptions): Promise<string> => {
    const mailComposer = new MailComposer(options);
    const message = await mailComposer.compile().build();
    return encodeMessage(message);
};

export const sendMail = async (options: nodemailer.SendMailOptions): Promise<string> => {
    const gmail = getGmailService();
    const rawMessage = await createMail(options);
    const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: rawMessage },
    });
    const { id } = response.data || {};
    if (!id) {
        throw new Error('Failed to send email');
    }
    return id;
};
