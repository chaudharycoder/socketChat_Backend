import { asyncHandler } from "../utilities/ayncHandler.js";
import { sendEmail } from "../utilities/EmailHandler.js";
import { errorHandler } from "../utilities/errorHandler.js";
import { generateOTP} from "../utilities/password.js"; // Make sure you import it
import OTP from "../models/otpModel.js";
export const sendotp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
   console.log("run")
   console.log(email)
  if (!email) {
    return next(new errorHandler("Email is required", 400));
  }
  
  const otp = generateOTP(); 
  const expiresAt = new Date(Date.now() +  5* 60 * 1000); // 2 mins
  await OTP.deleteMany({ email });
  await OTP.create({ email, otp, expiresAt });
    
  sendEmail(
    email, 
    "🔐 Verify Your SocketChat OTP",
    `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="text-align: center; color: #333;">🔐 SocketChat Verification</h2>
      
      <p style="font-size: 16px; color: #444;">Hi there,</p>
      <p style="font-size: 16px; color: #444;">
        Use the following One-Time Password (OTP) to verify your email address:
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; padding: 15px 25px; font-size: 28px; font-weight: bold; background-color: #4f46e5; color: white; border-radius: 8px;">
          ${otp}
        </div>
      </div>

      <p style="font-size: 14px; color: #777;">
        This OTP will expire in <strong>5 minutes</strong>. Do not share it with anyone.
      </p>

      <hr style="margin-top: 30px;">
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        If you did not request this OTP, please ignore this message or contact support.
      </p>
    </div>
    `
  );

  // You can store the OTP in DB or in-memory here for verification later

  res.status(200).json({
    success: true,
    message: "OTP sent to your email successfully!",
  });
});

export const verifyOTP = asyncHandler(async (req, res, next) => {
    const {email, otp } = req.body;
    if (!email ||!otp) {
      return next(new errorHandler("Email and OTP are required", 400));
    }
    const otpRecord = await OTP.findOne({ email,otp });
    if (!otpRecord) {
      return next(new errorHandler("Invalid OTP", 400));
    }
   
    
      // 💡 Optional: double-check expiry before TTL kicks in
      const TWO_MINUTES = 2 * 60 * 1000;

      if (Date.now() - otpRecord.createdAt.getTime() > TWO_MINUTES) {
        return next(new errorHandler("OTP expired. Please request a new one.", 400));
      }
      
    
    
    
      await OTP.deleteOne({ _id: otpRecord._id })

    res.status(200).json({
        success: true,
        message: "OTP verified successfully!",
      });
    });

