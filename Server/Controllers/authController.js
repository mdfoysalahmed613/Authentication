import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js";
import transporter from "../Config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../Config/emailTemplates.js";
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const dbUser = await userModel.findOne({ email });
    if (dbUser) {
      return res
        .status(409)
        .json({ success: false, message: "User Already Exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    
    const userData = {
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    }
    return res
      .status(201)
      .json({
        success: true,
        data: userData,
        message: "User Created Successfully",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and Password is required" });
  }
  try {
    const dbUser = await userModel.findOne({ email});
    if (!dbUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email addresss" });
    }
    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = {
      name: dbUser.name,
      email: dbUser.email,
      isVerified: dbUser.isVerified,
    }
    return res.json({
      success: true,
      data: userData,
      message: "User Login Successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if(!user){
      return res.status(404).json({success: false,message: 'User not found'})
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Your OTP is ${otp}. Verify your account using this OTP`,
      html: EMAIL_VERIFY_TEMPLATE.replace('{{email}}',user.email).replace('{{otp}}',otp)
    };
    await transporter.sendMail(mailOption);
    res.json({ success: true, message: "verification otp sent on email" });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  const userId = req.user.id;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User is not found" });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP is expired" });
    }
    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();
    return res.json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    res.json({ success: false, message: 'Internal server error' });
  }
};

const getUserData = async(req,res)=>{
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    if(!user){
      return res.status(404).json({success:false,message: 'User Not Found'})
    }
    const userData = {
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    }
    res.json({success: true, data:userData})
  } catch (error) {
    res.status(500).json({success:false,message: 'Server Error'})
  }
}

const sendResetOtp = async (req, res) => {
  const {email} = req.body;
  if(!email){
    return res.status(400).json({ success: false, message: 'Email is required' })
  }
  try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(404).json({ success: false, message: 'This email is not registered' })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Reset OTP",
      // text: `Your OTP is ${otp}. Reset your password using this OTP`,
      html: PASSWORD_RESET_TEMPLATE.replace('{{email}}',user.email).replace('{{otp}}',otp)
    };
    await transporter.sendMail(mailOption);
    return res.json({ success: true, message: 'OTP sent to your email' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
const verifyResetOtp = async (req, res) => {
  const {email,otp} = req.body;
  if(!otp || !email){
    return res.status(400).json({ success: false, message: 'Missing Details' })
  }
  try {
    const user = await userModel.findOne({email})
    
    if(!user){
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    if(user.resetOtp === '' || user.resetOtp !== otp){
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }
    if(user.resetOtpExpireAt < Date.now()){
      return res.status(400).json({ success: false, message: 'OTP is expired' })
    }
    res.json({ success: true, message: 'OTP is Valid' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

const resetPassword = async (req, res) => {
  const {email,otp,newPassword} = req.body;
  if(!email || !otp || !newPassword){
    return res.status(404).json({ success: false, message: 'Missing Details' })
  }
  try {
    const user = await userModel.findOne({email})
    
    if(!user){
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    if(user.resetOtp === '' || user.resetOtp !== otp){
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }
    if(user.resetOtpExpireAt < Date.now()){
      return res.status(400).json({ success: false, message: 'OTP is expired' })
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    user.save()

    res.json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
export { register, login, logout, sendVerifyOtp, verifyEmail, getUserData,resetPassword,sendResetOtp,verifyResetOtp };
