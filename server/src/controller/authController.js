const asyncWrapper = require("../middleware/asyncWrapper");
const customError = require("../errors");
const UserModel = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const jwt = require('jsonwebtoken');
const keys = require("../config/keys");
const { logger } = require("../utils/log");

const register = asyncWrapper(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!email || !userName || !password)
    throw new customError.BadRequestError("Please provide require data.");
  const emailAlreadyExist = await UserModel.findOne({ email });
  if (emailAlreadyExist)
    throw new customError.BadRequestError("Email already exist");

  const user = await UserModel.create({ userName, email, password });

  res.status(StatusCodes.OK).json({ message: "User Register successfully" });
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new customError.BadRequestError("Please provide require data.");

  const user = await UserModel.findOne({ email });
  if (!user) throw new customError.UnAuthenticatedError("Invalid crediential");

  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword)
    throw new customError.UnAuthenticatedError("Invalid Password");


  const {password: pswd,refreshToken: rt , ...loginUser} = user._doc;

  const accessToken = generateAccessToken(loginUser._id);
  const refreshToken = generateRefreshToken(loginUser._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
 logger.log('info', `login api hit with ${email}`);
  res
    .status(StatusCodes.OK)
    .json({ message: "login successfully", accessToken, refreshToken, user: loginUser });
});

const refreshTokencontroller = asyncWrapper(async (req,res)=>{
    let token;
    token = req.cookies.refreshToken;
    const {refreshToken} = req.body || {};
    if(refreshToken)token=refreshToken;

   if(!token){
    throw new customError.UnAuthenticatedError('Login again.');
   }
   const user = await UserModel.findOne({refreshToken: token});

   if(!user){
     throw new customError.UnAuthorizedError('User not found');
   }

   jwt.verify(token, keys.REFRESH_SECRET, (err, decode)=>{
    if(err)
     throw new customError.UnAuthorizedError('User not found');
    
    const accessTkn = generateAccessToken(user._id);
    const refreshTkn = generateRefreshToken(user._id);
    return res.status(StatusCodes.OK).json({message: 'New access token generated successfully.', accessToken: accessTkn, refreshToken: refreshTkn});
   })
})

const logoutController = asyncWrapper(async (req,res)=>{
  const token = req.cookies.refreshToken;
  if(token){
  const user = await UserModel.findOne({refreshToken: token});
  if(user){
    user.refreshToken = null;
    await user.save();
  }
  }
res.clearCookie("refreshToken");
res.status(StatusCodes.OK).json({message: 'logout successfully.'});
})
module.exports = { register, login, refreshTokencontroller, logoutController};
