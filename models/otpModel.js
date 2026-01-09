import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // 🔥 This line makes it auto-delete
  },
}, { timestamps: true });

 const OTP = mongoose.model('Otp', otpSchema);
export default OTP;

