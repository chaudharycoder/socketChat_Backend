import nodemailer from 'nodemailer';


import { generateOTP } from './password.js';

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "ankit2022jee@gmail.com",
      pass: "rpdi glda iows xbwi",
    },
  });
  const otp = generateOTP();
export const  sendEmail=(to, subject, text)=>{
  transporter.sendMail({
    to : to,
    subject:subject,
    html:text
  })
console.log('Email sent to:', to);
}






