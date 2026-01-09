
import User from '../models/userModel.js'
import { asyncHandler } from '../utilities/ayncHandler.js';
import { errorHandler } from '../utilities/errorHandler.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
export const register = asyncHandler(async (req, res, next) => {
  console.log(`[AUTH] Registration attempt for: ${req.body?.username}`);
  const { fullName, username, password, gender } = req.body;

  if (!fullName || !username || !password || !gender) {
    return next(new errorHandler("All fields are required", 400))
  }
  const user = await User.findOne({ username });
  if (user) {
    return next(new errorHandler("User already exists", 400))
  }

  const hashpassword = await bcrypt.hash(password, 10);
  const avtartype = gender === "male" ? "boy" : "girl";

  const avatar = `https://avatar.iran.liara.run/public/${avtartype}?username=[${username}]`
  const newUser = await User.create({
    username,
    fullName,
    password: hashpassword,
    gender,
    avatar
  })


  const tokentData = {
    _id: newUser?._id
  }
  const token = jwt.sign(tokentData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
  res.status(200).cookie("token", token, {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  }).json({
    success: true,
    responseData: {
      newUser,
      token
    }
  })

})

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new errorHandler("All fields are required", 400))
  }
  const user = await User.findOne({ username });
  if (!user) {
    return next(new errorHandler("User Not exists", 400))
  }
  const isValidpassword = bcrypt.compare(password, user.password);

  if (!isValidpassword) {
    return next(new errorHandler("Invalid Credential", 400))
  }

  const tokentData = {
    _id: user?._id
  }
  const token = jwt.sign(tokentData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
  res.status(200).
    cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    }).json({
      success: true,
      responseData: {
        user,
        token
      }
    })

})

export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const profile = await User.findById(userId);
  res.status(200).json({
    success: true,
    responseData: profile
  })
})

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout successfull!",
    });
});


export const getOtherUsers = asyncHandler(async (req, res, next) => {
  const otherUsers = await User.find({ _id: { $ne: req.user._id } });

  res.status(200).json({
    success: true,
    responseData: otherUsers,
  });
});