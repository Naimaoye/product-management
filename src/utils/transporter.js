import mailerGun from 'nodemailer-mailgun-transport';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = () => nodemailer.createTransport(mailerGun({
  auth: {
    // eslint-disable-next-line object-shorthand
    domain: process.env.domain,
    api_key: process.env.API_KEY
  }
}));


export default transporter;