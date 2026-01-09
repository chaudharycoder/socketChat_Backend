import crypto from 'crypto';

export const generateOTP = () => {
  const buffer = crypto.randomBytes(3); // 3 bytes = 6 hex digits
  const otp = parseInt(buffer.toString('hex'), 16) % 1000000; // Limit the range to 6 digits

  return otp.toString().padStart(6, '0');
};
